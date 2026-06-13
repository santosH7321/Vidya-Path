import { Schema, model } from "mongoose";

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: { type: String },
	courses: [
		{
			type: Schema.Types.ObjectId,
			ref: "Course",
		},
	],
});

const Category = model("Category", categorySchema);
export default Category;