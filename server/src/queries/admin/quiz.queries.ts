import { dbDrizzle } from "../../config/pg.db";
import { quiz , quizQuestion , quizQuestionOption } from "../../schema/admin/quiz";
import { sectionItem } from "../../schema/admin/section";

import { eq, sql } from "drizzle-orm";

export type CreateQuizInput = {
    title: string;
    description: string;
    section_id: string;
    questions: {
      question: string;
      options: {
        option: string;
        is_correct: boolean;
      }[];
    }[];
  };

  
export const createQuiz = async (quizObj: CreateQuizInput) => {
    return await dbDrizzle.transaction(async (tx) => {
      // Insert quiz
      const [insertedQuiz] = await tx.insert(quiz).values({
        title: quizObj.title,
        description: quizObj.description,
        section_id: quizObj.section_id,
      }).returning();
  
      const newQuizId = insertedQuiz.id;
  
      // Insert quiz questions
      const insertedQuestions = await tx.insert(quizQuestion).values(
        quizObj.questions.map((q) => ({
          question: q.question,
          quiz_id: newQuizId,
        }))
      ).returning();
  
      // Insert quiz question options
  
      const allOptions = quizObj.questions.flatMap((q, index) => {
        const questionId = insertedQuestions[index].id;
        return q.options.map((opt) => ({
          quiz_question_id: questionId,
          option: opt.option,
          is_correct: opt.is_correct,
        }));
      });
      
  
      await tx.insert(quizQuestionOption).values(allOptions);
  
      // Insert into section items
      const currentMaxOrderResult = await tx
        .select({ maxOrder: sql<number>`MAX(${sectionItem.order})` })
        .from(sectionItem)
        .where(eq(sectionItem.section_id, quizObj.section_id));
  
      const currentMaxOrder = currentMaxOrderResult[0].maxOrder ?? 0;
  
    const insertedItemList = await tx.insert(sectionItem).values({
        section_id: quizObj.section_id,
        item_id: newQuizId,
        content_type: 'quiz',
        order: currentMaxOrder + 1,
        title: insertedQuiz.title,
      });
  
      return insertedQuiz;
    });
  };
  