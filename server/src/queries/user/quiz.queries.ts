
import { quiz, quizQuestion, quizQuestionOption } from "../../schema/admin/quiz";
import { eq } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";

// Function to get a quiz by section ID
export const getQuizBySection = async (quizId: string) => {
  // 1. Get quiz for the section
  const quizzes = await dbDrizzle
    .select()
    .from(quiz)
    .where(eq(quiz.id, quizId));

  if (quizzes.length === 0) {
    return { success: false, data: null, message: "No quiz found" };
  }

  const quizData = quizzes[0];

  // 2. Get questions for this quiz
  const questions = await dbDrizzle
    .select()
    .from(quizQuestion)
    .where(eq(quizQuestion.quiz_id, quizData.id));

  // 3. Get options for each question
  const questionsWithOptions = await Promise.all(
    questions.map(async (q) => {
      const options = await dbDrizzle
        .select()
        .from(quizQuestionOption)
        .where(eq(quizQuestionOption.quiz_question_id, q.id));
      return {
        ...q,
        options,
      };
    })
  );

  return {
    success: true,
    data: {
      ...quizData,
      questions: questionsWithOptions,
    },
  };
};
