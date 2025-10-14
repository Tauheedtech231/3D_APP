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
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.z = Math.sin(t) * 0.004;
    meshRef.current.position.y = Math.sin(t * 0.8) * 0.04;
  });

  return (
    <mesh ref={meshRef} rotation={[-0.2, 0, 0]} position={[0, -0.15, 0]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial map={texture} roughness={0.5} metalness={0.25} />
    </mesh>
  );
}

function CameraOrbit() {
  const { camera } = useThree();
  const tRef = useRef(0);
  useFrame((_, delta) => {
    tRef.current += delta * 0.05;
    camera.position.x = Math.sin(tRef.current) * 3;
    camera.position.z = 7 + Math.cos(tRef.current) * 2;
    camera.lookAt(0, 0, 0);
  });
  return null;
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
  return (
    <section className="relative py-16 bg-white dark:bg-[#010a1a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: 3D Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full h-[360px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
          >
            <Canvas camera={{ position: [0, 3, 8], fov: 45 }} dpr={[1, 2]}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 10, 5]} intensity={1.1} />
              <Suspense fallback={null}>
                <LabPlane textureUrl="/images/labs_map.jpg" />
              </Suspense>
              <Environment
  files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr"
  background
/>

              <OrbitControls enablePan enableZoom enableRotate minDistance={4} maxDistance={20} enableDamping dampingFactor={0.07} />
              <CameraOrbit />
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

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Facilities</strong>
                  <div className="text-slate-600 dark:text-slate-300">Computers • IoT • Robotics</div>
                </div>
                <div>
                  <strong>Timings</strong>
                  <div className="text-slate-600 dark:text-slate-300">Mon–Sat: 8:00 – 18:00</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
