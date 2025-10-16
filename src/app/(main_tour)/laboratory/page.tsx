'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// LabPlane for immersive 360° view
function LabPlane({ textureUrl = '/3dlabsh.jpg' }) {
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

// OrbitControls for pan/zoom/rotate
function EnhancedOrbitControls() {
  const { camera } = useThree();
  /* eslint-disable */

  const controlsRef = useRef<any>(null);

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

// Canvas Loader
function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Loading Lab Environment...</p>
      </div>
    </div>
  );
}

// AutoPlay Video Component
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
      controls
      className="w-full h-full object-cover rounded-xl"
    />
  );
}

// Main Section
export default function LabsSection() {
  const [showVideo, setShowVideo] = useState(false);
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);

  return (
    <section className="relative py-12 md:py-16 bg-white dark:bg-[#010a1a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile Responsive */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white"
          >
            Explore Our{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Advanced Labs
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            State-of-the-art laboratories equipped with cutting-edge technology for hands-on learning and research.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
          {/* Left: 3D Sphere Canvas or Video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[480px] rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl border border-slate-200 dark:border-slate-700 relative bg-slate-100 dark:bg-slate-900"
            onMouseEnter={() => setIsHoveringCanvas(true)}
            onMouseLeave={() => setIsHoveringCanvas(false)}
          >
            {!showVideo ? (
              <>
                {!canvasLoaded && <CanvasLoader />}
                
                <div
                  className={`absolute inset-0 pointer-events-none z-10 transition-all duration-300 ${
                    isHoveringCanvas
                      ? 'bg-gradient-to-t from-black/20 to-transparent'
                      : 'bg-gradient-to-t from-black/10 to-transparent'
                  }`}
                />
                
                {/* Controls Guide */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isHoveringCanvas ? 1 : 0, y: isHoveringCanvas ? 0 : 10 }}
                  className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 z-20"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="flex items-center space-x-1">
                      <span className="text-sm sm:text-base">🖱️</span>
                      <span className="hidden xs:inline">Drag to look</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="text-sm sm:text-base">🔍</span>
                      <span className="hidden xs:inline">Scroll to zoom</span>
                    </span>
                  </div>
                </motion.div>

                <Canvas
                  camera={{ position: [0, 0, 10], fov: 70 }}
                  dpr={[1, 2]}
                  className="cursor-grab active:cursor-grabbing"
                  onCreated={() => setCanvasLoaded(true)}
                >
                  <SceneLights />
                  <Suspense fallback={null}>
                    <LabPlane textureUrl="/3dlabsh.jpg" />
                  </Suspense>
                  <EnhancedOrbitControls />
                </Canvas>
              </>
            ) : (
              // Video Tour
              <div className="w-full h-full bg-black">
                <AutoPlayVideo src="/videos/labs-tour.mp4" />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVideo(false)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/70 hover:bg-black/90 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 flex items-center space-x-2 z-20"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Back to 360° View</span>
                  <span className="sm:hidden">Back</span>
                </motion.button>

                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <p className="text-xs sm:text-sm">Virtual Lab Tour</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-6"
          >
            <div className="p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md md:shadow-lg">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
                Advanced Research Facilities
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Our laboratories are designed to provide students with hands-on experience in cutting-edge technologies. 
                From AI research to robotics and IoT development, we provide the tools and environment for innovation.
              </p>

              <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base">
                <div className="space-y-2">
                  <strong className="text-slate-900 dark:text-white text-base md:text-lg">🔬 Facilities</strong>
                  <ul className="text-slate-600 dark:text-slate-300 space-y-1 text-sm md:text-base">
                    <li>• High-performance Computing</li>
                    <li>• IoT Development Kits</li>
                    <li>• Robotics Equipment</li>
                    <li>• Electronics Workstations</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <strong className="text-slate-900 dark:text-white text-base md:text-lg">🕒 Timings</strong>
                  <div className="text-slate-600 dark:text-slate-300 space-y-1 text-sm md:text-base">
                    <p>Mon - Sat: 8:00 – 18:00</p>
                    <p>Sunday: 10:00 – 16:00</p>
                  </div>
                </div>
              </div>


              {/* Action Buttons */}
              <div className="mt-6 md:mt-8 space-y-3 md:space-y-4 flex flex-col items-center">
  {/* 🎥 Toggle between video and 360° view */}
  {!showVideo ? (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => setShowVideo(true)}
      className="w-48 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-full font-semibold text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
    >
      <span>🎥</span>
      <span>Start Tour</span>
    </motion.button>
  ) : (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => setShowVideo(false)}
      className="w-48 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-full font-semibold text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
    >
      <span>↶</span>
      <span>Back to 360°</span>
    </motion.button>
  )}

  {/* 🏠 Back to Home Button */}
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => (window.location.href = '/')}
    className="w-48 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-full font-semibold text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
  >
    <span>🏠</span>
    <span>Home</span>
  </motion.button>
</div>

            </div>

            {/* Additional Info Cards */}
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}