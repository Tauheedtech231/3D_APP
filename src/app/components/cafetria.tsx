'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CollegeEvent = {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category?: string;
};

const collegeEvents: CollegeEvent[] = [
  {
    id: 1,
    title: "Annual Tech Fest 2024 🚀",
    description: "Join us for the biggest technology festival of the year featuring coding competitions, robotics workshops, and AI demonstrations.",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80",
    date: "Nov 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "Main Auditorium",
    category: "Technology"
  },
  {
    id: 2,
    title: "Cultural Night Extravaganza 🎭",
    description: "Experience an evening of music, dance, and drama performances by our talented students. Food stalls and games included!",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    date: "Nov 20, 2024",
    time: "6:00 PM - 10:00 PM",
    location: "College Ground",
    category: "Cultural"
  },
  {
    id: 3,
    title: "Sports Tournament Finals 🏆",
    description: "Witness the championship matches of our annual sports tournament featuring cricket, football, and basketball finals.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    date: "Nov 25, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Sports Complex",
    category: "Sports"
  },
];

export default function EventsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % collegeEvents.length);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPaused, collegeEvents.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % collegeEvents.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + collegeEvents.length) % collegeEvents.length);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const currentEvent = collegeEvents[currentIndex];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/20 overflow-hidden relative z-10"> {/* Added relative z-10 */}
      {/* Header with Indigo to Pink Gradient */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            College Events
          </span>
        </h2>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Stay updated with exciting events happening across our campus
        </p>
      </motion.div>

      {/* Slider Container */}
      <div 
        className="relative max-w-4xl mx-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200 dark:border-slate-600"
          aria-label="Previous event"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200 dark:border-slate-600"
          aria-label="Next event"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Main Slider Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEvent.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer group"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden hover:shadow-2xl md:hover:shadow-3xl transition-all duration-500 border border-slate-200 dark:border-slate-700/30">
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-1/2 relative overflow-hidden">
                  <img 
                    src={currentEvent.image} 
                    alt={currentEvent.title}
                    className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <span className="px-3 py-1 md:px-4 md:py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 text-xs md:text-sm font-semibold rounded-full shadow-lg">
                      {currentEvent.category}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                    <div className="text-white">
                      <div className="text-xl md:text-2xl font-bold">{currentEvent.date.split(' ')[1]}</div>
                      <div className="text-xs md:text-sm opacity-90">{currentEvent.date.split(' ')[0]} {currentEvent.date.split(' ')[2]}</div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  <motion.h3 
                    className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentEvent.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-slate-600 dark:text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base lg:text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentEvent.description}
                  </motion.p>

                  {/* Event Details */}
                  <motion.div 
                    className="space-y-2 md:space-y-3 mb-6 md:mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center text-slate-700 dark:text-slate-300 text-sm md:text-base">
                      <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{currentEvent.time}</span>
                    </div>
                    <div className="flex items-center text-slate-700 dark:text-slate-300 text-sm md:text-base">
                      <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{currentEvent.location}</span>
                    </div>
                  </motion.div>

                  {/* Event Counter */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                      {currentIndex + 1} / {collegeEvents.length}
                    </div>
                    <div className="flex space-x-1 md:space-x-2">
                      {collegeEvents.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? 'bg-gradient-to-r from-indigo-500 to-pink-500 scale-125'
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mt-6 md:mt-8 relative">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 md:h-2">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-1 md:h-2 rounded-full"
              key={currentIndex}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Background Decorations - FIXED: No fixed positioning */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/20 dark:bg-pink-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
    </section>
  );
}