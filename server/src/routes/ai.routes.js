import express from "express";
import {
  generateQuiz,
  provideSentenceFeedback,
  chat,
  getSuggestions,
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All AI routes require authentication
router.use(protect);

router.post("/quiz", generateQuiz);
router.post("/feedback", provideSentenceFeedback);
router.post("/chat", chat);
router.post("/suggestions", getSuggestions);

export default router;
