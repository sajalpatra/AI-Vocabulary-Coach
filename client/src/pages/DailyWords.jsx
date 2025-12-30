import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import axios from "axios";

const DailyWords = () => {
  const [dailyWords, setDailyWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingWord, setAddingWord] = useState(null);

  useEffect(() => {
    loadDailyWords();
  }, []);

  const loadDailyWords = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/daily/words",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDailyWords(response.data.data.words);
    } catch (error) {
      console.error("Error loading daily words:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async (wordText) => {
    try {
      setAddingWord(wordText);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/daily/add-word",
        { wordText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the word status locally
      setDailyWords((prev) =>
        prev.map((word) =>
          word.text === wordText ? { ...word, isAdded: true } : word
        )
      );
    } catch (error) {
      console.error("Error adding word:", error);
      alert(error.response?.data?.message || "Failed to add word");
    } finally {
      setAddingWord(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <motion.div
            className="rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            📅
          </motion.div>
          <h1 className="text-5xl font-extrabold gradient-text mb-3">
            Today's 5 Words
          </h1>
          <p className="text-gray-400 text-lg">Learn something new every day</p>
          <motion.div
            className="mt-4 inline-block px-4 py-2 bg-blue-900/30 border border-blue-700 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-blue-300 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        </motion.div>

        {/* Words Grid */}
        <AnimatePresence mode="wait">
          {dailyWords.length > 0 ? (
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              {dailyWords.map((word, index) => (
                <motion.div
                  key={word.text}
                  className="card relative overflow-hidden"
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Number Badge */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                    >
                      {index + 1}
                    </motion.div>
                  </div>

                  {/* Word Content */}
                  <div className="pr-16">
                    <motion.h2
                      className="text-3xl font-bold text-gray-100 capitalize mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.15 + 0.4 }}
                    >
                      {word.text}
                    </motion.h2>

                    <motion.div
                      className="mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.15 + 0.5 }}
                    >
                      <h3 className="text-sm font-semibold text-blue-400 mb-1">
                        Definition
                      </h3>
                      <p className="text-gray-300 text-base leading-relaxed">
                        {word.definition}
                      </p>
                    </motion.div>

                    {word.examples && word.examples.length > 0 && (
                      <motion.div
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.15 + 0.6 }}
                      >
                        <h3 className="text-sm font-semibold text-green-400 mb-2">
                          Examples
                        </h3>
                        <ul className="space-y-1">
                          {word.examples.slice(0, 2).map((example, i) => (
                            <li
                              key={i}
                              className="text-gray-300 text-sm italic pl-4 border-l-2 border-green-700"
                            >
                              {example}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {word.collocations && word.collocations.length > 0 && (
                      <motion.div
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.15 + 0.7 }}
                      >
                        <h3 className="text-sm font-semibold text-purple-400 mb-2">
                          Common Phrases
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {word.collocations.slice(0, 3).map((phrase, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-purple-900/30 border border-purple-700 rounded-full text-xs text-purple-300"
                            >
                              {phrase}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Add Button */}
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + 0.8 }}
                    >
                      {word.isAdded ? (
                        <motion.div
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700 rounded-lg text-green-300"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <span className="text-xl">✓</span>
                          <span className="font-semibold">
                            Added to Vocabulary
                          </span>
                        </motion.div>
                      ) : (
                        <motion.button
                          onClick={() => handleAddWord(word.text)}
                          disabled={addingWord === word.text}
                          className="btn btn-primary flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {addingWord === word.text ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              <span>Adding...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl">+</span>
                              <span>Add to My Vocabulary</span>
                            </>
                          )}
                        </motion.button>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-8xl mb-6">🤔</div>
              <p className="text-gray-300 text-xl">No words available today</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Box */}
        <motion.div
          className="mt-10 p-6 bg-blue-900/20 border border-blue-700 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-lg font-bold text-blue-300 mb-2">
            💡 Daily Learning Tip
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Add these words to your vocabulary to start reviewing them with our
            spaced repetition system. Come back tomorrow for 5 new words!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DailyWords;
