import mongoose, { Document } from "mongoose";
export interface IReview extends Document {
    teacherId: mongoose.Types.ObjectId;
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
}
declare const _default: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview, {}, mongoose.DefaultSchemaOptions> & IReview & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IReview>;
export default _default;
//# sourceMappingURL=Review.d.ts.map