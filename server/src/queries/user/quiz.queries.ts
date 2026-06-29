import { quiz, quizQuestion, quizQuestionOption } from "../../schema/admin/quiz";
import { eq, inArray } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";

// Function to get a quiz by its ID, with questions and options.
export const getQuizBySection = async (quizId: string) => {
  // 1. Get the quiz
  const quizzes = await dbDrizzle.select().from(quiz).where(eq(quiz.id, quizId));

  if (quizzes.length === 0) {
    return { success: false, data: null, message: "No quiz found" };
  }

  const quizData = quizzes[0];

  // 2. Get questions for this quiz
  const questions = await dbDrizzle
    .select()
    .from(quizQuestion)
    .where(eq(quizQuestion.quiz_id, quizData.id));

  // 3. Get ALL options for these questions in a single query (was an N+1 loop),
  //    then group them by question id in memory.
  const questionIds = questions.map((q) => q.id);
  const allOptions = questionIds.length
    ? await dbDrizzle
        .select()
        .from(quizQuestionOption)
        .where(inArray(quizQuestionOption.quiz_question_id, questionIds))
    : [];

  const optionsByQuestion = new Map<string, typeof allOptions>();
  for (const opt of allOptions) {
    const list = optionsByQuestion.get(opt.quiz_question_id) ?? [];
    list.push(opt);
    optionsByQuestion.set(opt.quiz_question_id, list);
  }

  const questionsWithOptions = questions.map((q) => ({
    ...q,
    options: optionsByQuestion.get(q.id) ?? [],
  }));

  return {
    success: true,
    data: {
      ...quizData,
      questions: questionsWithOptions,
    },
  };
};
