import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token =
            req.cookies?.token ||
            req.body?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!
            );

            req.user = decoded;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }

        return next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while validating the token",
        });
    }
};

export const isStudent = async (req: Request, res: Response, next: NextFunction) => {
 try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only',
            });
        }
        next();
 }
 catch(error) {
    return res.status(500).json({
        success:false,
        message:'User role cannot be verified, please try again'
    })
 }
}

export const isInstructor = async (req: Request, res: Response, next: NextFunction) => {
    try{
           if(req.user.accountType !== "Instructor") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Instructor only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try{
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
}