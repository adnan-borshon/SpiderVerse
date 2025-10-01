import React, { useRef, useMemo, useEffect } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface WheatPlantProps {
  position: [number, number, number];
  germinated: boolean;
  growth: number;
}

const WheatPlant: React.FC<WheatPlantProps> = ({ position, germinated, growth }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && germinated) {
      // Gentle swaying animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
    }
  });
  
  if (!germinated) {
    // Show seed/failed germination
    return (
      <mesh position={position} ref={meshRef}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    );
  }
  
  // Calculate plant dimensions based on growth
  const height = 0.5 + growth * 4;
  const color = growth < 0.3 ? '#90EE90' : growth < 0.7 ? '#228B22' : '#7FBA00';
  
  return (
    <group position={position}>
      {/* Stem */}
      <mesh ref={meshRef} position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.04, height, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Leaves (appear at 30% growth) */}
      {growth > 0.3 && (
        <>
          <mesh position={[0.15, height * 0.4, 0]} rotation={[0, 0, Math.PI / 6]}>
            <planeGeometry args={[0.3, 0.1]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[-0.15, height * 0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <planeGeometry args={[0.3, 0.1]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      
      {/* Wheat head (appears at 80% growth) */}
      {growth > 0.8 && (
        <mesh position={[0, height + 0.2, 0]}>
          <coneGeometry args={[0.08, 0.3, 8]} />
          <meshStandardMaterial color="#DAA520" />
        </mesh>
      )}
    </group>
  );
};

export const WheatField: React.FC = () => {
  const { cropStage, germinationRate } = useFarmGame();
  const [growth, setGrowth] = React.useState(0);
  
  // Pre-calculate plant positions
  const plantPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let x = -40; x <= 40; x += 5) {
      for (let z = -40; z <= 40; z += 5) {
        // Add slight random offset
        const offsetX = (Math.random() - 0.5) * 1;
        const offsetZ = (Math.random() - 0.5) * 1;
        positions.push([x + offsetX, 0, z + offsetZ]);
      }
    }
    return positions;
  }, []);
  
  // Pre-calculate which plants germinated
  const germinationMap = useMemo(() => {
    return plantPositions.map(() => Math.random() < germinationRate);
  }, [plantPositions, germinationRate]);
  
  // Animate growth over time
  useEffect(() => {
    if (cropStage === 'germinating' || cropStage === 'sprouted' || cropStage === 'growing') {
      const interval = setInterval(() => {
        setGrowth(prev => {
          const newGrowth = prev + 0.01;
          if (newGrowth >= 1) {
            clearInterval(interval);
            return 1;
          }
          return newGrowth;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [cropStage]);
  
  if (cropStage === 'none' || cropStage === 'planting') {
    return null;
  }
  
  return (
    <group>
      {plantPositions.map((pos, i) => (
        <WheatPlant
          key={i}
          position={pos}
          germinated={germinationMap[i]}
          growth={growth}
        />
      ))}
    </group>
  );
};
