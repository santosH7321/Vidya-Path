import { Request, Response } from "express";
import Course from "../models/course.model";
import mongoose from "mongoose";
import { instance } from "../config/razorpay";

export const capturePayment = async (req: Request, res: Response) => {
    const {course_id} = req.body;
    const userId = req.user.id;

    if(!course_id) {
        return res.json({
            success:false,
            message:'Please provide valid course ID',
        })
    };

    let course;
    try{
        course = await Course.findById(course_id);
        if(!course) {
            return res.json({
                success:false,
                message:'Could not find the course',
            });
        }

        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success:false,
                message:'Student is already enrolled',
            });
        }
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message: error instanceof Error ? error.message : "Error in capturePayment",
        });
    }
    
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: Number(amount) * 100,
        currency,
        receipt: Date.now().toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try{
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        });
    }
    catch(error) {
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
};