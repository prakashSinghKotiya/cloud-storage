import express from "express"
import { loginwithGoogle, otpsent, otpverify } from "../controllers/authController.js"

const router = express.Router()

router.post("/send-otp", otpsent )
router.post("/verify-otp", otpverify )
router.post("/google", loginwithGoogle)





export default router