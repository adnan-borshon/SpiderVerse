import React, { useRef, useMemo } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

export const WeatherSystem: React.FC = () => {
  const { weatherCondition } = useFarmGame();
  const rainRef = useRef<THREE.Points>(null);
  
  // Generate rain particles
  const rainParticles = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 50 + 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);
  
  // Animate rain falling
  useFrame(() => {
    if (rainRef.current && weatherCondition === 'rainy') {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.5; // Fall speed
        
        // Reset particle when it hits ground
        if (positions[i + 1] < 0) {
          positions[i + 1] = 50 + Math.random() * 20;
        }
      }
      
      rainRef.current.geometry.attributes.position.needsUpdate = true;
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
      
      {/* Sun */}
      {weatherCondition === 'sunny' && (
        <mesh position={[40, 40, -40]}>
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial color="#FDB813" />
        </mesh>
      )}
      
      {/* Clouds */}
      {(weatherCondition === 'cloudy' || weatherCondition === 'rainy') && (
        <group>
          {Array.from({ length: 8 }).map((_, i) => {
            const x = (i % 4 - 1.5) * 25;
            const z = Math.floor(i / 4) * 30 - 40;
            return (
              <mesh key={i} position={[x, 35, z]}>
                <sphereGeometry args={[8, 16, 16]} />
                <meshStandardMaterial
                  color={weatherCondition === 'rainy' ? '#555555' : '#FFFFFF'}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Rain particles */}
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
            size={0.3}
            color="#4488FF"
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
    </>
  );
};
