import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { reviewAPI, wordsAPI } from "../services/api";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [todayWords, setTodayWords] = useState([]);
  const [recentWords, setRecentWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, todayRes, wordsRes] = await Promise.all([
        reviewAPI.getStats(),
        reviewAPI.getTodayWords(),
        wordsAPI.getMyWords(),
      ]);

      setStats(statsRes.data.data);
      setTodayWords(todayRes.data.data);
      setRecentWords(wordsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold gradient-text mb-3">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Track your vocabulary learning progress
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/daily-words"
                className="btn btn-primary flex items-center gap-2"
              >
                <span className="text-xl">📅</span>
                <span>Today's 5 Words</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div
            className="card group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Words
                </p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stats?.totalWords || 0}
                </p>
              </div>
              <motion.div
                className="text-5xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                📚
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="card group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Due Today
                </p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {stats?.dueToday || 0}
                </p>
              </div>
              <motion.div
                className="text-5xl"
                whileHover={{ scale: 1.2, rotate: -10 }}
              >
                ⏰
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="card group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Mastered
                </p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stats?.mastered || 0}
                </p>
              </div>
              <motion.div
                className="text-5xl"
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                🎯
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="card group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Learning
                </p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {stats?.learning || 0}
                </p>
              </div>
              <motion.div
                className="text-5xl"
                whileHover={{ scale: 1.2, rotate: -15 }}
              >
                📖
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        {stats?.totalWords > 0 && (
          <motion.div
            className="card mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                📈 Overall Progress
              </h3>
              <motion.span
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              >
                {Math.round((stats.mastered / stats.totalWords) * 100)}%
              </motion.span>
            </div>
            <div className="relative">
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-6 rounded-full shadow-lg relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.mastered / stats.totalWords) * 100}%`,
                  }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Review */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Today's Review</h2>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/review" className="btn btn-primary">
                  Start Review
                </Link>
              </motion.div>
            </div>

            {todayWords.length > 0 ? (
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {todayWords.slice(0, 5).map((word) => (
                  <motion.div
                    key={word._id}
                    className="border border-slate-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-slate-700/30"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg capitalize">
                          {word.word}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                          {word.definition}
                        </p>
                      </div>
                      <span className="text-xs bg-orange-900/50 text-orange-300 px-2 py-1 rounded border border-orange-700">
                        Due
                      </span>
                    </div>
                  </motion.div>
                ))}
                {todayWords.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{todayWords.length - 5} more words
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🎉
                </motion.div>
                <p className="text-gray-300">No words due today!</p>
                <p className="text-sm text-gray-400 mt-2">
                  Great job staying on track
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Recent Words */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recently Added</h2>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/add-word" className="btn btn-secondary">
                  Add Word
                </Link>
              </motion.div>
            </div>

            {recentWords.length > 0 ? (
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {recentWords.map((word) => (
                  <motion.div
                    key={word._id}
                    className="border border-slate-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-slate-700/30"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <h3 className="font-semibold text-lg capitalize">
                      {word.word}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      {word.definition}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span>Repetitions: {word.repetitions}</span>
                      <span>•</span>
                      <span>Interval: {word.interval} days</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-300">No words yet</p>
                <Link
                  to="/add-word"
                  className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block"
                >
                  Add your first word
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
