import { Request, Response, NextFunction } from "express";
import sendToken from "../utils/sendToken";
import { User } from "../models/User";
import { IUser } from "../models/schemas/UserSchema";
require('dotenv').config();

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
  let redirectUrl = "http://localhost:5173";
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
      if (window.opener) {
          window.opener.postMessage(${message}, '*'); // Use '*' for testing
      } else {
          console.error('Opener window is not available.');
      }
    </script>
  `);
};



export const steamLogin = async (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body;

  const { steamID } = req.body;
  let user = await User.findOne({ steamID: steamID});
  if (!user) {
    // Create a new user if they don't exist
    user = await User.create({
      steamId: steamID,
      // Add any additional fields you need
    });
  }

  sendToken(user, 200, res); // Send JWT to frontend
};
