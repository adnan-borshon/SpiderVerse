import React, { useRef, useMemo, useEffect } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface WheatPlantProps {
  position: [number, number, number];
  germinated: boolean;
  growth: number;
  germinationRate: number;
}

const WheatPlant: React.FC<WheatPlantProps> = ({ position, germinated, growth, germinationRate }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && germinated) {
      // Gentle swaying animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
    }
    
    // Dying plants droop over time
    if (groupRef.current && !germinated && growth > 0.1) {
      groupRef.current.rotation.x = Math.min(growth * 0.8, 0.6);
    }
  });
  
  // Failed germination - show withering seed
  if (!germinated) {
    const witherColor = growth < 0.3 ? '#8B7355' : growth < 0.6 ? '#6B4423' : '#3D2817';
    const witherSize = 0.15 - growth * 0.05;
    
    return (
      <group ref={groupRef} position={position}>
        <mesh position={[0, witherSize / 2, 0]}>
          <sphereGeometry args={[witherSize, 8, 8]} />
          <meshStandardMaterial color={witherColor} roughness={0.9} />
        </mesh>
        {/* Small dead sprout for visual feedback */}
        {growth > 0.3 && (
          <mesh position={[0, 0.2, 0]} rotation={[0.3, 0, 0.2]}>
            <cylinderGeometry args={[0.01, 0.02, 0.3, 4]} />
            <meshStandardMaterial color="#4A3728" />
          </mesh>
        )}
      </group>
    );
  }
  
  // Calculate plant dimensions based on growth with more dramatic stages
  const height = 0.3 + growth * 5; // Taller plants
  
  // Color progression: light green -> vibrant green -> golden wheat
  let color = '#90EE90'; // Light green (seed stage)
  if (growth > 0.2) color = '#76D275'; // Young sprout
  if (growth > 0.4) color = '#4CAF50'; // Growing
  if (growth > 0.6) color = '#388E3C'; // Mature green
  if (growth > 0.8) color = '#7FBA00'; // Pre-harvest
  if (growth > 0.9) color = '#9ACD32'; // Harvest ready
  
  return (
    <group position={position}>
      {/* Stem - thicker and more visible */}
      <mesh ref={meshRef} position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.06, height, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      
      {/* Early leaves (appear at 20% growth) */}
      {growth > 0.2 && (
        <>
          <mesh position={[0.2, height * 0.3, 0]} rotation={[0, 0, Math.PI / 5]} castShadow>
            <planeGeometry args={[0.4, 0.15]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[-0.2, height * 0.35, 0]} rotation={[0, 0, -Math.PI / 5]} castShadow>
            <planeGeometry args={[0.4, 0.15]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      
      {/* Middle leaves (appear at 40% growth) */}
      {growth > 0.4 && (
        <>
          <mesh position={[0, height * 0.5, 0.2]} rotation={[Math.PI / 6, 0, 0]} castShadow>
            <planeGeometry args={[0.35, 0.12]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, height * 0.55, -0.2]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
            <planeGeometry args={[0.35, 0.12]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      
      {/* Upper leaves (appear at 60% growth) */}
      {growth > 0.6 && (
        <>
          <mesh position={[0.15, height * 0.7, 0]} rotation={[0, 0, Math.PI / 7]} castShadow>
            <planeGeometry args={[0.5, 0.18]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[-0.15, height * 0.72, 0]} rotation={[0, 0, -Math.PI / 7]} castShadow>
            <planeGeometry args={[0.5, 0.18]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      
      {/* Wheat head (appears at 75% growth) */}
      {growth > 0.75 && (
        <group position={[0, height + 0.15, 0]}>
          <mesh castShadow>
            <coneGeometry args={[0.12, 0.4, 8]} />
            <meshStandardMaterial 
              color={growth > 0.9 ? '#DAA520' : '#C4A23E'} 
              roughness={0.8}
            />
          </mesh>
          {/* Wheat awns (bristles) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * 0.08;
            const z = Math.sin(angle) * 0.08;
            return (
              <mesh key={i} position={[x, 0.2, z]} rotation={[Math.PI / 6, angle, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.3, 3]} />
                <meshStandardMaterial color="#D4AF37" />
              </mesh>
            );
          })}
        </group>
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
  
  // Animate growth over time with faster, more visible progression
  useEffect(() => {
    if (cropStage === 'germinating' || cropStage === 'sprouted' || cropStage === 'growing') {
      console.log(`[WheatField] Starting growth animation at stage: ${cropStage}`);
      setGrowth(0); // Reset growth when starting
      
      const interval = setInterval(() => {
        setGrowth(prev => {
          const newGrowth = prev + 0.015; // Faster growth (was 0.01)
          if (newGrowth >= 1) {
            console.log('[WheatField] Crop fully grown!');
            clearInterval(interval);
            return 1;
          }
          
          // Log growth milestones
          if (newGrowth > 0.2 && prev <= 0.2) console.log('[WheatField] Sprouting (20%)');
          if (newGrowth > 0.4 && prev <= 0.4) console.log('[WheatField] Growing (40%)');
          if (newGrowth > 0.6 && prev <= 0.6) console.log('[WheatField] Maturing (60%)');
          if (newGrowth > 0.8 && prev <= 0.8) console.log('[WheatField] Nearly ready (80%)');
          
          return newGrowth;
        });
      }, 80); // Faster update rate (was 100ms)
      
      return () => clearInterval(interval);
    }
  }, [cropStage]);
  
  if (cropStage === 'none' || cropStage === 'planting') {
    return null;
  }
  
  console.log(`[WheatField] Rendering ${plantPositions.length} plants at growth ${growth.toFixed(2)}, germination rate: ${germinationRate}`);
  
  return (
    <group>
      {plantPositions.map((pos, i) => (
        <WheatPlant
          key={i}
          position={pos}
          germinated={germinationMap[i]}
          growth={growth}
          germinationRate={germinationRate}
        />
      ))}
    </group>
  );
};
