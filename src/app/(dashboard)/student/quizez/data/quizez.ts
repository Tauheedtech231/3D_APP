export interface Quiz {
  id: number;
  title: string;
  module_name: string;
  courses: {
    id: number;
    title: string;
  } | null;
  due_date: string;
  status: string;
  questions: {
    id: number;
    type: string;
    question_text: string;
    options: string[];
    correct_answer: string;
  }[];
  student_attempt: {
    id: number;
    status: string;
    score: number;
    submitted_at: string;
  } | null;
  total_points: number;
  time_limit: number;
  instructions?: string;
}