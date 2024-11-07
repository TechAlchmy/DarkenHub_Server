import {
  googleLogin,
  loginUser,
  registerUser,
  steamLogin,
} from "../controllers/authController";
import express, { Request, Response, NextFunction } from "express";
const OpenID = require('openid').OpenID;
import passport from "passport";
import { OAuth2Client } from "google-auth-library";
import jwt from 'jsonwebtoken';

import { User } from "../models/User";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

const generateJwtToken = (payload: { email: string; name: string }) => {
  // Create a JWT with a payload containing user info
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
  });
};

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Add your Google Client ID to your .env
const client = new OAuth2Client(CLIENT_ID);

router.post("/google", async (req: any, res: any) => {
  const { token } = req.body;

  try {
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    const userInfo = await userInfoResponse.json();
    
    const user = await User.findOne({ email: userInfo.email });
    if (!user) {
      // Create a new user if they don't exist
      const newUser = await User.create({
        email: userInfo.email,
        fullname: userInfo.name,
        // Add any additional fields you need
      });
    }

    const authToken = generateJwtToken({ email: userInfo.email, name: userInfo.name });
    res.json({ success: true, token: authToken });

  } catch (error) {
    console.error('Error verifying Google token:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid Google token',
    });
  }
});

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleLogin
);



// Endpoint to receive user data
router.post('/steam/login', steamLogin);


export default router;
