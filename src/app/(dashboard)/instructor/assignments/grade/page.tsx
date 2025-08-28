'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { ArrowLeft, Download, FileText, Video, Image as ImageIcon, Save, Clock, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Assignment {
  id: number;
  title: string;
  description: string;
  maxPoints: number;
  dueDate: string;
  course: string;
  module: string;
}

interface Submission {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  status: 'Submitted' | 'Late' | 'Graded';
  score?: number;
  feedback?: string;
  files: SubmissionFile[];
}

interface SubmissionFile {
  id: number;
  name: string;
  type: string;
  size: number;
  url: string;
}

const GradeAssignment: React.FC = () => {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('id');
  
  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({
    score: '',
    feedback: ''
  });

  useEffect(() => {
    if (assignmentId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5000/api/assignments/${assignmentId}`);
          if (response.ok) {
            const data = await response.json();
            setAssignment(data);
          } else {
            console.error('Failed to fetch assignment');
          }
        } catch (error) {
          console.error('Error fetching assignment:', error);
        } finally {
          setLoading(false);
        }
      };

      const fetchSubs = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5000/api/assignments/${assignmentId}/submissions`);
          if (response.ok) {
            const data = await response.json();
            setSubmissions(data);
          } else {
            console.error('Failed to fetch submissions');
          }
        } catch (error) {
          console.error('Error fetching submissions:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      fetchSubs();
    }
  }, [assignmentId]);



  const handleSubmissionSelect = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      score: submission.score?.toString() || '',
      feedback: submission.feedback || ''
    });
  };

  const handleGradeSubmit = async () => {
    if (!selectedSubmission) return;
    
    setLoading(true);
    try {
      const gradePayload = {
        submissionId: selectedSubmission.id,
        score: parseInt(gradeData.score),
        feedback: gradeData.feedback
      };

      // API call to grade submission
      const response = await fetch(`http://localhost:5000/api/assignments/${assignmentId}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradePayload),
      });

      if (response.ok) {
        // Update local state
        setSubmissions(prev => prev.map(sub => 
          sub.id === selectedSubmission.id 
            ? { ...sub, score: parseInt(gradeData.score), feedback: gradeData.feedback, status: 'Graded' as const }
            : sub
        ));
        
        // Update selected submission
        setSelectedSubmission(prev => prev ? {
          ...prev,
          score: parseInt(gradeData.score),
          feedback: gradeData.feedback,
          status: 'Graded'
        } : null);
        
        alert('Grade submitted successfully!');
      } else {
        throw new Error('Failed to submit grade');
      }
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert('Failed to submit grade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Submitted': 'default',
      'Late': 'destructive',
      'Graded': 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    );
  };

  if (loading || !assignment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assignment data...</p>
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold tracking-tight">Grade Assignment</h1>
          <p className="text-muted-foreground">{assignment.title}</p>
        </div>
      </div>

      {/* Assignment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Course</Label>
              <p className="font-medium">{assignment.course}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Module</Label>
              <p className="font-medium">{assignment.module}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Max Points</Label>
              <p className="font-medium">{assignment.maxPoints}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
              <p className="font-medium">{format(new Date(assignment.dueDate), 'PPP')}</p>
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="mt-1">{assignment.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Submissions List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Submissions ({submissions.length})</CardTitle>
            <CardDescription>Click on a submission to grade it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No submissions found</p>
              </div>
            ) : (
              submissions.map((submission) => (
              <div
                key={submission.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedSubmission?.id === submission.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSubmissionSelect(submission)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{submission.studentName}</p>
                    <p className="text-sm text-muted-foreground">{submission.studentEmail}</p>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(submission.submittedAt), 'MMM d, HH:mm')}
                  </div>
                  {submission.score !== undefined && (
                    <div className="font-medium text-foreground">
                      {submission.score}/{assignment.maxPoints}
                    </div>
                  )}
                </div>
              </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Submission Details and Grading */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSubmission ? (
            <>
              {/* Student Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {selectedSubmission.studentName}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-4">
                      <span>{selectedSubmission.studentEmail}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Submitted: {format(new Date(selectedSubmission.submittedAt), 'PPP p')}
                      </div>
                      {getStatusBadge(selectedSubmission.status)}
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Submitted Files */}
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedSubmission.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grading Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Grade Submission</CardTitle>
                  <CardDescription>
                    Provide a score and feedback for this submission
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="score">Score (out of {assignment.maxPoints})</Label>
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        max={assignment.maxPoints}
                        value={gradeData.score}
                        onChange={(e) => setGradeData(prev => ({ ...prev, score: e.target.value }))}
                        placeholder="Enter score"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Status</Label>
                      <div className="flex items-center h-10">
                        {getStatusBadge(selectedSubmission.status)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      value={gradeData.feedback}
                      onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
                      placeholder="Provide feedback for the student"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={handleGradeSubmit}
                      disabled={loading || !gradeData.score}
                    >
                      {loading ? 'Submitting...' : 'Submit Grade'}
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Select a Submission</p>
                  <p className="text-muted-foreground">Choose a submission from the list to view and grade it</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeAssignment;