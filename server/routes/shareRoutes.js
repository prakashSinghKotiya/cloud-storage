import express from "express"
import { createShareLink, getSharedFile } from "../controllers/shareController.js"
import checkAuth from "../Middlewares/authenticaton.js"



const router = express.Router()

router.post('/createshare/:fileId',checkAuth, createShareLink)
router.get('/:token', getSharedFile)



export default router