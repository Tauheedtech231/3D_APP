'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, BookOpen, Award, Clock, FileText } from "lucide-react";

import { Quiz } from "@/app/(dashboard)/student/quizez/data/quizez";

type QuizType = Quiz;

interface QuizCardProps {
  quiz: QuizType;
}

function QuizCard({ quiz }: QuizCardProps) {
  const statusColor = "bg-blue-600 text-white border-transparent dark:bg-blue-500";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getButtonText = () => {
    if (quiz.status === "Pending") return "Start Quiz";
    if (quiz.status === "Completed") return "View Results";
    return "Review Answers";
  };

  const getButtonLink = () => {
    if (quiz.status === "Graded") {
      return `/student/quizez/${quiz.id}/result`;
    }
    return `/student/quizez/${quiz.id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 8px 20px -5px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full"
    >
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-md text-blue-800 dark:text-blue-200 leading-tight">{quiz.title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor}`}>
            {quiz.status || "Pending"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 mb-2">
          <BookOpen size={14} className="text-blue-500 dark:text-blue-200" />
          <span className="line-clamp-1">{quiz.courses?.title || quiz.module_name || 'Unnamed Course'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 mb-2">
          <Calendar size={14} className="text-blue-500 dark:text-blue-200" />
          <span>Due: {formatDate(quiz.due_date)}</span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-blue-600 dark:text-blue-300 mb-3">
          <div className="flex items-center gap-1">
            <FileText size={12} />
            <span>{quiz.questions?.length || 0} Qs</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{quiz.time_limit} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Award size={12} />
            <span>{quiz.total_points} pts</span>
          </div>
        </div>

        {quiz.status === "Completed" && quiz.student_attempt?.score !== undefined && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-gray-700 rounded-xl border border-blue-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Score</span>
              <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                {quiz.student_attempt.score}/{quiz.total_points}
              </span>
            </div>
            <div className="w-full bg-blue-100 dark:bg-gray-600 rounded-full h-1 mt-1">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-1 rounded-full" 
                style={{ width: `${((quiz.student_attempt.score ?? 0) / quiz.total_points) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-blue-50 dark:bg-gray-700 border-t border-blue-200 dark:border-gray-600 flex justify-between items-center">
        <div className="text-[10px] text-blue-600 dark:text-blue-300">
          {quiz.status === "Pending" ? "Not started" : quiz.status === "Completed" ? "Submitted" : "Graded"}
        </div>
        <Link href={getButtonLink()}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            {getButtonText()}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

// Grid layout component
export function QuizCardGrid({ quizzes }: { quizzes: QuizType[] }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quizzes Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Check your upcoming quizzes and review completed ones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 max-w-sm mx-auto">
              <div className="text-blue-500 mb-3">
                <FileText size={40} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No quizzes available</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You currently have no quizzes assigned. Check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizCard;
