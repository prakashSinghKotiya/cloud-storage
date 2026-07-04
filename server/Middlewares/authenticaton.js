
import redisDb from "../database/redis.js"
import Session from "../models/sessionModel.js"
import User from "../models/userModel.js"

export default async function checkAuth(req, res, next){ // this will be also the authentication middleware 
const{sid} = req.signedCookies
if(!sid){
    return res.status(401).json({error: "not logged "})
}

//const session =  await Session.findById(sid)
const session = await redisDb.json.get(`session:${sid}`) // finding from redis not mongo
console.log("session",session);
if(!session){
    return res.status(401).json({error: "not logged "})
}

//const user = await User.findById({_id: session.userId}).lean()
//if(!user){
   // return res.status(401).json({error: "user not found"})}
//req.user = user //we are also setting up an req so we dont need to do db call to find use details just use req.user.name or any detail available

req.user = { _id: session.userId, rootDirId:session.rootDirId}
next()
}

export const adminChecker = (req, res , next )=>{ 
    if(req.user.role !== "User") return next()
       res.status(403).json({ error: "You can not access users" });

}

export const isAdmin = (req, res , next )=>{  // rbac mw power onlny for amdmin
    if(req.user.role !== "Admin") return next()
       res.status(403).json({ error: "You can not access users" }); 

}