import { Request, Response, NextFunction } from "express";
import sendToken from "../utils/sendToken";
import { User } from "../models/User";
import { IUser } from "../models/schemas/UserSchema";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullname, email, password } = req.body;
  const user = await User.create({ fullname, email, password });
  sendToken(user, 200, res);
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: "Invalid credentials" });
  } else {
    sendToken(user, 200, res);
  }
};

// For OAuth login (Google or Steam)
export const googleLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = (req.user as IUser).getSignedJwtToken();
  const message = JSON.stringify({
    type: "GOOGLE_AUTH_SUCCESS",
    token,
    user: req.user,
  });
  let redirectUrl = "";
  if (req.query.state) {
    try {
      const stateData = JSON.parse(
        Buffer.from(req.query.state as string, "base64").toString()
      );
      if (typeof stateData.redirect_url === "string") {
        redirectUrl = stateData.redirect_url;
      }
    } catch (error) {
      console.error("Error parsing state:", error);
    }
  }

  res.send(`
    <script>
      window.opener.postMessage(${message},'${redirectUrl}');
      window.close();
    </script>
  `);
};

export const steamLogin = (req: Request, res: Response, next: NextFunction) => {
  sendToken(req.user as IUser, 200, res); // Send JWT to frontend
};
