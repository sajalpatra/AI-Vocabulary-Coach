import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import axios from "axios";
import { PiBrainBold } from "react-icons/pi";
import { IoSparkles, IoSend } from "react-icons/io5";
import { HiLightningBolt } from "react-icons/hi";

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your AI vocabulary tutor. Ask me anything about English words, grammar, or learning techniques!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/ai/suggestions",
        { level: "B2", topic: "general" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions(response.data.data.suggestions);
    } catch (error) {
      console.error("Error loading suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Build conversation history (last 5 messages for context)
      const conversationHistory = messages.slice(-5).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await axios.post(
        "http://localhost:5000/api/ai/chat",
        {
          question: input,
          conversationHistory,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const assistantMessage = {
        role: "assistant",
        content: response.data.data.answer,
        timestamp: new Date(response.data.data.timestamp),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What's the difference between 'affect' and 'effect'?",
    "How can I improve my vocabulary?",
    "What are some common phrasal verbs?",
    "Explain what collocations are",
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <PiBrainBold className="text-5xl text-white" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <IoSparkles className="text-yellow-400 text-2xl" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-1"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <HiLightningBolt className="text-yellow-300 text-xl" />
              </motion.div>
            </div>
          </motion.div>
          <h1 className="text-5xl font-extrabold gradient-text mb-3">
            AI Assistant
          </h1>
          <p className="text-gray-400 text-lg">
            Your personal vocabulary tutor, powered by Gemini AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <motion.div
              className="card h-[600px] flex flex-col"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                            : "bg-slate-700/50 border border-slate-600 text-gray-100"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mb-2">
                            <PiBrainBold className="text-blue-400 text-xl" />
                            <span className="text-xs text-blue-400 font-semibold">
                              AI Tutor
                            </span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            message.role === "user"
                              ? "text-blue-200"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-700/50 border border-slate-600 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <PiBrainBold className="text-blue-400 text-xl" />
                        </motion.div>
                        <span className="text-gray-300 text-sm">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-700 pt-4 px-4"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about vocabulary..."
                    className="input flex-1"
                    disabled={loading}
                  />
                  <motion.button
                    type="submit"
                    className="btn btn-primary px-6 flex items-center gap-2"
                    disabled={loading || !input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IoSend />
                    <span>Send</span>
                  </motion.button>
                </div>

                {/* Quick Questions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => setInput(question)}
                      className="text-xs px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-full text-gray-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Word Suggestions */}
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-100">
                  💡 Word Suggestions
                </h3>
                <motion.button
                  onClick={loadSuggestions}
                  disabled={loadingSuggestions}
                  className="text-xs btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loadingSuggestions ? "Loading..." : "Get New"}
                </motion.button>
              </div>

              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      className="p-3 bg-slate-700/30 border border-slate-700 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-semibold text-blue-400 capitalize mb-1">
                        {suggestion.word}
                      </h4>
                      <p className="text-xs text-gray-300 mb-2">
                        {suggestion.definition}
                      </p>
                      <p className="text-xs text-gray-400 italic">
                        💭 {suggestion.reason}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  Click "Get New" for personalized word suggestions!
                </p>
              )}
            </motion.div>

            {/* Tips */}
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-gray-100 mb-3">
                💡 How to Use
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Ask about word meanings and usage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Get grammar explanations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Request learning tips and techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Explore word origins and etymology</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
