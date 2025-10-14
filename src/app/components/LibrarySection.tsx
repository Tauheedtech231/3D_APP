'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useTexture, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

type Hotspot = {
  id: string;
  title: string;
  desc: string;
  nx: number;
  ny: number;
  videoId?: string;
};

const hotspots: Hotspot[] = [
  { id: 'reading', title: 'Reading Hall', desc: 'Quiet reading zone with comfortable seating.', nx: -0.4, ny: 0.2, videoId: '5qap5aO4i9A' },
  { id: 'digital', title: 'Digital Resources', desc: 'Computers, e-journals and microfilm terminals.', nx: 0.3, ny: 0.25, videoId: 'ScMzIvxBSi4' },
  { id: 'stacks', title: 'Book Stacks', desc: 'Organized collections and reference sections.', nx: -0.1, ny: -0.15 },
];

function LibraryMapPlane({ textureUrl = '/images/library.jpg', planeWidth = 8, planeHeight = 5 }) {
  const texture = useTexture(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;

  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.z = Math.sin(t) * 0.004;
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.02;
  });

  return (
    <mesh ref={meshRef} rotation={[-0.12, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial map={texture} toneMapped />
    </mesh>
  );
}

function HotspotMarker({
  nx,
  ny,
  planeWidth,
  planeHeight,
  onClick,
  label,
}: {
  nx: number;
  ny: number;
  planeWidth: number;
  planeHeight: number;
  onClick: () => void;
  label: string;
}) {
  const x = nx * (planeWidth / 2);
  const z = ny * (planeHeight / 2) * -1;
  return (
    <Float floatIntensity={1} rotationIntensity={0.6} speed={2}>
      <mesh position={[x, 0.1, z]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial emissive={'#38bdf8'} emissiveIntensity={0.7} metalness={0.4} roughness={0.2} />
        <Html distanceFactor={8} transform position={[0, 0.28, 0]} center>
          <div
            onClick={onClick}
            className="cursor-pointer backdrop-blur-md bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-full text-xs text-slate-800 dark:text-white shadow-md hover:scale-105 transition"
          >
            {label}
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 3.6, 9);
  }, [camera]);
  return null;
}

// ✅ Auto play video when in view (YouTube-like effect)
function AutoPlayVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
      className="w-full h-full object-cover"
      controls
      playsInline
      muted
      preload="metadata"
    />
  );
}

export default function LibrarySection() {
  const [active, setActive] = useState<Hotspot | null>(null);
  const planeWidth = 10;
  const planeHeight = 6;

  const openHotspot = (h: Hotspot) => setActive(h);
  const closeHotspot = () => setActive(null);

  return (
    <section className="relative py-12 bg-white dark:bg-[#071025] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Our{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-600">
              Library
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Explore our library interactively — zoom, pan, and click hotspots to explore sections.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left 3D Canvas */}
          <div className="w-full h-[360px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
            <Canvas camera={{ position: [0, 3.6, 9], fov: 45 }} dpr={[1, 2]}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 5]} intensity={0.9} />
              <directionalLight position={[-10, 5, -5]} intensity={0.5} />
              <Suspense fallback={null}>
                <LibraryMapPlane textureUrl="/images/library.jpg" planeWidth={planeWidth} planeHeight={planeHeight} />
                {hotspots.map((h) => (
                  <HotspotMarker
                    key={h.id}
                    nx={h.nx}
                    ny={h.ny}
                    planeWidth={planeWidth}
                    planeHeight={planeHeight}
                    label={h.title}
                    onClick={() => openHotspot(h)}
                  />
                ))}
              </Suspense>
              <OrbitControls enableRotate={false} enablePan enableZoom minDistance={4} maxDistance={20} enableDamping dampingFactor={0.07} />
              <CameraController />
            </Canvas>
          </div>

          {/* Right Info */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="rounded-2xl overflow-hidden shadow-lg bg-black/5 dark:bg-white/5">
                <div className="aspect-video">
                  <AutoPlayVideo src="/videos/library-tour.mp4" />
                </div>
              </div>
            </motion.div>

           <div className="p-6 md:p-8 bg-gradient-to-tr from-white via-slate-50 to-white/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-shadow duration-300">
  {/* Header */}
  <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
    Library Overview
  </h3>

  {/* Description */}
  <p className="mt-2 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
    The library offers thousands of titles, peaceful reading areas, digital access zones, and collaborative study rooms. Scroll around the interactive map or view the quick tour video.
  </p>

  {/* Info Grid */}
  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="text-sm md:text-base">
      <strong className="block text-slate-900 dark:text-white mb-1">Hours</strong>
      <div className="text-slate-600 dark:text-slate-400">Mon–Fri: 8:00 – 20:00</div>
    </div>
    <div className="text-sm md:text-base">
      <strong className="block text-slate-900 dark:text-white mb-1">Facilities</strong>
      <div className="text-slate-600 dark:text-slate-400">Wi-Fi • Study Rooms • PCs</div>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="mt-6 flex flex-wrap gap-3">
    <button
      onClick={() => document.querySelector('canvas')?.scrollIntoView({ behavior: 'smooth' })}
      className="px-5 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm md:text-base font-semibold hover:scale-105 hover:from-sky-600 hover:to-indigo-600 transition transform duration-300"
    >
      Focus Map
    </button>

    <button
      onClick={() => setActive(hotspots[0])}
      className="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-sm md:text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
    >
      Explore Hotspots
    </button>
  </div>
</div>

          </div>
        </div>

        {/* Modal */}
        {active && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeHotspot} />
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
                <button onClick={closeHotspot} className="text-slate-500 hover:text-slate-800 dark:hover:text-white">
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
                  No video linked. Add a YouTube `videoId` to the hotspot to display one.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
