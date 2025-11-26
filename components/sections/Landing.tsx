'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef, useMemo, useCallback, useEffect, Suspense, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BigBangIntro from '../three/BigBangIntro';


// Optimized Starfield with More Stars
function Starfield() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 1200; // Increased for better visual
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Add some cyan stars for variety
      const isCyan = Math.random() > 0.92;
      if (isCyan) {
        colors[i * 3] = 0.4;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }
      
      // Varied sizes
      sizes[i] = Math.random() * 0.15 + 0.05;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  // Smooth rotation with subtle twinkling
  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
      starsRef.current.rotation.x += delta * 0.005;
      
      // Subtle opacity variation
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.8 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.1} 
        vertexColors
        transparent 
        opacity={0.85} 
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Animation variants with reduced motion support
const createVariants = (shouldReduce: boolean) => ({
  fadeInUp: {
    initial: { opacity: 0, y: shouldReduce ? 0 : 30 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: shouldReduce ? 0 : -30 },
    animate: { opacity: 1, x: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
});

export default function Landing() {
  const shouldReduceMotion = useReducedMotion();
  const variants = createVariants(shouldReduceMotion || false);
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  // Always show intro on page load (comment out to show only once per session)
  // useEffect(() => {
  //   const hasSeenIntro = sessionStorage.getItem('hasSeenBigBang');
  //   if (hasSeenIntro === 'true') {
  //     setShowIntro(false);
  //   }
  // }, []);

  const handleScrollToNext = useCallback(() => {
    if (typeof window === 'undefined') return;
    const experienceSection = document.querySelector('#experience');
    experienceSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    // sessionStorage.setItem('hasSeenBigBang', 'true'); // Uncomment to remember user has seen it
    setTimeout(() => setShowIntro(false), 1000);
  }, []);

  return (
    <section 
      className="relative w-full min-h-screen h-screen bg-black block overflow-hidden"
      aria-label="Landing section"
      style={{ isolation: 'isolate' }}
    >
      {/* Big Bang Intro Overlay */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="bigbang-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black flex flex-col items-center justify-center"
            style={{ 
              pointerEvents: showIntro ? 'auto' : 'none',
              margin: 0,
              padding: 0
            }}
          >
            {/* 3D Big Bang Animation */}
            <div className="absolute inset-0 w-full h-full">
              <Canvas
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 2]}
                style={{ width: '100%', height: '100%' }}
              >
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
                <BigBangIntro onComplete={handleIntroComplete} />
              </Canvas>
            </div>

            {/* Text Overlay */}
            {introComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center px-6"
              >
                <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light italic">
                  "Every engineer has an origin story.<br />This is mine."
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Starfield Background - Full Screen */}
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
              preserveDrawingBuffer: false,
            }}
            dpr={[1, 1.5]}
            frameloop="always"
            style={{ width: '100%', height: '100%' }}
            onCreated={({ gl }) => {
              gl.setClearColor('#000000');
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
            <Starfield />
          </Canvas>
        </Suspense>
      </div>
      
      {/* Gradient Overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 z-[5] pointer-events-none" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 z-[5] pointer-events-none" aria-hidden="true"></div>

      {/* Main Content - Centered */}
      <div className="relative z-20 w-full h-full flex items-center justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* Text Content - Centered */}
        <div className="flex flex-col justify-center items-center text-center">
          <motion.div
            variants={variants.fadeInLeft}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-5xl"
          >
            {/* Eyebrow Label */}
            <motion.p 
              variants={variants.fadeIn}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xs sm:text-sm text-gray-300 uppercase tracking-[0.4em] mb-16 lg:mb-20 font-light"
              style={{ position: 'relative', zIndex: 30 }}
            >
              Welcome to my universe
            </motion.p>

            {/* Hero Title with Gradient */}
            <motion.h1 
              variants={variants.fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-16 lg:mb-20 leading-[0.95] text-white"
              style={{ 
                letterSpacing: '-0.02em',
                textShadow: '0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(6, 182, 212, 0.3)',
                position: 'relative',
                zIndex: 30
              }}
            >
              SAI PRAKASH<br />REDDY<br />NALLAPAREDDY
            </motion.h1>
            
            {/* Animated Underline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-24 lg:mb-28 max-w-2xl mx-auto"
              style={{ transformOrigin: 'center', position: 'relative', zIndex: 30 }}
            />
            
            {/* Description Text - Enhanced */}
            <motion.p 
              variants={variants.fadeIn}
              initial="initial"
              animate="animate"
              transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
              className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-16 lg:mb-20 max-w-3xl mx-auto leading-relaxed font-light"
              style={{ position: 'relative', zIndex: 30 }}
            >
              Full Stack Developer crafting{' '}
              <span className="text-cyan-400 font-medium">scalable solutions</span>{' '}
              with React, Node.js, and modern web technologies
            </motion.p>

            {/* Glowing Orb Button - Hidden on Mobile, Visible on Desktop */}
            <motion.button
              onClick={handleScrollToNext}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
              className="hidden md:block relative group cursor-pointer mx-auto"
              aria-label="Scroll to experience section"
              style={{ position: 'relative', zIndex: 30 }}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.08, transition: { duration: 0.3, ease: "easeOut" } }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.95, transition: { duration: 0.15 } }}
            >
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full border-2 border-gray-600/40 w-48 h-80 lg:w-56 lg:h-96 blur-sm group-hover:border-cyan-400/60 transition-all duration-500"></div>
              
              {/* Main border */}
              <div className="relative rounded-full border-2 border-gray-600/60 w-48 h-80 lg:w-56 lg:h-96 flex items-center justify-center group-hover:border-cyan-400/80 transition-all duration-500 backdrop-blur-sm">
                {/* Inner glowing orb */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.85, 1, 0.85],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse"
                  }}
                  className="relative"
                >
                  {/* Outer glow */}
                  <div className="absolute inset-0 w-32 h-32 lg:w-40 lg:h-40 bg-cyan-400 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  
                  {/* Core orb */}
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full shadow-2xl group-hover:from-cyan-300 group-hover:to-green-300 transition-all duration-500">
                    {/* Inner highlight */}
                    <div className="absolute top-3 left-3 w-12 h-12 lg:w-16 lg:h-16 bg-white/30 rounded-full blur-lg"></div>
                  </div>
                </motion.div>
              </div>
            </motion.button>
          </motion.div>
        </div>


      </div>

      {/* Social Media Icons - Mobile: Bottom Center, Desktop: Right Side */}
      <motion.div
        variants={variants.fadeIn}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-row gap-8 md:bottom-auto md:right-8 md:left-auto md:translate-x-0 md:top-1/2 md:-translate-y-1/2 md:flex-col lg:right-16 lg:gap-8 z-50"
        role="navigation"
        aria-label="Social media links"
      >
        {/* GitHub */}
        <motion.a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          aria-label="GitHub Profile"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.15, transition: { duration: 0.2, ease: "easeOut" } }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9, transition: { duration: 0.1 } }}
        >
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg className="w-7 h-7 lg:w-8 lg:h-8 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 relative" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </motion.a>

        {/* LinkedIn */}
        <motion.a
          href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          aria-label="LinkedIn Profile"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.15, transition: { duration: 0.2, ease: "easeOut" } }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9, transition: { duration: 0.1 } }}
        >
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg className="w-7 h-7 lg:w-8 lg:h-8 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 relative" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </motion.a>

        {/* Instagram */}
        <motion.a
          href="https://instagram.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          aria-label="Instagram Profile"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.15, transition: { duration: 0.2, ease: "easeOut" } }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9, transition: { duration: 0.1 } }}
        >
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg className="w-7 h-7 lg:w-8 lg:h-8 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 relative" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </motion.a>

        {/* Email */}
        <motion.a
          href="mailto:your.email@example.com"
          className="group relative"
          aria-label="Email"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.15, transition: { duration: 0.2, ease: "easeOut" } }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9, transition: { duration: 0.1 } }}
        >
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg className="w-7 h-7 lg:w-8 lg:h-8 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.a>
      </motion.div>

      {/* Pagination Indicator */}
      <motion.div
        variants={variants.fadeIn}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
        className="absolute bottom-8 sm:bottom-10 lg:bottom-12 left-6 sm:left-8 md:left-12 lg:left-16 flex items-center gap-4 lg:gap-6 z-20"
        role="navigation"
        aria-label="Page navigation"
      >
        <span className="text-white text-xl lg:text-2xl font-light" aria-current="page">01</span>
        <div className="w-20 lg:w-24 h-px bg-gray-700" aria-hidden="true"></div>
        <span className="text-gray-600 text-xl lg:text-2xl font-light">02</span>
      </motion.div>
    </section>
  );
}
