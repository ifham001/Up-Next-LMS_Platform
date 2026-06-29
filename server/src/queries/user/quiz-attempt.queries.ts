import { and, eq, desc, inArray } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { quiz, quizQuestion, quizQuestionOption } from "../../schema/admin/quiz";
import { section } from "../../schema/admin/section";
import { userCourses } from "../../schema/user/userCourses";
import { quizAttempt, quizAnswer } from "../../schema/user/quiz-attempt";

// Is the user enrolled in the course that owns this quiz?
// Path: quiz.section_id -> section.course_id -> user_courses(userId, courseId).
export const isEnrolledInQuizCourse = async (
  userId: string,
  quizId: string
): Promise<boolean> => {
  const rows = await dbDrizzle
    .select({ id: userCourses.id })
    .from(quiz)
    .innerJoin(section, eq(quiz.section_id, section.id))
    .innerJoin(
      userCourses,
      and(eq(userCourses.courseId, section.course_id), eq(userCourses.userId, userId))
    )
    .where(eq(quiz.id, quizId))
    .limit(1);
  return rows.length > 0;
};

const PASS_THRESHOLD = 60; // percent

export interface SubmittedAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface GradedAttempt {
  attemptId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  results: Array<{
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    correctOptionId: string | null;
  }>;
}

// Grade a submission against the quiz's correct options and persist the attempt.
// Returns the graded result, or null if the quiz does not exist.
export const gradeAndSaveAttempt = async (
  userId: string,
  quizId: string,
  answers: SubmittedAnswer[]
): Promise<GradedAttempt | null> => {
  // 1. Confirm the quiz exists.
  const [theQuiz] = await dbDrizzle.select().from(quiz).where(eq(quiz.id, quizId)).limit(1);
  if (!theQuiz) return null;

  // 2. Load the quiz's questions and all of their options (single queries).
  const questions = await dbDrizzle
    .select({ id: quizQuestion.id })
    .from(quizQuestion)
    .where(eq(quizQuestion.quiz_id, quizId));

  const questionIds = questions.map((q) => q.id);
  const options = questionIds.length
    ? await dbDrizzle
        .select()
        .from(quizQuestionOption)
        .where(inArray(quizQuestionOption.quiz_question_id, questionIds))
    : [];

  const validQuestionIds = new Set(questionIds);
  const correctByQuestion = new Map<string, string>();
  const optionToQuestion = new Map<string, string>();
  for (const opt of options) {
    optionToQuestion.set(opt.id, opt.quiz_question_id);
    if (opt.is_correct) correctByQuestion.set(opt.quiz_question_id, opt.id);
  }

  // 3. Grade. Only count answers that reference a question belonging to this
  //    quiz and an option that belongs to that same question. Duplicate answers
  //    for one question keep the last submitted.
  const answerByQuestion = new Map<string, string>();
  for (const a of answers) {
    if (!validQuestionIds.has(a.questionId)) continue;
    if (optionToQuestion.get(a.selectedOptionId) !== a.questionId) continue;
    answerByQuestion.set(a.questionId, a.selectedOptionId);
  }

  const totalQuestions = questionIds.length;
  const results = Array.from(answerByQuestion.entries()).map(
    ([questionId, selectedOptionId]) => {
      const correctOptionId = correctByQuestion.get(questionId) ?? null;
      return {
        questionId,
        selectedOptionId,
        isCorrect: correctOptionId === selectedOptionId,
        correctOptionId,
      };
    }
  );

  const score = results.filter((r) => r.isCorrect).length;
  const percentage = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
  const passed = percentage >= PASS_THRESHOLD;

  // 4. Persist the attempt and its answers atomically.
  const attemptId = await dbDrizzle.transaction(async (tx) => {
    const [attempt] = await tx
      .insert(quizAttempt)
      .values({ userId, quizId, score, totalQuestions, percentage, passed })
      .returning({ id: quizAttempt.id });

    if (results.length > 0) {
      await tx.insert(quizAnswer).values(
        results.map((r) => ({
          attemptId: attempt.id,
          questionId: r.questionId,
          selectedOptionId: r.selectedOptionId,
          isCorrect: r.isCorrect,
        }))
      );
    }

    return attempt.id;
  });

  return { attemptId, score, totalQuestions, percentage, passed, results };
};

// List a user's attempts for a quiz, newest first.
export const listAttempts = async (userId: string, quizId: string) => {
  return dbDrizzle
    .select()
    .from(quizAttempt)
    .where(and(eq(quizAttempt.userId, userId), eq(quizAttempt.quizId, quizId)))
    .orderBy(desc(quizAttempt.createdAt));
};

// Get one attempt (owner-scoped) with its per-question answers.
export const getAttemptDetail = async (userId: string, attemptId: string) => {
  const [attempt] = await dbDrizzle
    .select()
    .from(quizAttempt)
    .where(and(eq(quizAttempt.id, attemptId), eq(quizAttempt.userId, userId)))
    .limit(1);

  if (!attempt) return null;

  const answers = await dbDrizzle
    .select()
    .from(quizAnswer)
    .where(eq(quizAnswer.attemptId, attemptId));

  return { ...attempt, answers };
};
