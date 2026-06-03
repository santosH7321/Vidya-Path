import { Schema, model} from "mongoose";
import mailSender from "../utils/mailSender";

const OTPSchema = new Schema({
    email:{
        type:String,
        required: true,
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
});

async function sendVerificationEmail(email: String, otp: String) {
    try{
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
        console.log("Email sent Successfully: ", mailResponse);
    }
    catch(error) {
        console.log("error occured while sending mails: ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function() {
    await sendVerificationEmail(this.email, this.otp);
}) 


const OTP = model("OTP", OTPSchema);
export default OTP;