import * as dao from "./dao.js";
import * as qdao from "../Questions/dao.js";
import * as adao from "../QuizAttempts/dao.js";

export default function QuizRoutes(app) {
    // List quizzes for a course
    //   app.get("/api/courses/:cid/quizzes", async (req, res) => {
    //     const { cid } = req.params;
    //     const list = await dao.findQuizzesForCourse(cid);
    //     res.json(list);
    //   });
    app.get("/api/courses/:cid/quizzes", async (req, res) => {
        const { cid } = req.params;
        const role = req.session?.currentUser?.role;
        const query = role === "FACULTY" ? { course: cid } : { course: cid, published: true };
        const list = await dao.findQuizzesByQuery(query);
        res.json(list);
    });

    // Create a new quiz with default title, then return it
    app.post("/api/courses/:cid/quizzes", async (req, res) => {
        const { cid } = req.params;
        const created = await dao.createQuiz(cid, req.body || {});
        res.json(created);
    });

    // CRUD for a quiz
    // app.get("/api/quizzes/:qid", async (req, res) => {
    //     const quiz = await dao.findQuizById(req.params.qid);
    //     res.json(quiz);
    // });
    app.get("/api/quizzes/:qid", async (req, res) => {
        const quiz = await dao.findQuizById(req.params.qid);
        const role = req.session?.currentUser?.role;
        if (!quiz) return res.sendStatus(404);
        if (role !== "FACULTY" && !quiz.published) return res.sendStatus(404);
        res.json(quiz);
    });
    app.put("/api/quizzes/:qid", async (req, res) => {
        const status = await dao.updateQuiz(req.params.qid, req.body || {});
        // recompute points on every save (optional)
        await dao.recomputePoints(req.params.qid);
        res.json(status);
    });
    app.delete("/api/quizzes/:qid", async (req, res) => {
        const status = await dao.deleteQuiz(req.params.qid);
        res.json(status);
    });

    // Publish / Unpublish
    app.post("/api/quizzes/:qid/publish", async (req, res) => {
        const { published } = req.body;
        const status = await dao.togglePublish(req.params.qid, !!published);
        res.json(status);
    });

    // Questions for a quiz
    app.get("/api/quizzes/:qid/questions", async (req, res) => {
        const list = await qdao.findQuestionsForQuiz(req.params.qid);
        res.json(list);
    });
    app.post("/api/quizzes/:qid/questions", async (req, res) => {
        const created = await qdao.createQuestion(req.params.qid, req.body || {});
        await dao.recomputePoints(req.params.qid);
        res.json(created);
    });
    app.put("/api/questions/:id", async (req, res) => {
        const status = await qdao.updateQuestion(req.params.id, req.body || {});
        res.json(status);
    });
    app.delete("/api/questions/:id", async (req, res) => {
        const status = await qdao.deleteQuestion(req.params.id);
        res.json(status);
    });

    // Attempts (student)
    app.get("/api/quizzes/:qid/attempts/mine", async (req, res) => {
        const { qid } = req.params;
        const currentUser = req.session?.currentUser;
        if (!currentUser) return res.sendStatus(401);
        const list = await adao.listAttemptsForUser(qid, currentUser._id);
        res.json(list);
    });

    app.get("/api/quizzes/:qid/can-start", async (req, res) => {
        const { qid } = req.params;
        const currentUser = req.session?.currentUser;
        if (!currentUser) return res.sendStatus(401);
        const gate = await adao.canStartQuiz(qid, currentUser._id);
        res.json(gate);
    });

    app.post("/api/quizzes/:qid/attempts", async (req, res) => {
        const { qid } = req.params;
        const currentUser = req.session?.currentUser;
        if (!currentUser) return res.sendStatus(401);

        const quiz = await dao.findQuizById(qid);
        if (!quiz) return res.sendStatus(404);

        const used = await adao.countAttemptsForUser(qid, currentUser._id);
        const limit = quiz.multipleAttempts ? (quiz.allowedAttempts ?? 1) : 1;

        if (used >= limit) {
            return res.status(403).json({ error: "ATTEMPTS_EXHAUSTED" });
        }

        const attempt = await adao.gradeAttempt(qid, currentUser._id, req.body?.answers || []);
        res.json(attempt);
    });

    app.get("/api/quizzes/:qid/attempts/last", async (req, res) => {
        const { qid } = req.params;
        const currentUser = req.session?.currentUser;
        if (!currentUser) return res.sendStatus(401);
        const last = await adao.findLastAttemptForUser(qid, currentUser._id);
        res.json(last || null);
    });
    app.get("/api/quizzes/:qid/attempts/count", async (req, res) => {
        const { qid } = req.params;
        const currentUser = req.session?.currentUser;
        if (!currentUser) return res.sendStatus(401);
        const count = await adao.countAttemptsForUser(qid, currentUser._id);
        res.json({ count });
    });
}