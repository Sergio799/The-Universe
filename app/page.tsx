'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Eager load Landing (first view)
import Landing from '../components/sections/Landing';

// Lazy load heavy 3D sections with dynamic import
const OrbitalSystem = dynamic(() => import('../components/sections/OrbitalSystem'), {
  loading: () => <div className="w-full h-screen bg-black flex items-center justify-center">
    <div className="text-white text-lg animate-pulse">Loading Experience...</div>
  </div>,
  ssr: false, // Disable SSR for 3D components
});

const Lab = dynamic(() => import('../components/sections/Lab'), {
  loading: () => <div className="w-full h-screen bg-black flex items-center justify-center">
    <div className="text-white text-lg animate-pulse">Loading Lab...</div>
  </div>,
  ssr: false, // Disable SSR for 3D components
});

const Skills = dynamic(() => import('../components/sections/Skills'), {
  loading: () => <div className="w-full h-screen bg-black flex items-center justify-center">
    <div className="text-white text-lg animate-pulse">Loading Skills...</div>
  </div>,
  ssr: false,
});

const ThankYou = dynamic(() => import('../components/sections/ThankYou'), {
  loading: () => <div className="w-full h-screen bg-black flex items-center justify-center">
    <div className="text-white text-lg animate-pulse">Loading...</div>
  </div>,
  ssr: false,
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loadOrbital, setLoadOrbital] = useState(false);
  const [loadLab, setLoadLab] = useState(false);
  const [loadSkills, setLoadSkills] = useState(false);
  const [loadThankYou, setLoadThankYou] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Progressive loading for better performance
    const immediateTimer = setTimeout(() => {
      setLoadOrbital(true);
    }, 100);
    
    const labTimer = setTimeout(() => {
      setLoadLab(true);
    }, 200);
    
    const skillsTimer = setTimeout(() => {
      setLoadSkills(true);
    }, 300);
    
    const thankYouTimer = setTimeout(() => {
      setLoadThankYou(true);
    }, 400);

    return () => {
      clearTimeout(immediateTimer);
      clearTimeout(labTimer);
      clearTimeout(skillsTimer);
      clearTimeout(thankYouTimer);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Universe...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-black" style={{ willChange: 'scroll-position' }}>
        {/* Landing - Always loaded first */}
        <Suspense fallback={<div className="w-full h-screen bg-black" />}>
          <ErrorBoundary fallback={<div className="w-full h-screen bg-black flex items-center justify-center text-white">Landing section unavailable</div>}>
            <Landing />
          </ErrorBoundary>
        </Suspense>
        
        {/* OrbitalSystem - Loaded quickly */}
        {loadOrbital && (
          <Suspense fallback={<div className="w-full h-screen bg-black" />}>
            <ErrorBoundary fallback={<div className="w-full h-screen bg-black flex items-center justify-center text-white">Experience section unavailable</div>}>
              <OrbitalSystem />
            </ErrorBoundary>
          </Suspense>
        )}
        
        {/* Lab - Loaded quickly */}
        {loadLab && (
          <Suspense fallback={<div className="w-full h-screen bg-black" />}>
            <ErrorBoundary fallback={<div className="w-full h-screen bg-black flex items-center justify-center text-white">Lab section unavailable</div>}>
              <Lab />
            </ErrorBoundary>
          </Suspense>
        )}
        
        {/* Skills - Loaded quickly */}
        {loadSkills && (
          <Suspense fallback={<div className="w-full h-screen bg-black" />}>
            <ErrorBoundary fallback={<div className="w-full h-screen bg-black flex items-center justify-center text-white">Skills section unavailable</div>}>
              <Skills />
            </ErrorBoundary>
          </Suspense>
        )}
        
        {/* Thank You - Final section */}
        {loadThankYou && (
          <Suspense fallback={<div className="w-full h-screen bg-black" />}>
            <ErrorBoundary fallback={<div className="w-full h-screen bg-black flex items-center justify-center text-white">Thank you section unavailable</div>}>
              <ThankYou />
            </ErrorBoundary>
          </Suspense>
        )}
      </main>
    </ErrorBoundary>
  );
}
