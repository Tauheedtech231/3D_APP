"use client";

import React, { useEffect, useState } from "react";
import { Student } from "../types";
import StudentTable from "../components/StudentTable";

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://31.97.49.20/api/students"); // Backend route
        if (!res.ok) {
          throw new Error("Failed to fetch students");
        }
        const data: Student[] = await res.json();
        console.log("The data",data)
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse mb-6">
          <div className="h-8 bg-gray-300 rounded dark:bg-gray-700 w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-64"></div>
        </div>

        <div className="animate-pulse overflow-hidden rounded-xl shadow-md">
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-100 dark:bg-gray-700">
              {["Student", "Email", "Progress", "Actions"].map((_, i) => (
                <div key={i} className="h-6 bg-gray-300 rounded dark:bg-gray-600"></div>
              ))}
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="grid grid-cols-4 gap-4 px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full dark:bg-gray-600 mr-3"></div>
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-32"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-600"></div>
                  <div className="h-6 bg-gray-300 rounded-full dark:bg-gray-600 w-16"></div>
                  <div className="h-8 bg-gray-300 rounded-md dark:bg-gray-600 w-16"></div>
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
          Students
        </h2>
        <p className="text-blue-600 dark:text-blue-300">
          Manage and view all students in your institution
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <StudentTable students={students} />
      </div>
    </div>
  );
};

export default Students;
