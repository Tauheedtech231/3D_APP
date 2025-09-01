'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { ArrowLeft, Clock, User, Calendar, CheckCircle, XCircle, Save, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Quiz {
  id: number;
  title: string;
  instructions: string;
  totalPoints: number;
  timeLimit: number;
  dueDate: string;
  course: string;
  module: string;
}

interface QuizAttempt {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  attemptedAt: string;
  completedAt?: string;
  status: 'In Progress' | 'Completed' | 'Graded';
  score?: number;
  timeSpent: number; // in minutes
  answers: StudentAnswer[];
}

interface StudentAnswer {
  questionId: number;
  questionText: string;
  questionType: 'MCQ' | 'True/False';
  options: string[];
  correctAnswer: string;
  selectedAnswer: string;
  isCorrect: boolean;
  points: number;
}

const GradeQuiz: React.FC = () => {
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');
  
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const [manualGrades, setManualGrades] = useState<{[key: number]: number}>({});

  useEffect(() => {
    if (quizId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://31.97.49.20/api/quizzes/${quizId}`);
          if (response.ok) {
            const data = await response.json();
            setQuiz(data);
          } else {
            console.error('Failed to fetch quiz');
          }
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
      };

      const fetchQuizAttempts = async () => {
        try {
          const response = await fetch(`http://31.97.49.20/api/quizzes/${quizId}/attempts`);
          if (response.ok) {
            const data = await response.json();
            setAttempts(data);
          } else {
            console.error('Failed to fetch quiz attempts');
          }
        } catch (error) {
          console.error('Error fetching attempts:', error);
        }
      };

      fetchData();
      fetchQuizAttempts();
    }
  }, [quizId]);



  const handleAttemptSelect = (attempt: QuizAttempt) => {
    setSelectedAttempt(attempt);
    // Initialize manual grades with current scores
    const grades: {[key: number]: number} = {};
    attempt.answers.forEach(answer => {
      grades[answer.questionId] = answer.points;
    });
    setManualGrades(grades);
  };

  const handleAutoGrade = async () => {
    if (!selectedAttempt) return;
    
    setLoading(true);
    try {
      // API call to auto-grade quiz
      const response = await fetch(`/api/quizzes/${quizId}/auto-grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attemptId: selectedAttempt.id }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state with auto-graded results
        setAttempts(prev => prev.map(attempt => 
          attempt.id === selectedAttempt.id 
            ? { ...attempt, score: result.totalScore, status: 'Graded' as const }
            : attempt
        ));
        
        setSelectedAttempt(prev => prev ? {
          ...prev,
          score: result.totalScore,
          status: 'Graded'
        } : null);
        
        alert('Quiz auto-graded successfully!');
      } else {
        throw new Error('Failed to auto-grade quiz');
      }
    } catch (error) {
      console.error('Error auto-grading quiz:', error);
      alert('Failed to auto-grade quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualGrade = async () => {
    if (!selectedAttempt) return;
    
    setLoading(true);
    try {
      const totalScore = Object.values(manualGrades).reduce((sum, score) => sum + score, 0);
      
      // API call to manually grade quiz
      const response = await fetch(`/api/quizzes/${quizId}/manual-grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          attemptId: selectedAttempt.id,
          grades: manualGrades,
          totalScore
        }),
      });

      if (response.ok) {
        // Update local state
        setAttempts(prev => prev.map(attempt => 
          attempt.id === selectedAttempt.id 
            ? { ...attempt, score: totalScore, status: 'Graded' as const }
            : attempt
        ));
        
        setSelectedAttempt(prev => prev ? {
          ...prev,
          score: totalScore,
          status: 'Graded'
        } : null);
        
        alert('Quiz graded successfully!');
      } else {
        throw new Error('Failed to grade quiz');
      }
    } catch (error) {
      console.error('Error grading quiz:', error);
      alert('Failed to grade quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateManualGrade = (questionId: number, points: number) => {
    setManualGrades(prev => ({
      ...prev,
      [questionId]: points
    }));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'In Progress': 'default',
      'Completed': 'secondary',
      'Graded': 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    );
  };

  const calculateTotalManualScore = () => {
    return Object.values(manualGrades).reduce((sum, score) => sum + score, 0);
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/instructor">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grade Quiz</h1>
          <p className="text-muted-foreground">{quiz.title}</p>
        </div>
      </div>

      {/* Quiz Info */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Course</Label>
              <p className="font-medium">{quiz.course}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Module</Label>
              <p className="font-medium">{quiz.module}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Total Points</Label>
              <p className="font-medium">{quiz.totalPoints}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Time Limit</Label>
              <p className="font-medium">{quiz.timeLimit} minutes</p>
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-sm font-medium text-muted-foreground">Instructions</Label>
            <p className="mt-1">{quiz.instructions}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attempts List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quiz Attempts ({attempts.length})</CardTitle>
            <CardDescription>Click on an attempt to review and grade it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAttempt?.id === attempt.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleAttemptSelect(attempt)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{attempt.studentName}</p>
                    <p className="text-sm text-muted-foreground">{attempt.studentEmail}</p>
                  </div>
                  {getStatusBadge(attempt.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {attempt.timeSpent}min
                  </div>
                  {attempt.score !== undefined && (
                    <div className="font-medium text-foreground">
                      {attempt.score}/{quiz.totalPoints}
                    </div>
                  )}
                </div>
                {attempt.completedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed: {format(new Date(attempt.completedAt), 'MMM d, HH:mm')}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Attempt Details and Grading */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAttempt ? (
            <>
              {/* Student Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {selectedAttempt.studentName}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-4">
                      <span>{selectedAttempt.studentEmail}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Started: {format(new Date(selectedAttempt.attemptedAt), 'PPP p')}
                      </div>
                      {getStatusBadge(selectedAttempt.status)}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Time Spent</Label>
                      <p className="font-medium">{selectedAttempt.timeSpent} minutes</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Current Score</Label>
                      <p className="font-medium">
                        {selectedAttempt.score !== undefined ? `${selectedAttempt.score}/${quiz.totalPoints}` : 'Not graded'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedAttempt.status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grading Actions */}
              {selectedAttempt.status === 'Completed' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Grading Options</CardTitle>
                    <CardDescription>
                      Choose how to grade this quiz attempt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button onClick={handleAutoGrade} disabled={loading}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Auto Grade
                      </Button>
                      <Button variant="outline" onClick={handleManualGrade} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Manual Grades
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Questions and Answers */}
              {selectedAttempt.answers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Questions and Answers</CardTitle>
                    <CardDescription>
                      Review student answers and adjust grades if needed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedAttempt.answers.map((answer, index) => (
                      <div key={answer.questionId} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <Badge variant={answer.isCorrect ? 'default' : 'destructive'}>
                            {answer.isCorrect ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm">{answer.questionText}</p>
                        
                        <div className="grid gap-2">
                          <Label className="text-sm font-medium">Options:</Label>
                          {answer.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2 text-sm">
                              <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className={`${
                                option === answer.correctAnswer ? 'text-green-600 font-medium' :
                                option === answer.selectedAnswer ? 'text-red-600' : ''
                              }`}>
                                {option}
                                {option === answer.correctAnswer && <CheckCircle className="inline h-4 w-4 ml-1" />}
                                {option === answer.selectedAnswer && option !== answer.correctAnswer && 
                                  <XCircle className="inline h-4 w-4 ml-1" />}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Student Answer:</Label>
                            <p className="text-sm font-medium">{answer.selectedAnswer}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Correct Answer:</Label>
                            <p className="text-sm font-medium text-green-600">{answer.correctAnswer}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`points-${answer.questionId}`} className="text-sm font-medium">
                            Points:
                          </Label>
                          <Input
                            id={`points-${answer.questionId}`}
                            type="number"
                            min="0"
                            max="10"
                            value={manualGrades[answer.questionId] || 0}
                            onChange={(e) => updateManualGrade(answer.questionId, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">/ 10</span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Score:</span>
                        <span className="font-bold text-lg">
                          {calculateTotalManualScore()} / {quiz.totalPoints}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Select an Attempt</p>
                  <p className="text-muted-foreground">Choose a quiz attempt from the list to review and grade it</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeQuiz;