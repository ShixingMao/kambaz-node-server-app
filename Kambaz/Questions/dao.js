import { v4 as uuidv4 } from "uuid";
import Question from "./model.js";

export const findQuestionsForQuiz = (quizId) => Question.find({ quiz: quizId });
export const createQuestion = (quizId, data = {}) => {
  const _id = uuidv4();
  return Question.create({
    _id,
    quiz: quizId,
    type: data.type ?? "MULTIPLE_CHOICE",
    title: data.title ?? "Untitled Question",
    points: data.points ?? 1,
    prompt: data.prompt ?? "",
    choices: data.choices ?? [],
    correct: data.correct ?? true,
    blanks: data.blanks ?? [],
    caseSensitive: data.caseSensitive ?? false,
  });
};
export const updateQuestion = (id, data) => Question.updateOne({ _id: id }, { $set: data });
export const deleteQuestion = (id) => Question.deleteOne({ _id: id });