import { Schema, model} from "mongoose";

const userSchema = new Schema({
    firstName: {
        type:String,
        required:true,
        trim:true,
    },
    lastName :{
        type:String,
        required:true,
        trim:true,
    },
    email: {
        type:String,
        required:true,
        trim:true,
    },
    password: {
        type: String,
        required:true,
    },
    accountType: {
        type: String,
        enum:["Admin", "Student", "Instructor"],
        required:true    
    },
    additionalDetails: {
        type: Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses: [
        {
            type: Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    image:{
        type:String,
        required:true,
    },
    courseProgress: [
        {
            type: Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ],

});

const User = model("User", userSchema);
export default User;