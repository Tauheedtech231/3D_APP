import React, { useState } from 'react';
import { Course } from '../../types'
import Link from 'next/link';

interface CourseTableProps {
  courses: Course[];
}

const CourseTable: React.FC<CourseTableProps> = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-md bg-white dark:bg-gray-800">
      <div className="w-full overflow-x-auto p-4 flex flex-col space-y-4">
        {/* Top Bar: Search + Add Course Button */}
        <div className="flex justify-between items-center">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search courses..."
            className="w-[50%] px-4 py-2 text-sm text-blue-700 bg-white dark:bg-gray-700 dark:text-blue-300 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Add Course Button */}
          <Link
            href="/instructor/courses/add_course"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            + Create Course
          </Link>
          <Link
            href="/instructor/courses/materials"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            + Add meterials
          </Link>
        </div>

        {/* Table */}
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-blue-700 uppercase border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-blue-300">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Instructor</th>
              <th className="px-4 py-2">Enrollments</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCourses.map(course => (
              <tr key={course.id} className="text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg">
                <td className="px-4 py-2 text-sm">
                  <div className="flex flex-col">
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-blue-500 dark:text-blue-400">{course.description}</p>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm">{course.instructor?.name ?? "No instructor"}</td>

                <td className="px-4 py-2 text-xs">
                  <span className="px-2 py-1 font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-700 dark:text-blue-100">
                    {course.enrollmentCount}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  <Link
                    href={`/instructor/courses/${course.id}`}
                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;
