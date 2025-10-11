'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion} from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls,  Environment, Float, Text, } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Types
interface CampusLocation {
  id: number;
  name: string;
  description: string;
  image: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  type: 'building' | 'area';
  panorama?: string;
}

interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
}

// Updated Campus Data with reliable image URLs
const campusData: CampusLocation[] = [
  {
    id: 1,
    name: "Main Academic Block",
    description: "Modern academic building housing IT, Computer Science, and Business departments with state-of-the-art facilities.",
    image: "/images/academic_block.jpg",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [8, 4, 6],
    type: "building",
    panorama: "/images/academic_block_inside.jpg"
  },
  {
    id: 2,
    name: "Student Cafeteria",
    description: "Vibrant dining area with diverse food options, comfortable seating, and social spaces for students.",
    image: "/images/cafeteria.jpg",
    position: [15, 0, -8],
    rotation: [0, -Math.PI / 6, 0],
    scale: [6, 3, 5],
    type: "building",
    panorama: "/images/cafeteria_inside.jpg"
  },
  {
    id: 3,
    name: "University Library",
    description: "Peaceful study environment with extensive digital and physical resources across multiple floors.",
    image: "/images/library.jpg",
    position: [-12, 0, -6],
    rotation: [0, Math.PI / 4, 0],
    scale: [7, 4, 5],
    type: "building",
    panorama: "/images/library_inside.jpg"
  },
  {
    id: 4,
    name: "Science Laboratory Complex",
    description: "Advanced research facilities with cutting-edge equipment for Physics, Chemistry, and Biology.",
    image: "/images/lab_complex.jpg",
    position: [-16, 0, 10],
    rotation: [0, -Math.PI / 3, 0],
    scale: [8, 4, 7],
    type: "building",
    panorama: "/images/lab_inside.jpg"
  },
  {
    id: 5,
    name: "Computer Science Center",
    description: "High-performance computing labs for AI research, data science, and software development.",
    image: "/images/cs_center.jpg",
    position: [14, 0, 12],
    rotation: [0, Math.PI / 3, 0],
    scale: [6, 3, 5],
    type: "building",
    panorama: "/images/cs_inside.jpg"
  },
  {
    id: 6,
    name: "Sports Complex & Ground",
    description: "Olympic-sized sports facility with cricket, football fields, and indoor basketball courts.",
    image: "/images/sports_ground.jpg",
    position: [0, -0.2, 18],
    rotation: [0, 0, 0],
    scale: [12, 0.1, 8],
    type: "area",
    panorama: "/images/sports_inside.jpg"
  },
  {
    id: 7,
    name: "Grand Auditorium",
    description: "1000-seat capacity venue for academic conferences, performances, and student events.",
    image: "/images/auditorium.jpg",
    position: [-18, 0, -16],
    rotation: [0, Math.PI / 4, 0],
    scale: [9, 5, 7],
    type: "building",
    panorama: "/images/auditorium_inside.jpg"
  },
  {
    id: 8,
    name: "Student Residence Halls",
    description: "Comfortable on-campus accommodation with modern amenities and community spaces.",
    image: "/images/hostel.jpg",
    position: [20, 0, -2],
    rotation: [0, -Math.PI / 2, 0],
    scale: [10, 4, 8],
    type: "building",
    panorama: "/images/hostel_inside.jpg"
  },
  {
    id: 9,
    name: "Administration Building",
    description: "Central hub for student services, admissions, and academic administration offices.",
    image: "/images/admin_building.jpg",
    position: [0, 0, -15],
    rotation: [0, Math.PI, 0],
    scale: [7, 4, 6],
    type: "building",
    panorama: "/images/admin_inside.jpg"
  }
];

