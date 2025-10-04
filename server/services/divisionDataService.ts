import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SoilMoistureRecord {
  Date: string;
  Mean: number;
  FlagCode?: number;
  Quality_Simple?: string;
}

interface TemperatureRecord {
  Date: string;
  Mean: number; // in Kelvin
  FlagCode?: number;
  Quality_Simple?: string;
}

interface VegetationRecord {
  Date: string;
  Mean: number; // NDVI value
  FlagCode?: number;
  Quality_Simple?: string;
}

// Soil Moisture Thresholds for wheat (cm³/cm³)
const MOISTURE_THRESHOLDS = {
  Optimal: 0.30,
  Good: 0.25,
  Moderate: 0.20,
  HighStress: 0.15,
  Critical: 0.10
};

// Temperature Thresholds for wheat (Kelvin)
const TEMP_THRESHOLDS = {
  Optimal: 293,      // ~20°C
  Good: 298,         // ~25°C
  Moderate: 303,     // ~30°C
  HighStress: 308,   // ~35°C
  Critical: 313      // ~40°C
};

// NDVI Thresholds for wheat health
const NDVI_THRESHOLDS = {
  Excellent: 0.65,
  Good: 0.50,
  Moderate: 0.35,
  Poor: 0.20
};

// Division information mapping
const DIVISION_INFO = {
  rajshahi: {
    name: "Rajshahi",
    country: "Bangladesh",
    coordinates: { lat: 24.3745, lon: 88.6042 },
    climate: "Subtropical monsoon",
    mainCrop: "Wheat"
  },
  barishal: {
    name: "Barishal",
    country: "Bangladesh", 
    coordinates: { lat: 22.7010, lon: 90.3535 },
    climate: "Tropical monsoon",
    mainCrop: "Rice"
  },
  khulna: {
    name: "Khulna",
    country: "Bangladesh",
    coordinates: { lat: 22.8456, lon: 89.5403 },
    climate: "Tropical monsoon",
    mainCrop: "Shrimp & Rice"
  },
  sylhet: {
    name: "Sylhet",
    country: "Bangladesh",
    coordinates: { lat: 24.8910, lon: 91.8697 },
    climate: "Subtropical highland",
    mainCrop: "Tea"
  },
  chittagong: {
    name: "Chittagong",
    country: "Bangladesh",
    coordinates: { lat: 22.3569, lon: 91.7832 },
    climate: "Tropical monsoon",
    mainCrop: "Rice"
  },
  rangpur: {
    name: "Rangpur",
    country: "Bangladesh",
    coordinates: { lat: 25.7439, lon: 89.2752 },
    climate: "Subtropical",
    mainCrop: "Potato & Wheat"
  }
};

type Division = keyof typeof DIVISION_INFO;

// Get data directory path for a specific division
function getDataDir(division: Division): string {
  return path.join(__dirname, `../data/${division.charAt(0).toUpperCase() + division.slice(1)}`);
}

