export interface Assignment {
  id: number;
  title: string;
  description: string;
  instructions: string;
  due_date: string;
  total_points: number;
  submission_format: 'file' | 'text' | 'both';
  allow_late_submission: boolean;
  course_id: number;
  status: 'Pending' | 'Submitted' | 'Graded';
  courses?: {
    title: string;
  };
  submission?: {
    file_url?: string;
    file_name?: string;
    file_size?: number;
    submission_text?: string;
    submitted_at?: string;
    grade?: {
      points_earned: number;
      feedback?: string;
    };
  };
}