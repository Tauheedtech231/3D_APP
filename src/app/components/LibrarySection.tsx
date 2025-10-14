'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Online library images from Unsplash
const LIBRARY_IMAGES = [
  "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
];

function MultiViewLibraryImage({ textureUrl = '/images/library.jpg', planeWidth = 10, planeHeight = 6 }) {
  const texture = useTexture(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  /* eslint-disable */


  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Hover animation
  const [isHovered, setIsHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const t = state.clock.elapsedTime;
    
    // Gentle floating animation
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.01;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.02;
    
    // Enhanced hover effects
    if (isHovered) {
      meshRef.current.rotation.x = -0.1 + Math.sin(t * 0.8) * 0.02;
      meshRef.current.rotation.y = Math.sin(t * 0.4) * 0.03;
      materialRef.current.emissiveIntensity = 0.1;
    } else {
      meshRef.current.rotation.x = -0.12;
      meshRef.current.rotation.y = 0;
      materialRef.current.emissiveIntensity = 0.02;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-0.12, 0, 0]} 
      position={[0, -0.1, 0]}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial 
        ref={materialRef}
        map={texture} 
        toneMapped 
        emissive="#ffffff"
        emissiveIntensity={0.02}
      />
    </mesh>
  );
}

function EnhancedOrbitControls() {
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableRotate = true;
      controlsRef.current.enableZoom = true;
      controlsRef.current.enablePan = true;
      controlsRef.current.rotateSpeed = 0.4;
      controlsRef.current.zoomSpeed = 0.8;
      controlsRef.current.panSpeed = 0.5;
      controlsRef.current.minDistance = 3;
      controlsRef.current.maxDistance = 20;
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI;
    }
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      autoRotate={false}
      autoRotateSpeed={1}
    />
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.3} 
        color="#4f46e5"
      />
      <pointLight 
        position={[0, 3, 3]} 
        intensity={0.5} 
        color="#38bdf8"
        distance={10}
      />
    </>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const count = 50;
  
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 4;
      
      matrix.setPosition(x, y, z);
      particlesRef.current.setMatrixAt(i, matrix);
      
      color.setHSL(Math.random() * 0.1 + 0.5, 0.7, 0.6);
      particlesRef.current.setColorAt(i, color);
    }
    
    particlesRef.current.instanceMatrix.needsUpdate = true;
    if (particlesRef.current.instanceColor) {
      particlesRef.current.instanceColor.needsUpdate = true;
    }
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    particlesRef.current.rotation.y = time * 0.05;
    particlesRef.current.position.y = Math.sin(time * 0.3) * 0.1;
  });

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 2, 8);
  }, [camera]);
  return null;
}

function AutoPlayVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className="w-full h-full object-cover rounded-xl"
      controls
      playsInline
      muted
      preload="metadata"
    />
  );
}

// Online image URL for the card background
const CARD_BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

export default function LibrarySection() {
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % LIBRARY_IMAGES.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + LIBRARY_IMAGES.length) % LIBRARY_IMAGES.length);
  };

  // Auto-rotate images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const imageTitles = [
    "Main Reading Hall",
    "Study Zone & Computers", 
    "Book Collections",
    "Digital Resources"
  ];

  return (
    <section className="relative py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-[#0a1426] dark:via-[#071025] dark:to-[#0f172a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Explore Our{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
              Library
            </span>
          </h2>
        </motion.div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left: 3D Canvas Section */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              className="h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-700/50 relative group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              onMouseEnter={() => setIsHoveringCanvas(true)}
              onMouseLeave={() => setIsHoveringCanvas(false)}
            >
              {/* Interactive Hover Overlay */}
              <div className={`absolute inset-0 pointer-events-none z-10 transition-all duration-300 ${
                isHoveringCanvas 
                  ? 'bg-gradient-to-t from-black/10 to-transparent' 
                  : 'bg-gradient-to-t from-black/5 to-transparent'
              }`} />
              
              {/* Hover Instructions */}
              <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs sm:text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                isHoveringCanvas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                🖱️ Scroll to zoom • Drag to rotate • Right-click to pan
              </div>

              {/* Image Navigation */}
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                  {currentImageIndex + 1} / {LIBRARY_IMAGES.length}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <Canvas 
                camera={{ position: [0, 2, 8], fov: 50 }} 
                dpr={[1, 2]}
                className="cursor-grab active:cursor-grabbing"
              >
                <SceneLights />
                <Suspense fallback={null}>
                  <MultiViewLibraryImage 
                    textureUrl={LIBRARY_IMAGES[currentImageIndex]} 
                    planeWidth={10} 
                    planeHeight={6} 
                  />
                  <FloatingParticles />
                </Suspense>
                <EnhancedOrbitControls />
                <CameraController />
              </Canvas>
            </motion.div>

            {/* Image Title */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {imageTitles[currentImageIndex]}
              </h3>
              <div className="flex justify-center space-x-2 mt-2">
                {LIBRARY_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-blue-600 scale-125'
                        : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Content Section */}
          <div className="flex flex-col w-full lg:w-1/2 gap-6">
            {/* Video Card */}
            <motion.div 
              className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/30 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="aspect-video">
                <AutoPlayVideo src="/videos/library-tour.mp4" />
              </div>
            </motion.div>

            {/* Info Card with Background Image */}
            <motion.div 
              className="relative p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/40 dark:border-slate-700/40 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${CARD_BACKGROUND_IMAGE})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Dark mode overlay */}
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 -z-10" />
              
              <div className="relative z-10">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Library Experience
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 text-center leading-relaxed mb-4 sm:mb-6">
                  Discover our state-of-the-art library featuring modern architecture, 
                  extensive collections, and peaceful study environments designed for 
                  optimal learning and research.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-700/30 rounded-lg backdrop-blur-sm">
                    <div className="text-blue-600 dark:text-blue-400 text-sm sm:text-base font-semibold">10,000+</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Books</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-700/30 rounded-lg backdrop-blur-sm">
                    <div className="text-purple-600 dark:text-purple-400 text-sm sm:text-base font-semibold">24/7</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Digital Access</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-700/30 rounded-lg backdrop-blur-sm">
                    <div className="text-green-600 dark:text-green-400 text-sm sm:text-base font-semibold">50+</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Study Rooms</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-700/30 rounded-lg backdrop-blur-sm">
                    <div className="text-orange-600 dark:text-orange-400 text-sm sm:text-base font-semibold">Free</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">WiFi</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic">
                    A world of knowledge awaits in our modern learning space
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
    </section>
  );
}