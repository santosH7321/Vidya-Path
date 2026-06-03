import { Schema, model} from "mongoose";

const courseProgress = new Schema({
    
    courseID: {
        type: Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVideos: [
        {
            type: Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ]

});
const CourseProgress = model("CourseProgress", courseProgress);
export default CourseProgress;