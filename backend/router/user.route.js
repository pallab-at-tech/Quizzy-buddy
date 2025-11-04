import express from 'express'
import { quizParticiapantsDetails, userDetailsController, userForgotPassword, userLoginController, userLogOutController, userRefressingTokenController, userRegisterController, userResetPasswordController, userVerifyForgotPasswordController } from '../controller/user.controller.js'
import auth from '../middleware/auth.js'

const userRouter = express()

userRouter.post("/register",userRegisterController)
userRouter.post("/login",userLoginController)
userRouter.get("/logout",auth,userLogOutController)
userRouter.put("/forgot-password",userForgotPassword)
userRouter.put("/verify-forgot-password",userVerifyForgotPasswordController)
userRouter.put("/reset-password" ,userResetPasswordController)
userRouter.post("/refresh-token",userRefressingTokenController)
userRouter.get("/user-details",auth,userDetailsController)
userRouter.get("/quiz-details",auth,quizParticiapantsDetails)

export default userRouter