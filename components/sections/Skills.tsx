'use client';

import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useRef, useMemo, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { skillsData } from '../../lib/data/skills';
import SkillSphere from '../three/SkillSphere';
import SkillConnections from '../three/SkillConnections';

// Starfield component
function Starfield() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 2500; // Increased star count significantly
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Mix of white and purple stars
      const isPurple = Math.random() > 0.85;
      if (isPurple) {
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 0.9;
      } else {
        colors[i * 3] = 0.9;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
      starsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.12} 
        vertexColors
        transparent 
        opacity={0.85} 
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// 3D Skills Scene
function SkillsScene() {
  // Generate positions for skills in a 3D space
  const skillPositions = useMemo(() => {
    const positions: Array<{ skill: typeof skillsData[0]; position: [number, number, number]; color: string }> = [];
    const categoryColors: Record<string, string> = {
      frontend: '#f97316', // orange
      backend: '#8b5cf6', // purple
      cloud: '#eab308', // yellow
      databases: '#06b6d4', // cyan
    };

    skillsData.forEach((skill, index) => {
      const angle = (index / skillsData.length) * Math.PI * 2;
      const radius = 10 + Math.random() * 6;
      const height = (Math.random() - 0.5) * 8;
      
      positions.push({
        skill,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        color: categoryColors[skill.category] || '#ffffff'
      });
    });

    return positions;
  }, []);

  // Generate connections between related skills
  const connections = useMemo(() => {
    const conns: Array<{ start: [number, number, number]; end: [number, number, number] }> = [];
    
    // Connect skills within same category
    skillPositions.forEach((pos1, i) => {
      skillPositions.forEach((pos2, j) => {
        if (i < j && pos1.skill.category === pos2.skill.category && Math.random() > 0.6) {
          conns.push({
            start: pos1.position,
            end: pos2.position
          });
        }
      });
    });

    return conns;
  }, [skillPositions]);

  return (
    <>
      <Starfield />
      <SkillConnections connections={connections} />
      {skillPositions.map(({ skill, position, color }) => (
        <SkillSphere
          key={skill.id}
          position={position}
          name={skill.name}
          color={color}
        />
      ))}
    </>
  );
}

export default function Skills() {
  return (
    <section 
      id="skills"
      className="relative w-full min-h-screen h-screen bg-black block overflow-hidden"
      aria-label="Skills section"
      style={{ isolation: 'isolate' }}
    >
      {/* Section Title */}
      <div className="absolute top-4 sm:top-8 lg:top-12 left-4 sm:left-8 md:left-12 lg:left-16 z-30 pointer-events-none max-w-[90%] sm:max-w-xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4"
          style={{
            textShadow: '0 0 40px rgba(6, 182, 212, 0.5)',
            lineHeight: '1.1'
          }}
        >
          SKILLS
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-3 sm:gap-4 lg:gap-6 mb-3 sm:mb-4"
        >
          <span className="text-gray-600 text-lg sm:text-xl lg:text-2xl font-light">03</span>
          <div className="w-16 sm:w-20 lg:w-24 h-px bg-gray-700" aria-hidden="true"></div>
          <span className="text-white text-lg sm:text-xl lg:text-2xl font-light" aria-current="page">04</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/80 font-light mb-6"
          style={{ lineHeight: '1.4' }}
        >
          Explore my tech stack
        </motion.p>

        {/* Legend - Below description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{
                backgroundColor: '#f97316',
                boxShadow: '0 0 10px #f97316'
              }}
            ></div>
            <span className="text-white text-sm sm:text-base font-medium">Frontend</span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{
                backgroundColor: '#8b5cf6',
                boxShadow: '0 0 10px #8b5cf6'
              }}
            ></div>
            <span className="text-white text-sm sm:text-base font-medium">Backend</span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{
                backgroundColor: '#eab308',
                boxShadow: '0 0 10px #eab308'
              }}
            ></div>
            <span className="text-white text-sm sm:text-base font-medium">Cloud</span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{
                backgroundColor: '#06b6d4',
                boxShadow: '0 0 10px #06b6d4'
              }}
            ></div>
            <span className="text-white text-sm sm:text-base font-medium">Databases</span>
          </div>
        </motion.div>
      </div>

      {/* Full Screen 3D Skills Scene */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <Canvas 
            className="w-full h-full"
            gl={{ 
              antialias: true,
              alpha: false, 
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
            }}
            dpr={[1, 1.5]}
            frameloop="always"
            style={{ width: '100%', height: '100%', pointerEvents: 'auto', position: 'absolute', top: 0, left: 0 }}
          >
            <PerspectiveCamera makeDefault position={[0, 8, 25]} fov={60} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
            
            <SkillsScene />
            
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              enableRotate={true}
              minDistance={15}
              maxDistance={50}
              autoRotate
              autoRotateSpeed={0.3}
              target={[0, 0, 0]}
              enableDamping
              dampingFactor={0.05}
              makeDefault
            />
          </Canvas>
        </Suspense>
      </div>


    </section>
  );
}
