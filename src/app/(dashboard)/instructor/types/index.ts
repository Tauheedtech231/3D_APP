// types/index.ts
export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  progress: number;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: Instructor| null;
  duration: number;
  modules: Module[];
  enrollmentCount: number;
}

export interface Module {
  id: string;
  title: string;
  content: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  bio: string;
  courses: string[];
  avatar?: string;
}

export interface Transaction {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Engagement {
  date: string;
  activeStudents: number;
  timeSpent: number;
}

export interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: 'system' | 'user';
}