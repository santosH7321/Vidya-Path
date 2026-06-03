import { Schema, model} from "mongoose";

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
const OTP = model("OTP", OTPSchema);
export default OTP;