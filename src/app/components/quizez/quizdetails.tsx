"use client";

import { useState, useEffect, useCallback } from "react";
import { Quiz } from "@/app/(dashboard)/student/quizez/data/quizez";
import { ChevronLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";


interface QuizDetailsProps {
  quiz: Quiz;
}

export default function QuizDetails({ quiz }: QuizDetailsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit * 60); // in seconds

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitted) return;

    try {
      // Create a quiz attempt
      const attemptResponse = await fetch(`http://localhost:5000/api/quizzes/${quiz.id}/attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId: 2 }) // TODO: Get from auth session
      });
      console.log("the attemptResponse",attemptResponse)
      if (!attemptResponse.ok) throw new Error('Failed to create quiz attempt');
      const attempt = await attemptResponse.json();

      // Submit answers
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        answer
      }));

      const submitResponse = await fetch(`http://localhost:5000/api/quizzes/attempts/${attempt.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });
      if (!submitResponse.ok) throw new Error('Failed to submit answers');

      // Get the graded attempt
      const gradedResponse = await fetch(`http://localhost:5000/api/quizzes/attempts/${attempt.id}`);
      if (!gradedResponse.ok) throw new Error('Failed to get graded attempt');
      await gradedResponse.json();
      
      setIsSubmitted(true);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
    }
  }, [isSubmitted, quiz.id, answers]);

  useEffect(() => {
    if (quiz.status === "Pending" && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz.status, isSubmitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (quiz.status === "Completed" || quiz.status === "Graded") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Link href="/student/quizez" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 mb-6">
          <ChevronLeft size={20} />
          Back to Quizzes
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-blue-200 dark:border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">{quiz.title}</h1>
          <p className="text-blue-700 dark:text-blue-400 mb-6">{quiz.courses?.title || quiz.module_name}</p>

          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-gray-700 rounded-lg p-6 text-center mb-6">
            <CheckCircle size={48} className="text-blue-500 dark:text-blue-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">Quiz Completed</h2>
            <p className="text-blue-700 dark:text-blue-400">Your score: <span className="font-bold">{quiz.student_attempt?.score}/{quiz.total_points}</span></p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">Question Review</h3>
            {quiz.questions.map((q, index) => (
              <div key={q.id} className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{index + 1}. {q.question_text}</h4>
                <div className="space-y-2">
                  {q.options.map(option => (
                    <div
                      key={option}
                      className={`p-3 rounded-lg border ${option === q.correct_answer
                        ? "bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-300"
                        : answers[q.id] === option
                          ? "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-600 text-red-800 dark:text-red-300"
                          : "bg-white dark:bg-gray-700 border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {option}
                      {option === q.correct_answer && <CheckCircle size={16} className="inline-block ml-2 text-blue-500 dark:text-blue-300" />}
                      {answers[q.id] === option && option !== q.correct_answer && <XCircle size={16} className="inline-block ml-2 text-red-500 dark:text-red-300" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/student/quizez" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
          <ChevronLeft size={20} />
          Back to Quizzes
        </Link>

        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg">
          <Clock size={18} />
          <span className="font-medium">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-blue-200 dark:border-gray-700 overflow-hidden">
        {/* Progress bar */}
        <div className="h-2 bg-blue-100 dark:bg-gray-700">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">{quiz.title}</h1>
          <p className="text-blue-700 dark:text-blue-400 mb-6">{quiz.courses?.title || quiz.module_name}</p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </h3>

            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
              <p className="text-blue-800 dark:text-blue-300 font-medium">{quiz.questions[currentQuestion].question_text}</p>
            </div>

            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(quiz.questions[currentQuestion].id, option)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${answers[quiz.questions[currentQuestion].id] === option
                    ? "bg-blue-100 dark:bg-blue-800 border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-300"
                    : "bg-white dark:bg-gray-700 border-blue-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 disabled:opacity-50"
              disabled={currentQuestion === 0}
            >
              Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitted}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
