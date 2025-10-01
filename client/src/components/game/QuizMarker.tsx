import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface QuizMarkerProps {
  position: [number, number, number];
}

export const QuizMarker: React.FC<QuizMarkerProps> = ({ position }) => {
  const markerRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (markerRef.current) {
      // Floating animation
      markerRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      markerRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    
    if (ringRef.current) {
      // Pulsing ring animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <group ref={markerRef} position={position}>
      {/* Central sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color="#4A90E2" 
          emissive="#2E5C8A"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.1, 8, 32]} />
        <meshStandardMaterial 
          color="#6BA3FF" 
          emissive="#4A90E2"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Quiz icon text */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.8}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        ?
      </Text>
      
      {/* Label above */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        QUIZ ACTIVITY
      </Text>
      
      {/* Particle effects around marker */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#4A90E2" transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
};
