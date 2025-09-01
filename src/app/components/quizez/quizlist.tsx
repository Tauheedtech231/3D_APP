"use client";

import { useEffect, useState } from "react";
import QuizCard from "./quizcard";
import { Quiz } from "@/app/(dashboard)/student/quizez/data/quizez";
import { toast } from "sonner";

interface BackendQuestion {
  id: number;
  question_type: string;
  question_text: string;
  options: string[];
  correct_answer: string;
}

interface BackendModule {
  id: number;
  title: string;
}

interface BackendQuizAttempt {
  id: number;
  score: number;
  submitted_at: string;
  status: string;
}

interface BackendQuiz {
  id: number;
  title: string;
  module_name: string;
  modules: BackendModule | null;
  due_date: string;
  status: string;
  questions: BackendQuestion[];
  student_quiz_attempts: BackendQuizAttempt[];
  total_points: number;
  time_limit: number;
  instructions: string;
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://31.97.49.20/api/quizzes/student');
        if (response.ok) {
          const data: BackendQuiz[] = await response.json();
          console.log("the data", data);
          
          // Transform backend data to match frontend Quiz type
          const transformedQuizzes = data.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            module_name: quiz.module_name,
            courses: quiz.modules ? {
              id: quiz.modules.id,
              title: quiz.modules.title
            } : null,
            due_date: quiz.due_date,
            status: quiz.status,
            questions: quiz.questions?.map((q) => ({
              id: q.id,
              type: q.question_type,
              question_text: q.question_text,
              options: q.options || ['True', 'False'],
              correct_answer: q.correct_answer
            })) || [],
            student_attempt: quiz.student_quiz_attempts?.[0] ? {
              id: quiz.student_quiz_attempts[0].id,
              status: quiz.student_quiz_attempts[0].status,
              score: quiz.student_quiz_attempts[0].score,
              submitted_at: quiz.student_quiz_attempts[0].submitted_at
            } : null,
            total_points: quiz.total_points,
            time_limit: quiz.time_limit,
            instructions: quiz.instructions || ''
          }));

          setQuizzes(transformedQuizzes);
        } else {
          toast.error('Failed to fetch quizzes');
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        toast.error('Error loading quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
      {!loading && quizzes.length === 0 && (
        <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
          No quizzes available at the moment
        </div>
      )}
    </div>
  );
}
