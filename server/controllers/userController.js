
import Directory from "../models/directoryModel.js"
import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import Session from "../models/sessionModel.js"
import OTP from "../models/otpModel.js"
import File from "../models/fileModel.js"
import { loginSchema, registerSchema } from "../validators/zodAuth.js"
import mongoose, { Types } from "mongoose"
import redisDb from "../database/redis.js"



export const registerUser = async(req, res, next)=>{
    
    const {success , data , error} = registerSchema.safeParse(req.body) //sanitizing db inputs

    if(!success){
        return res.status(400).json({error: z.flattenError(error).fieldErrors})

    }
    const{email , name , password,otp} = data
    

    const otprecord= await OTP.findOne({email,otp})
       if(!otprecord){
        return res.status(400).json({error: " invalid otp "})
       }

       await otprecord.deleteOne() // deleting that otp if succesfuuly verified and registeration
    //const hashPassword = crypto.createHash('sha256').update(password).digest("hex") //hashing our user password here 
    const hashPassword = await bcrypt.hash(password, 12 ) // usin bcrypt for hashing pass .12 is no of round iteration with salt 
  
    const userExist = await User.findOne({email})
    if(userExist){
        return res.status(409).json({
                error: "user already exist" ,
                message: "user already exist"
            })}

        //const session = client.startSession() initializing session this is  how we do in mongo db 
      const ssn = await mongoose.startSession();
    
        try {
     ssn.startTransaction() // starting transaction // whenever a new user will register he will have his own root directory and an user directory we are creating that root dir and user dir here     
     const rootDirId = new Types.ObjectId();
     const userId = new Types.ObjectId();

     const userRootdir = await Directory.create([{ // we are not ading/creating id here manually cuz mongo create id by its own 
         _id: rootDirId,
        name : `root-${email}`,
        parentDirId : null,
        userId
      
        }],{session: ssn })
  //  const rootDirId = userRootdir._id //getting the root objectid of user root directory and we wil push this into that user dir as an root directory reference of user 
    
    const userDir = await User.create([{ //creating user collection here 
        _id:userId,
        name,
        email,
        password:hashPassword,
        rootDirId,
    }],{session: ssn })
        

   // const userId = userDir._id // in mongo we have to do userdir.insertedid to get object id 
   // await Directory.updateOne({_id :rootDirId }, {$set:{userId}}) // adding user id into his personal root directory and here we are updating his root dir using his rootdir objectid 
      ssn.commitTransaction() // transaaction ending either it will pass every insert operation or if any one of them fail by anychance all the operation will fail together 
    res.status(201).json({ message: "User Registered" });
        
      } catch (err){
        console.log(err)
        await ssn.abortTransaction(); // aborting it if any errror occured 
      if(err.code === 121) {
      res
        .json({ error: "Invalid input, please enter valid details" });

      
    } else {
      next(err);
    }
        
      }      

}

export const loginUser = async(req, res, next)=>{
    try{
         const {success , data , error} = loginSchema.safeParse(req.body) //sanitizing db inputs

    if(!success){
        console.log(error)
        return res.status(400).json({error: z.flattenError(error).fieldErrors})
    }
    const{email, password} = data
    
    
    const user = await User.findOne({email}) // findone will find both if one of them is not found it will throw err so its also acting as an authenticaton
    if(!user){
        return res.status(404).json({ error: "Invalid Credentials" });
    }

     if(user.deleted){ //soft delete check 
          return res.status(403).json({error: "your account is eleted contact admin"})
      }
      
    //const checkingHashPassword = crypto.createHash('sha256').update(password).digest("hex") // agaai chekking hash password is same or not 
    //if(user.password !== checkingHashPassword){ 
    //    return res.status(404).json({ error: "Invalid Credentials" });}

    const ispassValid = await bcrypt.compare(password, user.password) //user.paassword is  hashed still compaaring both how ? it does all the calculatio  inside and compare both pass manually llike hmac 
    if(!ispassValid){
        return res.status(404).json({ error: "Invalid Credentials" });
    }
    
    
    // const cookiePayload ={ // this cookie payload will help in authorization
     //   _id:user._id.toString(),
      //  expiry: Math.round(Date.now() / 1000 + 10), //here we are setting up expiry means we are here giving 10 sec to user after this token will be expired  and this expiry cannot be overide by user directly from browser cookie 
    // NOTE: earlier we were semding stateless cookie like this but now we have created an ttl index based model for session cookies statefull
    // and we were sending cookie as uid like this  res.cookie("uid", Buffer.from(JSON.stringify(cookiePayload)).toString("base64url")
    // saving cookiepayload in cookie for authentication and sending an json object cookie in req.cookie

    //const allSessions = await Session.find({userId :  user._id}) // an user can have multiple session so we are finding it here 
    //if(allSessions.length >= 2){  
   //     await allSessions[0].deleteOne()  restricting one user user cant login in  more then 2 place  same time wiith same acc }

   
   
   const allSessions = await redisDb.ft.search("userIdIdx", `@userId:{${user._id}}`, {RETURN:[]}) // BUT for using  SEARCHING WE NEED TO CREATE THE INDEX USING REDIS CLI IE UBUNTU 
    if(allSessions.total >= 2){  
        await redisDb.del(allSessions.documents[0].id)
    }
    //const session = await Session.create({userId: user._id}) creating an session model in monogoose like this before and usiing this id as session id bfore


    const sessionId = crypto.randomUUID();
    const redisKey = `session:${sessionId}`
    const session = await redisDb.json.set(redisKey , "$", {userId : user._id , rootDirId : user.rootDirId})  // usig redis for  session caching 

      const sessionExpiryTime = 60 * 1000 * 60 * 24 * 7;
      await redisDb.expire(redisKey, sessionExpiryTime / 1000);

    res.cookie("sid", sessionId ,{  // this is redis session id now !!
        httpOnly: true,
        signed: true,
        maxAge: sessionExpiryTime, // after this  time end user will be logot automatically and this can be customize diectly from ui and can be hacked easily
        sameSite: "none",   // for preventing csrff attack 
        secure: true
    })
    res.json({ message: "logged in" });
}
    catch(err){
        console.log(err)
        next(err)
    }
}

    

