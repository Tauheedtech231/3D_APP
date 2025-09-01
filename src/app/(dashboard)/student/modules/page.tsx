'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Module {
  id: number;
  title: string;
  content: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  enrollment_count: number;
  modules: Module[];
}

const StudentCoursesModules: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const studentId = 2; // Hardcoded for testing

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://31.97.49.20/api/student-courses/${studentId}`);
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-blue-600 mt-6 font-medium">Loading courses...</p>
    );
  }

  if (!courses.length) {
    return (
      <p className="text-center text-gray-500 mt-6 font-medium">
        You are not enrolled in any courses yet.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Courses & Modules</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
          Explore your enrolled courses and access each module directly
        </p>
      </div>

      {/* Courses and Modules */}
      {courses.map(course => (
        <div key={course.id} className="mb-10">
          {/* Course Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-2 sm:mb-0">
              {course.title}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Duration: {course.duration} days | Enrolled: {course.enrollment_count}
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {course.modules.map(module => (
              <Card
                key={module.id}
                className="rounded-2xl shadow-md border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2 truncate">
                    <BookOpen size={16} /> {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-700 dark:text-gray-300 flex flex-col justify-between">
                  <p className="line-clamp-3 mb-3">{module.content}</p>
                  <Link href={`/student/modules/${module.id}`}>
                    <button className="mt-auto w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition">
                      Open Module
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentCoursesModules;
