import React from "react";
import { Instructor, Course } from "../types";

interface InstructorProfileProps {
  instructor: Instructor;
  courses: Course[];
}

const InstructorProfile: React.FC<InstructorProfileProps> = ({ instructor, courses }) => {
  const instructorCourses = courses.filter((course) =>
    instructor.courses?.some(c => c.id === course.id) || false
  );

  return (
    <div className="px-6 py-6 mb-10 bg-white rounded-2xl shadow-lg dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="flex items-center mb-8">
        {/* <div className="relative w-24 h-24 mr-5 rounded-full border-4 border-blue-500 overflow-hidden shadow-md">
          <img
            className="object-cover w-full h-full"
            src={instructor.avatar || "https://via.placeholder.com/150"}
            alt={instructor.name}
          />
        </div> */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {instructor.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{instructor.email}</p>
          <div className="mt-3">
            <span className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md">
              {instructor.courses?.length || 0} Courses
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <h3 className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          👨‍🏫 About
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {instructor.bio || "No bio available."}
        </p>
      </div>

      {/* Courses Taught */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-200">
          📚 Courses Taught
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {instructorCourses.length > 0 ? (
            instructorCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-1">
                  {course.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {course.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No courses assigned yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
