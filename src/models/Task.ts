import { model, Schema, Document, Types } from "mongoose";
import { Tracks } from "./Student";

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  instructions: string;
  image: string;
  instructor: Types.ObjectId;
  tracks: Tracks;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  instructions: { type: String, required: true },
  image: { type: String, required: true },
  instructor: { type: Types.ObjectId, ref: "Instructor" }, // Say only one instructor, else array
  tracks: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
    required: true,
  },
});

export default model<ITask>("Task", TaskSchema);
