
import {   rm  } from "fs/promises"
import path from "path";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { JSDOM } from 'jsdom'; 
import DOMPurify from 'dompurify';
import { createUploadUrl, deleteUploadedAwsFile, getUploadedAwsMetadata, getUploadedurl } from "../service/awsS3.js";
import { cloudfrontSignedUrl } from "../service/cloudfront.js";
import { stat } from "fs";
import User from "../models/userModel.js";



const window = new JSDOM('').window;
const purify = DOMPurify(window)

export async function FolderSize (parentId ,sizee){ 
  while(parentId){
    const dir = await Directory.findById(parentId)
    dir.size += sizee
    await dir.save()
    parentId = dir.parentDirId // here we are seetting parent id again this is kind of recurssion 
  }

}

export const getFile = async(req, res, next) => {  //:id will automatically match the file in dir and show in url
    const {id} = req.params
    const fileData =  await File.findOne({
      _id: id,
      userId: req.user._id,
    }).lean()

    if(!fileData){
      return res.status(404).json({ error : "files not found "})
    }
// If "download" is requested, set the appropriate headers

  if (req.query.action === "download") {
    const url =  cloudfrontSignedUrl({ // this work straight no need of await  whereas aws s3 get url use async await 
      key:`${id}${fileData.extension}` , // key is the file name storedd in aws ie the file id with file extension
       download : true ,
        filename : fileData.name })

    return res.redirect(url); // we are directly redirecting it to frontend just needd to do api call no further steps 
  }

  // this will run if its normal call not a download call 
  const url =  cloudfrontSignedUrl({ 
      key:`${id}${fileData.extension}` ,
      filename : fileData.name })

    return res.redirect(url);
}


export const getStaredFile = async(req, res, next) => {  
  const user = req.user
  console.log(user);
  const staredFiles = await File.find({
    userId : user._id,
    starred : true
      }).lean()

      console.log(staredFiles);

      if (staredFiles.length === 0) {
  return res.status(200).json({
    message : "No starred files found",
  });
}


    return res.status(200).json(staredFiles);
}

export const addStaredFile = async(req, res, next) => {  
  const {id}= req.params
  
  const Files = await File.findOneAndUpdate({
        _id: id,
        userId: req.user._id,
      },
      {
        starred: true,
      },
      {
        new: true,
      })

      if(!Files){
        return res.status(404).json({ error : "files not found "})
      }
   


    return res.status(200).json({message: " file added to fav successfully", Files});
}

export const removeStarredFile = async(req, res, next) => {  
  const {id}= req.params
  
  const Files = await File.findOneAndUpdate({
        _id: id,
        userId: req.user._id,
      },
      {
        starred: false,
      },
      {
        new: true,
      })

      if(!Files){
        return res.status(404).json({ error : "files not found "})
      }
   


    return res.status(200).json({message: " file removed  successfully", Files});
}

export const updateFilename = async(req,res,next)=>{
    const {id } = req.params
    const fileInfo =  await File.findOne({
      _id: id,
      userId: req.user._id,
    })

    if(!fileInfo){
      return res.status(404).json({ error : "files not found "})
    }
    try {
       const newName = purify.sanitize( req.body.newFilename ) // we are gettng new file name in req.body and we are updating the new name 
       fileInfo.name = newName
       await fileInfo.save() //without the save() it wont get save 
        return res.status(200).json({message: " file renamed successfully"})
      
    } catch (error) {
      console.log(error)
      next(error)
      }
    }

export const uploadInitiateAws = async(req,res,next)=>{ // this is create of crud 
    const user = await User.findOne({_id : req.user._id}).lean() // we are getting user details of req.user
    console.log("filecreate",req.body);
    const parentDirId = req.body.parentDirId || user.rootDirId  
   try {
     const parentDirData = await Directory.findOne({
    _id : parentDirId, // searching and authenticatinng that the parent id comming for params exist in database or not
    userId: user._id,
  })
  
  if(!parentDirData){
    return res.status(404).json({error : "parent directory not found"})
  }
  const rootDir = await Directory.findById(user.rootDirId)

  const filename= purify.sanitize(req.body.name || "utittled"); // purifying the name \
  const remainingMemory = user.maxStorage - rootDir.size

  const fileSize = req.body.size  // we are sending filezed in body from frontend 
  if (fileSize > remainingMemory){
    console.log("file is tooo big ");
      return res.status(507).json({ error: "Not enough storage." }); // doing this bcz data is comming in body not params 
    //return res.destroy()  destroying proess like ths saves th bandwidth data of user 
    // res.header("Connection", "close"); we can aslo destroy the process like these 
      // return res.end();

      }

  const extension = path.extname(filename) // this is for finding the file extenson that came from headers/body
  const inserteFile = await File.insertOne({ // inserting file details in database that came from post route 
    name : filename,
    size: fileSize,
    extension,
    parentDirId: parentDirData._id, // also inserting parent dir id of user 
    userId : user._id, // inserting user id of  user in his file collection and this is how one user directory,user,and fiile collection are connnected
    isUploading : true,
  })

  const fileId = inserteFile._id // here we got the file id 
  const fullFileName = `${fileId}${extension}`

  const signedUrl = await createUploadUrl( { 
    key : fullFileName,
    contentType : req.body.contentType
  })

  res.json({ uploadSignedUrl: signedUrl , fileId: fileId}) // sending url as response and frontend will directly upload files to aws using thi url 

  
  //req.on(close and error event dosent  make sense here to put cuz we are uploading to aws directly from frontend in backend we are just sending 
  // meta data to store meta data from backend we are sending signed url and frontend will use this url and direcly upload from there 
  //backend is not imvolve in uploading so thesee req dsent make sense we will used these in frontend )
 

    } catch (error) {
       console.log(error);
        next(error);
   }
}

export const uploadComppletedAws = async( req, res, next )=>{
 
  const user = req.user
  const id = req.body.fileId
  const file = await File.findOne({
    _id:id,
    userId : user._id
  })
  if(!file){
    return res.status(404).json("file not found ")
  }

  try {
    const awsFiledata = await getUploadedAwsMetadata(`${file._id}${file.extension}`)
    if( awsFiledata.ContentLength !== file.size ){ // comparing size of s3 bucket fil with databse file if it same then allowing the upload
    await file.deleteOne()
    return res.status(400).json("file not found ") }
    
    file.isUploading = false
    await file.save()
    await FolderSize(file.parentDirId , file.size)
    return res.json({message: "file uploaded successfully"})

    
  } catch (error) {
    console.log(error);
    
    await file.deleteOne() 
    return res
      .status(404)
      .json({ error: "File was could not be uploaded properly." });
  
  }}


export const deleteFile = async (req, res,next) => {
 const {id } = req.params
    const fileInfo =  await File.findOne({
      _id: id,
      userId: req.user._id,
    }) //.select("extension") select will only get this seleccted field ie extension here only extion will come

    if(!fileInfo){
      return res.status(404).json({ error : "files not found "})
    }
  try {
    await fileInfo.deleteOne()  // deleting from database
    await FolderSize(fileInfo.parentDirId , -fileInfo.size ) // if we pass - it will subtract the filesize  updating size after deleting
    await deleteUploadedAwsFile(`${fileInfo._id}${fileInfo.extension}`) /// deleting from aws s3bucket
      
    return res.status(200).json({ message: "File Deleted Successfully" });
  } catch (err) {
    console.log(err);
    
    next(err)
  }
}


