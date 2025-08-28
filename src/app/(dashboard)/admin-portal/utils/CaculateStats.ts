// utils/calculateStats.ts
import { Student, Engagement,Transaction } from '../types';

export const calculateAverageProgress = (students: Student[]): number => {
  if (students.length === 0) return 0;
  const total = students.reduce((sum, student) => sum + (student.progress ?? 0), 0);
  return Math.round(total / students.length);
};

export const calculateTotalRevenue = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const calculateEngagementRate = (engagement: Engagement[]): number => {
  if (engagement.length === 0) return 0;
  const totalStudents = engagement.reduce((sum, day) => sum + day.activeStudents, 0);
  const average = totalStudents / engagement.length;
  return Math.round((average / 100) * 100); // Assuming 100 is max possible
};