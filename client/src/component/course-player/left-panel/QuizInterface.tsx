"use client";
import { getQuizApi } from "@/api/user/quiz/quiz";
import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import Button from "@/ui/Button";

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

  if (!quiz)
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-8 w-2/3 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="mt-4 space-y-2.5">
            <div className="skeleton h-12 w-full rounded-lg" />
            <div className="skeleton h-12 w-full rounded-lg" />
            <div className="skeleton h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <span className="eyebrow">Knowledge check</span>
      <h1 className="mt-4 mb-2 text-2xl font-semibold tracking-tight text-text-primary">
        {quiz.title}
      </h1>
      <p className="mb-6 max-w-[65ch] leading-relaxed text-text-secondary">
        {quiz.description}
      </p>

      <div className="divider mb-8" />

      <div className="space-y-8">
        {quiz.questions.map((q, idx) => (
          <div key={q.id}>
            <h2 className="mb-4 flex items-baseline gap-3 text-base font-medium text-text-primary">
              <span className="tnum shrink-0 text-text-muted">{idx + 1}.</span>
              <span>{q.question}</span>
            </h2>

            <div className="space-y-2.5">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.id;
                const correct = submitted && opt.is_correct;
                const wrong = submitted && selected && !opt.is_correct;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(q.id, opt.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-default
                      ${
                        correct
                          ? "border-success bg-success-soft font-medium text-success"
                          : wrong
                          ? "border-error bg-error-soft font-medium text-error"
                          : selected
                          ? "border-brand bg-brand-50 font-medium text-brand-dark"
                          : "border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-muted"
                      }
                    `}
                    disabled={submitted}
                  >
                    <span>{opt.option}</span>
                    {correct ? (
                      <Check size={18} strokeWidth={1.75} className="shrink-0 text-success" />
                    ) : wrong ? (
                      <X size={18} strokeWidth={1.75} className="shrink-0 text-error" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {!submitted ? (
          <Button onClick={handleSubmit} size="lg">
            Submit quiz
          </Button>
        ) : (
          <div className="card px-6 py-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Your result</p>
            <p className="tnum mt-1 font-display text-4xl font-bold text-text-primary">
              <span className="text-accent">{score}</span>
              <span className="text-text-muted">/{quiz.questions.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
