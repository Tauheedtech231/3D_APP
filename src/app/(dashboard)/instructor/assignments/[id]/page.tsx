"use client";
/* eslint-disable */



import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Download, Send, Check, X } from "lucide-react";

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  submittedOn: string;
  status: "pending" | "Graded";
  grade?: number;
  points_earned?: number;
  feedback?: string;
  attachmentUrl?: string;
  courseTitle?:string;
  submissionText?:string
}

export default function AssignmentGrading() {
  const params = useParams();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignmentData();
  }, [assignmentId]);

const fetchAssignmentData = async () => {
  try {
    setLoading(true);
    const response = await fetch(`http://31.97.49.20/api/assignments/${assignmentId}`);
    console.log("the res",response)
    if (response.ok) {
      const data = await response.json();
      console.log("Raw API response:", data);

      // Map submissions for table
      const mappedData = data.submissions.map((submission: any) => {
        const assignmentGrade = submission.assignment_grades?.[0];
        console.log("Assignment grade for submission:", assignmentGrade);
        
        return {
          id: submission.id,
          studentName: submission.students?.name || "",
          studentEmail: submission.students?.email || "",
          studentAvatar: submission.students?.image || "",
          submittedOn: submission.submitted_at || "",
          status: submission.status || "Pending",
          grade: assignmentGrade?.points_earned,
          points_earned: assignmentGrade?.points_earned,
          feedback: assignmentGrade?.feedback || "",
          attachmentUrl: submission.file_url || "",
          submissionText: submission.submission_text || "",
          courseTitle: data.courses?.title || "",
          title: data.title || "",
          description: data.description || "",
          instructions: data.instructions || "",
          total_points: data.total_points || 100,
          due_date: data.due_date || ""
        };
      });

      console.log("Mapped submission data:", mappedData);
      setAssignment(mappedData);
    } else {
      console.error('Failed to fetch assignment data');
    }
  } catch (error) {
    console.error('Error fetching assignment data:', error);
  } finally {
    setLoading(false);
  }
};



  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState<string>("");
  const [feedbackInput, setFeedbackInput] = useState<string>("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeInput(submission.points_earned?.toString() || "");
    setFeedbackInput(submission.feedback || "");
  };

  const handleSubmitGrade = async () => {
    if (!selectedSubmission) return;
    
    const grade = parseInt(gradeInput);
    if (isNaN(grade) || grade < 0 || grade > assignment.
total_points
) {
      alert(`Please enter a valid grade between 0 and ${assignment.
total_points
}`);
      return;
    }
    
    // Update the submission in our state
    
    // const updatedSubmissions = assignment.map(sub => {
    //   if (sub.id === selectedSubmission.id) {
    //     return {
    //       ...sub,
    //       status: "Graded",
    //       points_earned: grade,
    //       feedback: feedbackInput
    //     };
    //   }
    //   return sub;
    // });
    const updatedSubmissions: Submission[] = assignment.map((sub: Submission) => {
  if (sub.id === selectedSubmission.id) {
    return {
      ...sub,
      status: "Graded",
      points_earned: grade,
      feedback: feedbackInput
    };
  }
  return sub;
});

    
    setAssignment(updatedSubmissions);
    
    // Update the selected submission
    setSelectedSubmission({
      ...selectedSubmission,
      status: "Graded",
      points_earned: grade,
      feedback: feedbackInput
    });
    
    // Send grade and feedback to API
    try {
      const response = await fetch(`http://31.97.49.20/api/assignments/${assignmentId}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          grade,
          feedback: feedbackInput,
          instructor_id:1

        })
      });
      
      if (response.ok) {
        alert(`Grade and feedback submitted for ${selectedSubmission.studentName}`);
      } else {
        alert('Failed to submit grade');
      }
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert('Error submitting grade');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-6 transition-colors">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Loading assignment data...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-6 transition-colors">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <p className="text-center">Assignment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-6 transition-colors">
      {/* Assignment Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{assignment[0]?.courseTitle}</h1>
            <h2 className="text-xl mt-2">{assignment[0]?.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
              <span>Due: {formatDate(assignment[0]?.due_date)}</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              <span>{assignment?.length || 0} Submissions</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">Assignment Description</h2>
          <p className="text-gray-700 dark:text-gray-300">{assignment[0]?.description}</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{assignment[0]?.instructions}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Student Submissions</CardTitle>
              <CardDescription>Select a submission to grade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignment && assignment.length > 0 ? assignment.map((submission:any) => (
                  <div 
                    key={submission.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedSubmission?.id === submission.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    onClick={() => handleSelectSubmission(submission)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{submission.studentName}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${submission.status === 'Graded' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
                            {submission.status === 'Graded' ? `${submission.points_earned}/${assignment[0].total_points}` : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{submission.studentEmail}</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Submitted: {formatDate(submission.submittedOn)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No submissions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grading Area */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Grading: {selectedSubmission.studentName}</CardTitle>
                    <CardDescription>Submitted on {formatDate(selectedSubmission.submittedOn)}</CardDescription>
                  </div>
                {selectedSubmission.attachmentUrl && (
  <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
    <a
      href={`http://31.97.49.20${selectedSubmission.attachmentUrl}`}
      download
    >
      <Download className="h-4 w-4" />
      <span>Download</span>
    </a>
  </Button>
)}


                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Submission Text */}
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Submission Text</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.submissionText}</p>
                  </div>

                  {/* Grading Form */}
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="grade">Grade (out of {assignment[0].total_points})</Label>
                      <Input 
                        id="grade" 
                        type="number" 
                        min="0" 
                        max={assignment[0].total_points} 
                        placeholder="Enter grade" 
                        value={gradeInput}
                        onChange={(e) => setGradeInput(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="feedback">Feedback</Label>
                      <Textarea 
                        id="feedback" 
                        placeholder="Provide feedback to the student" 
                        className="min-h-[150px]"
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitGrade}>
                        <Check className="h-4 w-4 mr-2" />
                        Submit Grade
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-lg font-medium">Select a Submission</h3>
                <p className="text-gray-500 dark:text-gray-400">Choose a student submission from the list to start grading</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}