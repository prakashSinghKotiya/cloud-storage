import express from "express"
import { rzpWebhook } from "../controllers/webhookController.js"


const router = express.Router()

router.post('/razorpay', rzpWebhook)



export default router