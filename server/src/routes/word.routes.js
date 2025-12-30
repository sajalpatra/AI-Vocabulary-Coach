import express from "express";
import {
  addWord,
  getMyWords,
  getWordById,
  deleteWord,
} from "../controllers/word.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All word routes require authentication
router.use(protect);

router.post("/add", addWord);
router.get("/my-words", getMyWords);
router.get("/:id", getWordById);
router.delete("/:id", deleteWord);

export default router;
