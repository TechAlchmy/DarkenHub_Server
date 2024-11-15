require('dotenv').config();

export default {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  steamAPIKey: process.env.STEAM_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
};
