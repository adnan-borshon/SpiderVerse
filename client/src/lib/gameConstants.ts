// Game constants and location data

export const LOCATIONS = {
  'iowa-usa': {
    name: 'Iowa, USA',
    coordinates: { lat: 42.0, lon: -93.5 },
    country: 'USA',
    climate: 'temperate',
    mainCrop: 'wheat/corn',
    smapAnomaly: -0.3,
    modisLST: 2.5,
    floodRisk: 0.6,
    ndvi: 0.75
  },
  'punjab-india': {
    name: 'Punjab, India',
    coordinates: { lat: 30.9, lon: 75.8 },
    country: 'India',
    climate: 'monsoon-dependent',
    mainCrop: 'wheat/rice',
    smapAnomaly: -0.4,
    modisLST: 3.0,
    floodRisk: 0.7,
    ndvi: 0.70
  },
  'saopaulo-brazil': {
    name: 'São Paulo, Brazil',
    coordinates: { lat: -23.5, lon: -46.6 },
    country: 'Brazil',
    climate: 'tropical',
    mainCrop: 'soy/sugarcane',
    smapAnomaly: -0.2,
    modisLST: 2.0,
    floodRisk: 0.5,
    ndvi: 0.80
  },
  'kenya-africa': {
    name: 'Central Kenya',
    coordinates: { lat: -0.3, lon: 36.8 },
    country: 'Kenya',
    climate: 'semi-arid',
    mainCrop: 'maize/wheat',
    smapAnomaly: -0.5,
    modisLST: 3.5,
    floodRisk: 0.4,
    ndvi: 0.65
  }
};

export const NASA_TOOLS = {
  worldview: 'https://worldview.earthdata.nasa.gov/',
  cropCASMA: 'https://nassgeo.csiss.gmu.edu/CropCASMA/',
  giovanni: 'https://giovanni.gsfc.nasa.gov/giovanni/',
  floodPathfinder: 'https://earthdata.nasa.gov/learn/pathfinders/disasters/floods-data-pathfinder'
};

export const TOOLTIPS = {
  smap: "SMAP (Soil Moisture Active Passive) measures soil moisture 0-5cm deep using L-band microwave signals. Resolution: 9km. Best for regional drought monitoring.",
  modis: "MODIS Land Surface Temperature measures ground-level heat using thermal infrared. Updated twice daily. Critical for detecting crop stress during sensitive growth stages.",
  flood: "Flood Data Pathfinder combines satellite rainfall estimates with terrain models to predict flood probability. 7-day forecast window.",
  ndvi: "Normalized Difference Vegetation Index measures plant health using red/near-infrared light. Range 0-1. Healthy crops = 0.6-0.9."
};

export const QUIZ_QUESTIONS = [
  {
    id: 'smap-1',
    question: 'What does a SMAP soil moisture anomaly of -0.3 indicate?',
    options: [
      'Soil is wetter than normal',
      'Soil is drier than normal',
      'Soil moisture is normal',
      'Data is unavailable'
    ],
    correctIndex: 1,
    explanation: 'Negative SMAP anomalies indicate drier than average conditions. -0.3 means moderately dry soil that may need irrigation.'
  },
  {
    id: 'smap-2',
    question: 'For wheat germination, what minimum soil moisture is needed?',
    options: [
      'Very dry soil is fine',
      'Moderate moisture is sufficient',
      'High moisture is critical',
      'Moisture doesn\'t matter'
    ],
    correctIndex: 2,
    explanation: 'Wheat seeds need consistent moisture for germination. Dry conditions (negative SMAP anomaly) can reduce germination rates significantly.'
  },
  {
    id: 'smap-3',
    question: 'How often is SMAP data updated?',
    options: [
      'Every hour',
      'Every day',
      'Every 2-3 days',
      'Every week'
    ],
    correctIndex: 2,
    explanation: 'SMAP provides global soil moisture measurements every 2-3 days with 9km resolution, making it ideal for agricultural monitoring.'
  }
];
