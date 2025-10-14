'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import LibrarySection from '../components/LibrarySection';
import GroundSection from '../components/ground';
import LabsSection from '../components/labs';
import CafeteriaBlog from '../components/cafetria';

type Section = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  component: React.ReactNode;
};

export default function Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section definitions
  const sections: Section[] = [
    {
      id: 'library',
      title: 'Digital Library',
      description: 'Interactive 3D map with extensive book collections and modern study zones',
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      component: <LibrarySection />
    },
    {
      id: 'ground',
      title: 'Campus Ground',
      description: 'Immersive virtual tour of our beautiful gardens and sports facilities',
      icon: '🏛️',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      component: <GroundSection />
    },
    {
      id: 'labs',
      title: 'Science Labs',
      description: 'State-of-the-art laboratories with cutting-edge research equipment',
      icon: '🔬',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      component: <LabsSection />
    }
  ];

  useEffect(() => {
    // GSAP entrance animations
    if (textRef.current) {
      gsap.fromTo(textRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
    }
  }, []);

  const openSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowMenu(false);
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 100);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      {/* Professional Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-2xl border-b border-gray-200 dark:border-gray-700' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => { setActiveSection(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm md:text-lg">AC</span>
              </div>
              <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
              }`}>
                Aspire<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">College</span>
              </span>
            </motion.div>

            {/* Navigation Menu */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className={`px-4 py-2 md:px-6 md:py-2 rounded-full font-semibold transition-all duration-300 text-sm md:text-base ${
                  scrolled
                    ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                {isMobile ? 'Menu' : 'Explore Facilities'}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 -z-10">
          <video
            className="h-full w-full object-cover"
            src="/videos/Main.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 pt-16">
          <motion.div 
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-2xl mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Welcome to{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">
                Aspire College
              </span>
            </motion.h1>

            <motion.p 
              className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Premier Education. Exceptional Facilities. Unlimited Opportunities.
              <span className="block mt-2 sm:mt-4 text-indigo-200 font-semibold text-base sm:text-lg">
                Experience our campus through immersive virtual tours
              </span>
            </motion.p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center text-white/80"
            >
              <span className="text-sm mb-2 font-medium">Scroll to Explore</span>
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <motion.div 
                  className="w-1 h-3 bg-white rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Facilities Menu Modal - Z-INDEX FIXED */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4" // Increased z-index
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setShowMenu(false)}
            />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden z-[101]" // Increased z-index
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    Campus <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Facilities</span>
                  </motion.h2>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMenu(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {sections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ 
                        scale: isMobile ? 1.02 : 1.05,
                        y: isMobile ? 0 : -5,
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openSection(section.id)}
                      className="group cursor-pointer"
                    >
                      <div className={`${section.gradient} rounded-2xl p-6 text-white text-center shadow-lg group-hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between min-h-[180px] md:min-h-[200px]`}>
                        <div>
                          <motion.div 
                            className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300"
                          >
                            {section.icon}
                          </motion.div>
                          <h3 className="text-xl font-bold mb-3">{section.title}</h3>
                          <p className="text-white/90 text-sm leading-relaxed">{section.description}</p>
                        </div>
                        <motion.div 
                          className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        >
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm text-sm">
                            <span className="font-semibold">Explore</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 md:mt-8 text-center"
                >
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Select a facility to explore in detail
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Section Display */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 relative z-10" // Added z-10
          >
            {/* Simple Section Header */}
            <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-16">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                    {sections.find(s => s.id === activeSection)?.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="py-8"
            >
              {sections.find(s => s.id === activeSection)?.component}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CafeteriaBlog with proper z-index */}
       {/* Added wrapper with z-index */}
       
<div className="relative z-10"> {/* Lower z-index than nav */}
  <CafeteriaBlog />
</div>
      

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* College Name with Gradient */}
          <div className="text-center sm:text-left">
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
              Aspire College
            </span>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <a 
              href="tel:+15551234567" 
              className="flex items-center gap-2 hover:text-indigo-400 transition-colors duration-300"
            >
              📞 +1 (555) 123-4567
            </a>
            <a 
              href="mailto:info@aspirecollege.edu" 
              className="flex items-center gap-2 hover:text-pink-400 transition-colors duration-300"
            >
              ✉️ info@aspirecollege.edu
            </a>
          </div>

          {/* Year */}
          <div className="text-sm text-gray-400 text-center sm:text-right">
            © {new Date().getFullYear()} Aspire College
          </div>
        </div>
      </footer>
    </>
  );
}