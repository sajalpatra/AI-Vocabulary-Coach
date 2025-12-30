import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from "./routes/auth.routes.js";
import wordRoutes from "./routes/word.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import dailyRoutes from "./routes/daily.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/daily", dailyRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Vocabulary Coach API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});

export default app;
