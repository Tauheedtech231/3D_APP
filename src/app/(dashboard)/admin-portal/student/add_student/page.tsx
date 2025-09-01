"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface Course {
  id: number;
  title: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  progress: number;
  avatar?: string;
  enrolledCourses: number[]; // multiple courses
}

const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    email: "",
    progress: 0,
    avatar: "",
    enrolledCourses: [],
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  // Fetch courses from backend
useEffect(() => {
  fetch("http://31.97.49.20/api/courses")
    .then((res) => res.json())
    .then((data: Course[]) => setCourses(data))
    .catch((err) => console.error(err));
}, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, } = e.target;
    if (name === "progress") {
      setFormData({ ...formData, progress: Number(value) });
    } else if (name === "enrolledCourses") {
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => Number(option.value)
      );
      setFormData({ ...formData, enrolledCourses: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://31.97.49.20/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Student added successfully!");
        setFormData({ name: "", email: "", progress: 0, avatar: "", enrolledCourses: [] });
        router.push("/admin-portal/student");
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg text-white text-sm">
        <h2 className="text-lg font-semibold mb-4 text-blue-400">Add Student</h2>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border border-gray-700 rounded-2xl bg-gray-900 text-white placeholder-gray-400 text-sm"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-700 rounded-2xl bg-gray-900 text-white placeholder-gray-400 text-sm"
            required
          />
          <input
            type="number"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            placeholder="Progress (%)"
            className="w-full p-2 border border-gray-700 rounded-2xl bg-gray-900 text-white placeholder-gray-400 text-sm"
            min={0}
            max={100}
            required
          />
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Avatar URL (optional)"
            className="w-full p-2 border border-gray-700 rounded-2xl bg-gray-900 text-white placeholder-gray-400 text-sm"
          />
          {formData.avatar && (
            <div className="w-12 h-12 relative rounded-full overflow-hidden">
              <Image
                src={formData.avatar}
                alt={formData.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            </div>
          )}
          <select
            name="enrolledCourses"
            multiple
            value={formData.enrolledCourses.map(String)}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded-2xl bg-gray-900 text-white text-sm"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm transition-colors duration-200"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
