import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { reviewAPI, aiAPI } from "../services/api";

const Review = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sentence, setSentence] = useState("");
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTodayWords();
  }, []);

  const loadTodayWords = async () => {
    try {
      const response = await reviewAPI.getTodayWords();
      setWords(response.data.data);
      if (response.data.data.length > 0) {
        loadQuiz(response.data.data[0].word);
      }
    } catch (error) {
      console.error("Error loading words:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuiz = async (word) => {
    setQuizLoading(true);
    try {
      const response = await aiAPI.generateQuiz({ word });
      setQuiz(response.data.data);
    } catch (error) {
      console.error("Error loading quiz:", error);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleGrade = async (grade) => {
    const currentWord = words[currentIndex];

    try {
      await reviewAPI.submit({
        userWordId: currentWord._id,
        grade,
      });

      // Move to next word
      if (currentIndex < words.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setShowAnswer(false);
        setSentence("");
        setFeedback(null);
        setQuiz(null);
        loadQuiz(words[nextIndex].word);
      } else {
        // All done
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleCheckSentence = async () => {
    const currentWord = words[currentIndex];
    try {
      const response = await aiAPI.provideFeedback({
        sentence,
        word: currentWord.word,
      });
      setFeedback(response.data.data);
    } catch (error) {
      console.error("Error getting feedback:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
        <Navbar />
        <motion.div
          className="max-w-4xl mx-auto px-4 py-16 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            All Caught Up!
          </h2>
          <p className="text-gray-400 mb-8">
            No words to review today. Great job!
          </p>
          <motion.button
            onClick={() => navigate("/")}
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              Review Progress: {currentIndex + 1} / {words.length}
            </h2>
            <motion.span
              className="text-sm text-gray-400"
              key={currentIndex}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Word Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="card mb-6"
            initial={{ opacity: 0, x: 100, rotateY: -90 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 90 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-primary-600 mb-4 capitalize">
              {currentWord.word}
            </h1>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold text-gray-200 mb-2">
                  Definition:
                </h3>
                <p className="text-gray-300">{currentWord.definition}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold text-gray-200 mb-2">Examples:</h3>
                <ul className="space-y-2">
                  {currentWord.examples?.map((example, index) => (
                    <motion.li
                      key={index}
                      className="text-gray-300 pl-4 border-l-2 border-primary-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {example}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="font-semibold text-gray-200 mb-2">
                  Collocations:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentWord.collocations?.map((collocation, index) => (
                    <motion.span
                      key={index}
                      className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05, type: "spring" }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {collocation}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quiz Section */}
        <AnimatePresence mode="wait">
          {quizLoading ? (
            <motion.div
              className="card text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-300 mt-4">Generating quiz...</p>
            </motion.div>
          ) : (
            quiz && (
              <motion.div
                key={`quiz-${currentIndex}`}
                className="card mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-4">📝 Quick Quiz</h3>

                {/* Fill in the Blank */}
                <motion.div
                  className="mb-6 p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="font-medium text-gray-200 mb-2">
                    Fill in the blank:
                  </h4>
                  <p className="text-gray-100 mb-3">
                    {quiz.fillInBlank?.question}
                  </p>
                  <AnimatePresence>
                    {showAnswer && (
                      <motion.p
                        className="text-green-600 font-medium"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        Answer: {quiz.fillInBlank?.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Multiple Choice */}
                <motion.div
                  className="mb-6 p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-medium text-gray-200 mb-2">
                    {quiz.multipleChoice?.question}
                  </h4>
                  <div className="space-y-2">
                    {quiz.multipleChoice?.options?.map((option, index) => (
                      <motion.div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          showAnswer &&
                          index === quiz.multipleChoice.correctIndex
                            ? "bg-green-900/50 border-green-500"
                            : "bg-slate-700/50 border-slate-600"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        {option}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {!showAnswer && (
                  <motion.button
                    onClick={() => setShowAnswer(true)}
                    className="btn btn-secondary w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Show Answers
                  </motion.button>
                )}
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Sentence Practice */}
        <motion.div
          className="card mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4">✍️ Practice Sentence</h3>
          <p className="text-gray-300 mb-4">
            Write a sentence using "{currentWord.word}":
          </p>

          <textarea
            className="input min-h-24 mb-3"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder={`Example: ${
              currentWord.exercise || "Write your own sentence..."
            }`}
          />

          <motion.button
            onClick={handleCheckSentence}
            className="btn btn-secondary mb-4"
            disabled={!sentence.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get AI Feedback
          </motion.button>

          <AnimatePresence>
            {feedback && (
              <motion.div
                className="p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-semibold text-blue-300 mb-2">
                  AI Feedback:
                </h4>
                <p className="text-blue-200 mb-2">
                  <strong>Corrected:</strong> {feedback.correctedSentence}
                </p>
                <p className="text-blue-100 text-sm">{feedback.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Grade Buttons */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4">
            How well did you remember?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.button
              onClick={() => handleGrade("again")}
              className="btn bg-red-600 text-white hover:bg-red-700 py-4"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="font-semibold">Again</div>
              <div className="text-xs opacity-90">&lt; 1 day</div>
            </motion.button>

            <motion.button
              onClick={() => handleGrade("hard")}
              className="btn bg-orange-600 text-white hover:bg-orange-700 py-4"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="font-semibold">Hard</div>
              <div className="text-xs opacity-90">Soon</div>
            </motion.button>

            <motion.button
              onClick={() => handleGrade("good")}
              className="btn bg-green-600 text-white hover:bg-green-700 py-4"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="font-semibold">Good</div>
              <div className="text-xs opacity-90">Scheduled</div>
            </motion.button>

            <motion.button
              onClick={() => handleGrade("easy")}
              className="btn bg-blue-600 text-white hover:bg-blue-700 py-4"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="font-semibold">Easy</div>
              <div className="text-xs opacity-90">Later</div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Review;
