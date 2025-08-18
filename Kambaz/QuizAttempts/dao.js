// import { v4 as uuidv4 } from "uuid";
// import Attempt from "./model.js";
// import Question from "../Questions/model.js";

// export const gradeAttempt = async (quizId, userId, rawAnswers) => {
//   // rawAnswers: [{ question, selectedChoiceIndex | selectedTrueFalse | filledText }]
//   const qDocs = await Question.find({ quiz: quizId });
//   const qMap = new Map(qDocs.map((q) => [q._id, q]));

//   let score = 0;
//   const answers = (rawAnswers || []).map((a) => {
//     const q = qMap.get(a.question);
//     if (!q) return { ...a, isCorrect: false, pointsAwarded: 0 };

//     let isCorrect = false;
//     if (q.type === "MULTIPLE_CHOICE") {
//       const idx = a.selectedChoiceIndex ?? -1;
//       const choice = q.choices?.[idx];
//       isCorrect = !!choice?.isCorrect;
//     } else if (q.type === "TRUE_FALSE") {
//       isCorrect = String(!!a.selectedTrueFalse) === String(!!q.correct);
//     } else if (q.type === "FILL_IN_BLANK") {
//       const candidate = (a.filledText || "").trim();
//       const acceptable = (q.blanks || []).some((b) => {
//         if (q.caseSensitive) return b === candidate;
//         return String(b).toLowerCase() === candidate.toLowerCase();
//       });
//       isCorrect = acceptable;
//     }
//     const pointsAwarded = isCorrect ? q.points || 0 : 0;
//     score += pointsAwarded;
//     return { ...a, isCorrect, pointsAwarded };
//   });

//   const _id = uuidv4();
//   const attempt = await Attempt.create({
//     _id,
//     quiz: quizId,
//     user: userId,
//     submittedAt: new Date(),
//     score,
//     answers,
//   });
//   return attempt;
// };

// export const findLastAttemptForUser = (quizId, userId) =>
//   Attempt.findOne({ quiz: quizId, user: userId }).sort({ submittedAt: -1 });
import { v4 as uuidv4 } from "uuid";
import Attempt from "./model.js";
import Question from "../Questions/model.js";
import Quiz from "../Quizzes/model.js"; // <-- add

export const listAttemptsForUser = (quizId, userId) =>
  Attempt.find({ quiz: quizId, user: userId }).sort({ submittedAt: -1 });

export const countAttemptsForUser = async (quizId, userId) =>
  Attempt.countDocuments({ quiz: quizId, user: userId });

export const canStartQuiz = async (quizId, userId) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) return { ok: false, reason: "QUIZ_NOT_FOUND" };

  // Availability checks (optional but useful)
  const now = new Date();
  if (quiz.availableDate && now < new Date(quiz.availableDate)) {
    return { ok: false, reason: "NOT_YET_AVAILABLE" };
  }
  if (quiz.untilDate && now > new Date(quiz.untilDate)) {
    return { ok: false, reason: "CLOSED" };
  }

  // Attempts limit
  const used = await countAttemptsForUser(quizId, userId);
  if (!quiz.multipleAttempts && used >= 1) {
    return { ok: false, reason: "ATTEMPTS_EXHAUSTED", used, allowed: 1 };
  }
  if (quiz.multipleAttempts && typeof quiz.allowedAttempts === "number") {
    if (used >= quiz.allowedAttempts) {
      return {
        ok: false,
        reason: "ATTEMPTS_EXHAUSTED",
        used,
        allowed: quiz.allowedAttempts,
      };
    }
  }
  return {
    ok: true,
    used,
    allowed: quiz.multipleAttempts ? quiz.allowedAttempts ?? Infinity : 1,
  };
};

export const gradeAttempt = async (quizId, userId, rawAnswers) => {
  // Enforce limit here
  const gate = await canStartQuiz(quizId, userId);
  if (!gate.ok) {
    const err = new Error(gate.reason || "ATTEMPTS_EXHAUSTED");
    err.code = gate.reason || "ATTEMPTS_EXHAUSTED";
    throw err;
  }

  const qDocs = await Question.find({ quiz: quizId });
  const qMap = new Map(qDocs.map((q) => [q._id, q]));

  let score = 0;
  const answers = (rawAnswers || []).map((a) => {
    const q = qMap.get(a.question);
    if (!q) return { ...a, isCorrect: false, pointsAwarded: 0 };

    let isCorrect = false;
    if (q.type === "MULTIPLE_CHOICE") {
      const idx = a.selectedChoiceIndex ?? -1;
      const choice = q.choices?.[idx];
      isCorrect = !!choice?.isCorrect;
    } else if (q.type === "TRUE_FALSE") {
      isCorrect = String(!!a.selectedTrueFalse) === String(!!q.correct);
    } else if (q.type === "FILL_IN_BLANK") {
      const candidate = (a.filledText || "").trim();
      const acceptable = (q.blanks || []).some((b) => {
        if (q.caseSensitive) return b === candidate;
        return String(b).toLowerCase() === candidate.toLowerCase();
      });
      isCorrect = acceptable;
    }
    const pointsAwarded = isCorrect ? q.points || 0 : 0;
    score += pointsAwarded;
    return { ...a, isCorrect, pointsAwarded, question: q._id };
  });

  const _id = uuidv4();
  const attempt = await Attempt.create({
    _id,
    quiz: quizId,
    user: userId,
    submittedAt: new Date(),
    score,
    answers,
  });
  return attempt;
};

export const findLastAttemptForUser = (quizId, userId) =>
  Attempt.findOne({ quiz: quizId, user: userId }).sort({ submittedAt: -1 });