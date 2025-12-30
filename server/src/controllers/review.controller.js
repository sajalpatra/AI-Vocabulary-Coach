import UserWord from "../models/UserWord.model.js";
import { calculateNextReview, getDifficultyGrades } from "../utils/sm2.js";

/**
 * @desc    Get words due for review today
 * @route   GET /api/review/today
 * @access  Private
 */
export const getTodayWords = async (req, res, next) => {
  try {
    const now = new Date();

    const userWords = await UserWord.find({
      userId: req.user._id,
      nextReviewAt: { $lte: now },
    })
      .populate("wordId")
      .sort({ nextReviewAt: 1 });

    res.status(200).json({
      success: true,
      count: userWords.length,
      data: userWords,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit review for a word
 * @route   POST /api/review/submit
 * @access  Private
 */
export const submitReview = async (req, res, next) => {
  try {
    const { userWordId, grade, timeSpent } = req.body;

    // Validate input
    if (!userWordId || grade === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide userWordId and grade",
      });
    }

    // Validate grade (0-5 or difficulty string)
    let numericGrade = grade;
    if (typeof grade === "string") {
      const grades = getDifficultyGrades();
      numericGrade = grades[grade.toLowerCase()];

      if (numericGrade === undefined) {
        return res.status(400).json({
          success: false,
          message: "Invalid grade. Use 0-5 or: again, hard, good, easy",
        });
      }
    }

    if (numericGrade < 0 || numericGrade > 5) {
      return res.status(400).json({
        success: false,
        message: "Grade must be between 0 and 5",
      });
    }

    // Find the user word
    const userWord = await UserWord.findOne({
      _id: userWordId,
      userId: req.user._id,
    });

    if (!userWord) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    // Calculate next review using SM-2 algorithm
    const updatedFields = calculateNextReview(userWord, numericGrade);

    // Update the user word
    userWord.efactor = updatedFields.efactor;
    userWord.interval = updatedFields.interval;
    userWord.repetitions = updatedFields.repetitions;
    userWord.nextReviewAt = updatedFields.nextReviewAt;
    userWord.lastResult = updatedFields.lastResult;

    // Add to review history
    userWord.reviewHistory.push({
      reviewedAt: new Date(),
      grade: numericGrade,
      timeSpent: timeSpent || 0,
    });

    await userWord.save();

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      data: userWord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get review statistics
 * @route   GET /api/review/stats
 * @access  Private
 */
export const getReviewStats = async (req, res, next) => {
  try {
    const userWords = await UserWord.find({ userId: req.user._id });

    const now = new Date();
    const dueToday = userWords.filter(
      (word) => new Date(word.nextReviewAt) <= now
    ).length;
    const totalWords = userWords.length;
    const averageEfactor =
      userWords.length > 0
        ? userWords.reduce((sum, word) => sum + word.efactor, 0) /
          userWords.length
        : 0;

    // Count words by repetition level
    const newWords = userWords.filter((word) => word.repetitions === 0).length;
    const learning = userWords.filter(
      (word) => word.repetitions > 0 && word.repetitions < 3
    ).length;
    const mastered = userWords.filter((word) => word.repetitions >= 3).length;

    res.status(200).json({
      success: true,
      data: {
        totalWords,
        dueToday,
        newWords,
        learning,
        mastered,
        averageEfactor: parseFloat(averageEfactor.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};
