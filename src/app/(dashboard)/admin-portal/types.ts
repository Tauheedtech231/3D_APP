export interface Student {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  progress?: number;
  enrolledCourses?: number[];
}

export interface Module {
  id: number;
  title: string;
  content: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  enrollmentCount: number;
  instructor: {
    id: number;
    name: string;
  } | null;
  duration: number;
  modules: Module[];
}

export interface Engagement {
  date: string;
  activeStudents: number;
  timeSpent: number;
  type: string;
}

export interface Transaction {
  id: number;
  studentId: number;
  courseId: number;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  expertise?: string[];
  courses?: Course[];
  rating?: number;
  totalStudents?: number;
}

export interface Log {
  id: number;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  source: 'system' | 'user';
  message: string;
}