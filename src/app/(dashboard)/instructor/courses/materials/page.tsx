"use client";
/* eslint-disable */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";

type Module = { id: number; name: string };
type Option = { id: number; name: string; modules?: Module[] };

export default function NewMaterialPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Option[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [instructors, setInstructors] = useState<Option[]>([]);
  const [step, setStep] = useState<1 | 2>(1); 
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [popupUrl, setPopupUrl] = useState(""); 
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState("");

  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch(`${API_BASE}/courses`);
        const res2 = await fetch(`${API_BASE}/instructors`);
        if (!res1.ok || !res2.ok) throw new Error("Failed to fetch dropdowns");
        const coursesData = await res1.json();
        setCourses(coursesData);
        setInstructors(await res2.json());
      } catch (err) {
        console.error("Dropdown error:", err);
        setMsg("❌ Failed to load dropdowns");
      }
    };
    fetchData();
  }, []);

  // When course changes, update modules from selected course
  useEffect(() => {
    const selectedCourse = courses.find(c => c.id.toString() === courseId);
    setModules(selectedCourse?.modules || []);
    setModuleId(""); // reset module selection
  }, [courseId, courses]);

  // Step 1 → Upload Video
  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMsg("❌ Please choose a video file");
    setLoading(true);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "my_preset");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dfp9qc0gu/video/upload`,
        { method: "POST", body: fd }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");

      setFileUrl(data.secure_url);
      setPopupUrl(data.secure_url);
      setFileSize((data.bytes / 1024 / 1024).toFixed(2) as unknown as number); // MB
    } catch (err: any) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Step 1 → Upload Banner
  const handleBannerUpload = async () => {
    if (!bannerFile) return alert("Select a banner image");
    setLoading(true);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.append("file", bannerFile);
      fd.append("upload_preset", "my_preset");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfp9qc0gu/image/upload",
        { method: "POST", body: fd }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      setBannerUrl(data.secure_url);
      alert("✅ Banner uploaded!");
    } catch (err: any) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(popupUrl);
    setStep(2);
  };

  // Step 2 → Save metadata
  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const payload = {
        course_id: courseId,
        module_id: moduleId,
        instructor_id: instructorId,
        title,
        type: "video",
        video_url: fileUrl,
        file_size: fileSize,
        banner_url: bannerUrl,
      };

      const res = await fetch(`${API_BASE}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save material");

      setMsg("✅ Material saved successfully");

      setStep(1);
      setFile(null);
      setFileUrl("");
      setTitle("");
      setCourseId("");
      setModuleId("");
      setInstructorId("");
      setPopupUrl("");
      setFileSize(null);
      setBannerFile(null);
      setBannerUrl("");

      router.push("/instructor/courses");
    } catch (err: any) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0b0f16] dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Add Course Material</h1>

        {/* Step 1 → Upload Video */}
        {step === 1 && !popupUrl && (
          <form onSubmit={handleVideoUpload} className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl shadow">
            <label className="block space-y-2">
              <span className="text-sm">Choose video</span>
              <input
                type="file"
                onChange={e => setFile(e.target.files?.[0] || null)}
                accept="video/*"
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 dark:file:bg-gray-800 file:text-gray-900 dark:file:text-gray-100"
              />
              {file && <p className="text-xs opacity-80">{file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
            </label>

            <label className="block space-y-2">
              <span className="text-sm">Course Banner (optional)</span>
              <input
                type="file"
                onChange={e => setBannerFile(e.target.files?.[0] || null)}
                accept="image/*"
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 dark:file:bg-gray-800 file:text-gray-900 dark:file:text-gray-100"
              />
              <button
                type="button"
                onClick={handleBannerUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
                Upload Banner
              </button>
            </label>

            <button disabled={loading} className="w-full py-2 rounded-xl bg-blue-600 text-white">
              {loading ? "Uploading…" : "Upload Video"}
            </button>
            {msg && <div className="text-sm">{msg}</div>}
          </form>
        )}

        {/* Popup after upload */}
        {popupUrl && step === 1 && (
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl shadow space-y-3 text-center">
            <p className="text-sm break-words">{popupUrl}</p>
            <button
              onClick={handleCopyUrl}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl"
            >
              <Copy size={16} /> Copy URL & Next
            </button>
          </div>
        )}

        {/* Step 2 → Metadata Form */}
        {step === 2 && (
          <form onSubmit={handleSaveMetadata} className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-sm">Course</span>
                <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700" required>
                  <option value="">Select course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm">Module</span>
                <select value={moduleId} onChange={e => setModuleId(e.target.value)} className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700" required>
                  <option value="">Select module</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.id} - {m.name}</option>)}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm">Instructor</span>
                <select value={instructorId} onChange={e => setInstructorId(e.target.value)} className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700" required>
                  <option value="">Select instructor</option>
                  {instructors.map(i => <option key={i.id} value={i.id}>{i.id} - {i.name}</option>)}
                </select>
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-sm">Title</span>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700" required />
            </label>

            <label className="block space-y-1">
              <span className="text-sm">Video URL</span>
              <input type="text" value={fileUrl} readOnly className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 border" />
            </label>

            <button disabled={loading} className="w-full py-2 rounded-xl bg-blue-600 text-white">
              {loading ? "Saving…" : "Save Material"}
            </button>
            {msg && <div className="text-sm">{msg}</div>}
          </form>
        )}
      </div>
    </div>
  );
}
