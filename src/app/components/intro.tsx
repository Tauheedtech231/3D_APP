'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Simplified Loader
const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center">
      <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      <div className="text-gray-600 text-sm">Loading...</div>
    </div>
  </Html>
);

// Optimized Sphere Component
const Sphere360: React.FC<{ textureUrl: string }> = ({ textureUrl }) => {
  const texture = useTexture(textureUrl);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

// Simplified Section Wrapper - removed GSAP animation
const SectionWrapper: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ 
  id, 
  children, 
  className = "" 
}) => {
  return (
    <section id={id} className={`w-full min-h-screen flex items-center justify-center p-4 ${className}`}>
      {children}
    </section>
  );
};

// Explore Button Component with routing
const ExploreButton: React.FC<{ 
  targetId?: string; 
  href?: string;
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' 
}> = ({ 
  targetId, 
  href,
  children, 
  variant = 'primary' 
}) => {
  const handleClick = () => {
    if (href) {
      // Redirect to external route
      window.location.href = href;
    } else if (targetId) {
      // Internal scroll
      const element = document.getElementById(targetId);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const baseStyles = "px-6 py-3 rounded-full font-semibold text-base shadow-lg transition-all duration-200";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
    secondary: "border-2 border-white text-white hover:bg-white hover:text-gray-900"
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

// Visit Button Component for specific routes
const VisitButton: React.FC<{ 
  href: string;
  children: React.ReactNode; 
}> = ({ 
  href,
  children
}) => {
  const handleClick = () => {
    window.location.href = href;
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-3 rounded-full font-semibold text-base shadow-lg transition-all duration-200 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
    >
      {children}
    </button>
  );
};

// Simplified Navbar
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['hero', 'main-building', 'labs', 'ground', 'library'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'main-building', name: 'Main Building' },
    { id: 'labs', name: 'Labs' },
    { id: 'ground', name: 'Sports' },
    { id: 'library', name: 'Library' }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800 cursor-pointer" onClick={() => scrollToSection('hero')}>
          Aspire<span className="text-blue-600">College</span>
        </div>
        
        <div className="hidden md:flex space-x-1 bg-white/80 rounded-xl px-3 py-1 shadow-md">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                activeSection === sec.id 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>

        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition-colors duration-200">
          Book Tour
        </button>
      </div>
    </nav>
  );
};

// Optimized Footer
const Footer: React.FC = () => (
  <footer className="w-full py-12 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="text-left">
          <h3 className="text-xl font-bold mb-3">Aspire College</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Shaping futures through innovative education and state-of-the-art facilities.
          </p>
        </div>
        
        <div className="text-left">
          <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2">
            {['hero', 'main-building', 'labs', 'ground', 'library'].map((link) => (
              <li key={link}>
                <a 
                  href={`#${link}`} 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm block py-1"
                >
                  {link.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-left">
          <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            {[
              { icon: '📍', text: '123 College Road' },
              { icon: '📧', text: 'contact@aspirecollege.edu' },
              { icon: '📞', text: '+1 (555) 123-4567' }
            ].map((item) => (
              <li key={item.text} className="flex items-center space-x-2">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-left">
          <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
          <div className="flex space-x-3">
            {['FB', 'TW', 'IG', 'IN'].map((social) => (
              <div 
                key={social}
                className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-blue-600 text-xs font-semibold"
              >
                {social}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Aspire College Virtual Tour. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Simplified NavCard
const NavCard: React.FC<{ title: string; description: string; image: string; targetId: string }> = ({ 
  title, description, image, targetId 
}) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:shadow-xl"
      onClick={() => scrollToSection(targetId)}
    >
      <div className="h-40 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{description}</p>
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-md transition-colors duration-200 flex items-center space-x-1">
          <span>Explore</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

// Quick Navigation Section
const QuickNavigation: React.FC = () => {
  const locations = [
    {
      title: "Main Building",
      description: "Modern classrooms and auditoriums",
      image: "/mainbui.jpg",
      targetId: "main-building"
    },
    {
      title: "Science Labs",
      description: "Practical learning and research",
      image: "/3dlabsh.jpg",
      targetId: "labs"
    },
    {
      title: "Sports Ground",
      description: "Sports and fitness facilities",
      image: "/ground_sports.jpg",
      targetId: "ground"
    },
    {
      title: "Library",
      description: "Academic research and study",
      image: "/images/360lib.jpg",
      targetId: "library"
    }
  ];

  return (
    <section id="quick-nav" className="w-full py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Explore Our Campus</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take a virtual tour of our state-of-the-art facilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <div key={location.title}>
              <NavCard {...location} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simplified Feature Card
const FeatureCard: React.FC<{ title: string; description: string; color: string }> = ({ 
  title, description, color 
}) => (
  <div className={`p-4 rounded-xl shadow-md transition-colors duration-200 ${color}`}>
    <h4 className="font-semibold text-sm mb-1">{title}</h4>
    <p className="text-xs opacity-80">{description}</p>
  </div>
);

// Main App Component
const VirtualTourPage: React.FC = () => {
  useEffect(() => {
    // Remove smooth scrolling for anchor links - use instant scroll instead
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute('href')!);
        if (target) {
          const yOffset = -80;
          const y = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }, []);

  return (
    <div className="relative overflow-hidden">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        /* Simplified scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 3px;
        }
      `}</style>

      <Navbar />

      {/* Optimized Hero Section */}
      <SectionWrapper id="hero" className="relative min-h-[90vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="text-center text-white z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to{' '}
            <span className="text-blue-300 block mt-2">
              Aspire College
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
            Experience our campus through immersive 360° virtual tours
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ExploreButton targetId="main-building">
              Start Virtual Tour
            </ExploreButton>
            
            <ExploreButton targetId="quick-nav" variant="secondary">
              Explore Facilities
            </ExploreButton>
          </div>

          <div className="mt-16 flex flex-col items-center space-y-2">
            <div className="text-blue-200 text-sm">Scroll to Discover</div>
            <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-blue-300 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      <QuickNavigation />

      {/* Main Building Section with Visit Button */}
      <SectionWrapper id="main-building" className="bg-white py-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Main Building</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The heart of our campus with modern classrooms and administrative offices
            </p>
          </div>
          
          <div className="w-full h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-xl border-2 border-white">
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <Suspense fallback={<Loader />}>
                <Sphere360 textureUrl="/mainbui.jpg" />
              </Suspense>
              <OrbitControls 
                enableZoom 
                enablePan 
                enableRotate 
                zoomSpeed={0.5} 
                rotateSpeed={0.4}
                minDistance={3}
                maxDistance={10}
              />
            </Canvas>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-500 mb-4 text-sm">Click and drag to explore • Scroll to zoom</p>
            <div className="flex gap-4 justify-center">
              <ExploreButton targetId="labs">
                Next: Science Labs →
              </ExploreButton>
              <VisitButton href="/academic-block">
                Explore Academic Block
              </VisitButton>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Labs Section with Visit Button */}
      <SectionWrapper id="labs" className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Advanced Laboratories</h2>
                <p className="text-gray-700 leading-relaxed">
                  State-of-the-art laboratories equipped with cutting-edge technology for hands-on learning and research.
                </p>
                <div className="space-y-2">
                  {[
                    "Computer Science & Robotics Lab",
                    "Chemistry & Biochemistry Labs", 
                    "Physics Research Laboratory",
                    "Biotechnology Center"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-3 p-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <ExploreButton targetId="ground">
                    Next: Sports Ground →
                  </ExploreButton>
                  <VisitButton href="/laboratory">
                    Visit Laboratory
                  </VisitButton>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
              <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <Suspense fallback={<Loader />}>
                  <Sphere360 textureUrl="/3dlabsh.jpg" />
                </Suspense>
                <OrbitControls 
                  enableZoom 
                  enablePan 
                  enableRotate 
                  zoomSpeed={0.5} 
                  rotateSpeed={0.4}
                  minDistance={3}
                  maxDistance={10}
                />
              </Canvas>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Ground Section with Visit Button */}
      <SectionWrapper id="ground" className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="max-w-6xl mx-auto w-full text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Sports & Recreation</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Expansive sports facilities promoting physical wellness and athletic excellence
            </p>
          </div>
          
          <div className="w-full h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-xl border-2 border-white mb-8">
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <Suspense fallback={<Loader />}>
                <Sphere360 textureUrl="/ground_sports.jpg" />
              </Suspense>
              <OrbitControls 
                enableZoom 
                enablePan 
                enableRotate 
                zoomSpeed={0.5} 
                rotateSpeed={0.4}
                minDistance={3}
                maxDistance={10}
              />
            </Canvas>
          </div>
          
          <div className="flex gap-4 justify-center">
            <ExploreButton targetId="library">
              Next: Learning Center →
            </ExploreButton>
            <VisitButton href="/sports-complex">
              Visit Sports Complex
            </VisitButton>
          </div>
        </div>
      </SectionWrapper>

      {/* Adjusted Learning Center (Library) Section with Visit Button */}
      <SectionWrapper id="library" className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Learning & Innovation Center</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Interactive library with extensive digital resources, study areas, and collaborative spaces
            </p>
          </div>

          <div className="w-full h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-xl border-2 border-white mb-12">
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <Suspense fallback={<Loader />}>
                <Sphere360 textureUrl="/images/360lib.jpg" />
              </Suspense>
              <OrbitControls 
                enableZoom 
                enablePan 
                enableRotate 
                zoomSpeed={0.5} 
                rotateSpeed={0.4}
                minDistance={3}
                maxDistance={10}
              />
            </Canvas>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Facilities & Resources</h3>
              <div className="grid grid-cols-2 gap-4">
                <FeatureCard 
                  title="100,000+ Books" 
                  description="Physical and digital collection"
                  color="bg-blue-50 text-blue-800"
                />
                <FeatureCard 
                  title="24/7 Access" 
                  description="Digital resources anytime"
                  color="bg-green-50 text-green-800"
                />
                <FeatureCard 
                  title="Study Rooms" 
                  description="Group collaboration spaces"
                  color="bg-purple-50 text-purple-800"
                />
                <FeatureCard 
                  title="Research Help" 
                  description="Expert librarian support"
                  color="bg-orange-50 text-orange-800"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Services</h3>
              <div className="space-y-3">
                {[
                  "Digital resource access 24/7",
                  "Research assistance and workshops", 
                  "Group study room bookings",
                  "Inter-library loan services",
                  "Academic database access",
                  "Printing and scanning facilities"
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-3 p-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="flex gap-4 justify-center">
              <ExploreButton targetId="hero">
                Back to Top
              </ExploreButton>
              <VisitButton href="/library">
                Explore Library
              </VisitButton>
              <button className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-colors duration-200 shadow-md">
                Contact Admissions
              </button>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default VirtualTourPage;