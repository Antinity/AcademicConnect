import mongoose, { Schema, Document } from "mongoose";
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["student", "teacher", "school"], required: true },
}, { timestamps: true });
export default mongoose.model("User", UserSchema);
//# sourceMappingURL=User.js.map