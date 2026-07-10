import express from "express"
import checkAuth, { adminChecker, isAdmin } from "../Middlewares/authenticaton.js"

import { adminPowerlogout, DeleteUser, getAllUsers, loginUser, logout, logoutAll, registerUser, userDetails } from "../controllers/userController.js"




const router = express.Router()


router.post("/register", registerUser)

router.post("/login",loginUser )

router.get("/",checkAuth, userDetails)

router.post("/logout", checkAuth, logout)

router.post("/logout-All",checkAuth, logoutAll)

router.get("/users",checkAuth,adminChecker, getAllUsers) //rbac getalluser endpoint 

router.post("/users/:userId/logout",checkAuth,adminChecker,adminPowerlogout ) //rbac

router.post("/users/:userId",checkAuth,isAdmin,DeleteUser) //rbac

 

export default router
