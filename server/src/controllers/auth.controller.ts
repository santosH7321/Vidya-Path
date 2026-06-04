import { Request, Response, CookieOptions } from "express";
import User from "../models/user.model";
import OTP from "../models/OTP";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model";
import jwt from "jsonwebtoken";

export const sendOTP = async (req: Request, res: Response) =>  {
    try {
        const {email} = req.body;

        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent) {
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ", otp );

        //check unique otp or not
        let result = await OTP.findOne({otp: otp});

        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        const otpBody = await OTP.create(otpPayload);

        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:'OTP Sent Successfully',
            otp,
        })
    }
    catch(error) {
        if(error instanceof Error) {
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }
};

export const signUp = async (req: Request, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const recentOtp = await OTP.findOne({ email })
            .sort({ createdAt: -1 });

        if (!recentOtp) {
            return res.status(404).json({
                success: false,
                message: "OTP not found",
            });
        }

        if (String(otp) !== String(recentOtp.otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 14);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber || null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.error("Signup Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to register user",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(403). json({
                success:false,
                message:'All fields are required, please try again',
            });
        }

        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not registrered, please signup first",
            });
        }

        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET!, {
                expiresIn:"2h",
            });

            const userObj = user.toObject();

            delete (userObj as any).password;
            (userObj as any).token = token;

            const options: CookieOptions = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            };
            
            return res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user: userObj,
                message:'Logged in successfully',
            })

        }
        else {
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }
        
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        });
    }
};