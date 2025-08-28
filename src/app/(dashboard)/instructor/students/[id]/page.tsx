"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: { id: string; title: string; progress: number }[];
}

export default function StudentDetail() {
  const params = useParams();
  const studentId = params.id as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${studentId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || 'Failed to fetch student data');
        }
        const data = await response.json();
        console.log("the data", data);
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-6 transition-colors">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md animate-pulse">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error || 'Student not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-6 transition-colors">
      {/* Student Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="h-24 w-24 rounded-full overflow-hidden">
            <Image
              src={student.avatar}
              alt={student.name}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div>
              <h1 className="text-lg font-medium text-blue-600">{student.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Details Tabs */}
      <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Enrolled Courses</CardTitle>
              <CardDescription>Courses this student is currently enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {student.enrolledCourses.map((course) => (
                  <div key={course.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base text-blue-600">{course.title}</h3>
                  </div>
                ))}                
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}