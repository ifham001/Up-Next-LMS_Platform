"use client";
import React, { useState } from "react";
import { HelpCircle, Trash } from "lucide-react";
import Button from "@/ui/Button";
import PopUpModal from "@/ui/PopUpModal";
import TextInput from "@/ui/TextInput";
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
    

      
        <div className="space-y-6 p-4 max-h-[80vh] overflow-y-auto">
          <h1 className="text-xl font-bold text-center">Create a Quiz</h1>

          {/* Quiz metadata */}
          <div className="space-y-4 bg-gray-50 p-4 rounded shadow-sm">
            <TextInput label="Quiz Title" state={[quizTitle, setQuizTitle]} required />
            <TextInput
              label="Quiz Description"
              state={[quizDescription, setQuizDescription]}
              required
              textarea={true}
            />
          </div>

          {/* Existing questions */}
          {questions.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Added Questions</h2>
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 border rounded bg-white shadow-sm text-sm"
                >
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {idx + 1}. {q.question}
                    </p>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  <ul className="ml-5 list-disc text-gray-700 mt-2">
                    {q.options.map((opt, i) => (
                      <li key={i}>
                        {opt.option}
                        {opt.is_correct && (
                          <span className="text-green-600 font-semibold ml-1">
                            (Correct)
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
          <div className="space-y-4 bg-gray-100 p-4 rounded shadow-inner">
            <h2 className="text-lg font-semibold">Add a Question</h2>

            <TextInput
              label="Question"
              state={[questionText, setQuestionText]}
              required
            />

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === idx}
                    onChange={() => setCorrectAnswer(idx)}
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
                    className="flex-1 p-2 border rounded"
                  />
                </div>
              ))}

              <button
                onClick={() =>
                  setOptions([...options, { option: "", is_correct: false }])
                }
                className="text-blue-600 text-sm"
              >
                + Add Option
              </button>
            </div>

            <div className="flex justify-between pt-4">
              <div className="flex gap-2">
                <Button
                  onClick={addQuestion}
                  className="bg-blue-600 text-white"
                >
                  Save Question
                </Button>
                <Button
                  onClick={resetQuestionForm}
                  className="bg-gray-300 text-black"
                >
                  Add Another Question
                </Button>
              </div>
            </div>
          </div>

          {/* Save quiz */}
          <div className="flex justify-between pt-6">
            <Button
              onClick={onClose}
              className="bg-red-500 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={saveQuiz}
              className="bg-green-600 text-white"
            >
              Upload Quiz
            </Button>
          </div>
        </div>
  
    </>
  );
}
