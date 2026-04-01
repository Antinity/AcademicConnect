import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  participantIds: mongoose.Types.ObjectId[];
}

const ConversationSchema: Schema = new Schema(
  {
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<IConversation>("Conversation", ConversationSchema);
