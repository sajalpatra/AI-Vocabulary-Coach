import DailyWord from "../models/DailyWord.model.js";
import UserWord from "../models/UserWord.model.js";
import Word from "../models/Word.model.js";
import { generateWordInfo } from "../utils/gemini.js";

// Curated word list for daily recommendations
const WORD_POOL = [
  "ephemeral",
  "serendipity",
  "eloquent",
  "resilient",
  "pragmatic",
  "ambiguous",
  "inevitable",
  "meticulous",
  "profound",
  "substantial",
  "contemplate",
  "deliberate",
  "emphasize",
  "facilitate",
  "implement",
  "advocate",
  "coherent",
  "comprehensive",
  "intricate",
  "benevolent",
  "candid",
  "diligent",
  "gregarious",
  "innovation",
  "legitimate",
  "manifest",
  "notorious",
  "obsolete",
  "persistent",
  "predominant",
  "elaborate",
  "fluctuate",
  "hypothesis",
  "illustrate",
  "incentive",
  "indigenous",
  "integrity",
  "jurisdiction",
  "lucrative",
  "mediocre",
  "negligible",
  "paradigm",
  "pervasive",
  "plausible",
  "redundant",
  "scrutiny",
  "tangible",
  "ubiquitous",
  "vindicate",
  "zealous",
  "articulate",
  "circumstance",
  "disposition",
  "equilibrium",
  "exemplify",
  "feasible",
  "hierarchy",
  "implicit",
  "paradox",
  "phenomenon",
  "prospective",
  "reluctant",
  "spontaneous",
  "transcend",
  "unprecedented",
  "adversity",
  "aesthetic",
  "arbitrary",
  "catalyst",
  "compassion",
  "critique",
  "diminish",
  "discrepancy",
  "elucidate",
  "enhance",
  "excerpt",
  "implicit",
  "insight",
  "interpret",
  "invoke",
  "leverage",
  "magnitude",
  "methodology",
  "notion",
  "objective",
  "perpetual",
  "perspective",
  "preliminary",
  "profound",
  "proprietor",
  "requisite",
  "skeptical",
  "synthesis",
  "trajectory",
  "underlying",
  "versatile",
  "ambivalent",
  "analogous",
  "austere",
  "brevity",
];

/**
 * Get today's words - generates if not exists
 */
const getTodaysDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Generate 5 words for a specific date
 */
const generateDailyWords = async (date) => {
  try {
    // Get 5 random words from the pool
    const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 5);

    // Generate AI content for each word
    const wordsWithContent = await Promise.all(
      selectedWords.map(async (wordText) => {
        try {
          const aiContent = await generateWordInfo(wordText);

          // Also update/create in Word collection
          await Word.findOneAndUpdate(
            { text: wordText.toLowerCase() },
            {
              text: wordText.toLowerCase(),
              definition: aiContent.definition,
              examples: aiContent.examples,
              collocations: aiContent.collocations,
            },
            { upsert: true, new: true }
          );

          return {
            text: wordText.toLowerCase(),
            definition: aiContent.definition,
            examples: aiContent.examples,
            collocations: aiContent.collocations,
            difficulty: "B2", // Default difficulty
          };
        } catch (error) {
          console.error(`Error generating content for ${wordText}:`, error);
          return {
            text: wordText.toLowerCase(),
            definition: "A word to learn today",
            examples: [`Learn how to use ${wordText} in context.`],
            collocations: [],
            difficulty: "B2",
          };
        }
      })
    );

    // Save to database
    const dailyWord = await DailyWord.create({
      date,
      words: wordsWithContent,
    });

    return dailyWord;
  } catch (error) {
    console.error("Error generating daily words:", error);
    throw error;
  }
};

/**
 * @desc    Get today's 5 recommended words
 * @route   GET /api/daily/words
 * @access  Private
 */
export const getTodaysWords = async (req, res, next) => {
  try {
    const today = getTodaysDate();

    // Check if today's words already exist
    let dailyWords = await DailyWord.findOne({ date: today });

    // If not, generate them
    if (!dailyWords) {
      dailyWords = await generateDailyWords(today);
    }

    // Check which words the user has already added
    const userWordTexts = await UserWord.find({
      userId: req.user._id,
    }).select("word");

    const addedWords = new Set(userWordTexts.map((uw) => uw.word));

    // Mark words as added or not
    const wordsWithStatus = dailyWords.words.map((word) => ({
      ...word.toObject(),
      isAdded: addedWords.has(word.text),
    }));

    res.status(200).json({
      success: true,
      data: {
        date: dailyWords.date,
        words: wordsWithStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a daily word to user's vocabulary
 * @route   POST /api/daily/add-word
 * @access  Private
 */
export const addDailyWord = async (req, res, next) => {
  try {
    const { wordText } = req.body;

    if (!wordText) {
      return res.status(400).json({
        success: false,
        message: "Please provide a word",
      });
    }

    const normalizedText = wordText.toLowerCase().trim();

    // Find the word in Word collection
    let word = await Word.findOne({ text: normalizedText });

    if (!word) {
      return res.status(404).json({
        success: false,
        message: "Word not found in daily recommendations",
      });
    }

    // Check if user already has this word
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

    // Create UserWord
    const userWord = await UserWord.create({
      userId: req.user._id,
      wordId: word._id,
      word: normalizedText,
      definition: word.definition,
      examples: word.examples,
      collocations: word.collocations,
      efactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReviewAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Word added to your vocabulary",
      data: userWord,
    });
  } catch (error) {
    next(error);
  }
};
