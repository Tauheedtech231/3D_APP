"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Play,
  FileText,
  Clock,
  BookOpen,
  Search,
  ArrowLeft,
  Eye,
  BarChart3
} from "lucide-react";

type Material = {
  id: number;
  title: string;
  file_url: string;
  type: string;
  file_size?: number;
  banner_url?: string;
  duration?: string;
  views?: number;
  upload_date?: string;
};

export default function ModulePage() {
  const params = useParams();
  const moduleId = params.id;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/module/${moduleId}`);
        if (!res.ok) throw new Error("Failed to fetch materials");

        const data: Material[] = await res.json();
        // Demo extra info
        const enhancedData = data.map((material, index) => ({
          ...material,
          duration: index % 3 === 0 ? "15:30" : index % 3 === 1 ? "22:45" : "08:15",
          views: Math.floor(Math.random() * 1000),
          upload_date: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 86400000
          ).toLocaleDateString(),
        }));
        setMaterials(enhancedData);
        if (enhancedData.length > 0) setSelectedMaterial(enhancedData[0]);
      } catch (err) {
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [moduleId]);

  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="animate-pulse max-w-7xl mx-auto">
          <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl h-96"></div>
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Materials Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This module doesn’t have any materials yet. Check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg md:text-xl font-bold">Module Content</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Banner */}
        {selectedMaterial?.banner_url && (
          <div className="relative h-40 md:h-52 w-full mb-6 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={selectedMaterial.banner_url}
              alt={selectedMaterial.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {selectedMaterial.title}
              </h2>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md w-full lg:w-1/4 transition-all`}
          >
            <div className="mb-4">
              <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" /> Materials
              </h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Material list */}
            <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {filteredMaterials.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedMaterial?.id === m.id
                      ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedMaterial(m)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        selectedMaterial?.id === m.id
                          ? "bg-blue-600"
                          : "bg-blue-100 dark:bg-blue-900/30"
                      }`}
                    >
                      {m.type === "video" ? (
                        <Play
                          className={`h-4 w-4 ${
                            selectedMaterial?.id === m.id
                              ? "text-white"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        />
                      ) : (
                        <FileText
                          className={`h-4 w-4 ${
                            selectedMaterial?.id === m.id
                              ? "text-white"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium text-sm truncate ${
                          selectedMaterial?.id === m.id
                            ? "text-blue-900 dark:text-blue-100"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {m.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {m.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {m.duration}
                          </span>
                        )}
                        {m.views !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {m.views}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Preview */}
          <main className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            {selectedMaterial ? (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedMaterial.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {selectedMaterial.upload_date && (
                      <span>Uploaded: {selectedMaterial.upload_date}</span>
                    )}
                    {selectedMaterial.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {selectedMaterial.duration}
                      </span>
                    )}
                    {selectedMaterial.views !== undefined && (
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" /> {selectedMaterial.views} views
                      </span>
                    )}
                    {selectedMaterial.file_size && (
                      <span>{selectedMaterial.file_size} MB</span>
                    )}
                  </div>
                </div>

                {selectedMaterial.type === "video" ? (
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                    <video
                      controls
                      className="w-full h-full"
                      poster={selectedMaterial.banner_url}
                    >
                      <source src={selectedMaterial.file_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    <FileText className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Document preview not available
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Select a Material
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Choose a material from the list to view its content
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
