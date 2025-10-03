import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataVisualization } from './DataVisualization';

export const NASATutorial: React.FC = () => {
  const { location, tutorialStep, setTutorialStep, markNASAToolUsed, setPhase } = useFarmGame();

  // Mark tool as used when viewing the data
  const markToolAsUsed = (tool: 'worldview' | 'cropCASMA' | 'giovanni' | 'floodPathfinder') => {
    markNASAToolUsed(tool);
  };

  const nextStep = () => {
    if (tutorialStep < 4) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setPhase('stage1');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gray-900 text-white">
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold mb-2">🎓 Quick NASA Tools Crash Course</h2>
          <p className="text-gray-300 mb-6">
            For your farm in <strong className="text-green-400">{location?.name || 'Unknown Location'}</strong>
          </p>
          
          {/* Step 1: Soil Moisture Data */}
          {tutorialStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">💧 Step 1: Understanding Soil Moisture</h3>
              <p className="text-gray-300">Real SMAP satellite data from {location?.name || 'Rajshahi'}</p>
              
              <DataVisualization type="soil-moisture" />
              
              <div className="bg-blue-900/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What this data means:</h4>
                <ul className="space-y-1 text-sm">
                  <li>✅ Based on 485 real SMAP satellite measurements</li>
                  <li>✅ Shows soil moisture at 0-5cm depth</li>
                  <li>✅ Critical for wheat germination decisions</li>
                  <li>✅ Updated from NASA Earth Observation data</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Tip: Wheat needs 0.25-0.35 cm³/cm³ moisture for optimal germination
                </p>
              </div>
              
              <Button onClick={() => { markToolAsUsed('cropCASMA'); nextStep(); }} className="w-full">
                Next: Monitor Temperature →
              </Button>
            </div>
          )}
          
          {/* Step 2: Temperature Data */}
          {tutorialStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">🌡️ Step 2: Heat Stress Monitoring</h3>
              <p className="text-gray-300">Real MODIS temperature data showing heat conditions</p>
              
              <DataVisualization type="temperature" />
              
              <div className="bg-blue-900/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Temperature Impact on Wheat:</h4>
                <ul className="space-y-1 text-sm">
                  <li>🌡️ Based on 237 MODIS satellite temperature records</li>
                  <li>⚠️ Heat stress above 30°C affects wheat yield</li>
                  <li>🔴 Above 35°C causes critical damage</li>
                  <li>💧 Higher temperatures increase water demand</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  💡 During heatwaves: Irrigate early morning, use shade nets if possible
                </p>
              </div>
              
              <Button onClick={() => { markToolAsUsed('giovanni'); nextStep(); }} className="w-full">
                Next: Check Vegetation Health →
              </Button>
            </div>
          )}
          
          {/* Step 3: Vegetation Health */}
          {tutorialStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">🌿 Step 3: Vegetation Health Analysis</h3>
              <p className="text-gray-300">NDVI data showing crop health status</p>
              
              <DataVisualization type="vegetation" />
              
              <div className="bg-green-900/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Understanding NDVI:</h4>
                <ul className="space-y-1 text-sm">
                  <li>🌿 Based on 63 vegetation health records</li>
                  <li>📊 NDVI range: 0 (no vegetation) to 1 (dense healthy vegetation)</li>
                  <li>🌾 Healthy wheat: 0.6-0.8 during peak growth</li>
                  <li>⚠️ Below 0.4 indicates stress or poor growth</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  💡 NDVI drops can indicate drought, pests, or nutrient deficiency
                </p>
              </div>
              
              <Button onClick={() => { markToolAsUsed('worldview'); nextStep(); }} className="w-full">
                Next: Check Flood Risk →
              </Button>
            </div>
          )}
          
          {/* Step 4: Flood Pathfinder */}
          {tutorialStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">🌊 Step 4: Assess Flood Risk</h3>
              <p className="text-gray-300">NASA Flood Pathfinder provides precipitation forecasts and flood alerts</p>
              
              <DataVisualization type="flood" />
              
              <div className="bg-cyan-900/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Flood Risk Factors:</h4>
                <ul className="space-y-1 text-sm">
                  <li>🌧️ Monsoon rainfall patterns in {location?.name || 'Rajshahi'}</li>
                  <li>🏞️ River levels and overflow risk</li>
                  <li>🚨 Historical flood data analysis</li>
                  <li>🗺️ Terrain elevation and drainage</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Tip: Harvest early if flood risk is high. Store grain in elevated locations.
                </p>
              </div>
              
              <Button onClick={() => { markToolAsUsed('floodPathfinder'); nextStep(); }} className="w-full bg-green-600 hover:bg-green-700">
                🎮 Start Farming! →
              </Button>
            </div>
          )}
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${step <= tutorialStep ? 'bg-green-500' : 'bg-gray-600'}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
