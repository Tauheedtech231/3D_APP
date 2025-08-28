"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { Search, Filter, Clock, BookOpen, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import InquiryForm from "./components/InquiryForm";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  fee: string;
  requirements: string;
  category: string;
  level: string;
  instructor: string;
  rating: number;
  students: number;
  image: string;
  awarding_body: string;
}

export default function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Mock courses data - in a real app, this would be fetched from an API
  const courses: Course[] = [
    {
      id: "1",
      title: "Web Development Bootcamp",
      description: "Comprehensive web development course covering HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and gain practical experience.",
      duration: "12 Weeks",
      fee: "$499",
      requirements: "Basic computer knowledge",
      category: "Development",
      level: "Beginner",
      instructor: "John Smith",
      rating: 4.8,
      students: 1250,
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      awarding_body: "Tech Certification Board"
    },
    {
      id: "2",
      title: "AI & Machine Learning",
      description: "Master the fundamentals of artificial intelligence and machine learning. Learn Python, data analysis, neural networks, and implement AI solutions.",
      duration: "16 Weeks",
      fee: "$799",
      requirements: "Python Basics",
      category: "Data Science",
      level: "Advanced",
      instructor: "Dr. Sarah Williams",
      rating: 4.9,
      students: 850,
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      awarding_body: "AI Institute"
    },
    {
      id: "3",
      title: "UI/UX Design",
      description: "Learn to create beautiful and functional user interfaces. Master design principles, wireframing, prototyping, and user research methods.",
      duration: "10 Weeks",
      fee: "$399",
      requirements: "Creativity & Design Tools",
      category: "Design",
      level: "Intermediate",
      instructor: "Emily Chen",
      rating: 4.7,
      students: 920,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      awarding_body: "Design Academy"
    },
    {
      id: "4",
      title: "Cloud Computing",
      description: "Comprehensive course on cloud infrastructure, services, and deployment. Learn AWS, Azure, and Google Cloud platforms with hands-on projects.",
      duration: "14 Weeks",
      fee: "$699",
      requirements: "Networking basics",
      category: "IT & Software",
      level: "Intermediate",
      instructor: "Michael Johnson",
      rating: 4.6,
      students: 750,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      awarding_body: "Cloud Certification Authority"
    },
    {
      id: "5",
      title: "Data Science",
      description: "Comprehensive data science program covering statistics, data analysis, visualization, and machine learning with Python and R.",
      duration: "18 Weeks",
      fee: "$899",
      requirements: "Statistics & Python",
      category: "Data Science",
      level: "Advanced",
      instructor: "Dr. Robert Lee",
      rating: 4.9,
      students: 680,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      awarding_body: "Data Science Institute"
    },
    {
      id: "6",
      title: "Mobile App Development",
      description: "Learn to build native mobile applications for iOS and Android using React Native. Create cross-platform apps with a single codebase.",
      duration: "12 Weeks",
      fee: "$599",
      requirements: "Basic programming knowledge",
      category: "Development",
      level: "Intermediate",
      instructor: "Jessica Brown",
      rating: 4.7,
      students: 920,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      awarding_body: "Mobile Development Association"
    },
  ];

  // Get unique categories and levels for filters
  const categories = [...new Set(courses.map(course => course.category))];
  const levels = [...new Set(courses.map(course => course.level))];

  // Filter courses based on search query and selected filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleInquiry = (course: Course) => {
    setSelectedCourse(course);
    setShowInquiryForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Course Catalog</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">Explore our wide range of courses designed to help you master new skills and advance your career.</p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              type="text" 
              placeholder="Search for courses..." 
              className="pl-10 py-6 text-gray-800 dark:text-white bg-white dark:bg-gray-800 border-0 rounded-lg shadow-lg" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Filter size={20} className="mr-2" /> Filters
              </h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">CATEGORY</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="all-categories" 
                      name="category" 
                      className="mr-2" 
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                    />
                    <label htmlFor="all-categories">All Categories</label>
                  </div>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input 
                        type="radio" 
                        id={category} 
                        name="category" 
                        className="mr-2" 
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                      />
                      <label htmlFor={category}>{category}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Level Filter */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">LEVEL</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="all-levels" 
                      name="level" 
                      className="mr-2" 
                      checked={selectedLevel === null}
                      onChange={() => setSelectedLevel(null)}
                    />
                    <label htmlFor="all-levels">All Levels</label>
                  </div>
                  {levels.map((level) => (
                    <div key={level} className="flex items-center">
                      <input 
                        type="radio" 
                        id={level} 
                        name="level" 
                        className="mr-2" 
                        checked={selectedLevel === level}
                        onChange={() => setSelectedLevel(level)}
                      />
                      <label htmlFor={level}>{level}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Grid */}
          <div className="w-full md:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{filteredCourses.length} Courses Available</h2>
            </div>
            
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image 
                        src={course.image} 
                        alt={course.title} 
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-blue-600 hover:bg-blue-700">{course.level}</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1 text-blue-600" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-1 text-blue-600" />
                          <span>{course.students} students</span>
                        </div>
                        <div className="flex items-center">
                          <Award size={16} className="mr-1 text-blue-600" />
                          <span>{course.awarding_body}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-600">{course.fee}</span>
                        <Button 
                          onClick={() => handleInquiry(course)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Inquiry Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedLevel(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Inquiry Form Modal */}
      {showInquiryForm && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Inquiry for {selectedCourse.title}</h2>
                <button 
                  onClick={() => setShowInquiryForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <InquiryForm course={selectedCourse} onClose={() => setShowInquiryForm(false)} />
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}