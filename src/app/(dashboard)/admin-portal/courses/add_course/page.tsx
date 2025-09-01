"use client";

import React, { useState, useEffect } from "react";
import { Course } from "../../types";
import { useRouter } from "next/navigation";
export interface Instructor {
  id: number;    // Database me instructor ka primary key
  name: string;  // Instructor ka full name
}


// your instructors storage key

interface ModuleForm {
  id: string;
  title: string;
  content: string;
}

const AddCourseForm: React.FC = () => {
  const [courseData, setCourseData] = useState<Omit<Course, "id">>({
    title: "",
    description: "",
    instructor: null,
    duration: 0,
    enrollmentCount: 0,
    modules: [],
  });
  const router = useRouter();

  const [modules, setModules] = useState<ModuleForm[]>([
    { id: Date.now().toString(), title: "", content: "" },
  ]);

  const [instructors, setInstructors] = useState<Instructor[]>([]);

  // Fetch instructors from database
  useEffect(() => {
  const fetchInstructors = async () => {
    try {
      const res = await fetch("http://31.97.49.20/api/instructors");
      const data: { id: number; name: string }[] = await res.json();
      setInstructors(data);
    } catch (err) {
      console.error("Failed to fetch instructors:", err);
    }
  };

  fetchInstructors();
}, []);



  const handleCourseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]:
        name === "duration" || name === "enrollmentCount"
          ? Number(value)
          : value,
    });
  };

  const handleModuleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newModules = [...modules];
    newModules[index][name as keyof ModuleForm] = value;
    setModules(newModules);
  };

  const addModule = () => {
    setModules([...modules, { id: Date.now().toString(), title: "", content: "" }]);
  };

  const removeModule = (index: number) => {
    if (modules.length === 1) return;
    const newModules = [...modules];
    newModules.splice(index, 1);
    setModules(newModules);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://31.97.49.20/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: courseData.title,
        description: courseData.description,
        instructor_id: Number(courseData.instructor), // make sure instructor id is sent
        duration: courseData.duration,
        enrollment_count: courseData.enrollmentCount,
        modules: modules.map((mod) => ({ title: mod.title, content: mod.content })),
      }),
    });

    if (res.ok) {
      alert("Course added successfully!");
      setCourseData({ title: "", description: "", instructor: null, duration: 0, enrollmentCount: 0, modules: [] });
      setModules([{ id: Date.now().toString(), title: "", content: "" }]);
      router.push("/admin-portal/courses");
    } else {
      const data = await res.json();
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 rounded-lg dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
          Add Course
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-sm text-blue-700 dark:text-blue-300"
        >
          {/* Course Fields */}
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleCourseChange}
            placeholder="Course Title"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-blue-300"
            required
          />
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleCourseChange}
            placeholder="Course Description"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-blue-300"
            required
          />

          {/* Instructor Dropdown */}
        <select
  name="instructor"
  value={courseData.instructor?.id ?? " " }
  onChange={handleCourseChange}
  className="
    w-full p-2 border rounded
    border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-700
    text-gray-900 dark:text-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
  "
  required
>
  <option value="" disabled>
    Select Instructor
  </option>
  {instructors.map((inst) => (
    <option key={inst.id} value={inst.id}>
      {inst.name}
    </option>
  ))}
</select>


          <input
            type="number"
            name="duration"
            value={courseData.duration}
            onChange={handleCourseChange}
            placeholder="Duration (hours)"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-blue-300"
            required
          />
          <input
            type="number"
            name="enrollmentCount"
            value={courseData.enrollmentCount}
            onChange={handleCourseChange}
            placeholder="Enrollment Count"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-blue-300"
            required
          />

          {/* Modules */}
          <div className="space-y-3">
            <h3 className="font-medium text-blue-600 dark:text-blue-400">Modules</h3>
            {modules.map((mod, idx) => (
              <div
                key={mod.id}
                className="border p-3 rounded border-gray-300 dark:border-gray-600 space-y-2"
              >
                <input
                  type="text"
                  name="title"
                  value={mod.title}
                  onChange={(e) => handleModuleChange(idx, e)}
                  placeholder={`Module ${idx + 1} Title`}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-blue-300"
                  required
                />
                <textarea
                  name="content"
                  value={mod.content}
                  onChange={(e) => handleModuleChange(idx, e)}
                  placeholder={`Module ${idx + 1} Content`}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-blue-300"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => removeModule(idx)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    disabled={modules.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addModule}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
            >
              + Add Module
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourseForm;
