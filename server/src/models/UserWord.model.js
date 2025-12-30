import mongoose from "mongoose";

const userWordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Word",
      required: true,
    },
    word: {
      type: String,
      required: true,
      trim: true,
    },
    definition: {
      type: String,
      trim: true,
    },
    examples: [
      {
        type: String,
        trim: true,
      },
    ],
    collocations: [
      {
        type: String,
        trim: true,
      },
    ],
    exercise: {
      type: String,
      trim: true,
    },
    // Spaced Repetition (SM-2) fields
    efactor: {
      type: Number,
      default: 2.5,
      min: 1.3,
    },
    interval: {
      type: Number,
      default: 1,
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    nextReviewAt: {
      type: Date,
      default: Date.now,
    },
    lastResult: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewHistory: [
      {
        reviewedAt: Date,
        grade: Number,
        timeSpent: Number,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure user can't add same word twice
userWordSchema.index({ userId: 1, wordId: 1 }, { unique: true });

const UserWord = mongoose.model("UserWord", userWordSchema);

export default UserWord;
