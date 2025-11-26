/**
 * Mobile detection and optimization utilities
 */

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getDevicePixelRatio = (): number => {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
};

export const getOptimizedParticleCount = (baseCount: number): number => {
  if (typeof window === 'undefined') return baseCount;
  
  const width = window.innerWidth;
  
  if (width < 640) return Math.floor(baseCount * 0.3); // Mobile
  if (width < 1024) return Math.floor(baseCount * 0.5); // Tablet
  return baseCount; // Desktop
};

export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getPerformanceLevel = (): 'low' | 'medium' | 'high' => {
  if (typeof window === 'undefined') return 'medium';
  
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  
  // Low performance: Small screens with high DPR
  if (width < 640 && dpr > 2) return 'low';
  
  // Medium performance: Tablets or mobile
  if (width < 1024) return 'medium';
  
  // High performance: Desktop
  return 'high';
};
