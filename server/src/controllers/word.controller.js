import Word from "../models/Word.model.js";
import UserWord from "../models/UserWord.model.js";
import { generateWordInfo } from "../utils/gemini.js";

/**
 * @desc    Add a new word to user's vocabulary
 * @route   POST /api/words/add
 * @access  Private
 */
export const addWord = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Please provide a word",
      });
    }

    const wordText = text.toLowerCase().trim();

    // Check if user already has this word
    let word = await Word.findOne({ text: wordText });

    // If word doesn't exist in Word collection, create it
    if (!word) {
      word = await Word.create({ text: wordText });
    }

    // Check if user already added this word
    const existingUserWord = await UserWord.findOne({
      userId: req.user._id,
      wordId: word._id,
    });

    if (existingUserWord) {
      return res.status(400).json({
        success: false,
        message: "You have already added this word",
      });
    }

    // Generate AI content for the word
    const aiContent = await generateWordInfo(wordText);

    // Create UserWord with AI-generated content
    const userWord = await UserWord.create({
      userId: req.user._id,
      wordId: word._id,
      word: wordText,
      definition: aiContent.definition,
      examples: aiContent.examples,
      collocations: aiContent.collocations,
      exercise: aiContent.exercise,
      // SM-2 default values
      efactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReviewAt: new Date(),
    });

    // Update Word document with AI content if it doesn't have it
    if (!word.definition) {
      word.definition = aiContent.definition;
      word.examples = aiContent.examples;
      word.collocations = aiContent.collocations;
      await word.save();
    }

    res.status(201).json({
      success: true,
      message: "Word added successfully",
      data: userWord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all user's words
 * @route   GET /api/words/my-words
 * @access  Private
 */
export const getMyWords = async (req, res, next) => {
  try {
    const userWords = await UserWord.find({ userId: req.user._id })
      .populate("wordId")
      .sort({ createdAt: -1 });

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
 * @desc    Get a single word by ID
 * @route   GET /api/words/:id
 * @access  Private
 */
export const getWordById = async (req, res, next) => {
  try {
    const userWord = await UserWord.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("wordId");

    if (!userWord) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    res.status(200).json({
      success: true,
      data: userWord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a word from user's vocabulary
 * @route   DELETE /api/words/:id
 * @access  Private
 */
export const deleteWord = async (req, res, next) => {
  try {
    const userWord = await UserWord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!userWord) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Word deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
