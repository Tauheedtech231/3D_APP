'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Float, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function LabPlane({ textureUrl = '/images/labs_map.jpg', planeWidth = 10, planeHeight = 6 }) {
  const texture = useTexture(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;

  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Floating animation
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.01;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.02;
    
    // Enhanced hover effects
    if (isHovered) {
      meshRef.current.rotation.x = -0.18 + Math.sin(t * 0.8) * 0.02;
      meshRef.current.rotation.y = Math.sin(t * 0.4) * 0.03;
      materialRef.current.emissiveIntensity = 0.1;
    } else {
      meshRef.current.rotation.x = -0.2;
      meshRef.current.rotation.y = 0;
      materialRef.current.emissiveIntensity = 0.02;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-0.2, 0, 0]} 
      position={[0, -0.15, 0]}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial 
        ref={materialRef}
        map={texture} 
        roughness={0.5} 
        metalness={0.25}
        emissive="#ffffff"
        emissiveIntensity={0.02}
      />
    </mesh>
  );
}

function EnhancedOrbitControls() {
    /* eslint-disable */

  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableRotate = true;
      controlsRef.current.enableZoom = true;
      controlsRef.current.enablePan = true;
      controlsRef.current.rotateSpeed = 0.4;
      controlsRef.current.zoomSpeed = 0.8;
      controlsRef.current.panSpeed = 0.5;
      controlsRef.current.minDistance = 4;
      controlsRef.current.maxDistance = 20;
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI;
    }
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.07}
    />
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
    </>
  );
}

function AutoPlayVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (ref.current) {
            if (entry.isIntersecting) ref.current.play().catch(() => {});
            else ref.current.pause();
          }
        });
      },
      { threshold: 0.6 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      controls
      className="w-full h-full object-cover rounded-xl"
    />
  );
}

export default function LabsSection() {
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);

  return (
    <section className="relative py-16 bg-white dark:bg-[#010a1a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Explore Our <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Labs</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Hands-on labs equipped with modern tools for science and AI — learn, experiment, and innovate.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left: 3D Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full h-[320px] sm:h-[380px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 relative"
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
            <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${
              isHoveringCanvas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              🖱️ Scroll to zoom • Drag to rotate
            </div>

            <Canvas 
              camera={{ position: [0, 3, 8], fov: 45 }} 
              dpr={[1, 2]}
              className="cursor-grab active:cursor-grabbing"
            >
              <SceneLights />
              <Suspense fallback={null}>
                <LabPlane textureUrl="/images/labs_map.jpg" />
              </Suspense>
              <Environment
                files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr"
                background
              />
              <EnhancedOrbitControls />
            </Canvas>
          </motion.div>

          {/* Right: Video + Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl bg-black/5 dark:bg-white/5">
              <div className="aspect-video">
                <AutoPlayVideo src="/videos/labs-tour.mp4" />
              </div>
            </div>

            <div className="p-5 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white">Inside Our Labs</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Aspire College Labs are equipped with modern computers, electronics kits, and AI research tools to help students explore, learn, and create in a practical environment.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong className="text-slate-900 dark:text-white">Facilities</strong>
                  <div className="text-slate-600 dark:text-slate-300 mt-1">Computers • IoT • Robotics</div>
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Timings</strong>
                  <div className="text-slate-600 dark:text-slate-300 mt-1">Mon–Sat: 8:00 – 18:00</div>
                </div>
              </div>

              {/* Additional mobile-friendly features */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">AI Research</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">Electronics</span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">Robotics</span>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">IoT Kits</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}