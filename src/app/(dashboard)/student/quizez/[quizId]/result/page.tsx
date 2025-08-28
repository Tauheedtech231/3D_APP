'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizResult {
  quiz: {
    id: number;
    title: string;
    total_points: number;
  };
  attempt: {
    id: number;
    score: number;
    status: 'Pending' | 'Completed' | 'Graded';
    attempted_at: string;
  };
  answers: {
    id: number;
    question_text: string;
    selected_answer: string;
    correct_answer: string;
    is_correct: boolean;
  }[];
}

export default function QuizResultPage() {
  const params = useParams();
  const quizId = params.quizId as string;

  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const fetchQuizResult = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/results`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error fetching quiz result:', error);
    }
  };

    fetchQuizResult();
  }, [quizId]);

  if (!result) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-gray-700 dark:text-gray-200 text-sm">
        Loading result...
      </div>
    );
  }

  // Calculate number of correct answers and percentage
  const correctAnswers = result.answers.filter(a => a.is_correct).length;
  const percentage = Math.round((result.attempt.score));
  const totalQuestions = result.answers.length;

  return (
    <div className="space-y-4 max-w-3xl mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 transition-colors min-h-screen text-sm">
      {/* Quiz Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{result.quiz.title}</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Quiz Results</p>
      </div>

      {/* Score Summary */}
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 text-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Score Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3 text-xs sm:text-sm">
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">Score</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">{correctAnswers} / {totalQuestions}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">Percentage</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">{percentage}%</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">Status</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">{result.attempt.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Question Review</h2>
        {result.answers.map((answer, index) => (
          <Card key={answer.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 text-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Q{index + 1}</span>
                {answer.is_correct ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Correct
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    Incorrect
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm space-y-2">
              <p className="font-medium text-gray-900 dark:text-gray-100">{answer.question_text}</p>

              <div className="space-y-1">
                <p className="font-medium text-gray-500 dark:text-gray-400">Your Answer</p>
                <div
                  className={`p-1 rounded border ${
                    answer.is_correct
                      ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-400'
                      : 'border-red-500 bg-red-50 dark:bg-red-900 dark:border-red-400'
                  }`}
                >
                  {answer.selected_answer}
                </div>
              </div>

              {!answer.is_correct && (
                <div className="space-y-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Correct Answer</p>
                  <div className="p-1 rounded border border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-400">
                    {answer.correct_answer}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
