import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are no longer needed in Mongoose 6+
      // but kept for compatibility
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(
      "⚠️  Server will continue without database. Please fix MongoDB connection."
    );
    // Don't exit - allow server to start for development
  }
};

export default connectDB;
