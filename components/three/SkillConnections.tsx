'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Connection {
  start: [number, number, number];
  end: [number, number, number];
}

interface SkillConnectionsProps {
  connections: Connection[];
}

export default function SkillConnections({ connections }: SkillConnectionsProps) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const points: number[] = [];
    
    connections.forEach(({ start, end }) => {
      points.push(start[0], start[1], start[2]);
      points.push(end[0], end[1], end[2]);
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [connections]);

  useFrame((state) => {
    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.25}
        linewidth={2}
      />
    </lineSegments>
  );
}
