import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { PiBrainBold } from "react-icons/pi";
import { IoSparkles } from "react-icons/io5";
import { HiLightningBolt } from "react-icons/hi";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
    //   {/* Animated background elements */}
    //   <div className="absolute inset-0 overflow-hidden">
    //     <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    //     <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    //     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    //   </div>

    //   <motion.div
    //     className="max-w-md w-full relative z-10"
    //     initial={{ opacity: 0, y: 20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.6 }}
    //   >
    //     <motion.div
    //       className="text-center mb-10"
    //       initial={{ opacity: 0, scale: 0.9 }}
    //       animate={{ opacity: 1, scale: 1 }}
    //       transition={{ delay: 0.2, duration: 0.5 }}
    //     >
    //       <motion.div
    //         className="relative inline-block p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl mb-6"
    //         whileHover={{ scale: 1.1, rotate: -5 }}
    //         whileTap={{ scale: 0.95 }}
    //       >
    //         <PiBrainBold className="text-7xl text-white" />
    //         <motion.div
    //           className="absolute -top-2 -right-2"
    //           animate={{
    //             rotate: [0, 360],
    //             scale: [1, 1.3, 1],
    //           }}
    //           transition={{
    //             duration: 3,
    //             repeat: Infinity,
    //             ease: "linear",
    //           }}
    //         >
    //           <IoSparkles className="text-yellow-400 text-2xl" />
    //         </motion.div>
    //         <motion.div
    //           className="absolute -bottom-2 -left-2"
    //           animate={{
    //             y: [0, -5, 0],
    //           }}
    //           transition={{
    //             duration: 2,
    //             repeat: Infinity,
    //             ease: "easeInOut",
    //           }}
    //         >
    //           <HiLightningBolt className="text-yellow-300 text-xl" />
    //         </motion.div>
    //       </motion.div>
    //       <motion.h1
    //         className="text-5xl font-extrabold mb-3"
    //         initial={{ opacity: 0, y: -20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         transition={{ delay: 0.3, duration: 0.5 }}
    //       >
    //         <span className="gradient-text">AI Vocab Coach</span>
    //       </motion.h1>
    //       <motion.p
    //         className="text-gray-400 text-lg"
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         transition={{ delay: 0.4, duration: 0.5 }}
    //       >
    //         Master vocabulary with AI & spaced repetition
    //       </motion.p>
    //     </motion.div>

    //     <motion.div
    //       className="card"
    //       initial={{ opacity: 0, y: 20 }}
    //       animate={{ opacity: 1, y: 0 }}
    //       transition={{ delay: 0.5, duration: 0.5 }}
    //     >
    //       <h2 className="text-2xl font-bold text-center mb-8 text-gray-100">
    //         Create Account
    //       </h2>

    //       {error && (
    //         <div className="bg-gradient-to-r from-red-900/50 to-rose-900/50 border-2 border-red-700 text-red-200 px-5 py-4 rounded-xl mb-6 shadow-sm">
    //           <div className="flex items-center">
    //             <span className="text-xl mr-2">⚠️</span>
    //             <span>{error}</span>
    //           </div>
    //         </div>
    //       )}

    //       <form onSubmit={handleSubmit} className="space-y-6">
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-300 mb-2">
    //             👤 Full Name
    //           </label>
    //           <input
    //             type="text"
    //             className="input"
    //             value={formData.name}
    //             onChange={(e) =>
    //               setFormData({ ...formData, name: e.target.value })
    //             }
    //             required
    //             placeholder="John Doe"
    //           />
    //         </div>

    //         <div>
    //           <label className="block text-sm font-semibold text-gray-300 mb-2">
    //             📧 Email Address
    //           </label>
    //           <input
    //             type="email"
    //             className="input"
    //             value={formData.email}
    //             onChange={(e) =>
    //               setFormData({ ...formData, email: e.target.value })
    //             }
    //             required
    //             placeholder="your@email.com"
    //           />
    //         </div>

    //         <div>
    //           <label className="block text-sm font-semibold text-gray-300 mb-2">
    //             🔒 Password
    //           </label>
    //           <input
    //             type="password"
    //             className="input"
    //             value={formData.password}
    //             onChange={(e) =>
    //               setFormData({ ...formData, password: e.target.value })
    //             }
    //             required
    //             placeholder="••••••••"
    //             minLength={6}
    //           />
    //           <p className="text-xs text-gray-500 mt-2 flex items-center">
    //             <span className="mr-1">✔️</span> At least 6 characters
    //           </p>
    //         </div>

    //         <button
    //           type="submit"
    //           className="w-full btn btn-primary mt-8"
    //           disabled={loading}
    //         >
    //           {loading ? (
    //             <span className="flex items-center justify-center">
    //               <svg
    //                 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //               >
    //                 <circle
    //                   className="opacity-25"
    //                   cx="12"
    //                   cy="12"
    //                   r="10"
    //                   stroke="currentColor"
    //                   strokeWidth="4"
    //                 ></circle>
    //                 <path
    //                   className="opacity-75"
    //                   fill="currentColor"
    //                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    //                 ></path>
    //               </svg>
    //               Creating account...
    //             </span>
    //           ) : (
    //             "Create Account"
    //           )}
    //         </button>
    //       </form>

    //       <div className="mt-8 pt-6 border-t border-slate-700">
    //         <p className="text-center text-sm text-gray-400">
    //           Already have an account?{" "}
    //           <Link
    //             to="/login"
    //             className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all"
    //           >
    //             Sign In →
    //           </Link>
    //         </p>
    //       </div>
    //     </motion.div>
    //   </motion.div>
    // </div>
