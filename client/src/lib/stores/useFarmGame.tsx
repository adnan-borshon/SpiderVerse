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
  nasaData: NASAData | null;
  
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
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'heatwave';
  
  // Days passed modal
  daysPassed: number;
  daysPassedMessage: string;
  showDaysPassedModal: boolean;

  // Loading state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setLocation: (location: Location) => void;
  loadDivisionData: (division: string) => Promise<void>;
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
  setShowDaysPassedModal: (show: boolean) => void;
  resetGame: () => void;
}

// Helper function to get default NASA data (fallback only)
const getDefaultNASAData = (): NASAData => ({
  smapAnomaly: -0.3,
  modisLST: 2.5,
  floodRisk: 0.6,
  ndvi: 0.75
});

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
  nasaData: null, // Start with null until data is loaded
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
  daysPassed: 0,
  daysPassedMessage: '',
  showDaysPassedModal: false,
  isLoading: false,
  error: null,
  
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

  loadDivisionData: async (division: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/nasa-data/${division.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${division} data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      set({
        location: data.location,
        nasaData: data.nasaData,
        isLoading: false,
        error: null
      });
      
      console.log(`✅ Loaded real ${division} data:`, data);
    } catch (error) {
      console.error(`❌ Error loading ${division} data:`, error);
      
      // Fallback to default values if fetch fails
      const fallbackData = await getFallbackDivisionData(division);
      
      set({
        location: fallbackData.location,
        nasaData: fallbackData.nasaData,
        isLoading: false,
        error: `Failed to load ${division} data. Using simulated data.`
      });
    }
  },
  
  setStage1Decision: (decision) => set({ stage1Decision: decision }),
  
  processStage1Decision: () => {
    const { stage1Decision, nasaData } = get();
    
    // Use actual NASA data or fallback to defaults
    const currentNASAData = nasaData || getDefaultNASAData();
    
    if (stage1Decision === 'noIrrigate') {
      // Poor germination due to dry conditions - takes longer
      const germinationRate = 0.70;
      const droughtFactor = Math.max(0.3, 1 + 0.8 * currentNASAData.smapAnomaly);
      
      set({
        multipliers: {
          ...get().multipliers,
          germination: germinationRate,
          drought: droughtFactor
        },
        germinationRate,
        cropStage: 'germinating',
        weatherCondition: 'sunny',
        daysPassed: 14,
        daysPassedMessage: 'Seeds took longer to germinate in dry soil. Consider irrigation next time for faster growth.',
        showDaysPassedModal: true
      });
    } else {
      // Good germination with irrigation - faster
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
        weatherCondition: 'sunny', // Keep sunny - irrigation effect will show water
        daysPassed: 7,
        daysPassedMessage: 'Irrigation helped seeds germinate quickly with excellent rates. Your crop is off to a strong start!',
        showDaysPassedModal: true
      });
    }
  },
  
  setStage2Decision: (decision) => set({ stage2Decision: decision }),
  
  processStage2Decision: () => {
    const { stage2Decision, nasaData } = get();
    
    // Use actual NASA data or fallback to defaults
    const currentNASAData = nasaData || getDefaultNASAData();
    const lstAnomaly = currentNASAData.modisLST;
    
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
        weatherCondition: 'sunny' // Keep sunny since irrigation happened
      });
    } else {
      // Accept heat stress - show heatwave
      const heatFactor = Math.max(0.2, 1 - 0.05 * (lstAnomaly - 0.5));
      
      set({
        multipliers: {
          ...get().multipliers,
          heat: heatFactor
        },
        cropStage: 'growing',
        weatherCondition: 'heatwave' // Show heatwave when accepting heat stress
      });
    }
  },
  
  setStage3Decision: (decision) => set({ stage3Decision: decision }),
  
  processStage3Decision: () => {
    const { stage3Decision, nasaData } = get();
    
    // Use actual NASA data or fallback to defaults for flood risk
    const currentNASAData = nasaData || getDefaultNASAData();
    
    if (stage3Decision === 'harvestEarly') {
      // Early harvest path - immediate harvest
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
        floodOccurred: false,
        daysPassed: 0,
        daysPassedMessage: 'Immediate harvest avoided flood risk but reduced yield. Smart decision to minimize losses!',
        showDaysPassedModal: true
      });
    } else if (stage3Decision === 'waitForRipeness') {
      // Wait for maturity path - use actual flood risk from NASA data
      const floodOccurs = Math.random() < currentNASAData.floodRisk;
      
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
        weatherCondition: floodOccurs ? 'rainy' : 'sunny',
        daysPassed: 10,
        daysPassedMessage: floodOccurs 
          ? 'Waited 10 days for full ripeness, but flood struck! Major yield losses occurred.'
          : 'Waited 10 days and achieved full ripeness with maximum yield. Great timing!',
        showDaysPassedModal: true
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
  
  setShowDaysPassedModal: (show) => set({ showDaysPassedModal: show }),
  
  resetGame: () => set({
    phase: 'welcome',
    currentStage: 1,
    location: null,
    budget: 10000,
    waterReserve: 100,
    stage1Decision: null,
    stage2Decision: null,
    stage3Decision: null,
    nasaData: null, // Reset to null
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
    isLoading: false,
    error: null
  })
}));

