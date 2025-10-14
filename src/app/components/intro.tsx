'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

type FloatingBlockProps = {
  position: [number, number, number];
  color: string;
  speed: number;
  size: number;
};

function FloatingBlock({ position, color, speed, size }: FloatingBlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.6;
    meshRef.current.position.y = Math.sin(t) * 1.5 + position[1];
    meshRef.current.position.x = Math.sin(t * 0.3) * 2 + position[0];
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.5}
        roughness={0.4}
      />
    </mesh>
  );
}

function FloatingBlocksField() {
  const blocks = useMemo(() => {
    const arr: FloatingBlockProps[] = [];
    for (let i = 0; i < 50; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 20,
        ],
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        speed: 0.5 + Math.random(),
        size: 0.5 + Math.random() * 1.5,
      });
    }
    return arr;
  }, []);

  return <>{blocks.map((b, i) => <FloatingBlock key={i} {...b} />)}</>;
}

export default function Intro() {
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!btnRef.current) return;
    gsap.fromTo(
      btnRef.current,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: 'expo.out', duration: 0.8, delay: 0.5 }
    );
  }, []);

  const startTour = () => {
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => router.push('/tour'),
      });
    } else {
      router.push('/tour');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* === 3D Background === */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 12], fov: 55 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <FloatingBlocksField />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
      </div>

      {/* === Foreground Content === */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-xl animate-fadeIn">
          Welcome to Your{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 animate-textGlow">
            Virtual Campus
          </span>
        </h1>
        <p className="mt-4 text-gray-300 max-w-2xl animate-fadeIn delay-200">
          Explore classrooms, labs, and every corner of your campus in stunning 3D.
        </p>

        <button
          ref={btnRef}
          onClick={startTour}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-3xl shadow-2xl hover:scale-105 hover:shadow-pink-500/50 transition-transform font-semibold flex items-center gap-2 text-white"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3v18l15-9L5 3z" />
          </svg>
          Start Virtual Tour
        </button>
      </main>

      {/* === Animations === */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s forwards;
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 8px #fff, 0 0 20px #f0f; }
          50% { text-shadow: 0 0 12px #fff, 0 0 30px #0ff; }
        }
        .animate-textGlow {
          animation: textGlow 3s infinite alternate;
        }
      `}</style>
    </div>
  );
}