//     <div className="h-screen w-screen flex items-center justify-center overflow-hidden relative px-4">
//   {/* Animated background elements */}
//   <div className="absolute inset-0 overflow-hidden">
//     <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full blur-xl opacity-20 animate-blob" />
//     <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full blur-xl opacity-20 animate-blob animation-delay-2000" />
//     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full blur-xl opacity-20 animate-blob animation-delay-4000" />
//   </div>

//   {/* Main container */}
//   <motion.div
//     className="max-w-md w-full relative z-10"
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.6 }}
//   >
//     {/* Header */}
//     <motion.div
//       className="text-center mb-6"
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ delay: 0.2, duration: 0.5 }}
//     >
//       <motion.div
//         className="relative inline-block p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl mb-4"
//         whileHover={{ scale: 1.08, rotate: -5 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         <PiBrainBold className="text-6xl text-white" />

//         <motion.div
//           className="absolute -top-2 -right-2"
//           animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
//           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//         >
//           <IoSparkles className="text-yellow-400 text-xl" />
//         </motion.div>

//         <motion.div
//           className="absolute -bottom-2 -left-2"
//           animate={{ y: [0, -5, 0] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//         >
//           <HiLightningBolt className="text-yellow-300 text-lg" />
//         </motion.div>
//       </motion.div>

//       <motion.h1
//         className="text-4xl font-extrabold mb-2"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3, duration: 0.5 }}
//       >
//         <span className="gradient-text">AI Vocab Coach</span>
//       </motion.h1>

//       <motion.p
//         className="text-gray-400 text-sm"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4, duration: 0.5 }}
//       >
//         Master vocabulary with AI & spaced repetition
//       </motion.p>
//     </motion.div>

//     {/* Card */}
//     <motion.div
//       className="card"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.5, duration: 0.5 }}
//     >
//       <h2 className="text-xl font-bold text-center mb-6 text-gray-100">
//         Create Account
//       </h2>

//       {error && (
//         <div className="bg-gradient-to-r from-red-900/50 to-rose-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
//           ⚠️ {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-semibold text-gray-300 mb-1">
//             👤 Full Name
//           </label>
//           <input
//             type="text"
//             className="input"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData({ ...formData, name: e.target.value })
//             }
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-300 mb-1">
//             📧 Email Address
//           </label>
//           <input
//             type="email"
//             className="input"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-300 mb-1">
//             🔒 Password
//           </label>
//           <input
//             type="password"
//             className="input"
//             value={formData.password}
//             onChange={(e) =>
//               setFormData({ ...formData, password: e.target.value })
//             }
//             required
//             minLength={6}
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             ✔️ At least 6 characters
//           </p>
//         </div>

//         <button
//           type="submit"
//           className="w-full btn btn-primary mt-4"
//           disabled={loading}
//         >
//           {loading ? "Creating account..." : "Create Account"}
//         </button>
//       </form>

//       <div className="mt-5 pt-4 border-t border-slate-700">
//         <p className="text-center text-sm text-gray-400">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
//           >
//             Sign In →
//           </Link>
//         </p>
//       </div>
//     </motion.div>
//   </motion.div>
// </div>
<div className="h-screen w-screen flex items-center justify-center overflow-hidden relative px-4">
  {/* Background */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-32 -right-32 w-72 h-72 bg-blue-400 rounded-full blur-xl opacity-20 animate-blob" />
    <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-indigo-400 rounded-full blur-xl opacity-20 animate-blob animation-delay-2000" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400 rounded-full blur-xl opacity-20 animate-blob animation-delay-4000" />
  </div>

  {/* Content */}
  <motion.div
    className="max-w-md w-full relative z-10"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {/* Header */}
    <div className="text-center mb-4">
      <div className="inline-block p-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mb-3">
        <PiBrainBold className="text-5xl text-white" />
      </div>

      <h1 className="text-3xl font-bold mb-1 text-blue-400">
        AI Vocab Coach
      </h1>

      <p className="text-gray-400 text-sm">
        Master vocabulary with AI & spaced repetition
      </p>
    </div>

    {/* Card */}
    <div className="card px-6 py-5">
      <h2 className="text-lg font-semibold text-center mb-4 text-gray-100">
        Create Account
      </h2>

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-200 px-3 py-2 rounded mb-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            👤 Full Name
          </label>
          <input
            className="input h-10 text-sm"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            📧 Email Address
          </label>
          <input
            className="input h-10 text-sm"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            🔒 Password
          </label>
          <input
            type="password"
            className="input h-10 text-sm"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            minLength={6}
          />
          <p className="text-[11px] text-gray-500 mt-1">
            ✔️ At least 6 characters
          </p>
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary h-10 text-sm mt-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-3">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-400"
        >
          Sign In →
        </Link>
      </p>
    </div>
  </motion.div>
</div>


  );
};

export default Signup;
