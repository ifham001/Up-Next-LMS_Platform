"use client";
import React, { useState } from "react";
import { Trash } from "lucide-react";
import TextInput from "@/ui/TextInput";
import Button from "@/ui/Button";
import { createQuizApi } from "@/api/admin/upload-course/AddQuiz";
import { useDispatch } from "react-redux";
import Loading from "@/ui/Loading";
import { showNotification } from "@/store/slices/common/notification-slice";

interface Options {
  option: string;
  is_correct: boolean;
}

interface QuestionData {
  id: number;
  question: string;
  options: Options[];
}

export interface Quiz {
  title: string;
  description: string;
  questions: QuestionData[];
}

interface Props {
  sectionId: string;
  onClose: () => void;
}

export default function QuizBuilder({ sectionId, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<Options[]>([
    { option: "", is_correct: false },
    { option: "", is_correct: false },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const resetQuestionForm = () => {
    setQuestionText("");
    setOptions([
      { option: "", is_correct: false },
      { option: "", is_correct: false },
    ]);
    setCorrectAnswer(0);
  };

  const addQuestion = () => {
    if (questionText.trim() === "") {
      dispatch(showNotification({ message: "Question cannot be empty", type: "error" }));
      return;
    }

    const filledOptions = options.filter((opt) => opt.option.trim() !== "");
    if (filledOptions.length < 2) {
      dispatch(showNotification({ message: "At least two options must be filled", type: "error" }));
      return;
    }

    const updatedOptions = options.map((opt, idx) => ({
      option: opt.option.trim(),
      is_correct: idx === correctAnswer,
    }));

    const newQuestion: QuestionData = {
      id: Date.now(),
      question: questionText.trim(),
      options: updatedOptions,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    resetQuestionForm();
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const saveQuiz = async () => {
    if (quizTitle.trim() === "" || quizDescription.trim() === "") {
      dispatch(showNotification({ message: "Quiz title and description are required", type: "error" }));
      return;
    }

    if (questions.length === 0) {
      dispatch(showNotification({ message: "Add at least one question before uploading", type: "error" }));
      return;
    }

    const quiz: Quiz = {
      title: quizTitle.trim(),
      description: quizDescription.trim(),
      questions,
    };

    if(!sectionId){
      return dispatch(showNotification({message:"Section not found",type:"error"}))
      
    }
    const data = await createQuizApi(sectionId, quiz, dispatch, setIsLoading);
    onClose();

   
    setIsOpen(false);
    setOptions([{ option: "", is_correct: false }, { option: "", is_correct: false }]);
    setQuestionText("");
    setQuizTitle("");
    setQuizDescription("");
    setQuestions([]);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
    

      
        <div className="max-h-[80vh] space-y-6 overflow-y-auto p-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">
              Create a quiz
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Add a title, then build questions with at least two options each.
            </p>
          </div>

          {/* Quiz metadata */}
          <div className="space-y-4 rounded-lg border border-border bg-surface-muted p-5">
            <TextInput label="Quiz title" state={[quizTitle, setQuizTitle]} required />
            <TextInput
              label="Quiz description"
              state={[quizDescription, setQuizDescription]}
              required
              textarea={true}
            />
          </div>

          {/* Existing questions */}
          {questions.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-text-secondary">Added questions</h2>
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="card p-5 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-text-primary">
                      {idx + 1}. {q.question}
                    </p>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      aria-label="Delete question"
                      className="shrink-0 rounded-md p-1 text-text-muted transition-colors hover:bg-error-soft hover:text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      <Trash size={16} strokeWidth={1.75} />
                    </button>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={
                          opt.is_correct
                            ? "flex items-center gap-2 rounded-md border border-border bg-success-soft px-2.5 py-1.5 text-text-primary"
                            : "flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-text-secondary"
                        }
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-xs font-medium text-text-secondary">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt.option}</span>
                        {opt.is_correct && (
                          <span className="ml-auto rounded-full bg-success px-2.5 py-0.5 text-xs font-medium text-text-inverted">
                            Correct
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Add new question */}
          <div className="space-y-4 rounded-lg border border-border bg-surface-muted p-5">
            <h2 className="text-sm font-medium text-text-secondary">Add a question</h2>

            <TextInput
              label="Question"
              state={[questionText, setQuestionText]}
              required
            />

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 transition-colors hover:border-border-strong">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === idx}
                    onChange={() => setCorrectAnswer(idx)}
                    className="h-4 w-4 shrink-0 accent-accent"
                  />
                  <input
                    type="text"
                    value={opt.option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[idx].option = e.target.value;
                      setOptions(newOptions);
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className="flex-1 rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-input-placeholder focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              ))}

              <button
                onClick={() =>
                  setOptions([...options, { option: "", is_correct: false }])
                }
                className="link-accent text-sm font-medium"
              >
                + Add option
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" onClick={addQuestion}>
                Save question
              </Button>
              <Button variant="ghost" size="sm" onClick={resetQuestionForm}>
                Clear fields
              </Button>
            </div>
          </div>

          {/* Save quiz */}
          <div className="divider" />
          <div className="flex justify-between gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveQuiz}>
              Upload quiz
            </Button>
          </div>
        </div>
  
    </>
  );
}
