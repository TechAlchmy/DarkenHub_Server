import { Response } from "express";
import { IUser } from "../models/schemas/UserSchema";

const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getSignedJwtToken();

  // Options for the cookie
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Accessible only by web server
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
};

export default sendToken;
