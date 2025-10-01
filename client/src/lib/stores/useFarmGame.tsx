import { create } from "zustand";

export type GamePhase = 'welcome' | 'tutorial' | 'stage1' | 'stage2' | 'stage3' | 'results';
export type Stage1Decision = 'irrigate' | 'noIrrigate' | null;

interface Location {
  name: string;
  coordinates: { lat: number; lon: number };
  country: string;
  climate?: string;
  mainCrop?: string;
}

interface NASAData {
  smapAnomaly: number;
  modisLST: number;
  floodRisk: number;
  ndvi: number;
}

interface Multipliers {
  germination: number;
  drought: number;
  heat: number;
  flood: number;
}

interface FarmGameState {
  // Game phase
  phase: GamePhase;
  currentStage: number;
  
  // Location
  location: Location | null;
  
  // Farm properties
  farmSize: number;
  potentialYield: number;
  
  // Financial
  budget: number;
  waterReserve: number;
  
  // Decisions
  stage1Decision: Stage1Decision;
  
  // NASA data
  nasaData: NASAData;
  
  // Multipliers
  multipliers: Multipliers;
  
  // Tutorial progress
  tutorialStep: number;
  nasaToolsUsed: {
    worldview: boolean;
    cropCASMA: boolean;
    giovanni: boolean;
    floodPathfinder: boolean;
  };
  
  // Quiz
  quizActive: boolean;
  quizScore: number;
  questionsAnswered: number;
  
  // Crop visualization state
  cropStage: 'none' | 'planting' | 'germinating' | 'sprouted' | 'growing';
  germinationRate: number;
  
  // Weather state
  weatherCondition: 'sunny' | 'cloudy' | 'rainy';
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setLocation: (location: Location) => void;
  setStage1Decision: (decision: Stage1Decision) => void;
  processStage1Decision: () => void;
  setTutorialStep: (step: number) => void;
  markNASAToolUsed: (tool: keyof FarmGameState['nasaToolsUsed']) => void;
  setQuizActive: (active: boolean) => void;
  answerQuizQuestion: (correct: boolean) => void;
  setCropStage: (stage: FarmGameState['cropStage']) => void;
  setWeatherCondition: (condition: FarmGameState['weatherCondition']) => void;
  resetGame: () => void;
}

const initialNASAData: NASAData = {
  smapAnomaly: -0.3,
  modisLST: 2.5,
  floodRisk: 0.6,
  ndvi: 0.75
};

export const useFarmGame = create<FarmGameState>((set, get) => ({
  phase: 'welcome',
  currentStage: 1,
  location: null,
  farmSize: 10,
  potentialYield: 4000,
  budget: 10000,
  waterReserve: 100,
  stage1Decision: null,
  nasaData: initialNASAData,
  multipliers: {
    germination: 1.0,
    drought: 1.0,
    heat: 1.0,
    flood: 1.0
  },
  tutorialStep: 1,
  nasaToolsUsed: {
    worldview: false,
    cropCASMA: false,
    giovanni: false,
    floodPathfinder: false
  },
  quizActive: false,
  quizScore: 0,
  questionsAnswered: 0,
  cropStage: 'none',
  germinationRate: 0,
  weatherCondition: 'sunny',
  
  setPhase: (phase) => set({ phase }),
  
  setLocation: (location) => {
    // Update NASA data based on location
    const nasaData = { ...initialNASAData };
    
    if (location.climate === 'monsoon-dependent') {
      nasaData.smapAnomaly = -0.4;
      nasaData.floodRisk = 0.7;
    } else if (location.climate === 'semi-arid') {
      nasaData.smapAnomaly = -0.5;
      nasaData.modisLST = 3.5;
    }
    
    set({ location, nasaData });
  },
  
  setStage1Decision: (decision) => set({ stage1Decision: decision }),
  
  processStage1Decision: () => {
    const { stage1Decision, nasaData } = get();
    
    if (stage1Decision === 'noIrrigate') {
      // Poor germination due to dry conditions
      const germinationRate = 0.70;
      const droughtFactor = Math.max(0.3, 1 + 0.8 * nasaData.smapAnomaly);
      
      set({
        multipliers: {
          ...get().multipliers,
          germination: germinationRate,
          drought: droughtFactor
        },
        germinationRate,
        cropStage: 'germinating',
        weatherCondition: 'sunny'
      });
    } else {
      // Good germination with irrigation
      const germinationRate = 0.95;
      
      set({
        budget: get().budget - 2000,
        waterReserve: get().waterReserve - 20,
        multipliers: {
          ...get().multipliers,
          germination: germinationRate,
          drought: 0.76
        },
        germinationRate,
        cropStage: 'germinating',
        weatherCondition: 'rainy'
      });
    }
  },
  
  setTutorialStep: (step) => set({ tutorialStep: step }),
  
  markNASAToolUsed: (tool) => set({
    nasaToolsUsed: {
      ...get().nasaToolsUsed,
      [tool]: true
    }
  }),
  
  setQuizActive: (active) => set({ quizActive: active }),
  
  answerQuizQuestion: (correct) => set({
    quizScore: get().quizScore + (correct ? 1 : 0),
    questionsAnswered: get().questionsAnswered + 1
  }),
  
  setCropStage: (stage) => set({ cropStage: stage }),
  
  setWeatherCondition: (condition) => set({ weatherCondition: condition }),
  
  resetGame: () => set({
    phase: 'welcome',
    currentStage: 1,
    location: null,
    budget: 10000,
    waterReserve: 100,
    stage1Decision: null,
    nasaData: initialNASAData,
    multipliers: {
      germination: 1.0,
      drought: 1.0,
      heat: 1.0,
      flood: 1.0
    },
    tutorialStep: 1,
    nasaToolsUsed: {
      worldview: false,
      cropCASMA: false,
      giovanni: false,
      floodPathfinder: false
    },
    quizActive: false,
    quizScore: 0,
    questionsAnswered: 0,
    cropStage: 'none',
    germinationRate: 0,
    weatherCondition: 'sunny'
  })
}));
