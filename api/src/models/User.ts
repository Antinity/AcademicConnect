import mongoose, { Schema, Document } from "mongoose";

export type Role = "student" | "teacher" | "school";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional if using basic mocked auth
  role: Role;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["student", "teacher", "school"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
