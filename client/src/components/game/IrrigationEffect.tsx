import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface IrrigationEffectProps {
  active: boolean;
}

export const IrrigationEffect: React.FC<IrrigationEffectProps> = ({ active }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  
  // Generate water spray particles
  const waterParticles = useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    const velocities = new Float32Array(1500 * 3);
    
    for (let i = 0; i < 1500; i++) {
      // Start from multiple sprinkler positions across the field
      const sprinklerX = (Math.floor(i / 150) % 5 - 2) * 20;
      const sprinklerZ = Math.floor(i / 750) * 40 - 20;
      
      positions[i * 3] = sprinklerX + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = 5 + Math.random() * 2;
      positions[i * 3 + 2] = sprinklerZ + (Math.random() - 0.5) * 2;
      
      // Spray pattern velocities
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.4;
      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = 0.5 + Math.random() * 0.5; // Upward velocity
      velocities[i * 3 + 2] = Math.sin(angle) * speed;
    }
    
    return { positions, velocities };
  }, []);
  
  useEffect(() => {
    if (active) {
      console.log('[IrrigationEffect] Starting irrigation animation');
      setIsAnimating(true);
      
      // Stop after 5 seconds
      const timer = setTimeout(() => {
        console.log('[IrrigationEffect] Stopping irrigation animation');
        setIsAnimating(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [active]);
  
  // Animate water particles
  useFrame(() => {
    if (particlesRef.current && isAnimating) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const { velocities } = waterParticles;
      const particleCount = positions.length / 3;
      
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        
        // Apply gravity and velocity
        velocities[idx + 1] -= 0.02; // Gravity
        
        positions[idx] += velocities[idx];
        positions[idx + 1] += velocities[idx + 1];
        positions[idx + 2] += velocities[idx + 2];
        
        // Reset particle when it hits ground or goes too far
        if (positions[idx + 1] < 0 || Math.abs(positions[idx]) > 50 || Math.abs(positions[idx + 2]) > 50) {
          const sprinklerX = (Math.floor(i / 150) % 5 - 2) * 20;
          const sprinklerZ = Math.floor(i / 750) * 40 - 20;
          
          positions[idx] = sprinklerX + (Math.random() - 0.5) * 2;
          positions[idx + 1] = 5 + Math.random() * 2;
          positions[idx + 2] = sprinklerZ + (Math.random() - 0.5) * 2;
          
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.3 + Math.random() * 0.4;
          velocities[idx] = Math.cos(angle) * speed;
          velocities[idx + 1] = 0.5 + Math.random() * 0.5;
          velocities[idx + 2] = Math.sin(angle) * speed;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  if (!isAnimating) return null;
  
  return (
    <group>
      {/* Water particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={waterParticles.positions.length / 3}
            array={waterParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.4}
          color="#4DA6FF"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
      
      {/* Sprinkler heads */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = (i % 5 - 2) * 20;
        const z = Math.floor(i / 5) * 40 - 20;
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Sprinkler post */}
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 5, 8]} />
              <meshStandardMaterial color="#555555" metalness={0.8} />
            </mesh>
            {/* Sprinkler head */}
            <mesh position={[0, 5, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="#3388CC" metalness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
