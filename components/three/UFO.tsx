'use client';

import { useRef, useMemo, useState, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UFOProps {
  onClick?: () => void;
  isSelected?: boolean;
}

function UFO({ onClick, isSelected }: UFOProps) {
  const ufoRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const lightsRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Memoized materials for better performance
  const materials = useMemo(() => ({
    dome: new THREE.MeshStandardMaterial({
      color: '#888888',
      metalness: 0.9,
      roughness: 0.1,
      emissive: new THREE.Color('#444444'),
      emissiveIntensity: 0.2,
    }),
    mainDisc: new THREE.MeshStandardMaterial({
      color: '#666666',
      metalness: 0.95,
      roughness: 0.05,
      emissive: new THREE.Color('#333333'),
      emissiveIntensity: 0.3,
    }),
    bottomDisc: new THREE.MeshStandardMaterial({
      color: '#555555',
      metalness: 0.9,
      roughness: 0.1,
    }),
    beam: new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    beamGlow: new THREE.MeshBasicMaterial({
      color: '#00ffff',
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  }), []);

  // Optimized animation with reduced calculations
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (ufoRef.current) {
      ufoRef.current.position.y = Math.sin(time * 0.5) * 0.3;
      ufoRef.current.rotation.y = time * 0.5; // Increased from 0.2 to 0.5
      
      const targetScale = isSelected ? 1.15 : hovered ? 1.1 : 1;
      ufoRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (beamRef.current) {
      const pulse = Math.sin(time * 2) * 0.1 + 0.9;
      beamRef.current.scale.set(pulse, 1, pulse);
      (beamRef.current.material as THREE.Material & { opacity: number }).opacity = pulse * 0.3;
    }

    if (lightsRef.current) {
      lightsRef.current.rotation.y = time * 3; // Increased from 2 to 3
    }
  });

  // Reduced light count for better performance
  const lightPositions = useMemo(() => {
    const positions = [];
    const count = 8; // Reduced from 12
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push({
        x: Math.cos(angle) * 2,
        z: Math.sin(angle) * 2,
        color: i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#ff00ff' : '#ffff00',
      });
    }
    return positions;
  }, []);

  return (
    <group 
      ref={ufoRef} 
      position={[0, 2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Top Dome */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={materials.dome} attach="material" />
      </mesh>

      {/* Main Disc */}
      <mesh>
        <cylinderGeometry args={[2.5, 2.5, 0.3, 24]} />
        <primitive object={materials.mainDisc} attach="material" />
      </mesh>

      {/* Bottom Disc */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[2, 2, 0.2, 24]} />
        <primitive object={materials.bottomDisc} attach="material" />
      </mesh>

      {/* Rotating Lights */}
      <group ref={lightsRef} position={[0, -0.2, 0]}>
        {lightPositions.map((pos, i) => (
          <mesh key={i} position={[pos.x, 0, pos.z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial 
              color={pos.color}
              emissive={pos.color}
              emissiveIntensity={2}
            />
            <pointLight 
              color={pos.color}
              intensity={0.8}
              distance={2}
            />
          </mesh>
        ))}
      </group>

      {/* Light Beam */}
      <mesh ref={beamRef} position={[0, -3, 0]}>
        <coneGeometry args={[2, 5, 16, 1, true]} />
        <primitive object={materials.beam} attach="material" />
      </mesh>

      {/* Beam glow effect */}
      <mesh position={[0, -3, 0]}>
        <coneGeometry args={[2.2, 5.2, 16, 1, true]} />
        <primitive object={materials.beamGlow} attach="material" />
      </mesh>

      {/* Enhanced lighting for UFO */}
      <pointLight 
        position={[0, -1, 0]} 
        color="#ffffff" 
        intensity={3}
        distance={10}
      />
      <pointLight 
        position={[0, 1, 0]} 
        color="#00ffff" 
        intensity={2}
        distance={6}
      />
      <spotLight
        position={[0, -0.5, 0]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={2}
        color="#ffffff"
        distance={8}
        target-position={[0, -5, 0]}
      />
    </group>
  );
}

export default memo(UFO);
