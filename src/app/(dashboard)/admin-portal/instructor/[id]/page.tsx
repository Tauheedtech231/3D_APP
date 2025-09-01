"use client";
/* eslint-disable */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InstructorProfile from "../../components/InstructorProfile";
import { Instructor, Course } from "../../types";

export default function InstructorPage() {
  const { id } = useParams<{ id: string }>();

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Call API (Express/Supabase route)
        const res = await fetch(`http://31.97.49.20/api/instructors/${id}`);
        if (!res.ok) throw new Error("Failed to fetch instructor data");

        const data = await res.json();

        setInstructor({
          id: data.id,
          name: data.name,
          email: data.email,
          bio: data.bio,
          avatar: data.avatar,
          courses: data.courses.map((c: any) => c.id), // store course IDs
        });

        setCourses(
          data.courses.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            duration: c.duration,
            enrollmentCount: c.enrollment_count,
            instructor: data.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-6 w-48 bg-gray-300 dark:bg-gray-700 mb-4"></div>
        <div className="animate-pulse h-4 w-64 bg-gray-300 dark:bg-gray-700 mb-6"></div>
        <div className="animate-pulse h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Instructor Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The instructor you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return <InstructorProfile instructor={instructor} courses={courses} />;
}
