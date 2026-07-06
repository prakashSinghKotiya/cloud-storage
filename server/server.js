import express from "express"
import cors from "cors";


import directoryRoutes from "./routes/directoryRoutes.js"
import fileRoutes from "./routes/fileRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import rzpwebhook from "./routes/webhookRoutes.js"
import rzpsubscriptionRoutes from "./routes/rzpsubscriptionRoutes.js"
import { connectdb } from "./database/database.js";
import checkAuth from "./Middlewares/authenticaton.js";
import cookieParser from "cookie-parser";
import { generalLimiter, registerLimiter, requstThrottling } from "./validators/rateLimiting.js";
import helmet from "helmet";
import shareRoutes from "./routes/shareRoutes.js";
import { getAiresponse } from "./controllers/aiController.js";



const secretkey = process.env.SESSION_SECRET
try {
await connectdb()       // connecting mongooose here 
const app = express()
//app.use(requstThrottling)
app.use(cookieParser(secretkey)) // this will be the secret key of our signed coookie 
app.use(express.json()) // sending body data, It parses the incoming JSON string from the HTTP request body into a JavaScript object. 

app.use(cors({
  origin: "http://localhost:5173", // Enabling CORS
  credentials: true,
}))  
                   
app.use(helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));      // helmet js lib set mutipple authentication headers for secure app such as Content-Security-Policy and many more 
  
//app.use(generalLimiter) //global rate limiter this is causing problem for oauth so 




app.use("/directory",checkAuth,requstThrottling,generalLimiter, directoryRoutes) // global  middlewares 
app.use("/file",checkAuth,requstThrottling, generalLimiter, fileRoutes)
app.use("/user",registerLimiter,requstThrottling , userRoutes) 
app.use("/auth", authRoutes)
app.use("/webhooks", rzpwebhook)
app.use("/subscriptions",checkAuth, rzpsubscriptionRoutes)
app.use("/share", shareRoutes)
app.use("/ai",checkAuth, getAiresponse)


app.use((err, req, res, next) => {// global error handler middleware 
    console.log(err);
    res.status(err.status || 500).json({ message: "Something went wrong!!" });
  });


  app.listen(4000, () => {
    console.log("server-started");

})
    
} catch (error) {
    console.log(error)
    
} 

  //mongo
  //const db = connectdb() // connecting database function this is done in mongodb
  //app.use((req,res,next)=>{  moongodb connecction 
    /// req.db = db // this is  how we are  sharing databse to evry other routes we will fetch db from req.db n other routes
   // next() })

