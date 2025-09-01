'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';

interface Quiz {
  id: number;
  title: string;
  due_date: string;
  total_points: number;
  total_attempts: number;
  pending_grading: number;
  average_score: number;
}

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://31.97.49.20/api/quizzes');
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      const data = await response.json();
      console.log("the quiz data data",data)
      setQuizzes(data);
    } catch (err) {
      setError('Error loading quizzes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const response = await fetch(`http://31.97.49.20/api/quizzes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete quiz');
      
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    } catch (err) {
      console.error('Error deleting quiz:', err);
      alert('Failed to delete quiz');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-700 dark:text-gray-300">Loading...</div>;
  if (error) return <div className="text-red-500 text-center h-64">{error}</div>;

  return (
    <div className="p-6 text-sm bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Quizzes</h1>
        <Link 
          href="/instructor/quizzes/create"
          className="bg-blue-500 text-white px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-blue-600 transition-colors text-sm"
        >
          <FaPlus /> Create Quiz
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left font-medium uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 text-left font-medium uppercase tracking-wider">Due Date</th>
              <th className="px-4 py-2 text-left font-medium uppercase tracking-wider">Points</th>
              <th className="px-4 py-2 text-left font-medium uppercase tracking-wider">Attempts</th>
              <th className="px-4 py-2 text-left font-medium uppercase tracking-wider">Pending</th>
              <th className="px-4 py-2 text-left font-medium uppercase tracking-wider">Avg. Score</th>
              <th className="px-4 py-2 text-left font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="text-gray-800 dark:text-gray-200">
                <td className="px-4 py-2">{quiz.title}</td>
                <td className="px-4 py-2">
                  {quiz.due_date ? format(new Date(quiz.due_date), 'MMM d, yyyy') : 'No due date'}
                </td>
                <td className="px-4 py-2">{quiz.total_points}</td>
                <td className="px-4 py-2">{quiz.total_attempts || 0}</td>
                <td className="px-4 py-2">{quiz.pending_grading || 0}</td>
                <td className="px-4 py-2">
                  {quiz.average_score ? `${Math.round(quiz.average_score)}%` : 'N/A'}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Link 
                    href={`/instructor/quizzes/${quiz.id}/attempts`}
                    className="text-blue-500 hover:text-blue-700"
                    title="View Attempts"
                  >
                    <FaEye className="inline" />
                  </Link>
                  <Link 
                    href={`/instructor/quizzes/${quiz.id}/edit`}
                    className="text-green-500 hover:text-green-700"
                    title="Edit Quiz"
                  >
                    <FaEdit className="inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Quiz"
                  >
                    <FaTrash className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {quizzes.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
            No quizzes found. Click &quot;Create Quiz&quot; to add one.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;
