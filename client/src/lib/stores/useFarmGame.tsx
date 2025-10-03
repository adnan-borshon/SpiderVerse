import { create } from "zustand";

export type GamePhase = 'welcome' | 'tutorial' | 'stage1' | 'stage2' | 'stage3' | 'results';
export type Stage1Decision = 'irrigate' | 'noIrrigate' | null;
export type Stage2Decision = 'emergencyIrrigation' | 'acceptHeatStress' | null;
export type Stage3Decision = 'harvestEarly' | 'waitForRipeness' | null;

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
  stage2Decision: Stage2Decision;
  stage3Decision: Stage3Decision;
  
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
  cropStage: 'none' | 'planting' | 'germinating' | 'sprouted' | 'growing' | 'mature' | 'harvested';
  germinationRate: number;
  
  // Stage 3 specific
  cropMaturity: number;
  pricePerBushel: number;
  day: number;
  floodOccurred: boolean;
  
  // Weather state
  weatherCondition: 'sunny' | 'cloudy' | 'rainy';
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setLocation: (location: Location) => void;
  loadRajshahiData: () => Promise<void>;
  setStage1Decision: (decision: Stage1Decision) => void;
  processStage1Decision: () => void;
  setStage2Decision: (decision: Stage2Decision) => void;
  processStage2Decision: () => void;
  setStage3Decision: (decision: Stage3Decision) => void;
  processStage3Decision: () => void;
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
  stage2Decision: null,
  stage3Decision: null,
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
  cropMaturity: 90,
  pricePerBushel: 6.5,
  day: 100,
  floodOccurred: false,
  
  setPhase: (phase) => {
    const currentStage = phase === 'stage1' ? 1 : 
                        phase === 'stage2' ? 2 : 
                        phase === 'stage3' ? 3 : 
                        get().currentStage;
    set({ phase, currentStage });
  },
  
  setLocation: (location) => {
    set({ location });
  },

  loadRajshahiData: async () => {
    try {
      const response = await fetch('/api/nasa-data/rajshahi');
      if (!response.ok) {
        throw new Error('Failed to fetch Rajshahi data');
      }
      
      const data = await response.json();
      
      set({
        location: data.location,
        nasaData: data.nasaData
      });
      
      console.log('✅ Loaded real Rajshahi data:', data);
    } catch (error) {
      console.error('❌ Error loading Rajshahi data:', error);
      // Fallback to default values if fetch fails
      set({
        location: {
          name: "Rajshahi",
          country: "Bangladesh",
          coordinates: { lat: 24.3745, lon: 88.6042 },
          climate: "Subtropical monsoon",
          mainCrop: "Wheat"
        },
        nasaData: initialNASAData
      });
    }
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
  
  setStage2Decision: (decision) => set({ stage2Decision: decision }),
  
  processStage2Decision: () => {
    const { stage2Decision, nasaData } = get();
    const lstAnomaly = nasaData.modisLST;
    
    if (stage2Decision === 'emergencyIrrigation') {
      // Apply emergency irrigation costs and benefits
      const baseHeatFactor = Math.max(0.2, 1 - 0.05 * (lstAnomaly - 0.5));
      const improvedHeatFactor = Math.min(1.0, baseHeatFactor + 0.10);
      
      set({
        budget: get().budget - 3000,
        waterReserve: get().waterReserve - 30,
        multipliers: {
          ...get().multipliers,
          heat: improvedHeatFactor
        },
        cropStage: 'growing',
        weatherCondition: 'rainy'
      });
    } else {
      // Accept heat stress
      const heatFactor = Math.max(0.2, 1 - 0.05 * (lstAnomaly - 0.5));
      
      set({
        multipliers: {
          ...get().multipliers,
          heat: heatFactor
        },
        cropStage: 'growing',
        weatherCondition: 'sunny'
      });
    }
  },
  
  setStage3Decision: (decision) => set({ stage3Decision: decision }),
  
  processStage3Decision: () => {
    const { stage3Decision } = get();
    
    if (stage3Decision === 'harvestEarly') {
      // Early harvest path
      set({
        potentialYield: get().potentialYield * 0.85,
        multipliers: {
          ...get().multipliers,
          flood: 0.91
        },
        pricePerBushel: 6.5,
        day: get().day + 1,
        cropStage: 'harvested',
        weatherCondition: 'sunny',
        floodOccurred: false
      });
    } else if (stage3Decision === 'waitForRipeness') {
      // Wait for maturity path
      const floodOccurs = Math.random() < 0.60;
      
      set({
        day: get().day + 7,
        pricePerBushel: 8.0,
        cropMaturity: 100,
        floodOccurred: floodOccurs,
        multipliers: {
          ...get().multipliers,
          flood: floodOccurs ? 0.46 : 1.0
        },
        cropStage: floodOccurs ? 'harvested' : 'mature',
        weatherCondition: floodOccurs ? 'rainy' : 'sunny'
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
    stage2Decision: null,
    stage3Decision: null,
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
    cropMaturity: 90,
    pricePerBushel: 6.5,
    day: 100,
    floodOccurred: false
  })
}));