// Custom Hook for Camera Animation
const useCameraAnimation = () => {
  const { camera } = useThree();
  const targetRef = useRef<THREE.Vector3>(new THREE.Vector3());

  const moveCameraTo = useCallback((position: CameraPosition) => {
    const timeline = gsap.timeline();

    timeline.to(camera.position, {
      x: position.position[0],
      y: position.position[1],
      z: position.position[2],
      duration: 2,
      ease: "power2.inOut"
    });

    timeline.to(targetRef.current, {
      x: position.target[0],
      y: position.target[1],
      z: position.target[2],
      duration: 2,
      ease: "power2.inOut"
    }, "-=2");

    return timeline;
  }, [camera]);

  useFrame(() => {
    if (targetRef.current) {
      camera.lookAt(targetRef.current);
    }
  });

  return { targetRef, moveCameraTo };
};

// Fallback colors for buildings
const getBuildingColor = (id: number) => {
  const colors = [
    '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#10B981',
    '#F59E0B', '#EF4444', '#06B6D4', '#84CC16'
  ];
  return colors[id % colors.length];
};

// Custom Image Component with proper error handling




interface CustomImageProps {
  url: string;
  position: [number, number, number];
  scale: number;
  onError: () => void;
}

const CustomImage: React.FC<CustomImageProps> = ({ url, position, scale, onError }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (loadedTexture) => {
        // Success callback
        setTexture(loadedTexture);
      },
      undefined, // onProgress (optional)
      (error) => {
        // Error callback
        console.error("Texture loading failed:", error);
        onError();
      }
    );
  }, [url, onError]);

  if (!texture) return null; // Don't render until texture is loaded

  return (
    <mesh position={position} scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={1} />
    </mesh>
  );
};




