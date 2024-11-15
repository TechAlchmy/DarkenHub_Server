import { Request, Response, NextFunction } from "express";

import sendToken from "../utils/sendToken";
import { User } from "../models/User";
import { IUser } from "../models/schemas/UserSchema";
import { dota2ItemSave } from "./dota2Controller";

require('dotenv').config();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullname, userID, email, password } = req.body;
  const user = await User.create({ fullname, userID, email, password });
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
  let redirectUrl = `${process.env.BASE_URL}`;
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

const fetchSteamUserData = async (steamID: any) => {
  const apiKey = `${process.env.STEAM_APIKEY}`; // Replace with your Steam API key
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamID}`;

  try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.response.players.length > 0) {
          const player = data.response.players[0];
          const userData = {
            username: player.personaname,
          };
          return userData;
      } else {
          console.log('No player found with this Steam ID');
          return null;
      }
  } catch (error) {
      console.error('Error fetching Steam user data:', error);
  }
};


export const steamLogin = async (req: Request, res: Response, next: NextFunction) => {
  const steamID = req.body.steamId;
  let user = await User.findOne({ steamId: steamID }) || await User.findOne({ email: `${steamID}@steam.com` });
  if (!user) {
    const userData = await fetchSteamUserData(steamID);
    // Create a new user if they don't exist
    if (userData) {
      // Create a new user only if userData is valid
      user = await User.create({
        steamId: steamID,
        userID: steamID,
        fullname: userData.username,
        email: `${steamID}@steam.com`,
      });
    }
    dota2ItemSave(steamID);
  }else{
    console.log('User already exists');
  }
  sendToken(user, 200, res); // Send JWT to frontend
};
