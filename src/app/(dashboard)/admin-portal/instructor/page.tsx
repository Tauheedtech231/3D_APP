"use client";

import { useEffect, useState } from "react";
import InstructorTable from "../components/InstructorTable";
import { Instructor } from "../types";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstructors() {
      try {
        const response = await fetch("http://31.97.49.20/api/instructors");
        if (!response.ok) throw new Error("Failed to fetch instructors");

        const data: Instructor[] = await response.json();
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInstructors();
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
                <div
                  key={item}
                  className="h-6 bg-gray-300 rounded dark:bg-gray-600"
                ></div>
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="grid grid-cols-5 gap-4 px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full dark:bg-gray-600 mr-3"></div>
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-3/4"></div>
                  </div>
                  {[1, 2, 3, 4].map((col) => (
                    <div
                      key={col}
                      className="h-4 bg-gray-300 rounded dark:bg-gray-600"
                    ></div>
                  ))}
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
        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
          Instructors
        </h1>
        <p className="text-blue-600 dark:text-blue-300">
          Manage and view all instructors in your institution
        </p>
      </div>
      <InstructorTable instructors={instructors} />
    </div>
  );
}
