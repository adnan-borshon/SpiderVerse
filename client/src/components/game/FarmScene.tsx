import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Fog } from '@react-three/drei';
import { Terrain } from './Terrain';
import { WheatField } from './WheatField';
import { WeatherSystem } from './WeatherSystem';
import { QuizMarker } from './QuizMarker';
import { IrrigationEffect } from './IrrigationEffect';
import { Environment } from './Environment';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import * as THREE from 'three';

export const FarmScene: React.FC = () => {
  const { quizActive, stage1Decision, cropStage } = useFarmGame();
  
  return (
    <Canvas shadows className="w-full h-full">
      <Suspense fallback={null}>
        <WeatherSystem />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[50, 50, 50]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        
        {/* Camera - positioned to show the expanded world */}
        <PerspectiveCamera
          makeDefault
          position={[70, 60, 70]}
          fov={50}
        />
        
        {/* Controls - allow viewing the larger world but focused on farm */}
        <OrbitControls
          target={[0, 0, 0]}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={30}
          maxDistance={200}
          maxPolarAngle={Math.PI / 2.2}
          panSpeed={0.5}
        />
        
        {/* Fog for depth perception */}
        <fog attach="fog" args={['#E6F3FF', 100, 300]} />
        
        {/* Scene objects */}
        <Environment />
        <Terrain />
        <WheatField />
        
        {/* Quiz marker appears when quiz is active */}
        {quizActive && <QuizMarker position={[15, 5, 15]} />}
        
        {/* Irrigation effect when irrigating */}
        <IrrigationEffect active={stage1Decision === 'irrigate' && cropStage === 'planting'} />
        
        {/* Farm area grid helper */}
        <gridHelper args={[70, 14, '#FFD700', '#FFA500']} position={[0, 0.01, 0]} />
      </Suspense>
    </Canvas>
  );
};
