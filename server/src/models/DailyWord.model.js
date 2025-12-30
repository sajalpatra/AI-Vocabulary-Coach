import mongoose from "mongoose";

const dailyWordSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    words: [
      {
        text: {
          type: String,
          required: true,
        },
        definition: {
          type: String,
        },
        examples: [String],
        collocations: [String],
        difficulty: {
          type: String,
          enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
          default: "B1",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient date queries
dailyWordSchema.index({ date: 1 });

const DailyWord = mongoose.model("DailyWord", dailyWordSchema);

export default DailyWord;
