import { Router } from "express"
import { deleteAccount, getAllUserDetails, getEnrolledCourses, updateDisplayPicture, updateProfile } from "../controllers/profile.controller";
import { auth } from "../middlewares/auth.middleware";
export const ProfileRoute = Router();

ProfileRoute.delete("/deleteProfile", deleteAccount)
ProfileRoute.put("/updateProfile", auth, updateProfile)
ProfileRoute.get("/getUserDetails", auth, getAllUserDetails)
ProfileRoute.get("/getEnrolledCourses", auth, getEnrolledCourses)
ProfileRoute.put("/updateDisplayPicture", auth, updateDisplayPicture)
