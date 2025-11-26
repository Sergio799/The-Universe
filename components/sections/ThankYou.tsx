'use client';

import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef, useMemo, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Starfield component
function Starfield() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Mix of white and cyan stars
      const isCyan = Math.random() > 0.85;
      if (isCyan) {
        colors[i * 3] = 0.4;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
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
        size={0.1} 
        vertexColors
        transparent 
        opacity={0.8} 
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ThankYou() {
  return (
    <section 
      id="thankyou"
      className="relative w-full min-h-screen h-screen bg-black block overflow-hidden"
      aria-label="Thank you section"
      style={{ isolation: 'isolate' }}
    >
      {/* Starfield Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none" aria-hidden="true">
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <Canvas 
            className="w-full h-full"
            gl={{ 
              antialias: false,
              alpha: false, 
              powerPreference: 'high-performance',
              stencil: false,
              depth: false,
            }}
            dpr={[1, 1.5]}
            frameloop="always"
            style={{ width: '100%', height: '100%' }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
            <Starfield />
          </Canvas>
        </Suspense>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-[5] pointer-events-none" aria-hidden="true"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-20">
        
        {/* Spacer for top */}
        <div className="flex-shrink-0"></div>
        
        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="text-center max-w-4xl flex-shrink-0"
        >
          {/* Thank You Title with letter animation */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 lg:mb-8 text-white"
            style={{
              textShadow: '0 0 60px rgba(6, 182, 212, 0.6)',
              letterSpacing: '-0.02em',
              lineHeight: '1'
            }}
          >
            {['T', 'H', 'A', 'N', 'K', ' ', 'Y', 'O', 'U'].map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + index * 0.1,
                  ease: "easeOut"
                }}
                style={{ display: 'inline-block' }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.h1>

          {/* Animated Underline with pulse */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: 1, 
              opacity: 1,
            }}
            transition={{ duration: 1, delay: 1.5 }}
            className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-8 lg:mb-10 max-w-2xl mx-auto relative"
            style={{ transformOrigin: 'center' }}
          >
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-sm"
            />
          </motion.div>

          {/* Message with fade and slide */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 1.8 }}
            className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light mb-4 leading-relaxed"
          >
            For visiting my universe
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 2.1 }}
            className="text-lg sm:text-xl md:text-2xl text-white/70 font-light italic"
          >
            <motion.span
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              I hope you enjoyed the experience
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Footer with slide up */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4 }}
          className="text-center w-full flex-shrink-0 mt-12"
        >
          <motion.p
            animate={{
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-white/50 text-sm"
          >
            © 2025 Sai Prakash Reddy Nallapareddy. All rights reserved.
          </motion.p>
        </motion.div>
      </div>

      {/* Pagination Indicator with slide in */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2.6, ease: "easeOut" }}
        className="absolute bottom-8 sm:bottom-10 lg:bottom-12 left-6 sm:left-8 md:left-12 lg:left-16 flex items-center gap-4 lg:gap-6 z-20"
        role="navigation"
        aria-label="Page navigation"
      >
        <motion.span 
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-600 text-xl lg:text-2xl font-light"
        >
          04
        </motion.span>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="w-20 lg:w-24 h-px bg-gray-700" 
          aria-hidden="true"
          style={{ transformOrigin: 'left' }}
        />
        <motion.span 
          animate={{ 
            textShadow: [
              '0 0 10px rgba(6, 182, 212, 0.5)',
              '0 0 20px rgba(6, 182, 212, 0.8)',
              '0 0 10px rgba(6, 182, 212, 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-xl lg:text-2xl font-light" 
          aria-current="page"
        >
          05
        </motion.span>
      </motion.div>
    </section>
  );
}
