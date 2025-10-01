import React, { useRef, useMemo } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

export const WeatherSystem: React.FC = () => {
  const { weatherCondition } = useFarmGame();
  const rainRef = useRef<THREE.Points>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  
  // Generate more rain particles for better visibility
  const rainParticles = useMemo(() => {
    const positions = new Float32Array(2000 * 3); // Doubled particle count
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 50 + 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);
  
  // Animate rain falling and sun glow
  useFrame((state) => {
    if (rainRef.current && weatherCondition === 'rainy') {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.8; // Faster fall speed for more dramatic effect
        
        // Reset particle when it hits ground
        if (positions[i + 1] < 0) {
          positions[i + 1] = 50 + Math.random() * 20;
        }
      }
      
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate sun glow
    if (sunRef.current && weatherCondition === 'sunny') {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      sunRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
  });
  
  return (
    <>
      {/* Sky color based on weather */}
      <color
        attach="background"
        args={[
          weatherCondition === 'sunny' ? '#87CEEB' :
          weatherCondition === 'cloudy' ? '#B0C4DE' :
          '#708090'
        ]}
      />
      
      {/* Sun with rays */}
      {weatherCondition === 'sunny' && (
        <group position={[40, 40, -40]}>
          {/* Sun core */}
          <mesh ref={sunRef}>
            <sphereGeometry args={[5, 32, 32]} />
            <meshBasicMaterial color="#FDB813" />
          </mesh>
          {/* Sun glow */}
          <mesh>
            <sphereGeometry args={[6.5, 32, 32]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
          </mesh>
          {/* Sun rays */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x = Math.cos(angle) * 8;
            const y = Math.sin(angle) * 8;
            return (
              <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
                <coneGeometry args={[0.5, 4, 4]} />
                <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Clouds - larger and more prominent */}
      {(weatherCondition === 'cloudy' || weatherCondition === 'rainy') && (
        <group>
          {Array.from({ length: 12 }).map((_, i) => {
            const x = (i % 4 - 1.5) * 25;
            const z = Math.floor(i / 4) * 30 - 40;
            const yOffset = Math.floor(i / 4) * 2;
            return (
              <mesh key={i} position={[x, 35 + yOffset, z]}>
                <sphereGeometry args={[10, 16, 16]} />
                <meshStandardMaterial
                  color={weatherCondition === 'rainy' ? '#444444' : '#FFFFFF'}
                  transparent
                  opacity={weatherCondition === 'rainy' ? 0.9 : 0.8}
                />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Rain particles - larger and more visible */}
      {weatherCondition === 'rainy' && (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={rainParticles.length / 3}
              array={rainParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.5}
            color="#6BA3FF"
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}
    </>
  );
};
