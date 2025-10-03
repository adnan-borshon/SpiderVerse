import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

export const Environment: React.FC = () => {
  // Generate trees positions
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    
    // Trees along the borders
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 60 + Math.random() * 20;
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ]);
    }
    
    // Random trees in distance
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      // Only place trees outside the main farm area
      if (Math.abs(x) > 40 || Math.abs(z) > 40) {
        positions.push([x, 0, z]);
      }
    }
    
    return positions;
  }, []);

  // Generate houses for neighboring farms
  const housePositions = useMemo(() => {
    return [
      [-80, 0, -60],
      [85, 0, -70],
      [-90, 0, 40],
      [95, 0, 60],
    ] as [number, number, number][];
  }, []);

  return (
    <>
      {/* River */}
      <group position={[0, -0.5, -55]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 15]} />
          <meshStandardMaterial
            color="#4A90E2"
            roughness={0.2}
            metalness={0.4}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* River banks */}
        <mesh position={[0, 0.5, -7.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 2]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
        <mesh position={[0, 0.5, 7.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 2]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
      </group>

      {/* Trees */}
      {treePositions.map((pos, i) => (
        <group key={`tree-${i}`} position={pos}>
          {/* Tree trunk */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.5, 0.7, 4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Tree foliage */}
          <mesh position={[0, 5, 0]}>
            <coneGeometry args={[3, 5, 6]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
          <mesh position={[0, 7, 0]}>
            <coneGeometry args={[2.5, 4, 6]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
        </group>
      ))}

      {/* Neighboring farm houses */}
      {housePositions.map((pos, i) => (
        <group key={`house-${i}`} position={pos}>
          {/* House base */}
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[8, 4, 10]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 4.5, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[7, 3, 4]} />
            <meshStandardMaterial color="#8B0000" />
          </mesh>
          {/* Windows */}
          <mesh position={[4.01, 2, 0]}>
            <boxGeometry args={[0.1, 1.5, 2]} />
            <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.2} />
          </mesh>
          {/* Door */}
          <mesh position={[4.01, 1, 3]}>
            <boxGeometry args={[0.1, 2.5, 1.5]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          
          {/* Small farm field near house */}
          <mesh position={[0, 0.05, 15]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[16, 20]} />
            <meshStandardMaterial color="#90EE90" />
          </mesh>
        </group>
      ))}

      {/* Roads/Paths */}
      <mesh position={[-50, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[100, 8]} />
        <meshStandardMaterial color="#696969" roughness={0.9} />
      </mesh>
      <mesh position={[50, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[100, 8]} />
        <meshStandardMaterial color="#696969" roughness={0.9} />
      </mesh>

      {/* Fence around player's farm */}
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const radius = 35;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={`fence-${i}`} position={[x, 1, z]}>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        );
      })}

      {/* Hills in the background */}
      <mesh position={[-100, 5, -100]}>
        <sphereGeometry args={[30, 8, 8]} />
        <meshStandardMaterial color="#8FBC8F" />
      </mesh>
      <mesh position={[120, 8, -90]}>
        <sphereGeometry args={[40, 8, 8]} />
        <meshStandardMaterial color="#9ACD32" />
      </mesh>
      <mesh position={[-110, 6, 100]}>
        <sphereGeometry args={[35, 8, 8]} />
        <meshStandardMaterial color="#8FBC8F" />
      </mesh>

      {/* Extended terrain for the larger world */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#7CFC00" />
      </mesh>

      {/* Farm boundaries marker */}
      <lineSegments>
        <edgesGeometry>
          <boxGeometry args={[70, 0.1, 70]} />
        </edgesGeometry>
        <lineBasicMaterial color="#FFD700" linewidth={2} />
      </lineSegments>
    </>
  );
};