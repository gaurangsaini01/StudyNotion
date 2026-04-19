import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

import { useAppSelector } from "../../redux/hooks";
import {
  type QuizQuestionsResponse,
  getQuizQuestions,
} from "../../services/operations/profileAPI";
import type { Course, QuizQuestion } from "../../types/domain";
import IconBtn from "../reusable/IconBtn";

interface QuizModalProps {
  course: Course;
  setQuizModal: (course: Course | null) => void;
}

export default function QuizModal({ course, setQuizModal }: QuizModalProps) {
  const { token } = useAppSelector((state) => state.auth);
  const [quizResponse, setQuizResponse] = useState<QuizQuestionsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchQuizQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, token]);

  const questions: QuizQuestion[] = quizResponse?.data?.questions || [];

  async function fetchQuizQuestions() {
    if (!token) return;
    setLoading(true);
    setQuizResponse(null);
    setSelectedAnswers({});
    setScore(null);
    setIsSubmitted(false);

    const response = await getQuizQuestions(
      {
        courseName: course?.courseName,
        courseDescription: course?.courseDescription,
      },
      token
    );

    setQuizResponse(response);
    setLoading(false);
  }

  function handleOptionSelect(questionIndex: number, option: string) {
    if (isSubmitted) {
      return;
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  }

  function handleSubmitQuiz() {
    if (isSubmitted) {
      return;
    }

    const computedScore = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question?.answer ? 1 : 0);
    }, 0);

    setScore(computedScore);
    setIsSubmitted(true);
  }

  function getOptionClasses(
    question: QuizQuestion,
    option: string,
    index: number
  ) {
    const selectedOption = selectedAnswers[index];
    const isCorrectOption = question?.answer === option;
    const isSelectedOption = selectedOption === option;

    if (isSubmitted && isCorrectOption) {
      return "border-green-400 bg-green-400/10 text-green-100";
    }

    if (isSubmitted && isSelectedOption && !isCorrectOption) {
      return "border-red-400 bg-red-400/10 text-red-100";
    }

    if (isSelectedOption) {
      return "border-yellow-100 bg-yellow-100/10";
    }

    return "border-richblack-700";
  }

  function getQuestionContainerClasses(index: number) {
    if (isSubmitted && !selectedAnswers[index]) {
      return "border-red-400";
    }

    return "border-richblack-600";
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Quiz</p>
          <button onClick={() => setQuizModal(null)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        <div className="space-y-4 p-6 text-richblack-25">
          <div>
            <p className="text-lg font-semibold text-richblack-5">
              {course?.courseName}
            </p>
            <p className="mt-2 text-sm text-richblack-200">
              This AI-generated quiz is based on your course progress and is
              designed to help you evaluate your understanding.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="loader"></div>
            </div>
          ) : questions?.length > 0 ? (
            <>
              <div className="max-h-[420px] space-y-5 overflow-y-auto pr-2">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border bg-richblack-900 p-4 ${getQuestionContainerClasses(index)}`}
                  >
                    <p className="text-base font-medium text-richblack-5">
                      {index + 1}. {question?.question}
                    </p>

                    <div className="mt-4 space-y-3">
                      {question?.options?.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className={`flex items-start gap-3 rounded-md border px-3 py-2 text-sm text-richblack-100 transition-all duration-200 ${
                            isSubmitted
                              ? "cursor-default"
                              : "cursor-pointer hover:border-yellow-100"
                          } ${getOptionClasses(question, option, index)}`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={selectedAnswers[index] === option}
                            onChange={() => handleOptionSelect(index, option)}
                            className="mt-1 accent-yellow-100"
                            disabled={isSubmitted}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {score !== null && (
                <div className="rounded-lg border border-yellow-100 bg-richblack-900 p-4 text-center">
                  <p className="text-sm uppercase tracking-wider text-yellow-100">
                    Your Score
                  </p>
                  <p className="mt-2 text-2xl font-bold text-richblack-5">
                    {score} / {questions.length}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                {isSubmitted && (
                  <IconBtn text="Retry Quiz" onclick={fetchQuizQuestions} />
                )}
                <IconBtn
                  text={isSubmitted ? "Submitted" : "Submit Quiz"}
                  onclick={handleSubmitQuiz}
                  disabled={isSubmitted}
                />
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-richblack-600 bg-richblack-900 p-4 text-sm text-richblack-100">
              {quizResponse?.message ||
                "No quiz questions are available right now."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
