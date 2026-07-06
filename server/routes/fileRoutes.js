import express from "express"

import {  addStaredFile, deleteFile, getFile, getStaredFile,  removeStarredFile, updateFilename, uploadComppletedAws, uploadInitiateAws } from "../controllers/fileController.js";
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";

const router = express.Router()
router.param("parentDirId",validateIdMiddleware) // these router.params will execute whenever client will go to these url /id or/ parentirid and we have applied an cheking middleware to chek the object id is legit or not 
router.param("id",validateIdMiddleware)


router.post("/upload/initiate" ,  uploadInitiateAws)
router.post("/upload/complete" ,  uploadComppletedAws)

//create
//router.post("/:parentDirId?  ", createFile) we are using aws s3 no need of this now 
//READ

router.get("/getStaredFile",getStaredFile)
router.get("/:id",getFile)
router.patch("/star/:id",addStaredFile)
router.patch("/removestar/:id",removeStarredFile)
//update
router.patch("/:id", updateFilename)
//delete
router.delete("/:id", deleteFile);



export default router
