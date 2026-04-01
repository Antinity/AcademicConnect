import mongoose, { Document } from "mongoose";
export interface IConversation extends Document {
    participantIds: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, mongoose.DefaultSchemaOptions> & IConversation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IConversation>;
export default _default;
//# sourceMappingURL=Conversation.d.ts.map