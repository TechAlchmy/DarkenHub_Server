import mongoose from "mongoose";
import { IUser, UserModel, UserSchema } from "./schemas/UserSchema";

export const User = mongoose.model<IUser, UserModel>("User", UserSchema);
