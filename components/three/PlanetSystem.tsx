'use client';

import { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetData {
  id: string;
  name: string;
  type: string;
  color: string;
  size: number;
  distance: number;
}

interface PlanetSystemProps {
  data: PlanetData[];
  onPlanetClick: (id: string) => void;
  selectedPlanet: string | null;
}

interface PlanetStyle {
  color: string;
  hasRings: boolean;
  ringColor?: string;
  moons: number;
  shininess: number;
}

// Optimized Moon component
function Moon({ size, distance, speed }: { size: number; distance: number; speed: number }) {
  const moonRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.getElapsedTime() * speed;
    }
  });

  return (
    <group ref={moonRef}>
      <mesh position={[distance, 0, 0]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshPhongMaterial color="#A0A0A0" shininess={10} specular="#555555" />
      </mesh>
    </group>
  );
}

// Planet component
function Planet({ data, onClick, isSelected }: { data: PlanetData; onClick: () => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Mobile-responsive sizing
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const sizeMultiplier = isMobile ? 1.5 : 1; // 50% larger on mobile
  const adjustedSize = data.size * sizeMultiplier;

  // Planet styling configuration
  const getPlanetStyle = useCallback((): PlanetStyle => {
    const styles: Record<string, PlanetStyle> = {
      'sports-excitement': {
        color: '#C8A870',
        hasRings: true,
        ringColor: '#B89968',
        moons: 2,
        shininess: 20,
      },
      'accenture': {
        color: '#4A7BA7',
        hasRings: false,
        moons: 1,
        shininess: 40,
      },
      'uncc-ta-swe': {
        color: '#A67C52',
        hasRings: false,
        moons: 2,
        shininess: 25,
      },
      'uncc-ta-logic': {
        color: '#5B7FBF',
        hasRings: false,
        moons: 1,
        shininess: 35,
      },
    };

    return styles[data.id] || {
      color: data.color,
      hasRings: false,
      moons: 0,
      shininess: 30,
    };
  }, [data.id, data.color]);

  const style = getPlanetStyle();

  // Unique starting angle for each planet
  const startingAngle = useMemo(() => {
    const hash = data.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 360) * (Math.PI / 180);
  }, [data.id]);

  useFrame((state) => {
    if (!orbitRef.current || !meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const speed = 0.12 / data.distance;
    
    orbitRef.current.rotation.y = startingAngle + (time * speed);
    meshRef.current.rotation.y = time * 0.2;

    // Scale animation when selected
    const targetScale = isSelected ? Math.sin(time * 2) * 0.05 + 1 : 1;
    meshRef.current.scale.setScalar(targetScale);
  });

  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(true);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'pointer';
    }
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'auto';
    }
  }, []);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    console.log('Planet clicked:', data.id); // Debug log
    onClick();
  }, [onClick, data.id]);

  return (
    <group ref={orbitRef}>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.02, data.distance + 0.02, 128]} />
        <meshBasicMaterial
          color={isSelected ? '#FFFFFF' : '#888888'}
          transparent
          opacity={isSelected ? 0.7 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Planet group */}
      <group position={[data.distance, 0, 0]}>
        {/* Main planet */}
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          raycast={undefined}
        >
          <sphereGeometry args={[adjustedSize, 48, 48]} />
          <meshPhongMaterial
            color={style.color}
            emissive={isSelected || hovered ? style.color : '#000000'}
            emissiveIntensity={isSelected ? 0.3 : hovered ? 0.15 : 0}
            shininess={style.shininess}
            specular="#666666"
            depthTest={true}
            depthWrite={true}
          />
        </mesh>

        {/* Rings */}
        {style.hasRings && (
          <>
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
              <ringGeometry args={[adjustedSize * 1.4, adjustedSize * 2.3, 64]} />
              <meshPhongMaterial
                color={style.ringColor}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
                shininess={5}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
              <ringGeometry args={[adjustedSize * 1.35, adjustedSize * 1.45, 64]} />
              <meshBasicMaterial
                color="#8B7355"
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </>
        )}

        {/* Moons */}
        {style.moons > 0 &&
          Array.from({ length: style.moons }).map((_, i) => (
            <Moon
              key={i}
              size={adjustedSize * 0.25}
              distance={adjustedSize * (2.5 + i * 0.8)}
              speed={1.5 + i * 0.5}
            />
          ))}
      </group>
    </group>
  );
}

// Optimized Asteroid Belt
function AsteroidBelt() {
  const asteroidRef = useRef<THREE.Points>(null);

  const { positions, geometry } = useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    const innerRadius = 8.5;
    const outerRadius = 9.5;

    for (let i = 0; i < 1500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const height = (Math.random() - 0.5) * 0.3;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    return { positions, geometry: geo };
  }, []);

  useFrame((state) => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={asteroidRef} geometry={geometry}>
      <pointsMaterial size={0.03} color="#888888" transparent opacity={0.6} />
    </points>
  );
}

// Optimized Starfield
function Starfield() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
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

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

// Sun component
function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const sunGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (sunRef.current) {
      sunRef.current.rotation.y = time * 0.05;
      sunRef.current.scale.setScalar(Math.sin(time * 0.8) * 0.03 + 1);
    }

    if (sunGlowRef.current) {
      sunGlowRef.current.scale.setScalar(Math.sin(time * 0.8) * 0.05 + 1);
    }
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#FFEB3B" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#FFD54F" transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#FFB74D" transparent opacity={0.8} />
      </mesh>
      <mesh ref={sunGlowRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#FF9800" transparent opacity={0.6} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshBasicMaterial color="#FF6F00" transparent opacity={0.4} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#E65100" transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// Main PlanetSystem component
export default function PlanetSystem({ data, onPlanetClick, selectedPlanet }: PlanetSystemProps) {
  if (!data || data.length === 0) return null;

  return (
    <group>
      <Starfield />
      <Sun />
      <AsteroidBelt />
      {data.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          onClick={() => onPlanetClick(planet.id)}
          isSelected={selectedPlanet === planet.id}
        />
      ))}
    </group>
  );
}
