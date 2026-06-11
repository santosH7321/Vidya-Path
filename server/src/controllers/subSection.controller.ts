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

export const updateSubSection = async ( req: CustomRequest, res: Response ) => {
  try {
    const { subSectionId, title, description, timeDuration } = req.body;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID is required",
      });
    }

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title) subSection.title = title;
    if (description) subSection.description = description;
    if (timeDuration) subSection.timeDuration = timeDuration;

    const video = req.files?.videoFile;

    if (video && !Array.isArray(video)) {
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME!
      );

      subSection.videoUrl = uploadDetails.secure_url;
    }

    await subSection.save();

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: subSection,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};