'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Float, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

type Spot = {
  id: string;
  title: string;
  desc: string;
  nx: number;
  ny: number;
  videoId?: string;
};

const spots: Spot[] = [
  { id: 'main-gate', title: 'Main Entrance', desc: 'Grand entrance to the university campus.', nx: -0.5, ny: 0.25, videoId: 'ScMzIvxBSi4' },
  { id: 'sports', title: 'Sports Ground', desc: 'Cricket & football ground with seating area.', nx: 0.3, ny: 0.1, videoId: '5qap5aO4i9A' },
  { id: 'garden', title: 'Green Garden', desc: 'Peaceful garden for students to relax.', nx: 0.1, ny: -0.2 },
];

function GroundPlane({ textureUrl = '/images/sports_ground.jpg', planeWidth = 12, planeHeight = 7 }) {
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
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.006;
    meshRef.current.position.y = Math.sin(t * 0.8) * 0.03;
    
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
      position={[0, -0.2, 0]}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial 
        ref={materialRef}
        map={texture} 
        roughness={0.6} 
        metalness={0.2}
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

function SpotMarker({
  nx,
  ny,
  planeWidth,
  planeHeight,
  onClick,
}: {
  nx: number;
  ny: number;
  planeWidth: number;
  planeHeight: number;
  onClick: () => void;
}) {
  const x = nx * (planeWidth / 2);
  const z = ny * (planeHeight / 2) * -1;

  return (
    <Float floatIntensity={1.2} rotationIntensity={0.5}>
      <mesh position={[x, 0.15, z]} onClick={onClick}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial emissive="#22d3ee" emissiveIntensity={1} metalness={0.4} roughness={0.3} />
      </mesh>
    </Float>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={0.9} />
      <directionalLight position={[-10, 5, -5]} intensity={0.3} />
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

  return <video ref={ref} src={src} className="w-full h-full object-cover" muted controls playsInline preload="metadata" />;
}

export default function GroundSection() {
  const [active, setActive] = useState<Spot | null>(null);
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
  const planeWidth = 12;
  const planeHeight = 7;

  return (
    <section className="relative py-12 bg-white dark:bg-[#030b1b] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Campus <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-600">Ground Tour</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Explore the beautiful grounds of our campus, featuring sports facilities, gardens, and open spaces for students to enjoy.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: 3D Ground Map */}
          <div 
            className="w-full h-[360px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 relative"
            onMouseEnter={() => setIsHoveringCanvas(true)}
            onMouseLeave={() => setIsHoveringCanvas(false)}
          >
            {/* Hover Instructions */}
            <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${
              isHoveringCanvas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              🖱️ Scroll to zoom • Drag to rotate
            </div>

            <Canvas 
              camera={{ position: [0, 3.6, 9], fov: 45 }} 
              dpr={[1, 2]}
              className="cursor-grab active:cursor-grabbing"
            >
              <SceneLights />
              <Environment
                files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr"
                background
              />

              <Suspense fallback={null}>
                <GroundPlane textureUrl="/images/sports_ground.jpg" planeWidth={planeWidth} planeHeight={planeHeight} />
                {spots.map((s) => (
                  <SpotMarker
                    key={s.id}
                    nx={s.nx}
                    ny={s.ny}
                    planeWidth={planeWidth}
                    planeHeight={planeHeight}
                    onClick={() => setActive(s)}
                  />
                ))}
              </Suspense>
              <EnhancedOrbitControls />
            </Canvas>
          </div>

          {/* Right: Video + Info */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="rounded-2xl overflow-hidden shadow-lg bg-black/5 dark:bg-white/5">
                <div className="aspect-video">
                  <AutoPlayVideo src="/videos/ground-tour.mp4" />
                </div>
              </div>
            </motion.div>

            <div className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white">About the Ground</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                The campus grounds feature lush green gardens, a modern sports complex, and open spaces that encourage learning and recreation. Explore each area interactively.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Facilities</strong>
                  <div className="text-slate-600 dark:text-slate-300">Sports • Events • Parking</div>
                </div>
                <div>
                  <strong>Open Hours</strong>
                  <div className="text-slate-600 dark:text-slate-300">Daily: 7:00 – 21:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {active && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActive(null)} />
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white dark:bg-slate-900 max-w-2xl w-full rounded-2xl shadow-2xl p-6 md:p-8 z-10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white">{active.title}</h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{active.desc}</p>
                </div>
                <button onClick={() => setActive(null)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white">
                  ✕
                </button>
              </div>

              {active.videoId ? (
                <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1`}
                    className="w-full h-full"
                    title={active.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                  No video linked for this location.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}