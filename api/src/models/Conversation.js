import mongoose, { Schema, Document } from "mongoose";
const ConversationSchema = new Schema({
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
export default mongoose.model("Conversation", ConversationSchema);
//# sourceMappingURL=Conversation.js.map