import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel", required: true },
    title: { type: String, default: "New Quiz" },
    description: { type: String, default: "" },
    published: { type: Boolean, default: false },

    // Summary properties
    points: { type: Number, default: 0 }, // may be computed from questions

    // Assignment-style settings
    quizType: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimitMinutes: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    allowedAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "NEVER" }, // simple placeholder
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },

    // Dates
    dueDate: { type: Date },
    availableDate: { type: Date },
    untilDate: { type: Date },
  },
  { collection: "quizzes" }
);
export default quizSchema;