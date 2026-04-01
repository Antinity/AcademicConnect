import mongoose, { Schema, Document } from "mongoose";
const MessageSchema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model("Message", MessageSchema);
//# sourceMappingURL=Message.js.map