import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/schemas/UserSchema";
import { User } from "../models/User";

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById((req.user as IUser).id);
  res.status(200).json({ success: true, data: user });
};
