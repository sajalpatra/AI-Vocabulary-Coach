import express from "express";
import {
  getTodayWords,
  submitReview,
  getReviewStats,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All review routes require authentication
router.use(protect);

router.get("/today", getTodayWords);
router.post("/submit", submitReview);
router.get("/stats", getReviewStats);

export default router;
