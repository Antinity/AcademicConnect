import mongoose, { Document } from "mongoose";
export type Role = "student" | "teacher" | "school";
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: Role;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map