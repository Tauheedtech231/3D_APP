import React from 'react';
import { Course } from '../../types';

interface CourseDetailProps {
  course: Course;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  return (
    <div className="px-4 py-3 mb-8 bg-white rounded-xl shadow-md dark:bg-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-700 dark:text-blue-300">
          {course.title}
        </h2>
        <p className="text-sm text-blue-500 dark:text-blue-400 mt-1">
          {course.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-full shadow-sm">
            Instructor: {course.instructor?.name}
          </span>
          <span className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-sm">
            Duration: {course.duration}h
          </span>
          <span className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-sm">
            Enrollments: {course.enrollmentCount}
          </span>
        </div>
      </div>

      {/* Modules */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-blue-700 dark:text-blue-300">
          Course Modules
        </h3>
        <div className="overflow-hidden bg-white rounded-xl shadow-sm dark:bg-gray-700">
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {course.modules.map((module) => (
              <li key={module.id} className="px-4 py-2">
                <div className="flex flex-col">
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    {module.title}
                  </p>
                  <p className="text-sm text-blue-500 dark:text-blue-400">
                    {module.content}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
