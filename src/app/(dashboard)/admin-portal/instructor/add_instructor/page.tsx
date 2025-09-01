"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const InstructorForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://31.97.49.20/api/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add instructor");
      }

      await response.json();
      router.push("/admin-portal/instructor");
    } catch (error) {
      console.error(error);
      alert("Error adding instructor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-white">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          Add Instructor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-400"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-400"
            required
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-400"
            required
          />

          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Avatar URL (optional)"
            className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Instructor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InstructorForm;
