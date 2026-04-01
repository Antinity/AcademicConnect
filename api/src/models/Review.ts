import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  teacherId: mongoose.Types.ObjectId;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

const ReviewSchema: Schema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewer: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", ReviewSchema);
