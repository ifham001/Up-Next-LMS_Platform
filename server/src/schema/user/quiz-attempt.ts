import { pgTable, uuid, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth";
import { quiz, quizQuestion, quizQuestionOption } from "../admin/quiz";

// One row per quiz submission by a user. Stores the graded result so attempt
// history and scores can be shown without re-grading.
export const quizAttempt = pgTable("quiz_attempt", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  quizId: uuid("quiz_id")
    .references(() => quiz.id, { onDelete: "cascade" })
    .notNull(),

  score: integer("score").notNull(), // number of correct answers
  totalQuestions: integer("total_questions").notNull(),
  percentage: integer("percentage").notNull(), // 0..100, rounded
  passed: boolean("passed").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// One row per answered question within an attempt.
export const quizAnswer = pgTable("quiz_answer", {
  id: uuid("id").primaryKey().defaultRandom(),

  attemptId: uuid("attempt_id")
    .references(() => quizAttempt.id, { onDelete: "cascade" })
    .notNull(),

  questionId: uuid("question_id")
    .references(() => quizQuestion.id, { onDelete: "cascade" })
    .notNull(),

  selectedOptionId: uuid("selected_option_id")
    .references(() => quizQuestionOption.id, { onDelete: "cascade" })
    .notNull(),

  isCorrect: boolean("is_correct").notNull(),
});

export const quizAttemptRelations = relations(quizAttempt, ({ one, many }) => ({
  user: one(user, { fields: [quizAttempt.userId], references: [user.id] }),
  quiz: one(quiz, { fields: [quizAttempt.quizId], references: [quiz.id] }),
  answers: many(quizAnswer),
}));

export const quizAnswerRelations = relations(quizAnswer, ({ one }) => ({
  attempt: one(quizAttempt, {
    fields: [quizAnswer.attemptId],
    references: [quizAttempt.id],
  }),
  question: one(quizQuestion, {
    fields: [quizAnswer.questionId],
    references: [quizQuestion.id],
  }),
  selectedOption: one(quizQuestionOption, {
    fields: [quizAnswer.selectedOptionId],
    references: [quizQuestionOption.id],
  }),
}));
