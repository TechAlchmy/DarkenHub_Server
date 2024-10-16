import {
  googleLogin,
  loginUser,
  registerUser,
  steamLogin,
} from "../controllers/authController";
import express from "express";
import passport from "passport";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// OAuth routes
router.get("/google", (req, res) => {
  const state = Buffer.from(JSON.stringify(req.query)).toString("base64");

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
  })(req, res);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleLogin
);

router.get("/steam", passport.authenticate("steam"));
router.get(
  "/steam/callback",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  steamLogin
);

export default router;
