"use client";

import { useEffect, useState } from "react";
import CourseTable from "../components/CourseTable";
import { Course } from "../types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/courses"); // backend route
      if (!res.ok) throw new Error("Failed to fetch courses from server");

      const data = await res.json();
      console.log("The data",data)

      // Map backend response to frontend Course type (modules ignore kiya)
   

      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);


  if (loading) {
    return (
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="animate-pulse mb-6">
          <div className="h-8 bg-gray-300 rounded dark:bg-gray-700 w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-64"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="animate-pulse mb-6">
          <div className="h-12 bg-gray-300 rounded-lg dark:bg-gray-700 w-full max-w-md"></div>
        </div>

        {/* Table Skeleton */}
        <div className="animate-pulse overflow-hidden rounded-xl shadow-md">
          <div className="w-full overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-100 dark:bg-gray-700">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-6 bg-gray-300 rounded dark:bg-gray-600"></div>
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="grid grid-cols-5 gap-4 px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-12 h-9 bg-gray-300 rounded dark:bg-gray-600 mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-32 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded dark:bg-gray-600 w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-600"></div>
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-600"></div>
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-600"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-300 rounded dark:bg-gray-600 w-16"></div>
                    <div className="h-8 bg-gray-300 rounded dark:bg-gray-600 w-8"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
          Courses
        </h2>
        <p className="text-blue-600 dark:text-blue-300">
          Manage and view all available courses
        </p>
      </div>
      {courses.length > 0 ? (
        <CourseTable courses={courses} />
      ) : (
        <p className="text-blue-600 dark:text-blue-300">No courses available.</p>
      )}
    </div>
  );
}
