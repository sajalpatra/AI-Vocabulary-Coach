import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Word text is required"],
      trim: true,
      lowercase: true,
      unique: true,
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
    difficulty: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      default: "B1",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Word = mongoose.model("Word", wordSchema);

export default Word;
