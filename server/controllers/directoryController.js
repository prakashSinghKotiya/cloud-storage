import { rm } from "fs/promises"
import Directory from "../models/directoryModel.js"
import File from "../models/fileModel.js"
import { FolderSize } from "./fileController.js"
import { deleteUploadedAwsFiles } from "../service/awsS3.js"
import { file } from "zod"



export const getDirectorybyId = async (req, res)=>{
  //const db = req.db we dont need this anymore here 
  const user = req.user 
  const _id = req.params.id || user.rootDirId.toString() //mongoose directy give id like this no needd to do object id like in mongo

  const directoryData = await  Directory.findOne({_id}).lean() // this is now acting as an validator now if id not there or  its invalid id mongo will automatically send an error 
  
  if(!directoryData){
   return res.status(404).json({ error : "directory not foud or you have no access to it "})
  } 

  const filesData = await File.find({parentDirId: directoryData._id}).lean() // no need to do in .toarrray()here cuz mongoose dosent use cursor
  const allDirectory = await Directory.find({parentDirId: _id }).lean() //lean will send limited properties in lean way
  res.set("Cache-Control", "no-store");
  return res.status(200).json({
    ...directoryData,
    files:filesData.map((file)=>({...file, id: file._id})), //mapping every files id for rendering in ui
   directories: allDirectory.map((dir)=> ({...dir , id: dir._id})), // we have to map every dir id here before sending to client ie frontend 
  })

}

export const createDirectory = async (req, res,next)=>{

  const user = req.user 
 
  const parentDirId = req.params.parentDirId || user.rootDirId.toString()
  const dirname = req.headers.dirname || "New Folder"
  try {
    const parentDir = await Directory.findOne({_id : parentDirId}).lean() //searching parentdir id we are now creating an whole new objectd for every directory not merging it as an array inside parentdir 
    if (!parentDir)
      return res
        .status(404)
        .json({ message: "Parent Directory Does not exist!" });

     await Directory.create({
      name: dirname,
      parentDirId,  //pushing parenddir id ie the root dir of user into the new directory(folder) of user and this is how they are chained and connnected 
      userId : user._id, // pushing also user id  to the new directory ie the new folder ,
     
      
    })  
    return res.status(200).json({ message: "Directory Created!" });

    
  } catch (err) {
    
      console.dir(error?.errInfo?.details, { depth: null });
    
    if (err.code === 121) {
      res
        .status(400)
        .json({ error: "Invalid input, please enter valid details" });
    } else {
      next(err);
    }
    
  }
}

export const updateDirectory = async (req, res, next)=>{
  const user = req.user // taking user from here
  const {newDirName} = req.body // taking new dir name frm=om here 
  
  
  const { id } = req.params // getting id from params ie the route we have made :id 

  try {
    
   //await Directory.updateOne({  this is how we were doing in mongo 
  //  _id: new ObjectId(id), // chekinng id in database with id came from params 
  //  userId : new ObjectId(user._id) // also cheking user id from user.id with database id . these are also workinng as validation 
  //},  {$set: {name : newDirName}})

  await Directory.findOneAndUpdate({ // this block is for finding and this is how wee are updating in mnongooose
    _id:id,
    userId: user._id
  },{                       // this block is for updating 
    name : newDirName
  })

  return res.status(200).json({ message : " Renamed successfully "})
    
  } catch (error) {
    next(error)
  }
}

export const deleteDirectory = async (req,res,next )=>{
  const user = req.user
  const {id} = req.params

  //const parentDirId = new ObjectId(id) // intitally making the id from params to object id so mongo db dont read it as string
  const directoryData = await Directory.findOne({
    _id:id,
    userId : user._id
  }) //.select("_id").lean()  select working same as projection does in mongo oly id field will come fromm the doc 
 

  
if(!directoryData){
  return res.status(404).json({message:"Directory not found"})
}
try {

  async function getDirectoryContents(id){
  let files = await File.find({parentDirId : id}).select("extension").lean()
  let directories = await Directory.find({parentDirId: id }).select("_id").lean()

  for (const {_id} of directories) {
    const {files : childFiles , directories:childDirectories} = await getDirectoryContents(_id) // reccursion calling the same function inside 
    files = [...files, ...childFiles]
    directories=[...directories , ...childDirectories]
    }

    return {files, directories}
    console.log(files,directories);
    
 }

    const {files, directories} = await getDirectoryContents(id) // sharing the id here that comming from params and calling the recurssion fnction to evaluate and find all the dir and files 
  console.log(files, directories);
  
    const keys = files.map(({_id ,extension }) => ({ Key: `${_id}${extension}`})) // returning new array of key  
    console.log(keys);
    
    if(keys.length > 0){
      await deleteUploadedAwsFiles(keys) // deleting from aws 
      }
    


    await File.deleteMany({_id: {$in : files.map(({_id})=> _id) }}) // $in will send all the id that is comming from the map loop of files 
   
    await Directory.deleteMany({_id: {$in: [...directories.map(({ _id }) => _id), id]}})


     await FolderSize(directoryData.parentDirId , -directoryData.size)

     return res.json({ message: "Files deleted successfully" });

  
} catch (error) {
  console.log(error);
  
}


}