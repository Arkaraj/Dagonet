import { model, Schema, Document, Types } from "mongoose";

export enum Tracks {
  beginner = "Beginner",
  intermediate = "Intermediate",
  advanced = "Advanced",
}

export interface IStudent extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  role: boolean;
  tracks: Tracks;
}

const StudentSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Boolean, required: true, default: false },
  tracks: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  }, // default: "Beginner"
});

export default model<IStudent>("Student", StudentSchema);
