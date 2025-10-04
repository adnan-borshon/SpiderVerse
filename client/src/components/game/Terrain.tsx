import React, { useMemo } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import * as THREE from 'three';

export const Terrain: React.FC = () => {
  const { nasaData, stage1Decision, cropStage, phase, location } = useFarmGame();
  
  // Debug logging
  React.useEffect(() => {
    console.log('🏞️ Terrain Debug:', {
      nasaData,
      stage1Decision,
      cropStage,
      phase,
      location: location?.name
    });
  }, [nasaData, stage1Decision, cropStage, phase, location]);

  // Handle null nasaData with fallback values
  const currentNASAData = nasaData || {
    smapAnomaly: -0.3,
    modisLST: 2.5,
    floodRisk: 0.6,
    ndvi: 0.75
  };

  // Determine soil color based on moisture and stage
  const soilColor = useMemo(() => {
    console.log('🎨 Calculating soil color:', {
      smapAnomaly: currentNASAData.smapAnomaly,
      cropStage,
      location: location?.name
    });

    // Before planting or during planting, show brown soil
    if (cropStage === 'none' || cropStage === 'planting') {
      const anomaly = currentNASAData.smapAnomaly;
      if (anomaly < -0.4) return '#6B4423'; // Very dry - dark brown
      if (anomaly < -0.2) return '#8B6914'; // Dry - medium brown
      if (anomaly < 0) return '#A0792C'; // Slightly dry - light brown
      return '#654321'; // Normal - rich soil brown
    }
    
    // After planting, show soil with green tint (vegetation growing)
    return '#5A5A3A'; // Dark greenish brown (soil with vegetation)
  }, [currentNASAData.smapAnomaly, cropStage, location]);
  
  // Generate plowed field rows
  const plowedRows = useMemo(() => {
    console.log('🚜 Generating plowed rows for:', location?.name || 'unknown location');
    
    const rows: JSX.Element[] = [];
    const numRows = 18;
    const rowSpacing = 3.5;
    const startZ = -(numRows / 2) * rowSpacing;
    
    for (let i = 0; i < numRows; i++) {
      const z = startZ + i * rowSpacing;
      rows.push(
        <mesh key={`row-${i}`} position={[0, 0.05, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[60, 2.8]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#543A1F' : '#4A3319'} 
            roughness={0.95}
          />
        </mesh>
      );
      
      // Add furrow between rows
      rows.push(
        <mesh key={`furrow-${i}`} position={[0, 0.08, z - 1.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[60, 0.6]} />
          <meshStandardMaterial 
            color="#3A2815" 
            roughness={1.0}
          />
        </mesh>
      );
    }
    
    return rows;
  }, [location]);
  
  // Show cracks in dry soil before irrigation
  const showCracks = currentNASAData.smapAnomaly < -0.3 && !stage1Decision;

  console.log('🏜️ Terrain Conditions:', {
    showCracks,
    soilMoisture: currentNASAData.smapAnomaly,
    hasIrrigation: stage1Decision === 'irrigate',
    cropStage,
    location: location?.name
  });

  return (
    <group>
      {/* Base terrain - larger area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial
          color={soilColor}
          roughness={0.9}
        />
      </mesh>
      
      {/* Plowed field rows - only show before crops are mature */}
      {(cropStage === 'none' || cropStage === 'planting' || cropStage === 'germinating' || cropStage === 'sprouted') && (
        <group>{plowedRows}</group>
      )}
      
      {/* Dry soil cracks overlay - before irrigation */}
      {showCracks && (
        <group position={[0, 0.11, 0]}>
          {Array.from({ length: 25 }).map((_, i) => {
            const x = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 60;
            const rotation = Math.random() * Math.PI;
            const length = 2 + Math.random() * 4;
            return (
              <mesh key={i} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, rotation]}>
                <planeGeometry args={[length, 0.15]} />
                <meshBasicMaterial color="#2A1810" transparent opacity={0.7} />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Wet soil patches (after irrigation) */}
      {stage1Decision === 'irrigate' && cropStage !== 'none' && (
        <group position={[0, 0.12, 0]}>
          {Array.from({ length: 30 }).map((_, i) => {
            const x = (Math.random() - 0.5) * 55;
            const z = (Math.random() - 0.5) * 55;
            return (
              <mesh key={i} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.5 + Math.random() * 2, 16]} />
                <meshStandardMaterial 
                  color="#3A3A2A" 
                  transparent 
                  opacity={0.6} 
                  roughness={0.3}
                  metalness={0.1}
                />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Flood water overlay (if flood occurred in stage 3) */}
      {cropStage === 'harvested' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
          <planeGeometry args={[70, 70]} />
          <meshStandardMaterial
            color="#1E3A8A"
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      )}
      
      {/* Field borders - wooden stakes and string */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 32;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={`stake-${i}`} position={[x, 0.8, z]}>
            <cylinderGeometry args={[0.15, 0.15, 1.6]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Location marker sign */}
      {location && (
        <group position={[0, 2, -25]}>
          {/* Sign post */}
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
          {/* Sign board */}
          <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[3, 1, 0.1]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.7} />
          </mesh>
          {/* Sign text area (simplified) */}
          <mesh position={[0, 0.5, 0.06]} rotation={[0, 0, 0]}>
            <planeGeometry args={[2.8, 0.8]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};