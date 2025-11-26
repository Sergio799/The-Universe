'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface SkillSphereProps {
  position: [number, number, number];
  name: string;
  color: string;
  onClick?: () => void;
}

export default function SkillSphere({ position, name, color, onClick }: SkillSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation with slight rotation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
      meshRef.current.rotation.y += 0.005;
      
      // Pulse effect when hovered
      const targetScale = hovered ? 1.4 : clicked ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );
    }
  });

  const handleClick = () => {
    setClicked(!clicked);
    onClick?.();
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.6}
          roughness={0.1}
          metalness={1}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.5 : 0.25}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Extra glow layer for depth */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Skill name label with pill background - VISIBLE */}
      <Html
        position={[0, -0.9, 0]}
        center
        distanceFactor={3}
        occlude={false}
        zIndexRange={[1000, 0]}
        sprite
        transform
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'block',
          visibility: 'visible',
        }}
      >
        <div
          className="px-4 py-2 rounded-full text-white font-bold whitespace-nowrap"
          style={{
            backgroundColor: `${color}dd`,
            boxShadow: `0 0 20px ${color}99, 0 0 40px ${color}55`,
            border: `2px solid ${color}`,
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            transform: hovered ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.3s ease',
            minWidth: '80px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '700',
            display: 'block',
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}
