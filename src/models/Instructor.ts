import { model, Schema, Document, Types } from "mongoose";

export interface IInstructor extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  role: boolean;
}

const InstructorSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Boolean, required: true, default: true },
});

export default model<IInstructor>("Instructor", InstructorSchema);
