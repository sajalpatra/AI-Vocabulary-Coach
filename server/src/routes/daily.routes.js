import express from "express";
import {
  getTodaysWords,
  addDailyWord,
} from "../controllers/daily.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All daily word routes require authentication
router.use(protect);

router.get("/words", getTodaysWords);
router.post("/add-word", addDailyWord);

export default router;
