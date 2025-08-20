"use client";
import { getQuizApi } from "@/api/user/quiz/quiz";
import React, { useEffect, useState } from "react";

interface QuizQuestionOption {
  id: string;
  option: string;
  is_correct: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizQuestionOption[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface Props {
  quizId: string;
}

export default function QuizPage({ quizId }: Props) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch quiz from API
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizApi(quizId);
          
        if (res.success && res.data ) {
          setQuiz(res.data); // Assuming API returns an array
        } 
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Select option
  const handleSelect = (qId: string, optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  // Submit
  const handleSubmit = () => {
    if (!quiz) return;
    let correct = 0;

    quiz.questions.forEach((q) => {
      const selectedOption = q.options.find((o) => o.id === answers[q.id]);
      if (selectedOption?.is_correct) correct++;
    });

    setScore(correct);
    setSubmitted(true);
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-2">{quiz.title}</h1>
      <p className="text-gray-600 mb-6">{quiz.description}</p>

      {quiz.questions.map((q, idx) => (
        <div key={q.id} className="mb-6">
          <h2 className="font-semibold text-lg mb-2">
            {idx + 1}. {q.question}
          </h2>

          <div className="space-y-2">
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt.id;
              const correct = submitted && opt.is_correct;
              const wrong = submitted && selected && !opt.is_correct;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(q.id, opt.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg border transition
                    ${selected ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}
                    ${correct ? "border-green-500 bg-green-50" : ""}
                    ${wrong ? "border-red-500 bg-red-50" : ""}
                  `}
                  disabled={submitted}
                >
                  {opt.option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      ) : (
        <p className="mt-4 font-semibold text-lg text-center">
          ✅ You scored {score}/{quiz.questions.length}
        </p>
      )}
    </div>
  );
}