// Parse CSV file for a specific division
async function parseCSV<T>(division: Division, filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    const fullPath = path.join(getDataDir(division), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found for ${division}: ${fullPath}`);
      return reject(new Error(`File not found for ${division}: ${filePath}`));
    }

    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    
    Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<T>) => {
        resolve(results.data as T[]);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}

// Categorize soil moisture quality based on flag codes
function categorizeSoilMoistureQuality(flagCode: number): string {
  if (flagCode === 8) return "Excellent";
  if (flagCode === 9) return "Good";
  if (flagCode === 7) return "Moderate";
  if ([13, 15].includes(flagCode)) return "Poor";
  return "Moderate";
}

// Categorize temperature quality based on flag codes
function categorizeTemperatureQuality(flagCode: number): string {
  if ([17, 1, 0].includes(flagCode)) return "Excellent";
  if ([65, 81, 97].includes(flagCode)) return "Good";
  if ([129, 145].includes(flagCode)) return "Moderate";
  if ([2, 161].includes(flagCode)) return "Poor";
  return "Moderate";
}

// Analyze soil moisture data for a specific division
export async function analyzeSoilMoisture(division: Division) {
  try {
    const soilStats = await parseCSV<SoilMoistureRecord>(division, 'geographic-soil-moisture-Statistics.csv');
    const flagStats = await parseCSV<any>(division, 'geographic soil moisture flag statistic.csv');
    const lookupData = await parseCSV<any>(division, 'geographic-Soil-Moisture-Retrieval-Data-AM-retrieval-qual-flag-lookup.csv');
    
    // Filter only soil moisture data (values between 0 and 1)
    const soilMoistureData = soilStats.filter(record => 
      record.Mean >= 0 && record.Mean <= 1
    );
    
    if (soilMoistureData.length === 0) {
      throw new Error(`No valid soil moisture data found for ${division}`);
    }
    
    const avgMoisture = soilMoistureData.reduce((sum, record) => sum + record.Mean, 0) / soilMoistureData.length;
    const maxMoisture = Math.max(...soilMoistureData.map(r => r.Mean));
    const minMoisture = Math.min(...soilMoistureData.map(r => r.Mean));
    
    // Determine moisture status
    let status = 'CRITICAL';
    let message = 'Critical drought - immediate irrigation required';
    let smapAnomaly = -0.4; // Very dry
    
    if (avgMoisture >= MOISTURE_THRESHOLDS.Optimal) {
      status = 'OPTIMAL';
      message = 'Perfect soil moisture for wheat growth';
      smapAnomaly = 0.1;
    } else if (avgMoisture >= MOISTURE_THRESHOLDS.Good) {
      status = 'GOOD';
      message = 'Good soil moisture conditions';
      smapAnomaly = 0;
    } else if (avgMoisture >= MOISTURE_THRESHOLDS.Moderate) {
      status = 'MODERATE STRESS';
      message = 'Moderate drought stress - consider irrigation';
      smapAnomaly = -0.15;
    } else if (avgMoisture >= MOISTURE_THRESHOLDS.HighStress) {
      status = 'HIGH STRESS';
      message = 'High drought stress - irrigation needed';
      smapAnomaly = -0.3;
    }
    
    return {
      avgMoisture: parseFloat(avgMoisture.toFixed(3)),
      maxMoisture: parseFloat(maxMoisture.toFixed(3)),
      minMoisture: parseFloat(minMoisture.toFixed(3)),
      status,
      message,
      smapAnomaly, // This is what the game uses
      recordCount: soilMoistureData.length
    };
  } catch (error) {
    console.error(`Error analyzing soil moisture for ${division}:`, error);
    throw error;
  }
}

// Analyze temperature data for heat stress for a specific division
export async function analyzeTemperature(division: Division) {
  try {
    const tempStats = await parseCSV<TemperatureRecord>(division, 'temperature-Statistics.csv');
    const qcDayStats = await parseCSV<any>(division, 'temperature-QC-Day-Statistics-QA.csv');
    const qcLookup = await parseCSV<any>(division, 'temperature-QC-Day-lookup.csv');
    
    if (tempStats.length === 0) {
      throw new Error(`No temperature data found for ${division}`);
    }
    
    const avgTemp = tempStats.reduce((sum, record) => sum + record.Mean, 0) / tempStats.length;
    const maxTemp = Math.max(...tempStats.map(r => r.Mean));
    const minTemp = Math.min(...tempStats.map(r => r.Mean));
    const avgTempCelsius = avgTemp - 273.15;
    
    // Determine heat stress status
    let status = 'CRITICAL';
    let message = `Critical heat stress - crop damage likely (${avgTempCelsius.toFixed(1)}°C)`;
    let modisLST = 5.0; // High anomaly
    
    if (avgTemp <= TEMP_THRESHOLDS.Optimal) {
      status = 'OPTIMAL';
      message = `Perfect temperature for wheat growth (${avgTempCelsius.toFixed(1)}°C)`;
      modisLST = 0;
    } else if (avgTemp <= TEMP_THRESHOLDS.Good) {
      status = 'GOOD';
      message = `Good conditions for wheat (${avgTempCelsius.toFixed(1)}°C)`;
      modisLST = 1.0;
    } else if (avgTemp <= TEMP_THRESHOLDS.Moderate) {
      status = 'MODERATE STRESS';
      message = `Moderate heat stress - monitor closely (${avgTempCelsius.toFixed(1)}°C)`;
      modisLST = 2.5;
    } else if (avgTemp <= TEMP_THRESHOLDS.HighStress) {
      status = 'HIGH STRESS';
      message = `High heat stress - irrigation needed (${avgTempCelsius.toFixed(1)}°C)`;
      modisLST = 4.0;
    }
    
    return {
      avgTemp: parseFloat(avgTemp.toFixed(1)),
      avgTempCelsius: parseFloat(avgTempCelsius.toFixed(1)),
      maxTemp: parseFloat(maxTemp.toFixed(1)),
      minTemp: parseFloat(minTemp.toFixed(1)),
      status,
      message,
      modisLST, // This is what the game uses (temperature anomaly in °C)
      recordCount: tempStats.length
    };
  } catch (error) {
    console.error(`Error analyzing temperature for ${division}:`, error);
    throw error;
  }
}

// Analyze vegetation/NDVI data for a specific division
export async function analyzeVegetation(division: Division) {
  try {
    const vegStats = await parseCSV<VegetationRecord>(division, 'vegetation-Statistics.csv');
    const qcStats = await parseCSV<any>(division, 'vegetation-250m-16-days-VI-Quality-Statistics-QA.csv');
    const qcLookup = await parseCSV<any>(division, 'vegetation-250m-16-days-VI-Quality-lookup.csv');
    
    if (vegStats.length === 0) {
      throw new Error(`No vegetation data found for ${division}`);
    }
    
    const avgNDVI = vegStats.reduce((sum, record) => sum + record.Mean, 0) / vegStats.length;
    const maxNDVI = Math.max(...vegStats.map(r => r.Mean));
    const minNDVI = Math.min(...vegStats.map(r => r.Mean));
    
    // Determine vegetation health
    let status = 'POOR';
    let message = 'Poor vegetation health - critical intervention needed';
    
    if (avgNDVI >= NDVI_THRESHOLDS.Excellent) {
      status = 'EXCELLENT';
      message = 'Excellent crop health and vigor';
    } else if (avgNDVI >= NDVI_THRESHOLDS.Good) {
      status = 'GOOD';
      message = 'Good crop health';
    } else if (avgNDVI >= NDVI_THRESHOLDS.Moderate) {
      status = 'MODERATE';
      message = 'Moderate crop health - monitor for stress';
    } else if (avgNDVI >= NDVI_THRESHOLDS.Poor) {
      status = 'FAIR';
      message = 'Fair crop health - consider intervention';
    }
    
    return {
      avgNDVI: parseFloat(avgNDVI.toFixed(3)),
      maxNDVI: parseFloat(maxNDVI.toFixed(3)),
      minNDVI: parseFloat(minNDVI.toFixed(3)),
      status,
      message,
      ndvi: parseFloat(avgNDVI.toFixed(3)), // This is what the game uses
      recordCount: vegStats.length
    };
  } catch (error) {
    console.error(`Error analyzing vegetation for ${division}:`, error);
    throw error;
  }
}

// Get comprehensive data for any division
export async function getDivisionData(division: Division) {
  try {
    const [soilData, tempData, vegData] = await Promise.all([
      analyzeSoilMoisture(division),
      analyzeTemperature(division),
      analyzeVegetation(division)
    ]);
    
    const divisionInfo = DIVISION_INFO[division];
    
    if (!divisionInfo) {
      throw new Error(`No information found for division: ${division}`);
    }
    
    // Combine all data in the format the game expects
    return {
      location: divisionInfo,
      nasaData: {
        smapAnomaly: soilData.smapAnomaly,
        modisLST: tempData.modisLST,
        ndvi: vegData.ndvi,
        floodRisk: calculateFloodRisk(division) // Custom flood risk based on division
      },
      analysis: {
        soilMoisture: soilData,
        temperature: tempData,
        vegetation: vegData
      }
    };
  } catch (error) {
    console.error(`Error getting data for ${division}:`, error);
    throw error;
  }
}

// Calculate flood risk based on division characteristics
function calculateFloodRisk(division: Division): number {
  const floodRiskMap: Record<Division, number> = {
    barishal: 0.8,    // High flood risk (coastal)
    khulna: 0.7,      // High flood risk (coastal)
    chittagong: 0.6,  // Moderate flood risk (hilly but coastal)
    sylhet: 0.9,      // Very high flood risk (floodplain)
    rajshahi: 0.5,    // Moderate flood risk (floodplain but drier)
    rangpur: 0.6      // Moderate flood risk (floodplain)
  };
  
  return floodRiskMap[division] || 0.5;
}

// Backward compatibility - keep the original function name for Rajshahi
export async function getRajshahiData() {
  return getDivisionData('rajshahi');
}

// Export available divisions
export const availableDivisions = Object.keys(DIVISION_INFO) as Division[];