// 3D Image Building Component with Error Handling
const ImageBuilding = ({ 
  location, 
  onClick, 
  isSelected 
}: { 
  location: CampusLocation; 
  onClick: (location: CampusLocation) => void; 
  isSelected: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation for buildings
      if (location.type === 'building') {
        meshRef.current.position.y = location.position[1] + Math.sin(state.clock.elapsedTime + location.id) * 0.1;
      }
      
      // Pulsing effect when selected
      if (isSelected) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        meshRef.current.scale.x = location.scale![0] * scale;
        meshRef.current.scale.z = location.scale![2] * scale;
      } else {
        meshRef.current.scale.x = location.scale![0];
        meshRef.current.scale.z = location.scale![2];
      }
    }
  });

  return (
    <group position={location.position} rotation={location.rotation}>
      {/* Main Building */}
      <mesh
        ref={meshRef}
        scale={location.scale}
        onClick={(e) => {
          e.stopPropagation();
          onClick(location);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={imageError ? getBuildingColor(location.id) : '#ffffff'}
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.1}
          emissive={isSelected ? '#FBBF24' : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
        
        {/* Front Image - Only render if no error */}
        {!imageError && (
          <CustomImage
            url={location.image}
            position={[0, 0, 0.51]}
            scale={0.95}
            onError={() => setImageError(true)}
          />
        )}
      </mesh>
      
      {/* Building Label */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, location.scale![1] / 2 + 0.8, 0]}
          fontSize={0.4}
          color={isSelected ? '#FBBF24' : hovered ? '#60A5FA' : '#FFFFFF'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {location.name}
        </Text>
      </Float>

      {/* Glow effect for selected building */}
      {isSelected && (
        <mesh scale={[location.scale![0] + 0.8, location.scale![1] + 0.8, location.scale![2] + 0.8]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#FBBF24"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Hover effect */}
      {hovered && !isSelected && (
        <mesh scale={[location.scale![0] + 0.3, location.scale![1] + 0.3, location.scale![2] + 0.3]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#60A5FA"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
};

// Panorama Viewer Component
const PanoramaViewer = ({ 
  location, 
  onClose 
}: { 
  location: CampusLocation; 
  onClose: () => void;
}) => {
  const { scene, camera } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);
  const [panoramaError, setPanoramaError] = useState(false);

  useEffect(() => {
    if (sphereRef.current && location.panorama && !panoramaError) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        location.panorama,
        (texture) => {
          const geometry = new THREE.SphereGeometry(50, 60, 40);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
          });
          
          if (sphereRef.current) {
            sphereRef.current.geometry = geometry;
            sphereRef.current.material = material;
          }

          // Position camera inside sphere
          camera.position.set(0, 0, 0.1);
        },
        undefined,
        () => {
          setPanoramaError(true);
        }
      );
    }
  }, [location.panorama, camera, panoramaError]);

  return (
    <group>
      {!panoramaError ? (
        <mesh ref={sphereRef} />
      ) : (
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial color="#1E40AF" side={THREE.BackSide} />
        </mesh>
      )}
      
      {/* Close button in 3D space */}
      <Text
        position={[0, 0, -2]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onClick={onClose}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        Close Panorama
      </Text>
    </group>
  );
};

// 3D Scene Component
const SceneContent = ({ 
  locations, 
  selectedLocation, 
  onLocationSelect,
  viewMode 
}: { 
  locations: CampusLocation[]; 
  selectedLocation: CampusLocation | null; 
  onLocationSelect: (location: CampusLocation) => void;
  viewMode: 'explore' | 'panorama';
}) => {
  const { moveCameraTo } = useCameraAnimation();

  // Move camera when location is selected
  useEffect(() => {
    if (selectedLocation && viewMode === 'explore') {
      const cameraPosition: CameraPosition = {
        position: [
          selectedLocation.position[0] + 8,
          selectedLocation.position[1] + 4,
          selectedLocation.position[2] + 8
        ],
        target: selectedLocation.position
      };
      moveCameraTo(cameraPosition);
    }
  }, [selectedLocation, moveCameraTo, viewMode]);

  if (viewMode === 'panorama' && selectedLocation) {
    return <PanoramaViewer location={selectedLocation} onClose={() => onLocationSelect(selectedLocation)} />;
  }

  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-15, 15, -15]} intensity={0.4} color="#4F46E5" />
      <pointLight position={[15, 8, 15]} intensity={0.3} color="#8B5CF6" />
      <hemisphereLight intensity={0.3} />

      {/* Environment */}
      <Environment 
        preset="park" 
        background={false}
      />
      
      {/* Enhanced Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial 
          color="#6B7280" 
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>

      {/* Buildings */}
      {locations.map((location) => (
        <ImageBuilding
          key={location.id}
          location={location}
          onClick={onLocationSelect}
          isSelected={selectedLocation?.id === location.id}
        />
      ))}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={40}
        target={selectedLocation ? [selectedLocation.position[0], selectedLocation.position[1], selectedLocation.position[2]] : [0, 0, 0]}
      />
    </>
  );
};

// Navigation Component with Dark Mode Support
const Navigation = ({ 
  locations, 
  onLocationSelect, 
  currentLocation,
  onToggleView,
  viewMode 
}: { 
  locations: CampusLocation[]; 
  onLocationSelect: (location: CampusLocation) => void; 
  currentLocation: CampusLocation | null;
  onToggleView: () => void;
  viewMode: 'explore' | 'panorama';
}) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 
                          rounded-2xl flex items-center justify-center 
                          shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-extrabold text-xl tracking-wider">AC</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                Aspire College
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                Virtual Campus Tour
              </span>
            </div>
          </motion.div>

          {/* Contact Button */}
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 
                       text-white font-semibold shadow-lg hover:shadow-xl 
                       transition-all duration-300 hover:opacity-90"
          >
            Contact
          </motion.a>
        </div>
      </div>

      {/* Location Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-blue-50/70 to-purple-50/70 dark:from-gray-800/70 dark:to-gray-900/70
                   border-t border-gray-200/30 dark:border-gray-700/30 backdrop-blur-md shadow-inner"
      >
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex space-x-4 overflow-x-auto pb-3 scrollbar-hide">
            {locations.map((location) => (
              <motion.button
                key={location.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLocationSelect(location)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 
                            flex items-center space-x-2 shadow-md ${
                  currentLocation?.id === location.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-300 dark:shadow-indigo-600 shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200/70 dark:border-gray-600/70 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentLocation?.id === location.id ? 'bg-white' : 'bg-indigo-500/70 dark:bg-indigo-400'
                  }`}
                />
                <span>{location.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

// Enhanced Location Card Component with Dark Mode Support
const LocationCard = ({ 
  location, 
  onClose, 
  isVisible,
  onEnterPanorama 
}: { 
  location: CampusLocation | null; 
  onClose: () => void; 
  isVisible: boolean;
  onEnterPanorama: () => void;
}) => {
  const [imageError, setImageError] = useState(false);

  if (!location || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 w-[90%] sm:w-[400px] md:w-[420px]"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl rounded-3xl shadow-[0_0_25px_rgba(99,102,241,0.25)]
                   border border-white/20 dark:border-gray-700/20 overflow-hidden transition-all duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10 dark:border-gray-700/10">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            {location.name}
          </h3>

          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full 
                       bg-white/20 dark:bg-gray-700/20 hover:bg-white/30 dark:hover:bg-gray-600/30 
                       text-gray-900 dark:text-white shadow-inner transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>

        {/* Image */}
        <div className="p-4">
          {!imageError ? (
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              src={location.image}
              alt={location.name}
              onError={() => setImageError(true)}
              className="w-full h-64 object-cover rounded-2xl shadow-lg border border-white/20 dark:border-gray-600/20"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
              {location.name}
            </div>
          )}

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 dark:text-gray-200 text-sm md:text-base leading-relaxed mt-4"
          >
            {location.description}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Hero Section Component with Dark Mode Support
const HeroSection = ({ onExploreClick }: { onExploreClick: () => void }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Discover{' '}
          <motion.span
            initial={{ backgroundPosition: '0%' }}
            animate={{ backgroundPosition: '200%' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%] bg-clip-text text-transparent"
          >
            Aspire
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
        >
          Experience our state-of-the-art campus through an immersive 3D virtual tour with realistic environments.
        </motion.p>

        {/* Start Tour Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExploreClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-3xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center space-x-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM15 10l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            <span>Start Virtual Tour</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Main Page Component with Dark Mode Support
export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [showScene, setShowScene] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'explore' | 'panorama'>('explore');

  const handleLocationSelect = useCallback((location: CampusLocation) => {
    setSelectedLocation(location);
    if (!showScene) setShowScene(true);
    setViewMode('explore');
  }, [showScene]);

  const handleStartTour = useCallback(() => {
    setShowScene(true);
    setShowGuidedTour(true);
    setCurrentTourIndex(0);
    setSelectedLocation(campusData[0]);
  }, []);

  const handleNextLocation = useCallback(() => {
    const nextIndex = (currentTourIndex + 1) % campusData.length;
    setCurrentTourIndex(nextIndex);
    setSelectedLocation(campusData[nextIndex]);
  }, [currentTourIndex]);

  const handlePreviousLocation = useCallback(() => {
    const prevIndex = (currentTourIndex - 1 + campusData.length) % campusData.length;
    setCurrentTourIndex(prevIndex);
    setSelectedLocation(campusData[prevIndex]);
  }, [currentTourIndex]);

  const handleToggleView = useCallback(() => {
    if (selectedLocation) {
      setViewMode(prev => prev === 'explore' ? 'panorama' : 'explore');
    }
  }, [selectedLocation]);

  // Auto-advance tour when playing
  useEffect(() => {
    if (isTourPlaying) {
      const interval = setInterval(handleNextLocation, 5000);
      return () => clearInterval(interval);
    }
  }, [isTourPlaying, handleNextLocation]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
      {!showScene ? (
        <HeroSection onExploreClick={handleStartTour} />
      ) : (
        <>
          <Navigation
            locations={campusData}
            onLocationSelect={handleLocationSelect}
            currentLocation={selectedLocation}
            onToggleView={handleToggleView}
            viewMode={viewMode}
          />
          
          <div className="pt-32 h-screen">
            <Canvas shadows gl={{ antialias: true }}>
              <SceneContent
                locations={campusData}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
                viewMode={viewMode}
              />
            </Canvas>
          </div>

          <LocationCard
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
            isVisible={!!selectedLocation && viewMode === 'explore'}
            onEnterPanorama={handleToggleView}
          />
        </>
      )}
    </main>
  );
}