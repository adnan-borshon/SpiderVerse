import { useEffect, useRef } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { Howl } from 'howler';

export const SoundManager: React.FC = () => {
  const { weatherCondition, stage1Decision, cropStage, quizActive } = useFarmGame();
  const soundsRef = useRef<{ [key: string]: Howl }>({});
  const isPlayingRef = useRef<{ [key: string]: boolean }>({});
  
  useEffect(() => {
    console.log('[SoundManager] Initializing sounds');
    
    // Initialize all sound effects
    soundsRef.current = {
      background: new Howl({
        src: ['/sounds/background.mp3'],
        loop: true,
        volume: 0.3
      }),
      success: new Howl({
        src: ['/sounds/success.mp3'],
        volume: 0.5
      }),
      // Create rain sound by looping hit sound at different rates
      rain: new Howl({
        src: ['/sounds/hit.mp3'],
        loop: true,
        volume: 0.15,
        rate: 0.5
      })
    };
    
    // Start background music
    soundsRef.current.background.play();
    console.log('[SoundManager] Background music started');
    
    return () => {
      // Cleanup all sounds
      Object.values(soundsRef.current).forEach(sound => sound.stop());
    };
  }, []);
  
  // Handle weather sounds
  useEffect(() => {
    const rainSound = soundsRef.current.rain;
    
    if (weatherCondition === 'rainy') {
      if (!isPlayingRef.current.rain) {
        console.log('[SoundManager] Starting rain sound');
        rainSound?.play();
        isPlayingRef.current.rain = true;
      }
    } else {
      if (isPlayingRef.current.rain) {
        console.log('[SoundManager] Stopping rain sound');
        rainSound?.stop();
        isPlayingRef.current.rain = false;
      }
    }
  }, [weatherCondition]);
  
  // Handle irrigation sound
  useEffect(() => {
    if (stage1Decision === 'irrigate' && cropStage === 'planting') {
      console.log('[SoundManager] Playing irrigation sound effect');
      // Use success sound for irrigation
      soundsRef.current.success?.play();
    }
  }, [stage1Decision, cropStage]);
  
  // Handle quiz activation sound
  useEffect(() => {
    if (quizActive) {
      console.log('[SoundManager] Playing quiz activation sound');
      soundsRef.current.success?.play();
    }
  }, [quizActive]);
  
  return null; // This component doesn't render anything
};
