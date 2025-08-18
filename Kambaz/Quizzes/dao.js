import { v4 as uuidv4 } from "uuid";
import Quiz from "./model.js";
import Question from "../Questions/model.js";

export const findQuizzesForCourse = (courseId) => Quiz.find({ course: courseId });
export const findQuizById = (id) => Quiz.findById(id);
export const createQuiz = (courseId, data = {}) => {
  const _id = uuidv4();
  return Quiz.create({
    _id,
    course: courseId,
    title: data.title ?? "New Quiz",
    description: data.description ?? "",
    // defaults from schema
  });
};
export const updateQuiz = (id, data) => Quiz.updateOne({ _id: id }, { $set: data });
export const deleteQuiz = async (id) => {
  await Question.deleteMany({ quiz: id });
  return Quiz.deleteOne({ _id: id });
};
export const togglePublish = async (id, published) => {
  return Quiz.updateOne({ _id: id }, { $set: { published } });
};
export const recomputePoints = async (quizId) => {
  const questions = await Question.find({ quiz: quizId });
  const total = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  await Quiz.updateOne({ _id: quizId }, { $set: { points: total } });
  return total;
};
export const findQuizzesByQuery = (q) => Quiz.find(q);
