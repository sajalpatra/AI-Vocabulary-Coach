import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { PiBrainBold } from "react-icons/pi";
import { IoSparkles } from "react-icons/io5";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800/90 backdrop-blur-md shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <PiBrainBold className="text-3xl text-white" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <IoSparkles className="text-yellow-400 text-sm" />
                </motion.div>
              </motion.div>
              <div>
                <span className="text-2xl font-bold gradient-text block">
                  AI Vocab Coach
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Smart Learning Platform
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-gray-200 hover:bg-blue-900/30 hover:text-blue-400 font-medium transition-all"
              >
                📊 Dashboard
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/daily-words"
                className="px-4 py-2 rounded-lg text-gray-200 hover:bg-blue-900/30 hover:text-blue-400 font-medium transition-all"
              >
                📅 Daily Words
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/add-word"
                className="px-4 py-2 rounded-lg text-gray-200 hover:bg-blue-900/30 hover:text-blue-400 font-medium transition-all"
              >
                ➕ Add Word
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/review"
                className="px-4 py-2 rounded-lg text-gray-200 hover:bg-blue-900/30 hover:text-blue-400 font-medium transition-all"
              >
                📝 Review
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/ai-assistant"
                className="px-4 py-2 rounded-lg text-gray-200 hover:bg-blue-900/30 hover:text-blue-400 font-medium transition-all"
              >
                🤖 AI Tutor
              </Link>
            </motion.div>

            <div className="flex items-center space-x-3 ml-6 pl-6 border-l-2 border-slate-700">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-600 px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-gray-200">
                  👤 {user?.name}
                </span>
              </div>
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚪 Logout
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
