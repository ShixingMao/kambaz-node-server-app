import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: { type: String, ref: "QuestionModel" },
    // For different types, store one of these
    selectedChoiceIndex: { type: Number }, // MC
    selectedTrueFalse: { type: Boolean }, // TF
    filledText: { type: String }, // FIB

    isCorrect: { type: Boolean, default: false },
    pointsAwarded: { type: Number, default: 0 },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel", required: true },
    user: { type: String, ref: "UserModel", required: true },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    score: { type: Number, default: 0 },
    answers: [answerSchema],
  },
  { collection: "quiz_attempts" }
);
export default attemptSchema;