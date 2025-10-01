import React, { useMemo } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export const Terrain: React.FC = () => {
  const { nasaData, stage1Decision } = useFarmGame();
  const grassTexture = useTexture('/textures/grass.png');
  
  // Configure texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10);
  
  // Determine soil color based on moisture
  const soilColor = useMemo(() => {
    const anomaly = nasaData.smapAnomaly;
    if (anomaly < -0.4) return '#8B6914'; // Very dry - dark brown
    if (anomaly < -0.2) return '#A0792C'; // Dry - medium brown
    if (anomaly < 0) return '#B8956A'; // Slightly dry - light brown
    return '#7A6D5A'; // Normal - greenish brown
  }, [nasaData.smapAnomaly]);
  
  // Show cracks in dry soil
  const showCracks = nasaData.smapAnomaly < -0.3;
  
  return (
    <group>
      {/* Main terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 32, 32]} />
        <meshStandardMaterial
          map={grassTexture}
          color={soilColor}
          roughness={0.8}
        />
      </mesh>
      
      {/* Dry soil cracks overlay */}
      {showCracks && (
        <group position={[0, 0.01, 0]}>
          {Array.from({ length: 20 }).map((_, i) => {
            const x = (Math.random() - 0.5) * 80;
            const z = (Math.random() - 0.5) * 80;
            const rotation = Math.random() * Math.PI;
            return (
              <mesh key={i} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, rotation]}>
                <planeGeometry args={[2 + Math.random() * 3, 0.1]} />
                <meshBasicMaterial color="#5C4A33" transparent opacity={0.6} />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Wet soil patches (after irrigation) */}
      {stage1Decision === 'irrigate' && (
        <group position={[0, 0.02, 0]}>
          {Array.from({ length: 15 }).map((_, i) => {
            const x = (Math.random() - 0.5) * 70;
            const z = (Math.random() - 0.5) * 70;
            return (
              <mesh key={i} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[3 + Math.random() * 2, 16]} />
                <meshStandardMaterial color="#4A5A3A" transparent opacity={0.5} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
};
