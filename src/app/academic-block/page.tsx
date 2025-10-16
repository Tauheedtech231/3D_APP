'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// 🌐 360° Main Building Image Component
function MainBuildingPlane({ textureUrl = '/mainbui.jpg' }) {
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

// 🕹️ Orbit Controls
function EnhancedOrbitControls() {
  /* eslint-disable */

  const controlsRef = useRef<any>(null);
  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />;
}

// 💡 Lights
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />
    </>
  );
}

// ⏳ Loader
function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-900 rounded-xl">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">Loading Main Building...</p>
      </div>
    </div>
  );
}

// ✅ Main Component
export default function MainBuildingImageWithVideo() {
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();

  return (
    <section className="py-16 bg-white dark:bg-[#010a1a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: 360° Canvas or Video */}
          <div className="w-full h-[70vh] lg:h-[80vh] rounded-3xl overflow-hidden shadow-2xl relative bg-black">
            {!showVideo && (
              <>
                {!canvasLoaded && <CanvasLoader />}
                <Canvas
                  camera={{ position: [0, 0, 10], fov: 70 }}
                  dpr={[1, 2]}
                  className="cursor-grab active:cursor-grabbing"
                  onCreated={() => setCanvasLoaded(true)}
                >
                  <SceneLights />
                  <Suspense fallback={null}>
                    <MainBuildingPlane textureUrl="/mainbui.jpg" />
                  </Suspense>
                  <EnhancedOrbitControls />
                </Canvas>
              </>
            )}

            {/* Video Overlay */}
            {showVideo && (
              <div className="w-full h-full relative">
                <video
                  src="/videos/Main.mp4"
                  autoPlay
                  controls
                  className="w-full h-full object-cover rounded-3xl"
                />
                <motion.button
                  onClick={() => setShowVideo(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-4 right-4 bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center border border-white/40 shadow-md hover:bg-white/50 transition-all"
                  title="Exit Video"
                >
                  ✕
                </motion.button>
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center space-y-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              Explore Our{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Main Building
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-lg text-slate-600 dark:text-slate-300"
            >
              Step inside our main building with full 360° exploration. Rotate, zoom, and pan to navigate the facility interactively.
            </motion.p>

            {/* Watch Video Button */}
            <motion.button
              onClick={() => setShowVideo(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-44 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-full font-semibold text-sm shadow-md transition-all duration-300"
            >
              🎥 Watch Video
            </motion.button>

            {/* Back to Home Button */}
            <motion.button
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-44 bg-gray-700 hover:bg-gray-800 text-white py-2.5 rounded-full font-semibold text-sm shadow-md transition-all duration-300"
            >
              🏠 Back Home
            </motion.button>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md text-slate-700 dark:text-slate-300">
              <h4 className="font-semibold text-lg mb-2">Building Info</h4>
              <p className="text-sm md:text-base">
                Our main building hosts administrative offices, lecture halls, and state-of-the-art classrooms. Use the 360° map to explore interactively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
