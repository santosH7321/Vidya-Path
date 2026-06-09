import { Request, Response } from "express";
import Tag from "../models/tags.model";

export const createTag = async (req: Request, res: Response) => {
    try{
        const {name, description} = req.body;

            if(!name || !description) {
                return res.status(400).json({
                    success:false,
                    message:'All fields are required',
                })
            }

            const tagDetails = await Tag.create({
                name:name,
                description:description,
            });

            return res.status(200).json({
                success:true,
                message:"Tag Created Successfully",
            })


    }
    catch(error) {
        if(error instanceof Error){
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }
};