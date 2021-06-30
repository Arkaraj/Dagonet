import { model, Schema, Document, Types } from "mongoose";

export interface IUploadedTask extends Document {
  _id: Types.ObjectId;
  image: string;
  grade: number;
  task: Types.ObjectId;
  user: Types.ObjectId;
}

const UploadedTaskSchema: Schema = new Schema({
  image: { type: String, required: true, unique: true },
  grade: { type: Number, min: 1, max: 5 },
  task: { type: Types.ObjectId, ref: "Task" },
  user: { type: Types.ObjectId, ref: "Student" },
});

export default model<IUploadedTask>("UploadedTask", UploadedTaskSchema);
