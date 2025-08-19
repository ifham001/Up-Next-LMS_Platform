import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { section } from "./section";


export const quiz = pgTable('quiz', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    section_id: uuid('section_id').references(() => section.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  
  export const quizQuestion = pgTable('quiz_question', {
    id: uuid('id').primaryKey().defaultRandom(),
    question: varchar('question', { length: 255 }).notNull(),
    quiz_id: uuid('quiz_id').references(() => quiz.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  
  
  
  export const quizQuestionOption = pgTable('quiz_question_option', {
    id: uuid('id').primaryKey().defaultRandom(),
    option: varchar('option', { length: 255 }).notNull(),
    quiz_question_id: uuid('quiz_question_id').references(() => quizQuestion.id).notNull(),
    is_correct: boolean('is_correct').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });


  export interface Quiz {
    title: string;
    description: string;
    section_id: string;
    questions: QuizQuestion[];
    
  }
  
  export interface QuizQuestion {
    question: string;
    quiz_id: string;
    options: QuizQuestionOption[];
  }
  
  
  
  export interface QuizQuestionOption {
    option: string;
    quiz_question_id: string;
    is_correct: boolean;
  }