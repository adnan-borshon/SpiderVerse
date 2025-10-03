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

// Data paths
const DATA_DIR = path.join(__dirname, '../data/Rajshahi');

// Parse CSV file
async function parseCSV<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    const fullPath = path.join(DATA_DIR, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return reject(new Error(`File not found: ${filePath}`));
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

// Analyze soil moisture data
export async function analyzeSoilMoisture() {
  try {
    const soilStats = await parseCSV<SoilMoistureRecord>('geographic-soil-moisture-Statistics.csv');
    const flagStats = await parseCSV<any>('geographic soil moisture flag statistic.csv');
    const lookupData = await parseCSV<any>('geographic-Soil-Moisture-Retrieval-Data-AM-retrieval-qual-flag-lookup.csv');
    
    // Filter only soil moisture data (values between 0 and 1)
    const soilMoistureData = soilStats.filter(record => 
      record.Mean >= 0 && record.Mean <= 1
    );
    
    if (soilMoistureData.length === 0) {
      throw new Error('No valid soil moisture data found');
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
    console.error('Error analyzing soil moisture:', error);
    throw error;
  }
}

// Analyze temperature data for heat stress
export async function analyzeTemperature() {
  try {
    const tempStats = await parseCSV<TemperatureRecord>('temperature-Statistics.csv');
    const qcDayStats = await parseCSV<any>('temperature-QC-Day-Statistics-QA.csv');
    const qcLookup = await parseCSV<any>('temperature-QC-Day-lookup.csv');
    
    if (tempStats.length === 0) {
      throw new Error('No temperature data found');
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
    console.error('Error analyzing temperature:', error);
    throw error;
  }
}

// Analyze vegetation/NDVI data
export async function analyzeVegetation() {
  try {
    const vegStats = await parseCSV<VegetationRecord>('vegetation-Statistics.csv');
    const qcStats = await parseCSV<any>('vegetation-250m-16-days-VI-Quality-Statistics-QA.csv');
    const qcLookup = await parseCSV<any>('vegetation-250m-16-days-VI-Quality-lookup.csv');
    
    if (vegStats.length === 0) {
      throw new Error('No vegetation data found');
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
    console.error('Error analyzing vegetation:', error);
    throw error;
  }
}

// Get comprehensive Rajshahi data for the game
export async function getRajshahiData() {
  try {
    const [soilData, tempData, vegData] = await Promise.all([
      analyzeSoilMoisture(),
      analyzeTemperature(),
      analyzeVegetation()
    ]);
    
    // Combine all data in the format the game expects
    return {
      location: {
        name: "Rajshahi",
        country: "Bangladesh",
        coordinates: { lat: 24.3745, lon: 88.6042 },
        climate: "Subtropical monsoon",
        mainCrop: "Wheat"
      },
      nasaData: {
        smapAnomaly: soilData.smapAnomaly,
        modisLST: tempData.modisLST,
        ndvi: vegData.ndvi,
        floodRisk: 0.6 // This would need flood pathfinder data - using reasonable value for Bangladesh
      },
      analysis: {
        soilMoisture: soilData,
        temperature: tempData,
        vegetation: vegData
      }
    };
  } catch (error) {
    console.error('Error getting Rajshahi data:', error);
    throw error;
  }
}
