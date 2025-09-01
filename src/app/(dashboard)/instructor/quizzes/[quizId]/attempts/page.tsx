'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';

interface QuizAttempt {
  id: number;
  student_id: number;
 students?: {
    name: string;
    email: string;
  };
  status: string;
  score: number | null;
  started_at: string;
  
submitted_at
: string | null;
  graded_at: string | null;
}

const QuizAttemptsPage = () => {
  const { quizId } = useParams();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
    try {
      const response = await fetch(`http://31.97.49.20/api/quiz-attempts/quiz/${quizId}`);
      if (!response.ok) throw new Error('Failed to fetch attempts');
      const data = await response.json();
      console.log("the data",data)
      setAttempts(data);
    } catch (err) {
      setError('Error loading attempts');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

    fetchAttempts();
  }, [quizId]);

  const handleAutoGrade = async (attemptId: number) => {
    try {
      const response = await fetch(
        `http://31.97.49.20/api/quiz-attempts/${attemptId}/auto-grade`,
        { method: 'POST' }
      );

      if (!response.ok) throw new Error('Failed to auto-grade attempt');
      
      const { score } = await response.json();
      setAttempts(attempts.map(attempt => 
        attempt.id === attemptId 
          ? { ...attempt, status: 'Graded', score, graded_at: new Date().toISOString() }
          : attempt
      ));
    } catch (err) {
      console.error('Error auto-grading attempt:', err);
      alert('Failed to auto-grade attempt');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Graded': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-700 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400 text-center h-64">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Quiz Attempts</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Student','Status','Score','Started','Submitted','Graded','Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {attempt.students?.name} 
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{attempt.students?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(attempt.status)}`}>
                    {attempt.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {attempt.score !== null ? `${Math.round(attempt.score)}%` : 'Not graded'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {format(new Date(attempt.started_at), 'MMM d, yyyy HH:mm')}
                </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
  {attempt.
submitted_at

    ? format(new Date(attempt.
submitted_at
), 'MMM d, yyyy HH:mm')
    : 'Not submitted'
  }
</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                 {attempt.score !== null
  ? 'Graded'
  : 'Not graded'}
                </td>
              {attempt.status === 'Submitted' && attempt.score === null && (
  <button
    onClick={() => handleAutoGrade(attempt.id)}
    className="bg-blue-600 mt-4 text-white text-xs md:text-sm px-2 py-2 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
  >
    Auto-grade
  </button>
)}


              </tr>
            ))}
          </tbody>
        </table>

        {attempts.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No attempts found for this quiz.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAttemptsPage;
