import { Router, RequestHandler } from "express"
import { changePassword, login, sendOTP, signUp } from "../controllers/auth.controller"
import { auth } from "../middlewares/auth.middleware"
import { resetPassword, resetPasswordToken } from "../controllers/reset.password.controller"
export const AuthRouter = Router()

AuthRouter.post("/login", login)

AuthRouter.post("/signup", signUp)

AuthRouter.post("/sendotp", sendOTP)

AuthRouter.post("/changepassword", auth, changePassword as RequestHandler)

AuthRouter.post("/reset-password-token", resetPasswordToken)

AuthRouter.post("/reset-password", resetPassword)
