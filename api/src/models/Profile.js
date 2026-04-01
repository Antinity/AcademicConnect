import mongoose, { Schema, Document } from "mongoose";
const ProfileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    headline: { type: String },
    location: { type: String },
    bio: { type: String },
    subjects: { type: [String] },
    hourlyRate: { type: Number },
    rating: { type: Number, default: 0 },
    title: { type: String },
}, { timestamps: true });
export default mongoose.model("Profile", ProfileSchema);
//# sourceMappingURL=Profile.js.map