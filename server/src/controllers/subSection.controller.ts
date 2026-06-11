import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { uploadImageToCloudinary } from "../utils/imageUploader";
import SubSection from "../models/subSection.model";
import Section from "../models/section.model";

interface CustomRequest extends Request {
  files?: {
    videoFile?: UploadedFile | UploadedFile[];
  };
}

export const createSubSection = async ( req: CustomRequest, res: Response ) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;

    const video = req.files?.videoFile;

    if (!sectionId || !title || !timeDuration || !description || !video ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    if (Array.isArray(video)) {
      return res.status(400).json({
        success: false,
        message: "Please upload only one video file",
      });
    }

    if (!process.env.FOLDER_NAME) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary folder name is not configured",
      });
    }

    const uploadDetails = await uploadImageToCloudinary( video, process.env.FOLDER_NAME);

    const subSectionDetails = await SubSection.create({ title, timeDuration, description, videoUrl: uploadDetails.secure_url });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      {
        new: true,
      }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "Sub Section Created Successfully",
      data: updatedSection,
    });
  } 
  catch (error) {
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Error in createSubSection",
        });
    }
};

