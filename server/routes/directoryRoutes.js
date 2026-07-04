import express from "express"
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js"
import { createDirectory, deleteDirectory, getDirectorybyId, updateDirectory } from "../controllers/directoryController.js"

const router = express.Router()

router.param("parentDirId",validateIdMiddleware) // these router.params will execute whenever client will go to these url /id or/ parentirid and we have applied an cheking middleware to chek the object id is legit or not 
router.param("id",validateIdMiddleware)
//read files and serving files from a directory
// router.get("/?*", async(req,res)=>{ //multi level nesting using * this star also call as wildcard
//         const {0:dirname} = req.params // destruturing url param from frontend and renaming it to dirname 
//         const fullDirPath = `./storage/${dirname? dirname : ""}`
//         const readDir = await readdir(fullDirPath) //showing dir files
//         const responseData = []
//         for(const items of readDir){
//           const stats = await stat(`${fullDirPath}/${items}`)
//           responseData.push({name : items , isDirectory : stats.isDirectory()}) // name and is directory is key and this will send true or fale and this will help in frintend to give download option or not 
//           }// if its an directory will give only open option otherwise both open and download option will be given and this will help us by giving true or false
//         res.json(responseData) //sending json data 
// })

router.get("/:id?", getDirectorybyId)

router.post("/:parentDirId?", createDirectory)

router.patch("/:id", updateDirectory)

router.delete("/:id", deleteDirectory)

export default router