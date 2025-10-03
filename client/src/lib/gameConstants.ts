// Game constants and location data

// Rajshahi Division Districts
export const LOCATIONS = {
  'bogra': {
    name: 'Bogra',
    division: 'Rajshahi',
    coordinates: { lat: 24.8481, lon: 89.3730 },
    country: 'Bangladesh',
    climate: 'Subtropical monsoon',
    mainCrop: 'Wheat/Rice',
    useRealData: true
  },
  'joypurhat': {
    name: 'Joypurhat',
    division: 'Rajshahi',
    coordinates: { lat: 25.0968, lon: 89.0227 },
    country: 'Bangladesh',
    climate: 'Subtropical monsoon',
    mainCrop: 'Wheat/Rice',
    useRealData: true
  },
  'naogaon': {
    name: 'Naogaon',
    division: 'Rajshahi',
    coordinates: { lat: 24.7936, lon: 88.9318 },
    country: 'Bangladesh',
    climate: 'Subtropical monsoon',
    mainCrop: 'Wheat/Rice',
    useRealData: true
  },
  'natore': {
    name: 'Natore',
    division: 'Rajshahi',
    coordinates: { lat: 24.4206, lon: 89.0000 },
    country: 'Bangladesh',
    climate: 'Subtropical monsoon',
    mainCrop: 'Wheat/Rice',
    useRealData: true
  },
  'nawabganj': {
    name: 'Nawabganj',
    division: 'Rajshahi',
    coordinates: { lat: 24.5965, lon: 88.2775 },
    country: 'Bangladesh',
    climate: 'Subtropical monsoon',
    mainCrop: 'Wheat/Rice',
    useRealData: true
  },
  'pabna': {
    name: 'Pabna',
    division: 'Rajshahi',
    coordinates: { lat: 24.0064, lon: 89.2372 },
    country: 'Bangladesh',
    climate: 'Subtropical monsoon',
    mainCrop: 'Wheat/Rice',
    useRealData: true
  },
  'rajshahi': {
    name: 'Rajshahi',
    division: 'Rajshahi',
    coordinates: { lat: 24.3745, lon: 88.6042 },
    country: 'Bangladesh',
    climate: 'Subtropical monsoon',
    mainCrop: 'Wheat',
    useRealData: true
  },
  'sirajganj': {
    name: 'Sirajganj',
    division: 'Rajshahi',
    coordinates: { lat: 24.4533, lon: 89.7006 },
    country: 'Bangladesh',
    climate: 'Subtropical monsoon',
    mainCrop: 'Wheat/Jute',
    useRealData: true
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
    explanation: 'Negative SMAP anomalies indicate drier than average conditions. -0.3 means moderately dry soil that may need irrigation.',
    stage: 1
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
    explanation: 'Wheat seeds need consistent moisture for germination. Dry conditions (negative SMAP anomaly) can reduce germination rates significantly.',
    stage: 1
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
    explanation: 'SMAP provides global soil moisture measurements every 2-3 days with 9km resolution, making it ideal for agricultural monitoring.',
    stage: 1
  }
];

export const STAGE2_QUIZ_QUESTIONS = [
  {
    id: 'modis-1',
    question: 'What does a MODIS LST anomaly of +2.5°C indicate during wheat flowering?',
    options: [
      'Normal temperature',
      'Cooler than average - no concern',
      'Warmer than average - potential heat stress',
      'Data error'
    ],
    correctIndex: 2,
    explanation: 'A positive MODIS LST anomaly means temperatures are warmer than the historical average. +2.5°C during sensitive flowering stages can significantly impact grain development.',
    stage: 2
  },
  {
    id: 'modis-2',
    question: 'Why is wheat flowering particularly sensitive to heat stress?',
    options: [
      'Flowers need cold temperatures',
      'High temperatures reduce grain weight and fertility',
      'Heat helps the plant grow faster',
      'Temperature doesn\'t affect flowering'
    ],
    correctIndex: 1,
    explanation: 'Wheat flowering is highly heat-sensitive. Temperatures above 32°C can reduce pollen viability and grain weight by 5% per degree Celsius, significantly impacting final yield.',
    stage: 2
  },
  {
    id: 'ndvi-1',
    question: 'What does NDVI measure in crops?',
    options: [
      'Soil temperature',
      'Plant height',
      'Chlorophyll content and plant health',
      'Water content in soil'
    ],
    correctIndex: 2,
    explanation: 'NDVI (Normalized Difference Vegetation Index) measures plant chlorophyll using red and near-infrared light reflectance. Healthy crops have high NDVI (0.6-0.8), while stressed crops show declining values.',
    stage: 2
  }
];

export const STAGE3_QUIZ_QUESTIONS = [
  {
    id: 'flood-1',
    question: 'What does a 60% flood probability forecast mean for harvest decisions?',
    options: [
      'It will definitely flood',
      'There is a 60% chance of flood in the forecast period',
      'Only 60% of the area will flood',
      'Flood risk is low'
    ],
    correctIndex: 1,
    explanation: 'A 60% flood probability means there is a 6 in 10 chance that flood conditions will occur in the specified time period. This is considered high risk and requires careful decision-making.',
    stage: 3
  },
  {
    id: 'flood-2',
    question: 'How does NASA\'s Flood Data Pathfinder predict flood risk?',
    options: [
      'Only uses local rain gauges',
      'Combines satellite rainfall data with terrain models',
      'Uses only historical flood records',
      'Predicts by farmer reports'
    ],
    correctIndex: 1,
    explanation: 'NASA\'s Flood Data Pathfinder integrates satellite rainfall estimates (GPM, TRMM) with digital elevation models to predict flood probability. This provides advanced warning up to 7 days ahead.',
    stage: 3
  },
  {
    id: 'flood-3',
    question: 'Why is early harvest at 90% maturity sometimes economically justified?',
    options: [
      'It always gives higher profits',
      'Labor is cheaper early in season',
      'Avoiding catastrophic flood losses can offset lower yield and price',
      'Early wheat tastes better'
    ],
    correctIndex: 2,
    explanation: 'While early harvest reduces yield by 15% and gets lower prices, it guarantees harvest safety. When flood risk is 60%, the expected value often favors early harvest to avoid potential 54% crop losses.',
    stage: 3
  }
];
