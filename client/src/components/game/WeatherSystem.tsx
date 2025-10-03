import React, { useRef, useMemo } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

export const WeatherSystem: React.FC = () => {
  const { weatherCondition } = useFarmGame();
  const rainRef = useRef<THREE.Points>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const heatWaveRef = useRef<THREE.Points>(null);
  
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
  
  // Generate heat wave shimmer particles
  const heatWaveParticles = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 10 + 0.5; // Near ground level
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);
  
  // Animate weather effects
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
    
    // Animate sun glow for normal and heatwave
    if (sunRef.current && (weatherCondition === 'sunny' || weatherCondition === 'heatwave')) {
      const intensity = weatherCondition === 'heatwave' ? 0.15 : 0.05;
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * intensity;
      sunRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
    
    // Animate heat wave shimmer
    if (heatWaveRef.current && weatherCondition === 'heatwave') {
      const positions = heatWaveRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Create rising heat shimmer effect
        positions[i + 1] += 0.05;
        positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.02;
        
        // Reset particle when it rises too high
        if (positions[i + 1] > 10) {
          positions[i + 1] = 0.5;
        }
      }
      
      heatWaveRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <>
      {/* Sky color based on weather */}
      <color
        attach="background"
        args={[
          weatherCondition === 'heatwave' ? '#FFA366' : // Orange-reddish for heatwave
          weatherCondition === 'sunny' ? '#87CEEB' :
          weatherCondition === 'cloudy' ? '#B0C4DE' :
          '#708090'
        ]}
      />
      
      {/* Sun with rays - shows for sunny and heatwave */}
      {(weatherCondition === 'sunny' || weatherCondition === 'heatwave') && (
        <group position={[40, 40, -40]}>
          {/* Sun core - more intense for heatwave */}
          <mesh ref={sunRef}>
            <sphereGeometry args={[weatherCondition === 'heatwave' ? 7 : 5, 32, 32]} />
            <meshBasicMaterial color={weatherCondition === 'heatwave' ? "#FF6B35" : "#FDB813"} />
          </mesh>
          {/* Sun glow - larger and more intense for heatwave */}
          <mesh>
            <sphereGeometry args={[weatherCondition === 'heatwave' ? 10 : 6.5, 32, 32]} />
            <meshBasicMaterial 
              color={weatherCondition === 'heatwave' ? "#FF8C42" : "#FFD700"} 
              transparent 
              opacity={weatherCondition === 'heatwave' ? 0.5 : 0.3} 
            />
          </mesh>
          {/* Sun rays - more prominent during heatwave */}
          {Array.from({ length: weatherCondition === 'heatwave' ? 16 : 12 }).map((_, i) => {
            const rayCount = weatherCondition === 'heatwave' ? 16 : 12;
            const angle = (i / rayCount) * Math.PI * 2;
            const distance = weatherCondition === 'heatwave' ? 12 : 8;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            return (
              <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
                <coneGeometry args={[weatherCondition === 'heatwave' ? 0.8 : 0.5, weatherCondition === 'heatwave' ? 6 : 4, 4]} />
                <meshBasicMaterial 
                  color={weatherCondition === 'heatwave' ? "#FF8C42" : "#FFD700"} 
                  transparent 
                  opacity={weatherCondition === 'heatwave' ? 0.8 : 0.6} 
                />
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
      
      {/* Heat wave shimmer particles */}
      {weatherCondition === 'heatwave' && (
        <points ref={heatWaveRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={heatWaveParticles.length / 3}
              array={heatWaveParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.3}
            color="#FFAA00"
            transparent
            opacity={0.4}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </>
  );
};
