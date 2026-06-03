import { Schema, model} from "mongoose";

const sectionSchema = new Schema({
    sectionName: {
        type:String,
    },
    subSection: [
        {
            type: Schema.Types.ObjectId,
            required:true,
            ref:"SubSection",    
        }
    ],
});
const Section = model("Section", sectionSchema);
export default Section;
