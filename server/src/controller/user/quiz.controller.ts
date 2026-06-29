import { Context } from "hono";
import { z } from "zod";
import { getQuizBySection } from "../../queries/user/quiz.queries";
import {
  gradeAndSaveAttempt,
  listAttempts,
  getAttemptDetail,
  isEnrolledInQuizCourse,
} from "../../queries/user/quiz-attempt.queries";
import { getValidated } from "../../util/validate";
import { ok, created } from "../../util/response";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../../util/errors";

const currentUserId = (c: Context): string => {
  const payload = c.get("user") as { id?: string } | undefined;
  if (!payload?.id) throw new UnauthorizedError("Authentication required");
  return payload.id;
};

// Existing: fetch a quiz with its questions and options.
export const quizController = async (c: Context) => {
  const quizId = c.req.param("quizId");
  if (!quizId) throw new NotFoundError("quizId is required");

  const quizData = await getQuizBySection(quizId);
  if (!quizData.success) throw new NotFoundError(quizData.message ?? "No quiz found");

  return ok(c, quizData.data, "Quiz fetched");
};

// --- Quiz submission & scoring -------------------------------------------

export const submitQuizSchema = z.object({
  quizId: z.string().uuid(),
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        selectedOptionId: z.string().uuid(),
      })
    )
    .min(1, "At least one answer is required"),
});

export const quizIdParamSchema = z.object({ quizId: z.string().uuid() });
export const attemptIdParamSchema = z.object({ attemptId: z.string().uuid() });

// POST /user/quiz/submit — grade and store an attempt.
export const submitQuiz = async (c: Context) => {
  const userId = currentUserId(c);
  const { quizId, answers } = getValidated<z.infer<typeof submitQuizSchema>>(c, "body");

  // Only enrolled users may submit a quiz (same gating as reviews).
  if (!(await isEnrolledInQuizCourse(userId, quizId))) {
    throw new ForbiddenError("You must be enrolled in this course to submit its quiz");
  }

  const result = await gradeAndSaveAttempt(userId, quizId, answers);
  if (!result) throw new NotFoundError("Quiz not found");

  return created(c, result, "Quiz submitted");
};

// GET /user/quiz/:quizId/attempts — the caller's attempt history for a quiz.
export const getQuizAttempts = async (c: Context) => {
  const userId = currentUserId(c);
  const { quizId } = getValidated<z.infer<typeof quizIdParamSchema>>(c, "params");
  const attempts = await listAttempts(userId, quizId);
  return ok(c, { attempts }, "Attempts fetched");
};

// GET /user/quiz/attempt/:attemptId — one attempt with per-question answers.
export const getQuizAttempt = async (c: Context) => {
  const userId = currentUserId(c);
  const { attemptId } = getValidated<z.infer<typeof attemptIdParamSchema>>(c, "params");
  const attempt = await getAttemptDetail(userId, attemptId);
  if (!attempt) throw new NotFoundError("Attempt not found");
  return ok(c, { attempt }, "Attempt fetched");
};
