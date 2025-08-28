"use client";

import React, { useState } from "react";
import { Instructor } from "../types";
import Link from "next/link";

interface InstructorTableProps {
  instructors: Instructor[];
}

const InstructorTable: React.FC<InstructorTableProps> = ({ instructors }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-900">
      {/* Top bar: Search + Add Instructor */}
      <div className="w-full p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search instructors..."
          className="w-full sm:w-1/2 px-3 py-2 text-sm rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-blue-200 dark:placeholder-blue-400 transition-colors duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/admin-portal/instructor/add_instructor">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200">
            Add Instructor
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] whitespace-nowrap rounded-lg">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-blue-600 uppercase border-b dark:border-gray-700 dark:text-blue-300 bg-gray-50 dark:bg-gray-900">
              <th className="px-3 py-2">Instructor</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Bio</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredInstructors.map((instructor) => (
              <tr
                key={instructor.id}
                className="text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="px-3 py-2 text-sm">
                  <div className="flex items-center">
                    {/* <div className="relative w-8 h-8 mr-2 rounded-full overflow-hidden md:block">
                      <Image
                        src={instructor.avatar || "/placeholder.png"}
                        alt={instructor.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    </div> */}
                    <p className="font-medium text-sm">{instructor.name}</p>
                  </div>
                </td>
                <td className="px-3 py-2 text-sm">{instructor.email}</td>
                <td className="px-3 py-2 text-sm">{instructor.bio}</td>
                
                <td className="px-3 py-2 text-sm">
                  <Link href={`/admin-portal/instructor/${instructor.id}`}>
                    <button className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200">
                      View
                    </button>
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

export default InstructorTable;
