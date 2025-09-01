'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, BookOpen, ClipboardList } from 'lucide-react';

interface StudentProgress {
  totalAssignments: number;
  completedAssignments: number;
  averageAssignmentScore: number;
  totalQuizzes: number;
  completedQuizzes: number;
  averageQuizScore: number;
  overallProgress: number;
}

const StudentProgressCard: React.FC = () => {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://31.97.49.20/api/student-progress/2/2');
        if (!res.ok) throw new Error('Failed to fetch progress');
        const data: StudentProgress = await res.json();
        setProgress(data);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading || !progress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] text-blue-600 dark:text-blue-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-2 text-xs">Loading student progress...</p>
      </div>
    );
  }

  /* eslint-disable */
  const renderCard = (
    title: string,
    Icon: React.FC<any>,
    mainValue: string,
    subtitle: string,
    progressValue: number
  ) => (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-md hover:shadow-lg transition-all duration-200 p-4 flex flex-col justify-between">
      <CardHeader className="p-0 mb-3">
        <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900">
            <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        <Progress value={progressValue} className="h-2 rounded-full" />
        <p className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1">{mainValue}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
        Student Learning Progress
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {renderCard(
          'Overall Progress',
          Activity,
          `${progress.overallProgress}%`,
          'Completion Percentage',
          progress.overallProgress
        )}
        {renderCard(
          'Assignments',
          BookOpen,
          `${progress.averageAssignmentScore}`,
          `Completed ${progress.completedAssignments}/${progress.totalAssignments}`,
          (progress.completedAssignments / progress.totalAssignments) * 100 || 0
        )}
        {renderCard(
          'Quizzes',
          ClipboardList,
          `${progress.averageQuizScore}`,
          `Completed ${progress.completedQuizzes}/${progress.totalQuizzes}`,
          (progress.completedQuizzes / progress.totalQuizzes) * 100 || 0
        )}
      </div>
    </div>
  );
};

export default StudentProgressCard;
