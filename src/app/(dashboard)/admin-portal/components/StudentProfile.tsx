import React from 'react';

import { Student, Course, Engagement } from '../types';
import PerformanceChart from './PerFormanceCharts';

interface StudentProfileProps {
  student: Student;
  courses: Course[];
  engagement: Engagement[];
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, courses, engagement }) => {
  console.log("The en",courses)
  const enrolledCourses = student.enrolledCourses?.length

    ? courses.filter(course => student.enrolledCourses?.includes(course.id))
    : [];

  return (
    <div className="px-4 py-3 mb-8 bg-white rounded-xl shadow-md dark:bg-gray-800">
      <div className="flex items-center mb-6">
        {/* <div className="relative w-20 h-20 mr-4 rounded-full border-2 border-blue-600 overflow-hidden">
          <Image
            src={student.avatar || '/placeholder.png'} // use a local placeholder image
            alt={student.name}
            fill
            className="object-cover"
          />
        </div> */}
        <div>
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
            {student.name}
          </h2>
          <p className="text-sm text-blue-600 dark:text-blue-400">{student.email}</p>
          <div className="mt-2">
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-700 dark:text-blue-100">
              Progress: {student.progress ?? 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Enrolled Courses */}
        <div>
          <h3 className="mb-3 font-medium text-blue-800 dark:text-blue-300 text-sm">
            Enrolled Courses
          </h3>
          <div className="overflow-hidden bg-white rounded-xl shadow-sm dark:bg-gray-700">
            {enrolledCourses.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                {enrolledCourses.map(course => (
                  <li
                    key={course.id}
                    className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-200 text-sm">
                          {course.title}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {course.instructor?.name}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-700 dark:text-blue-100">
                        {course.duration} hrs
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No courses enrolled</p>
            )}
          </div>
        </div>

        {/* Performance */}
        <div>
          <h3 className="mb-3 font-medium text-blue-800 dark:text-blue-300 text-sm">
            Performance
          </h3>
          {engagement?.length > 0 ? (
            <PerformanceChart data={engagement} />
          ) : (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              No performance data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
