'use client';

import { useState } from 'react';
import { Assignment } from '@/app/(dashboard)/student/assignments/data/assignment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileText, Upload } from 'lucide-react';
import { format } from 'date-fns';

interface AssignmentDetailsProps {
  assignment: Assignment;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function AssignmentDetails({ assignment, onSubmit }: AssignmentDetailsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  console.log("the assignments ha",assignment)
  const isPastDue = new Date(assignment.due_date) < new Date();
  const isSubmitted = assignment.status === 'Submitted' || assignment.status === 'Graded';
  const isGraded = assignment.status === 'Graded';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate submission based on format requirements
    if (assignment.submission_format === 'file' && !selectedFile) {
      setError('Please select a file to submit');
      return;
    }
    if (assignment.submission_format === 'text' && !submissionText.trim()) {
      setError('Please enter your submission text');
      return;
    }
    if (assignment.submission_format === 'both' && !selectedFile && !submissionText.trim()) {
      setError('Please provide either a file or text submission');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('assignmentId', assignment.id.toString());
      formData.append('studentId', '2'); // TODO: Get from auth session

      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      if (submissionText.trim()) {
        formData.append('submissionText', submissionText.trim());
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{assignment.title}</h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <FileText className="h-4 w-4 mr-2" />
          <span>Course: {assignment.courses?.title || `Course ${assignment.course_id}`}</span>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap mb-4">
            {assignment.description}
          </p>

          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap mb-4">
            {assignment.instructions}
          </p>

          <div className="flex flex-col space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>Due: {format(new Date(assignment.due_date), 'PPP pp')}</p>
            <p>Points: {assignment.total_points}</p>
            <p>Submission Format: {assignment.submission_format === 'both' ? 'File and Text' :
              assignment.submission_format === 'file' ? 'File only' : 'Text only'}</p>
          </div>
        </div>

        {isPastDue && !assignment.allow_late_submission && !isSubmitted && (
          <div className="flex items-center p-4 mb-6 text-red-800 bg-red-50 dark:bg-red-900/50 dark:text-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>This assignment is past due and late submissions are not allowed.</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Your Submission</h3>
            {assignment.submission?.file_url && (
              <div className="mb-3">
                <a
                  href={assignment.submission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {assignment.submission.file_name}
                  {assignment.submission.file_size && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      ({Math.round(assignment.submission.file_size / 1024)} KB)
                    </span>
                  )}
                </a>
              </div>
            )}
            {assignment.submission?.submission_text && (
              <div className="mb-3">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {assignment.submission.submission_text}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Submitted: {assignment.submission?.submitted_at ? format(new Date(assignment.submission.submitted_at), 'PPP pp') : 'Not available'}
            </p>
            {isGraded && assignment.submission?.grade && (
              <div className="mt-4">
                <p className="font-semibold">
                  Grade: {assignment.submission.grade.points_earned} points
                </p>
                {assignment.submission.grade.feedback && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Feedback: {assignment.submission.grade.feedback}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Submit Assignment</h3>
            
            {(assignment.submission_format === 'file' || assignment.submission_format === 'both') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File Submission
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="relative"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </Button>
                  {selectedFile && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {(assignment.submission_format === 'text' || assignment.submission_format === 'both') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Text Submission
                </label>
                <Textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Enter your submission text here..."
                  className="min-h-[200px]"
                />
              </div>
            )}

            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || (isPastDue && !assignment.allow_late_submission)}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
