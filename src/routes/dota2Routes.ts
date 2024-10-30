import express from "express";
import { getHeroes } from "../controllers/dota2Controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/heroes", getHeroes);

export default router;
