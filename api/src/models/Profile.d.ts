import mongoose, { Document } from "mongoose";
export interface IProfile extends Document {
    userId: mongoose.Types.ObjectId;
    headline?: string;
    location?: string;
    bio?: string;
    subjects?: string[];
    hourlyRate?: number;
    rating?: number;
    title?: string;
}
declare const _default: mongoose.Model<IProfile, {}, {}, {}, mongoose.Document<unknown, {}, IProfile, {}, mongoose.DefaultSchemaOptions> & IProfile & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProfile>;
export default _default;
//# sourceMappingURL=Profile.d.ts.map