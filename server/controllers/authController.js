import mongoose, { Types } from "mongoose";
import OTP from "../models/otpModel.js";
import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";
import { verifyIdToken } from "../service/gAuthService.js";
import { sendOtp } from "../service/sendotp.js";
import Directory from "../models/directoryModel.js";
import { gAuthSchema, otpSchema, registerSchema } from "../validators/zodAuth.js";
import z from "zod";
import redisDb from "../database/redis.js";

export const otpsent = async (req, res, next )=>{
    const {email}= req.body
    const ootipii = await sendOtp(email)
    console.log(ootipii)
      res.status(201).json(ootipii);

}


export const otpverify = async (req, res, next )=>{
  console.log(req.body)
   const {success , data , error} = otpSchema.safeParse(req.body) //sanitizing db inputs
  
      if(!success){
          return res.status(400).json({error: z.flattenError(error).fieldErrors})
      }
    const {email,otp}= data 


   const result= await OTP.find({email,otp})
   if(!result){
    return res.status(400).json({error: " invalid otp "})
   }
   
   return res.json({ message: "OTP Verified!" });

}

export const loginwithGoogle = async(req, res, next )=>{
   let mongooseSession = null;
  
     console.log("running auth controller ")
    const {idToken} = req.body  // we are getting id token from frontend using oauth2 gsi liabrary idtoken have the user details 
   

    if(!idToken){
      console.log("id token is required", req.body);
      return res.status(400).json({error: "id token is required"})
    }
    
    
    const userdata = await verifyIdToken(idToken)
    console.log("raw userdata from google:", userdata)
    
       const {success , data , error } = gAuthSchema.safeParse(userdata) //sanitizing using zod
      if(!success){
          return res.status(400).json({error: z.flattenError(error).fieldErrors})
      }
      
      
    const{name , email, picture , sub } = data
console.log(data)
console.log("picture:", picture)

    const user = await User.findOne({email})
 
    if(user){   // thsis block will run if user exist 
      if(user.deleted){//soft delete check 
          return res.status(403).json({error: "your account is deleted contact admin"})
      }

      

    // FT.CREATE userIdIdx ON JSON PREFIX 1 session: SCHEMA $.userId AS userId TAG creating redis idx like this using cli 

    const allSessions = await redisDb.ft.search("userIdIdx", `@userId:{${user._id}}`, {RETURN:[]}) // BUT for using  SEARCHING WE NEED TO CREATE THE INDEX USING REDIS CLI IE UBUNTU 
    console.log("auth",allSessions);
    if(allSessions.total >= 2){  
        await redisDb.del(allSessions.documents[0].id)
    }
    console.log("auth",allSessions);

    if(!user.picture.includes("googleusercontent.com")){
        user.picture = picture
        await user.save()
    }
  
    const sessionId = crypto.randomUUID();
    const redisKey = `session:${sessionId}`
    const session = await redisDb.json.set(redisKey , "$", {userId : user._id , rootDirId : user.rootDirId})  // usig redis for  session caching 

    const sessionExpiryTime = 60 * 1000 * 60 * 24 * 7;
      await redisDb.expire(redisKey, sessionExpiryTime / 1000); //setting ttl in redis  

    res.cookie("sid", sessionId ,{  // this is redis session id now !!
        httpOnly: true,
        signed: true,
        maxAge: sessionExpiryTime, // after this  time end user will be logot automatically and this can be customize diectly from ui and can be hacked easily
        sameSite: "none",   // for preventing csrff attack 
        secure: true
    })
    console.log("Saved session:");
console.log(await redisDb.json.get(redisKey));
    return res.json({ message: "logged in" });
    }
    
    console.log("user dosent exist")

   
    
     mongooseSession = await mongoose.startSession();
     try {

    // this will run if user dosent exist means he used oath to login so if user dosent exist we will create an user so we are here ccreating user dir , user itself
    // also its login session and wrapping all these in an mongoose transaction 
    
     
    
       await mongooseSession.startTransaction();
        const rootDirId = new Types.ObjectId();
      const userId = new Types.ObjectId();
    
        await Directory.create( [
          {
            _id: rootDirId,
            name: `root-${email}`,
            parentDirId: null,
            userId,
          },],
          {  session: mongooseSession }
        );
    
        await User.create([
          {
            _id: userId,
            name,
            email,
            picture,
            rootDirId,
          },],
          {  session: mongooseSession }
        );
    
    const sessionId = crypto.randomUUID();
    const redisKey = `session:${sessionId}`
    const session = await redisDb.json.set(redisKey , "$", {userId : userId , rootDirId : rootDirId})  // usig redis for  session caching 

    const sessionExpiryTime = 60 * 1000 * 60 * 24 * 7;
      await redisDb.expire(redisKey, sessionExpiryTime / 1000); //setting ttl in redis  

    res.cookie("sid", sessionId ,{  // this is redis session id now !!
        httpOnly: true,
        signed: true,
        maxAge: sessionExpiryTime, // after this  time end user will be logot automatically and this can be customize diectly from ui and can be hacked easily
        sameSite: "none",   // for preventing csrff attack 
        secure: true
    })



    
        await mongooseSession.commitTransaction();
        res.status(201).json({ message: "account created and logged in" });
    
    
  }catch (err) {
        console.log(err); 
        if (mongooseSession) await mongooseSession.abortTransaction()
          res.status(500).json({ message: "Something went wrong!!" }, err);
      //  next(err);
      }finally {
    if (mongooseSession) await mongooseSession.endSession(); // ✅ always clean up
  }

}