import mongoose, { Schema, Document } from "mongoose";
const ReviewSchema = new Schema({
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewer: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model("Review", ReviewSchema);
//# sourceMappingURL=Review.js.map