"use client";

import React, { useState } from "react";
import { Student } from "../types";
import Link from "next/link";

interface StudentTableProps {
  students: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-md bg-white dark:bg-gray-800">
      <div className="w-full overflow-x-auto p-4">
        {/* Top bar: Search + Add Student */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full sm:w-[50%] px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link href="/admin-portal/student/add_student">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
              Add Student
            </button>
          </Link>
        </div>

        <table className="w-full whitespace-nowrap rounded-lg">
          <thead>
            <tr className="text-sm font-semibold text-blue-600 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-blue-400">
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Progress</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg"
              >
                {/* Student Name & Avatar */}
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    {/* <div className="relative w-8 h-8 mr-3 rounded-full overflow-hidden">
                      <Image
                        src={student.avatar || "/placeholder.png"}
                        alt={student.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    </div> */}
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-300">
                        {student.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-blue-700 dark:text-blue-400 text-sm">
                  {student.email}
                </td>

                {/* Progress */}
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full dark:bg-blue-700 dark:text-blue-100">
                    {student.progress}%
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <Link
                    href={`/admin-portal/student/${student.id}`}
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
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

export default StudentTable;
