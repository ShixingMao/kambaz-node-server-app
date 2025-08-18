import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema(
  {
    _id: false,
    text: String,
    isCorrect: Boolean,
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel", required: true },
    type: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
      default: "MULTIPLE_CHOICE",
    },
    title: { type: String, default: "Untitled Question" },
    points: { type: Number, default: 1 },
    prompt: { type: String, default: "" }, // rich text allowed

    // Multiple choice
    choices: [choiceSchema],

    // True/False
    correct: { type: Boolean, default: true },

    // Fill in the blank
    blanks: [{ type: String }], // acceptable answers
    caseSensitive: { type: Boolean, default: false },
  },
  { collection: "questions" }
);
export default questionSchema;