export const userDetails = async(req, res)=>{ 
    console.log("req",req.user);
    const user = await User.findById(req.user._id)
    
    console.log("after",user);
    const dir = await Directory.findById(user.rootDirId)  
   
    
    res.status(200).json({
        name : user.name, //see here we are using req.user that we have set in authentication and getting userdetail easily
        email: user.email,
        picture: user.picture,
        role : user.role,
        totalStorage : user.maxStorage,
        usedStorage : dir.size,
        plan : user.plans
        
    })


}

export const getAllUsers = async(req, res)=>{  //rbac get all user endpoint controller 
    const allUsers = await User.find({deleted : false }).lean() //only user that is not deleted will be fetched 
    //const session = await Session.find().lean()
    const keys = await redisDb.keys("session:*");
    console.log("redis",keys);
    const session= await Promise.all(keys.map((key) => redisDb.json.get(key))
);
    const activeSession = session.map(({userId})=> userId.toString()) // because of object id we have to conver it in string 
    const allSessionSet = new Set(activeSession) // this is creating  an set of all active session can say an array of allsession

    const gettingUsers = allUsers.map(({_id,email,name}) =>({
        id:_id,
        name ,
        email,
        isLogedin : allSessionSet.has(_id.toString()) // creating an extra property if user session is not there it will be false els true 
    })) 
     res.status(200).json( gettingUsers)
   

}

export const adminPowerlogout = async(req,res,next)=>{ //rbac
  try {
      const id = req.params.userId
    await Session.deleteMany({userId:id}) 
     res.status(204).end();
    
  } catch (error) {
    next(error)
    }}

export const DeleteUser = async(req,res,next)=>{ //rbac
  
    
      const {userId} = req.params
      if(req.user._id.toString()  === userId){  //disabling self delete 
        return res.status(403).json({error : "you cannot delete yourself" }) 
      } 

        try {
     // await User.findByIdAndDelete({_id : userId})          this was hard delete we will implement soft delete
     // await File.deleteMany({userId})
     // await Directory.deleteMany({userId})
      await Session.deleteMany({userId})
      await findByIdAndUpdate(userId , { deleted : true}) //soft delete so we can recover the data if user wants to 
    
  } catch (error) {
    next(error)
    }}    


export const logout = async (req, res)=>{
    const{sid} = req.signedCookies
 //   await Session.findByIdAndDelete(sid)  also deleting session from database (models) this was in mongoose 

 await redisDb.del(`session:${sid}`)
    res.clearCookie("sid") // this will clear the coookie ie the user id we have set and user will be logout
    res.status(204).end();
}

export const logoutAll = async (req, res)=>{
    const{sid} = req.signedCookies
    const session = Session.findById(sid)
    await Session.deleteMany({userId : session.userId}) // deleting everry session user id  from database (models) to logoutfrom every where 
    res.clearCookie("uid") // this will clear the coookie ie the user id we have set and user will be logout
    res.status(204).end();
}