// Fallback data generator for when API fails
async function getFallbackDivisionData(division: string): Promise<{ location: Location; nasaData: NASAData }> {
  const divisionFallbacks: Record<string, { location: Location; nasaData: NASAData }> = {
    rajshahi: {
      location: {
        name: "Rajshahi",
        country: "Bangladesh",
        coordinates: { lat: 24.3745, lon: 88.6042 },
        climate: "Subtropical monsoon",
        mainCrop: "Wheat"
      },
      nasaData: {
        smapAnomaly: -0.4,
        modisLST: 3.2,
        floodRisk: 0.5,
        ndvi: 0.68
      }
    },
    barishal: {
      location: {
        name: "Barishal",
        country: "Bangladesh",
        coordinates: { lat: 22.7010, lon: 90.3535 },
        climate: "Tropical monsoon",
        mainCrop: "Rice"
      },
      nasaData: {
        smapAnomaly: 0.1,
        modisLST: 2.8,
        floodRisk: 0.8,
        ndvi: 0.72
      }
    },
    khulna: {
      location: {
        name: "Khulna",
        country: "Bangladesh",
        coordinates: { lat: 22.8456, lon: 89.5403 },
        climate: "Tropical monsoon",
        mainCrop: "Shrimp & Rice"
      },
      nasaData: {
        smapAnomaly: 0.2,
        modisLST: 2.9,
        floodRisk: 0.7,
        ndvi: 0.65
      }
    },
    sylhet: {
      location: {
        name: "Sylhet",
        country: "Bangladesh",
        coordinates: { lat: 24.8910, lon: 91.8697 },
        climate: "Subtropical highland",
        mainCrop: "Tea"
      },
      nasaData: {
        smapAnomaly: 0.3,
        modisLST: 1.8,
        floodRisk: 0.9,
        ndvi: 0.85
      }
    },
    chittagong: {
      location: {
        name: "Chittagong",
        country: "Bangladesh",
        coordinates: { lat: 22.3569, lon: 91.7832 },
        climate: "Tropical monsoon",
        mainCrop: "Rice"
      },
      nasaData: {
        smapAnomaly: 0.15,
        modisLST: 2.5,
        floodRisk: 0.6,
        ndvi: 0.78
      }
    },
    rangpur: {
      location: {
        name: "Rangpur",
        country: "Bangladesh",
        coordinates: { lat: 25.7439, lon: 89.2752 },
        climate: "Subtropical",
        mainCrop: "Potato & Wheat"
      },
      nasaData: {
        smapAnomaly: -0.2,
        modisLST: 2.2,
        floodRisk: 0.6,
        ndvi: 0.70
      }
    }
  };

  // Return division-specific data or a generic fallback
  return divisionFallbacks[division.toLowerCase()] || {
    location: {
      name: division.charAt(0).toUpperCase() + division.slice(1),
      country: "Bangladesh",
      coordinates: { lat: 0, lon: 0 },
      climate: "Unknown",
      mainCrop: "Wheat"
    },
    nasaData: getDefaultNASAData()
  };
}