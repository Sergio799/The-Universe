'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import PlanetSystem from '../three/PlanetSystem';
import { experienceData } from '../../lib/data/experience';

export default function OrbitalSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handlePlanetClick = useCallback((id: string) => {
    setSelectedPlanet(id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedPlanet(null);
  }, []);

  // Auto-close after 5 seconds if not hovering
  useEffect(() => {
    if (selectedPlanet && !isHovering) {
      const timer = setTimeout(() => {
        setSelectedPlanet(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedPlanet, isHovering]);
  
  const selectedData = experienceData.find(p => p.id === selectedPlanet);

  return (
    <section 
      id="experience" 
      className="relative w-full min-h-screen h-screen bg-black block overflow-hidden"
      aria-label="Experience orbital system"
      style={{ isolation: 'isolate' }}
    >
      {/* Section Title */}
      <div className="absolute top-4 sm:top-8 lg:top-12 left-4 sm:left-8 md:left-12 lg:left-16 z-20 pointer-events-none">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white glow-text mb-2 sm:mb-4">
          THE EXP
        </h1>
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 mb-3 sm:mb-6">
          <span className="text-gray-600 text-lg sm:text-xl lg:text-2xl font-light">01</span>
          <div className="w-16 sm:w-20 lg:w-24 h-px bg-gray-700" aria-hidden="true"></div>
          <span className="text-white text-lg sm:text-xl lg:text-2xl font-light" aria-current="page">02</span>
        </div>
        <p className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 font-light max-w-xs sm:max-w-md">
          Tap a planet to explore experience
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas 
        className="absolute inset-0 z-0 touch-action-none" 
        gl={{ 
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        frameloop="always"
        style={{ pointerEvents: 'auto', touchAction: 'none' }}
      >
        <PerspectiveCamera makeDefault position={[0, 25, 0]} rotation={[-Math.PI / 2, 0, 0]} fov={60} />
        <ambientLight intensity={1.2} />
        <pointLight position={[0, 0, 0]} intensity={15} color="#FFA500" />
        <pointLight position={[0, 20, 0]} intensity={3} color="#FFFFFF" />
        <directionalLight position={[10, 15, 10]} intensity={1} />
        <directionalLight position={[-10, 15, -10]} intensity={1} />
        
        <PlanetSystem
          data={experienceData}
          onPlanetClick={handlePlanetClick}
          selectedPlanet={selectedPlanet}
        />
      </Canvas>

      {/* Experience Card Overlay - Vertical Mobile-Style Card */}
      <AnimatePresence>
        {selectedData && (
          <motion.div
            key={selectedData.id}
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>

              <div className="relative z-10 flex-1 overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedData.name}</h2>
                <p className="text-base text-white/90 font-semibold mb-1">{selectedData.role}</p>
                {selectedData.location && (
                  <p className="text-xs text-white/60 mb-1">{selectedData.location}</p>
                )}
                <time className="text-xs text-white/50 block mb-6">{selectedData.period}</time>
                
                <p className="text-sm text-white/80 mb-6 leading-relaxed">{selectedData.description}</p>
                
                {selectedData.highlights && selectedData.highlights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">
                      Key Achievements
                    </h3>
                    <ul className="text-xs text-white/70 space-y-2 list-disc list-inside">
                      {selectedData.highlights.slice(0, 3).map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedData.technologies.map((tech, index) => (
                      <span key={`${tech}-${index}`} className="px-3 py-1.5 text-xs bg-white/15 text-white rounded-full backdrop-blur-sm whitespace-nowrap">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
