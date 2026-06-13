import { Request, Response } from "express";
import Course from "../models/course.model";
import Tag from "../models/tags.model";
import User from "../models/user.model";
import { uploadImageToCloudinary } from "../utils/imageUploader";
import { UploadedFile } from "express-fileupload";

export const createCourse = async (req: Request, res: Response) => {
    try {
        const {courseName, courseDescription, whatYoutWillLearn, price, tag} = req.body;
        const thumbnail = req.files?.thumbnailImage as UploadedFile;

        if(!courseName || !courseDescription || !whatYoutWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: " , instructorDetails);

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
        }

        const tagDetails = await Tag.findById(tag);
        if(!tagDetails) {
            return res.status(404).json({
                success:false,
                message:'Tag Details not found',
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME!);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYoutWillLearn,
            price,
            tag: [tagDetails._id.toString()],
            thumbnail: thumbnailImage.secure_url,
        })

        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });

    }
    catch(error) {
        if(error instanceof Error){
            return res.status(500).json({
                success:false,
                message:'Failed to create Course',
                error: error.message,
            })
        }
    }
};

export const getAllCourses = async (req: Request, res: Response) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error instanceof Error ? error.message: "Error getAllCourse controller",
		});
	}
};

export const getCourseDetails = async (req: Request, res: Response) => {
    try {
            const {courseId} = req.body;

            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        .populate("ratingAndreviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();


                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }

                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error instanceof Error ? error.message: "Error in getCourseDetails controller",
        });
    }
}