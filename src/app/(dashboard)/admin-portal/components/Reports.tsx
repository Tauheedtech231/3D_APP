"use client";

import React, { useState } from 'react';
import { Engagement, Student, Course, Transaction } from '../types';

interface ReportsProps {
  engagement: Engagement[];
  students: Student[];
  courses: Course[];
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ engagement, students, courses, transactions }) => {
  const [reportType, setReportType] = useState<'engagement' | 'students' | 'courses' | 'revenue'>('engagement');

  const generateCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    switch (reportType) {
      case 'engagement':
        csvContent += 'Date,Active Students,Time Spent\n';
        engagement.forEach(item => {
          csvContent += `${item.date},${item.activeStudents},${item.timeSpent}\n`;
        });
        break;
      case 'students':
        csvContent += 'ID,Name,Email,Progress\n';
        students.forEach(student => {
          csvContent += `${student.id},${student.name},${student.email},${student.progress}\n`;
        });
        break;
      case 'courses':
        csvContent += 'ID,Title,Instructor,Enrollment Count\n';
        courses.forEach(course => {
          csvContent += `${course.id},${course.title},${course.instructor?.name || 'No Instructor'},${course.enrollmentCount}\n`;
        });
        break;
      case 'revenue':
        csvContent += 'ID,Student ID,Course ID,Amount,Date,Status\n';
        transactions.forEach(transaction => {
          csvContent += `${transaction.id},${transaction.studentId},${transaction.courseId},${transaction.amount},${transaction.date},${transaction.status}\n`;
        });
        break;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-4 py-4 mb-8 rounded-2xl shadow-md bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-200">
      {/* Heading with gradient */}
      <h2 className="mb-4 text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Reports
      </h2>

      {/* Report Type Dropdown */}
      <div className="mb-4 w-48">
        <select
          className="block w-full px-3 py-1 text-sm rounded-full text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={reportType}
          onChange={(e) => setReportType(e.target.value as 'engagement' | 'students' | 'courses' | 'revenue')}
        >
          <option value="engagement">Engagement Report</option>
          <option value="students">Student Report</option>
          <option value="courses">Course Report</option>
          <option value="revenue">Revenue Report</option>
        </select>
      </div>

      {/* Export CSV Button */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={generateCSV}
          className="px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white shadow-sm"
        >
          Export CSV
        </button>
      </div>

      {/* Preview Table */}
      <div className="overflow-hidden rounded-xl shadow-md">
        <table className="w-full whitespace-nowrap text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-400 to-blue-600 text-xs font-semibold uppercase text-white rounded-xl">
              {reportType === 'engagement' && (
                <>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Active Students</th>
                  <th className="px-3 py-2">Time Spent</th>
                </>
              )}
              {reportType === 'students' && (
                <>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Progress</th>
                </>
              )}
              {reportType === 'courses' && (
                <>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Instructor</th>
                  <th className="px-3 py-2">Enrollments</th>
                </>
              )}
              {reportType === 'revenue' && (
                <>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Student ID</th>
                  <th className="px-3 py-2">Course ID</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700">
            {reportType === 'engagement' && engagement.slice(0,5).map(item => (
              <tr key={item.date} className="hover:bg-blue-50 dark:hover:bg-gray-600 rounded-xl">
                <td className="px-3 py-2">{item.date}</td>
                <td className="px-3 py-2">{item.activeStudents}</td>
                <td className="px-3 py-2">{item.timeSpent} hours</td>
              </tr>
            ))}
            {reportType === 'students' && students.slice(0,5).map(student => (
              <tr key={student.id} className="hover:bg-blue-50 dark:hover:bg-gray-600 rounded-xl">
                <td className="px-3 py-2">{student.id}</td>
                <td className="px-3 py-2">{student.name}</td>
                <td className="px-3 py-2">{student.email}</td>
                <td className="px-3 py-2">{student.progress}%</td>
              </tr>
            ))}
            {reportType === 'courses' && courses.slice(0,5).map(course => (
              <tr key={course.id} className="hover:bg-blue-50 dark:hover:bg-gray-600 rounded-xl">
                <td className="px-3 py-2">{course.id}</td>
                <td className="px-3 py-2">{course.title}</td>
                <td className="px-3 py-2">{course.instructor?.name || 'No Instructor'}</td>
                <td className="px-3 py-2">{course.enrollmentCount}</td>
              </tr>
            ))}
            {reportType === 'revenue' && transactions.slice(0,5).map(tx => (
              <tr key={tx.id} className="hover:bg-blue-50 dark:hover:bg-gray-600 rounded-xl">
                <td className="px-3 py-2">{tx.id}</td>
                <td className="px-3 py-2">{tx.studentId}</td>
                <td className="px-3 py-2">{tx.courseId}</td>
                <td className="px-3 py-2">${tx.amount}</td>
                <td className="px-3 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="px-3 py-2">{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
