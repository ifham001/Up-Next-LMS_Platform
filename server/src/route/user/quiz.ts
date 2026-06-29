import { Hono } from "hono";
import {
  quizController,
  submitQuiz,
  getQuizAttempts,
  getQuizAttempt,
  submitQuizSchema,
  quizIdParamSchema,
  attemptIdParamSchema,
} from "../../controller/user/quiz.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateBody, validateParams } from "../../util/validate";

const quiz = new Hono();

quiz.get("/get-quiz/:quizId", authMiddleware, quizController);

// Submission & scoring
quiz.post("/quiz/submit", authMiddleware, validateBody(submitQuizSchema), submitQuiz);
quiz.get(
  "/quiz/attempt/:attemptId",
  authMiddleware,
  validateParams(attemptIdParamSchema),
  getQuizAttempt
);
quiz.get(
  "/quiz/:quizId/attempts",
  authMiddleware,
  validateParams(quizIdParamSchema),
  getQuizAttempts
);

export default quiz;
