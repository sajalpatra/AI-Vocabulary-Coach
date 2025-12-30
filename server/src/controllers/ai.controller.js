import {
  generateQuiz as generateQuizAI,
  provideFeedback,
  chatWithAI,
  getWordSuggestions,
} from "../utils/gemini.js";

/**
 * @desc    Generate AI quiz for a word
 * @route   POST /api/ai/quiz
 * @access  Private
 */
export const generateQuiz = async (req, res, next) => {
  try {
    const { word, difficulty } = req.body;

    if (!word) {
      return res.status(400).json({
        success: false,
        message: "Please provide a word",
      });
    }

    const quiz = await generateQuizAI(word, difficulty || "B1");

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Provide feedback on user's sentence
 * @route   POST /api/ai/feedback
 * @access  Private
 */
export const provideSentenceFeedback = async (req, res, next) => {
  try {
    const { sentence, word } = req.body;

    if (!sentence || !word) {
      return res.status(400).json({
        success: false,
        message: "Please provide both sentence and word",
      });
    }

    const feedback = await provideFeedback(sentence, word);

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Chat with AI assistant about vocabulary
 * @route   POST /api/ai/chat
 * @access  Private
 */
export const chat = async (req, res, next) => {
  try {
    const { question, conversationHistory } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question",
      });
    }

    const response = await chatWithAI(question, conversationHistory || []);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get personalized word suggestions
 * @route   POST /api/ai/suggestions
 * @access  Private
 */
export const getSuggestions = async (req, res, next) => {
  try {
    const { level, topic } = req.body;

    const suggestions = await getWordSuggestions(
      level || "B1",
      topic || "general"
    );

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};
