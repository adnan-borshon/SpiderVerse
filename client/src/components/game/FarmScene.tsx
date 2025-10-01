import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Terrain } from './Terrain';
import { WheatField } from './WheatField';
import { WeatherSystem } from './WeatherSystem';
import { QuizMarker } from './QuizMarker';
import { IrrigationEffect } from './IrrigationEffect';
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
        
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[50, 40, 50]}
          fov={45}
        />
        
        {/* Controls */}
        <OrbitControls
          target={[0, 0, 0]}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={100}
          maxPolarAngle={Math.PI / 2.2}
        />
        
        {/* Scene objects */}
        <Terrain />
        <WheatField />
        
        {/* Quiz marker appears when quiz is active */}
        {quizActive && <QuizMarker position={[15, 5, 15]} />}
        
        {/* Irrigation effect when irrigating */}
        <IrrigationEffect active={stage1Decision === 'irrigate' && cropStage === 'planting'} />
        
        {/* Grid helper for reference */}
        <gridHelper args={[100, 20, '#444444', '#666666']} position={[0, 0.01, 0]} />
      </Suspense>
    </Canvas>
  );
};
