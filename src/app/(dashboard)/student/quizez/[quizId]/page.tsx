'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, AlertCircle } from 'lucide-react';

interface Question {
  id: number;
  quiz_id: number;
  type: 'MCQ' | 'True/False';
  question_type: 'MCQ' | 'True/False';
  question_text: string;
  options: string[];
  selected_answer?: string; // optional, for completed quizzes
}

interface Quiz {
  id: number;
  title: string;
  instructions: string;
  total_points: number;
  time_limit: number;
  due_date: string;
  status?: 'Completed' | 'Pending'; // optional, from student attempts
  score?: number;                  // optional, from student attempts
  questions: Question[];
}

export default function QuizAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  // Fetch quiz details on mount
  useEffect(() => {
    if (!quizId) return;
    
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://31.97.49.20/api/quizzes/${quizId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Quiz = await response.json();

        // Map backend field names
        const mappedQuestions = data.questions.map(q => ({
          ...q,
          type: q.question_type
        }));

        setQuiz({ ...data, questions: mappedQuestions });
        setQuestions(mappedQuestions);

        // If quiz is already completed, prefill answers and optionally redirect
        if (data.status === 'Completed') {
          const completedAnswers: Record<number, string> = {};
          mappedQuestions.forEach(q => {
            if (q.selected_answer) completedAnswers[q.id] = q.selected_answer;
          });
          setAnswers(completedAnswers);
          alert(`You have already completed this quiz. Your score: ${data.score}`);
          router.push(`/student/quizez/${quizId}/result`);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [quizId, router]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!quiz) return;
      
      // First create an attempt
      const createAttemptResponse = await fetch(`http://31.97.49.20/api/quizzes/${quizId}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 2 }), // TODO: Get from auth session
      });

      if (!createAttemptResponse.ok) throw new Error(`HTTP error! status: ${createAttemptResponse.status}`);
      const attempt = await createAttemptResponse.json();
      
      // Then submit the answers
      const submitResponse = await fetch(`http://31.97.49.20/api/quizzes/attempts/${attempt.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            question_id: parseInt(questionId),
            selected_answer: answer,
          })),
        }),
      });

      if (!submitResponse.ok) throw new Error(`HTTP error! status: ${submitResponse.status}`);
      const data = await submitResponse.json();
      console.log('Quiz submitted:', data);
      router.push(`/student/quizez/${quizId}/result`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  }, [quiz, quizId, answers, router]);

  // Timer
  useEffect(() => {
    if (quiz?.time_limit && quiz.status !== 'Completed') {
      setTimeLeft(quiz.time_limit * 60); // minutes → seconds
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (!prev || prev <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, handleSubmit]);


  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p>Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="sticky top-0 bg-background z-10 py-4 border-b">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
            <p className="text-muted-foreground">Answer all questions before submitting</p>
          </div>
          <div className="flex items-center gap-6">
            {timeLeft !== null && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
            {quiz.status !== 'Completed' && (
              <Button onClick={() => setConfirmSubmit(true)}>Submit Quiz</Button>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Instructions */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        {quiz.instructions && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="whitespace-pre-wrap">{quiz.instructions}</p>
            </CardContent>
          </Card>
        )}

        {/* Questions */}
        <div className="space-y-8">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle>Question {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="font-medium">{question.question_text}</p>
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onValueChange={quiz.status === 'Completed' ? undefined : (value) => handleAnswerChange(question.id, value)}
                    disabled={quiz.status === 'Completed'}
                  >
                    {question.type === 'MCQ'
                      ? question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`q${question.id}-${optionIndex}`} />
                            <Label htmlFor={`q${question.id}-${optionIndex}`}>{option}</Label>
                          </div>
                        ))
                      : ['True', 'False'].map((val) => (
                          <div key={val} className="flex items-center space-x-2">
                            <RadioGroupItem value={val} id={`q${question.id}-${val.toLowerCase()}`} />
                            <Label htmlFor={`q${question.id}-${val.toLowerCase()}`}>{val}</Label>
                          </div>
                        ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Submit Dialog */}
      <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p>Are you sure you want to submit your quiz?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You won’t be able to change your answers after submission.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setConfirmSubmit(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit Quiz</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
