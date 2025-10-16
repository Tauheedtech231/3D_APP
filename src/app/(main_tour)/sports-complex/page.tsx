'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import { motion } from 'framer-motion';

// Inside your component



// 🌐 360° Ground Image Component
function GroundPlane({ textureUrl = '/ground_sports.jpg' }) {
  const texture = useTexture(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
 

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = Math.sin(t * 0.2) * 0.01;
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Orbit Controls
function EnhancedOrbitControls() {
  /* eslint-disable */

 
  const controlsRef = useRef<any>(null);
  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />;
}

// Lights
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />
    </>
  );
}

// Loader
function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">Loading Ground Map...</p>
      </div>
    </div>
  );
}

// ✅ Main Ground Section with Video Exit
export default function GroundSection() {
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="py-16 bg-white dark:bg-[#010a1a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: 360° Image / Video */}
          <div className="w-full h-[70vh] lg:h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-700">
            {!canvasLoaded && !showVideo && <CanvasLoader />}

            {!showVideo ? (
              <Canvas
                camera={{ position: [0, 0, 10], fov: 70 }}
                dpr={[1, 2]}
                className="cursor-grab active:cursor-grabbing"
                onCreated={() => setCanvasLoaded(true)}
              >
                <SceneLights />
                <Suspense fallback={null}>
                  <GroundPlane textureUrl="/ground_sports.jpg" />
                </Suspense>
                <EnhancedOrbitControls />
              </Canvas>
            ) : (
              <div className="w-full h-full relative">
                <video
                  src="/videos/ground-tour.mp4"
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted={false}
                  playsInline
                />
                {/* Exit Button */}
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gray-800 text-white font-semibold shadow-lg hover:bg-gray-700 transition"
                >
                  ✕ Exit Video
                </button>
              </div>
            )}
          </div>

          {/* Right: Content + Buttons */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white">About the Ground</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                The campus grounds feature lush green gardens, a modern sports complex, and open spaces that encourage learning and recreation. Explore each area interactively.
              </p>

              <div className="mt-4 flex space-x-4">
                {/* Watch Video */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVideo(true)}
                  className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg text-lg"
                >
                  ▶ Watch Video
                </motion.button>

              <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => window.location.href = '/'} // Redirect to home using window
  className="flex-1 px-6 py-3 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold shadow-lg text-lg"
>
  ← Back Home
</motion.button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
