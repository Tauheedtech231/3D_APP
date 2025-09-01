"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentProfile from "../../components/StudentProfile";
import { Student, Course, Engagement } from '@/app/(dashboard)/admin-portal/types'

export default function StudentPage() {
  const params = useParams();
  const id = params?.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [engagement, setEngagement] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch student info
        const studentRes = await fetch(`http://31.97.49.20/api/students/${id}`);
        if (!studentRes.ok) throw new Error("Failed to fetch student");
        const studentData: Student = await studentRes.json();
        setStudent(studentData);

        // Fetch all courses
        const coursesRes = await fetch("http://31.97.49.20/api/courses");
        if (!coursesRes.ok) throw new Error("Failed to fetch courses");
        const coursesData: Course[] = await coursesRes.json();
        setCourses(coursesData);

        // Fetch engagement for this student
        const engagementRes = await fetch(`http://31.97.49.20/api/engagement`);
        if (!engagementRes.ok) throw new Error("Failed to fetch engagement");
        const engagementData: Engagement[] = await engagementRes.json();
        setEngagement(engagementData);
        console.log("The engagement",engagementData)


      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="px-4 py-6 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 animate-pulse">
        {/* Skeleton content same as before */}
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-4 bg-red-100 rounded-full dark:bg-red-900/30 mb-4">
          <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Student Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">The student you’re looking for doesn’t exist or may have been removed.</p>
      </div>
    );
  }

  return <StudentProfile student={student} courses={courses} engagement={engagement} />;
}
