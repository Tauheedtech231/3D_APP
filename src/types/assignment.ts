export interface AssignmentGrade {
  id: number;
  submission_id: number;
  instructor_id: number;
  points_earned: number;
  feedback?: string;
  graded_at: string;
}

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  student_id: number;
  submission_text?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number; // in bytes
  submitted_at: string;
  status: 'Submitted' | 'Graded' | 'Late' | 'Missing';
  grade?: AssignmentGrade;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  instructions: string;
  course_id: number;
  total_points: number;
  due_date: string;
  submission_format: 'file' | 'text' | 'both';
  allow_late_submission: boolean;
  late_penalty?: number;
  created_at: string;
  updated_at: string;
  courses?: {
    title: string;
  };
  submission?: AssignmentSubmission;
}