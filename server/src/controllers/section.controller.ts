import { Request, Response } from "express";
import Section from "../models/section.model";
import Course from "../models/course.model";

export const createSection = async (req: Request, res: Response) => {
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        const newSection = await Section.create({sectionName});

        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent:newSection._id,
                                                }
                                            },
                                            {new:true},
                                        );

        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updatedCourseDetails,
        })
    }
    catch(error) {
        if(error instanceof Error){
            return res.status(500).json({
                success:false,
                message:"Unable to create Section, please try again",
                error:error.message,
            });
        }
    }
}

export const updateSection = async (req: Request, res: Response) => {
    try {
        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        return res.status(200).json({
            success:true,
            message:'Section Updated Successfully',
        });

    }
    catch(error) {
        if(error instanceof Error){
            return res.status(500).json({
                success:false,
                message:"Unable to update Section, please try again",
                error:error.message,
            });
        }
    }
};

export const deleteSection = async (req: Request, res: Response) => {
    try {
        const {sectionId} = req.params

        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        })

    }
    catch(error) {
        if(error instanceof Error){
            return res.status(500).json({
                success:false,
                message:"Unable to delete Section, please try again",
                error:error.message,
            });
        }
    }
}