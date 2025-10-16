'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

const LIBRARY_IMAGE = "/images/360lib.jpg";

// 🌐 360° Sphere Library Image Component
function LibrarySphere({ textureUrl = LIBRARY_IMAGE }) {
  const texture = useTexture(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = Math.sin(t * 0.2) * 0.01; // gentle floating
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// 🕹️ Orbit Controls for pan/zoom/rotate
function EnhancedOrbitControls() {
  const { camera, gl } = useThree();
  /* eslint-disable */

  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableRotate = true;
      controlsRef.current.enableZoom = true;
      controlsRef.current.enablePan = true;
      controlsRef.current.zoomSpeed = 0.8;
      controlsRef.current.rotateSpeed = 0.4;
      controlsRef.current.minDistance = 1;
      controlsRef.current.maxDistance = 60;
      camera.position.set(0, 0, 10);
    }
  }, [camera]);

  return <OrbitControls
  ref={controlsRef}
  enableDamping
  dampingFactor={0.05}
  makeDefault
/>

}


// 💡 Scene Lights
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />
    </>
  );
}

// ⏳ Loader
function CanvasLoader({ label = "Loading..." }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">{label}</p>
      </div>
    </div>
  );
}

// Video Tour Component
function LibraryTourVideo({ onExit }: { onExit: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <motion.div
      className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <video
        ref={videoRef}
        src="/videos/library-tour.mp4"
        className="w-full h-full object-cover"
        controls
        autoPlay
        muted
      />
      <button
        onClick={onExit}
        className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition-all"
      >
        ✖ Exit
      </button>
    </motion.div>
  );
}

// ✅ Main Library Section
export default function LibrarySection() {
  const [isTourActive, setIsTourActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center py-10 px-6">
      <div className="max-w-6xl mx-auto w-full backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20">
        <div className="flex flex-col lg:flex-row gap-10 items-center">

          {/* 3D Library Scene / Video */}
          <div className="w-full lg:w-1/2">
            <AnimatePresence mode="wait">
              {!isTourActive ? (
                <motion.div
                  key="3dscene"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-indigo-200/60 to-purple-200/60 dark:from-indigo-800/40 dark:to-purple-800/40"
                >
                  {isLoading && <CanvasLoader label="Loading Immersive Library..." />}
                  <Canvas camera={{ position: [0, 0, 10], fov: 70 }} dpr={[1, 2]}>
                    <SceneLights />
                    <Suspense fallback={null}>
                      <LibrarySphere />
                    </Suspense>
                    <EnhancedOrbitControls />
                  </Canvas>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs md:text-sm border border-white/20 text-center">
                    🖱️ Drag to look around • Scroll to zoom
                  </div>
                </motion.div>
              ) : (
                <LibraryTourVideo key="video" onExit={() => setIsTourActive(false)} />
              )}
            </AnimatePresence>
          </div>

          {/* Right Content & Buttons */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
              Explore Our{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Immersive Library
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              Experience our library like never before. Drag to look around in all directions,
              scroll to zoom into any area, and explore every corner without ever seeing empty spaces.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => setIsTourActive(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                🎥 Watch Video Tour
              </motion.button>

              <motion.button
                onClick={() => window.location.href = '/'}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white px-6 py-3 rounded-2xl font-semibold border border-gray-300 dark:border-gray-700 shadow-md hover:bg-white/90 dark:hover:bg-gray-700 transition-all"
              >
                ↩️ Back to Home
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
