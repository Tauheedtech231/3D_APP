// dashboard/student/page.tsx
"use client";

import ProgressTracker from "./progress/page";
import Link from "next/link";
import { BookOpen, FileText, ClipboardList } from "lucide-react";

export default function StudentDashboardPage() {
  const quickActions = [
    {
      name: "My Courses",
      href: "/student/modules",
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
    },
    {
      name: "Assignments",
      href: "/student/assignments",
      icon: <FileText className="h-6 w-6 text-green-500" />,
    },
    {
      name: "Quizzes",
      href: "/student/quizez",
      icon: <ClipboardList className="h-6 w-6 text-purple-500" />,
    },
  ];

  return (
    <div className="space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors">
      
      {/* Dashboard Header */}
      <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white rounded-2xl p-6 shadow-md dark:shadow-lg text-center transition-colors">
        <h1 className="text-lg md:text-xl font-bold">
          Welcome Back, Student
        </h1>
        <p className="mt-1 text-xs md:text-sm text-white/90 dark:text-white/80">
          Here’s an overview of your courses, assignments, and progress.
        </p>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white dark:bg-gray-800 shadow-sm p-6 hover:shadow-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {action.icon}
              <span className="text-sm font-medium">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
