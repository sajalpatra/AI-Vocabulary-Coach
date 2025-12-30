import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { wordsAPI } from "../services/api";

const AddWord = () => {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setLoading(true);

    try {
      const response = await wordsAPI.add({ text: word });
      const wordData = response.data.data;

      setSuccess(wordData);
      setWord("");

      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add word. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-100">Add New Word</h1>
          <p className="text-gray-400 mt-2">
            AI will generate definition, examples, and exercises
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Enter a Word</h2>

            {error && (
              <motion.div
                className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Word
                </label>
                <input
                  type="text"
                  className="input text-lg"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="e.g., approach"
                  required
                  disabled={loading}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter any English word you want to learn
                </p>
              </div>

              <motion.button
                type="submit"
                className="w-full btn btn-primary"
                disabled={loading || !word.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating with AI...
                  </span>
                ) : (
                  "✨ Add Word with AI"
                )}
              </motion.button>
            </form>

            <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
              <h3 className="font-semibold text-blue-300 mb-2">
                📝 What happens next?
              </h3>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• AI generates a simple definition</li>
                <li>• Creates 3 example sentences</li>
                <li>• Suggests common collocations</li>
                <li>• Designs a practice exercise</li>
                <li>• Schedules first review for today</li>
              </ul>
            </div>
          </motion.div>

          {/* AI Generated Content */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">AI-Generated Content</h2>

            {success ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  ✅ Word added successfully!
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-semibold text-lg capitalize text-primary-600 mb-2">
                    {success.word}
                  </h3>
                  <p className="text-gray-200">{success.definition}</p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="font-semibold text-sm text-gray-200 mb-2">
                    Examples:
                  </h4>
                  <ul className="space-y-2">
                    {success.examples?.map((example, index) => (
                      <motion.li
                        key={index}
                        className="text-sm text-gray-300 pl-4 border-l-2 border-primary-300"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {example}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h4 className="font-semibold text-sm text-gray-200 mb-2">
                    Collocations:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {success.collocations?.map((collocation, index) => (
                      <motion.span
                        key={index}
                        className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.7 + index * 0.05,
                          type: "spring",
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {collocation}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h4 className="font-semibold text-sm text-gray-200 mb-2">
                    Exercise:
                  </h4>
                  <p className="text-sm text-gray-300 italic bg-slate-700/50 p-3 rounded-lg">
                    {success.exercise}
                  </p>
                </motion.div>

                <motion.p
                  className="text-sm text-gray-500 text-center pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Redirecting to dashboard...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12 text-gray-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  🤖
                </motion.div>
                <p>AI content will appear here</p>
                <p className="text-sm mt-2">Enter a word to get started</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddWord;
