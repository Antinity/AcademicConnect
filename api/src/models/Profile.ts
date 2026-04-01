import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  headline?: string;
  location?: string;
  bio?: string;
  subjects?: string[];
  hourlyRate?: number;
  rating?: number;
  title?: string;
  gradeLevel?: string;
  goals?: string;
  institutionName?: string;
  hiringFocus?: string;
}

const ProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    headline: { type: String },
    location: { type: String },
    bio: { type: String },
    subjects: { type: [String] },
    hourlyRate: { type: Number },
    rating: { type: Number, default: 0 },
    title: { type: String },
    gradeLevel: { type: String },
    goals: { type: String },
    institutionName: { type: String },
    hiringFocus: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>("Profile", ProfileSchema);
