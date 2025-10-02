import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Irrigation water droplet particles
const IrrigationEffect: React.FC<{ active: boolean }> = ({ active }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [particles] = useState(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 15 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = -Math.random() * 0.5 - 0.3;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    
    return { positions, velocities };
  });
  
  useFrame(() => {
    if (!active || !particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += particles.velocities[i * 3];
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2];
      
      // Reset particle when it hits ground
      if (positions[i * 3 + 1] < 0.5) {
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = Math.random() * 10 + 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (!active) return null;
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#4A90E2" transparent opacity={0.7} />
    </points>
  );
};

interface WheatPlantProps {
  position: [number, number, number];
  germinated: boolean;
  growth: number;
  germinationRate: number;
  healthFactor: number; // 0-1, based on soil moisture and irrigation decisions
  heatStress: boolean; // Shows visual heat stress
}

const WheatPlant: React.FC<WheatPlantProps> = ({ position, germinated, growth, germinationRate, healthFactor, heatStress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && germinated) {
      // Gentle swaying animation - more vigorous if healthy, weaker if stressed
      const swayIntensity = heatStress ? 0.08 : 0.05;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + position[0]) * swayIntensity;
    }
    
    // Dying plants or stressed plants droop over time
    if (groupRef.current && (!germinated || healthFactor < 0.5) && growth > 0.1) {
      const droopAmount = germinated ? (1 - healthFactor) * 0.3 : Math.min(growth * 0.8, 0.6);
      groupRef.current.rotation.x = droopAmount;
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
  const height = 0.3 + growth * 5 * (0.7 + healthFactor * 0.3); // Height affected by health
  
  // Color progression: light green -> vibrant green -> golden wheat
  // Color is also affected by health and heat stress
  let baseColor = '#90EE90'; // Light green (seed stage)
  if (growth > 0.2) baseColor = '#76D275'; // Young sprout
  if (growth > 0.4) baseColor = '#4CAF50'; // Growing
  if (growth > 0.6) baseColor = '#388E3C'; // Mature green
  if (growth > 0.8) baseColor = '#7FBA00'; // Pre-harvest
  if (growth > 0.9) baseColor = '#9ACD32'; // Harvest ready
  if (growth >= 1.0) baseColor = '#DAA520'; // Fully mature golden wheat (Stage 3)
  
  // Apply health and stress modifiers to color
  let color = baseColor;
  if (healthFactor < 0.7) {
    // Stressed plants turn yellowish-brown
    const stressFactor = 1 - healthFactor;
    color = growth < 0.5 ? '#B8A678' : '#A89968'; // Yellowish stressed color
  }
  if (heatStress && healthFactor < 0.8) {
    // Heat stressed plants turn more brown/yellow
    color = growth < 0.5 ? '#C4A661' : '#B89450'; // Heat stress brown-yellow
  }
  
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
  const { cropStage, germinationRate, phase, floodOccurred, stage1Decision, stage2Decision, weatherCondition } = useFarmGame();
  const [growth, setGrowth] = React.useState(0);
  
  // Calculate health factor based on player decisions
  const healthFactor = useMemo(() => {
    let health = 1.0;
    
    // Stage 1 decision impact on health
    if (stage1Decision === 'noIrrigate') {
      health *= 0.7; // No irrigation at planting = stressed plants
    } else if (stage1Decision === 'irrigate') {
      health *= 1.0; // Irrigated = healthy
    }
    
    // Stage 2 decision impact on health
    if (phase === 'stage2' || phase === 'stage3' || phase === 'results') {
      if (stage2Decision === 'acceptHeatStress') {
        health *= 0.6; // Accepting heat stress = severe stress
      } else if (stage2Decision === 'emergencyIrrigation') {
        health *= 0.95; // Emergency irrigation helps but has slight penalty
      }
    }
    
    return Math.max(0.3, Math.min(1.0, health)); // Clamp between 0.3 and 1.0
  }, [stage1Decision, stage2Decision, phase]);
  
  // Determine if plants are experiencing heat stress
  const heatStress = useMemo(() => {
    return phase === 'stage2' && weatherCondition === 'sunny';
  }, [phase, weatherCondition]);
  
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
    } else if (cropStage === 'mature') {
      // Stage 3: Show fully mature golden wheat
      console.log('[WheatField] Stage 3 - Showing mature golden wheat');
      setGrowth(1.0);
    }
  }, [cropStage]);
  
  if (cropStage === 'none' || cropStage === 'planting') {
    return null;
  }
  
  console.log(`[WheatField] Rendering ${plantPositions.length} plants at growth ${growth.toFixed(2)}, germination rate: ${germinationRate}, health: ${healthFactor.toFixed(2)}`);
  
  // Show irrigation effect when player irrigates
  const showIrrigationEffect = useMemo(() => {
    return (stage1Decision === 'irrigate' && phase === 'stage1') ||
           (stage2Decision === 'emergencyIrrigation' && phase === 'stage2');
  }, [stage1Decision, stage2Decision, phase]);
  
  return (
    <group>
      {plantPositions.map((pos, i) => (
        <WheatPlant
          key={i}
          position={pos}
          germinated={germinationMap[i]}
          growth={growth}
          germinationRate={germinationRate}
          healthFactor={healthFactor}
          heatStress={heatStress}
        />
      ))}
      
      {/* Irrigation water droplets effect */}
      <IrrigationEffect active={showIrrigationEffect} />
      
      {/* Flood water overlay if flood occurred in Stage 3 */}
      {floodOccurred && phase === 'stage3' && (
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#4A90E2" 
            transparent 
            opacity={0.6} 
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>
      )}
    </group>
  );
};
