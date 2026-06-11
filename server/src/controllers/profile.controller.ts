import { Request, Response } from "express";
import User from "../models/user.model";
import Profile from "../models/profile.model";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const updateProfile = async ( req: AuthRequest, res: Response ) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    const id = req.user?.id;

    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};