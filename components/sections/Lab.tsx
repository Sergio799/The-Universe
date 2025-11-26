'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useRef, useMemo, useEffect, Suspense, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import UFO from '../three/UFO';
import { projectsData } from '../../lib/data/projects';

// Starfield component
function Starfield() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      const radius = 60 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.05;
      starsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.08} 
        color="#ffffff" 
        transparent 
        opacity={0.9} 
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function Lab() {
  const [selectedUFO, setSelectedUFO] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleClose = useCallback(() => setSelectedUFO(null), []);

  // Auto-close after 5 seconds if not hovering
  useEffect(() => {
    if (selectedUFO && !isHovering) {
      const timer = setTimeout(() => {
        setSelectedUFO(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedUFO, isHovering]);
  
  const selectedProject = projectsData.find(p => p.id === selectedUFO);

  return (
    <section 
      id="lab"
      className="relative w-full min-h-screen h-screen bg-black block overflow-hidden"
      aria-label="Lab section"
      style={{ isolation: 'isolate' }}
    >
      {/* Section Title */}
      <div className="absolute top-4 sm:top-8 lg:top-12 left-4 sm:left-8 md:left-12 lg:left-16 z-20 pointer-events-none">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white glow-text mb-2 sm:mb-4">
          THE LAB
        </h1>
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 mb-3 sm:mb-6">
          <span className="text-gray-600 text-lg sm:text-xl lg:text-2xl font-light">02</span>
          <div className="w-16 sm:w-20 lg:w-24 h-px bg-gray-700" aria-hidden="true"></div>
          <span className="text-white text-lg sm:text-xl lg:text-2xl font-light" aria-current="page">03</span>
        </div>
        <p className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 font-light max-w-xs sm:max-w-md">
          Tap a UFO to explore projects
        </p>
      </div>

      {/* Full Screen 3D UFO Scene */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden" style={{ clipPath: 'inset(0)' }}>
        <Suspense fallback={null}>
          <Canvas 
            className="w-full h-full"
            gl={{ 
              antialias: false, 
              alpha: false, 
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
            }}
            dpr={[1, 1.5]}
            frameloop="always"
            style={{ 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'auto', 
              position: 'absolute', 
              top: 0, 
              left: 0,
              clipPath: 'inset(0)'
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 8, 25]} fov={55} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 15, 10]} intensity={1.5} />
            <directionalLight position={[-10, 10, -10]} intensity={1} color="#00ffff" />
            <pointLight position={[0, 8, 10]} intensity={4} color="#ffffff" />
            <pointLight position={[0, 15, 0]} intensity={2} color="#ffffff" />
            <Starfield />
            
            <group position={[-10, 2, 0]}>
              <UFO onClick={() => setSelectedUFO('ufo-1')} isSelected={selectedUFO === 'ufo-1'} />
            </group>
            
            <group position={[0, 2, 0]}>
              <UFO onClick={() => setSelectedUFO('ufo-2')} isSelected={selectedUFO === 'ufo-2'} />
            </group>
            
            <group position={[10, 2, 0]}>
              <UFO onClick={() => setSelectedUFO('ufo-3')} isSelected={selectedUFO === 'ufo-3'} />
            </group>
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              minPolarAngle={Math.PI / 3.5}
              maxPolarAngle={Math.PI / 2.2}
              autoRotate
              autoRotateSpeed={0.4}
              target={[0, 2, 0]}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Project Card Overlay - Vertical Mobile-Style Card */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed right-8 top-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[380px]"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className="relative rounded-[3rem] p-8 overflow-hidden min-h-[400px] max-h-[85vh] flex flex-col"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/[0.02] pointer-events-none"></div>
              
              {/* Close button - top right */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 w-11 h-11 rounded-full text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center z-20"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(40px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                }}
                aria-label="Close"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              
              {/* Icon at top */}
              <div className="relative z-10 flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
              </div>

              <div className="relative z-10 flex-1 overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-3">{selectedProject.title}</h2>
                <p className="text-sm text-white/80 mb-6 leading-relaxed">{selectedProject.description}</p>
                
                {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">
                      Key Achievements
                    </h3>
                    <ul className="text-xs text-white/70 space-y-2 list-disc list-inside">
                      {selectedProject.achievements.slice(0, 3).map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <span key={`${tech}-${index}`} className="px-3 py-1.5 text-xs bg-white/15 text-white rounded-full backdrop-blur-sm whitespace-nowrap">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Social Links & View Project Button */}
              <div className="relative z-10 mt-6 flex flex-col gap-3">
                {/* Social Icons Row */}
                <div className="flex items-center justify-center gap-3">
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
                    }}
                    aria-label="GitHub"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  
                  <a
                    href="https://linkedin.com/in/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
                    }}
                    aria-label="LinkedIn"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
                
                {/* View Project Button */}
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-[2rem] text-white text-base font-medium hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    View Project
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
