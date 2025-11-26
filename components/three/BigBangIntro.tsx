'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BigBangIntroProps {
  onComplete?: () => void;
}

export default function BigBangIntro({ onComplete }: BigBangIntroProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const explosionStarted = useRef(false);

  // Create particle system - MASSIVE explosion
  const { geometry, positions, velocities, colors, sizes } = useMemo(() => {
    const count = 8000; // Increased from 3000 to 8000!
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Initialize all particles at origin (the spark)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Random explosion velocities - wider spread
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 3 + Math.random() * 6; // Faster particles

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      // Varied particle sizes for depth
      sizes[i] = 0.1 + Math.random() * 0.4;

      // More vibrant colors - cyan, electric blue, purple, magenta, white, gold
      const colorChoice = Math.random();
      if (colorChoice < 0.2) {
        // Bright Cyan
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.4) {
        // Electric Purple
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.0;
        colors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.6) {
        // Electric Blue
        colors[i * 3] = 0.2;
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.75) {
        // Magenta
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.0;
        colors[i * 3 + 2] = 0.8;
      } else if (colorChoice < 0.9) {
        // Bright White
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Gold
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.0;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return { geometry: geo, positions, velocities, colors, sizes };
  }, []);

  useEffect(() => {
    // Trigger explosion after 1.5 seconds
    const timer = setTimeout(() => {
      explosionStarted.current = true;
    }, 1500);

    // Complete animation after 10 seconds (more time for quote)
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
      geometry.dispose();
    };
  }, [geometry, onComplete]);

  useFrame((_, delta) => {
    if (!particlesRef.current || !particlesRef.current.geometry) return;

    timeRef.current += delta;

    if (explosionStarted.current && timeRef.current < 5) {
      const positionAttribute = particlesRef.current.geometry.getAttribute('position');
      
      if (!positionAttribute) return;
      
      for (let i = 0; i < positions.length / 3; i++) {
        // Update positions based on velocities
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        // Apply gravity and drag
        velocities[i * 3 + 1] -= 0.5 * delta;
        velocities[i * 3] *= 0.98;
        velocities[i * 3 + 1] *= 0.98;
        velocities[i * 3 + 2] *= 0.98;
      }

      positionAttribute.needsUpdate = true;

      // Fade out material - faster fade
      const material = particlesRef.current.material as THREE.PointsMaterial;
      if (material && timeRef.current > 4) {
        material.opacity = Math.max(0, 1 - (timeRef.current - 4));
      }
    }
  });

  return (
    <group>
      {/* Initial spark before explosion */}
      {!explosionStarted.current && (
        <>
          <mesh>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
              color="#00ffff" 
              emissive="#00ffff"
              emissiveIntensity={2}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshBasicMaterial 
              color="#00ffff" 
              transparent
              opacity={0.3}
            />
          </mesh>
          <pointLight position={[0, 0, 0]} intensity={5} color="#00ffff" distance={10} />
        </>
      )}

      {/* Particle explosion */}
      <points ref={particlesRef} geometry={geometry}>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Additional glow layer for more impact */}
      {explosionStarted.current && timeRef.current < 2.5 && (
        <>
          <pointLight 
            position={[5, 0, 0]} 
            intensity={3} 
            color="#00ffff" 
            distance={30} 
          />
          <pointLight 
            position={[-5, 0, 0]} 
            intensity={3} 
            color="#ff00ff" 
            distance={30} 
          />
          <pointLight 
            position={[0, 5, 0]} 
            intensity={3} 
            color="#8b5cf6" 
            distance={30} 
          />
          <pointLight 
            position={[0, -5, 0]} 
            intensity={3} 
            color="#ffd700" 
            distance={30} 
          />
        </>
      )}

      {/* Glowing center light - more intense */}
      {explosionStarted.current && timeRef.current < 2 && (
        <>
          <pointLight 
            position={[0, 0, 0]} 
            intensity={10 - timeRef.current * 4} 
            color="#ffffff" 
            distance={40} 
          />
          <pointLight 
            position={[0, 0, 5]} 
            intensity={8 - timeRef.current * 3} 
            color="#00ffff" 
            distance={35} 
          />
        </>
      )}
    </group>
  );
}
