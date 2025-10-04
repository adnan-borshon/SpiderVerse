import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STAGE2_QUIZ_QUESTIONS } from '@/lib/gameConstants';

export const Stage2Panel: React.FC = () => {
  const { 
    stage2Decision, 
    setStage2Decision, 
    processStage2Decision, 
    setQuizActive,
    nasaData,
    location,
    budget,
    waterReserve
  } = useFarmGame();
  const [decisionConfirmed, setDecisionConfirmed] = React.useState(false);
  
  const handleConfirm = () => {
    if (!stage2Decision || decisionConfirmed) return;
    
    // Mark decision as confirmed to prevent repeated clicks
    setDecisionConfirmed(true);
    
    // Process the decision
    processStage2Decision();
    
    // Show quiz after decision
    setTimeout(() => {
      setQuizActive(true);
    }, 2000);
  };
      const currentNASAData = nasaData || {
    smapAnomaly: -0.3,
    modisLST: 2.5,
    floodRisk: 0.6,
    ndvi: 0.75
  };
  const lstAnomaly = currentNASAData.modisLST;
  const currentTemp = 33 + lstAnomaly;
  const currentNDVI = currentNASAData.ndvi;
  
  const getHeatColor = (temp: number) => {
    if (temp < 30) return 'bg-green-500';
    if (temp < 32) return 'bg-yellow-500';
    if (temp < 35) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getNDVIColor = (value: number) => {
    if (value < 0.3) return 'bg-yellow-900';
    if (value < 0.5) return 'bg-yellow-600';
    if (value < 0.7) return 'bg-green-400';
    return 'bg-green-600';
  };
  
  return (
    <div className="fixed right-4 top-4 w-[500px] max-h-[90vh] overflow-y-auto z-10 pointer-events-auto">
      <Card className="bg-gray-900/95 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">🌡️ Stage 2: Heatwave Crisis</CardTitle>
          <p className="text-sm text-gray-300 mt-2">
            Your wheat is flowering - a heat-sensitive stage. MODIS detects extreme heat.
          </p>
          <div className="mt-3 space-y-1 text-xs text-gray-400">
            <p>📍 Location: {location?.name || 'Unknown'}</p>
            <p>🌱 Crop stage: Flowering (critical!)</p>
            <p>💰 Budget: ${budget.toLocaleString()} | 💧 Water: {waterReserve}%</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* MODIS LST Data Card */}
          <div className="bg-orange-900/30 p-4 rounded-lg border-2 border-orange-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">🌡️ MODIS Land Surface Temperature</h3>
              <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse">
                LIVE DATA
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="h-8 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-full relative">
                <div 
                  className="absolute h-full flex items-center justify-end pr-3"
                  style={{ width: `${Math.min(100, (currentTemp / 40) * 100)}%` }}
                >
                  <span className="bg-black/80 px-3 py-1 rounded-full text-sm font-bold">
                    {currentTemp.toFixed(1)}°C
                  </span>
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <p className="text-gray-300">
                  <strong>Current:</strong> {currentTemp.toFixed(1)}°C 
                  ({lstAnomaly > 0 ? '+' : ''}{lstAnomaly.toFixed(1)}°C anomaly)
                </p>
                <p className="text-orange-400">
                  <strong>Impact:</strong> {lstAnomaly > 2 ? '⚠️ Significant heat stress expected' : 'Moderate heat stress likely'}
                </p>
                <p className="text-xs text-gray-500">
                  📡 MODIS Terra satellite, updated twice daily (10:30 AM/PM local)
                </p>
              </div>
            </div>
          </div>
          
          {/* NDVI Health Monitor Card */}
          <div className="bg-green-900/30 p-4 rounded-lg border-2 border-green-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">🌿 NDVI Vegetation Health</h3>
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                HEALTHY
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-full h-6 rounded-full ${getNDVIColor(currentNDVI)}`}>
                  <div className="h-full flex items-center justify-center text-xs font-bold text-white">
                    NDVI: {currentNDVI.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <p className="text-gray-300">
                  <strong>Current NDVI:</strong> {currentNDVI.toFixed(2)} (Healthy range: 0.6-0.8)
                </p>
                <p className="text-green-400">
                  <strong>Trend:</strong> Stable ✓ No stress detected yet
                </p>
                <p className="text-yellow-400 text-xs">
                  ⚠️ Heat stress may show in NDVI within 2-3 days if no action taken
                </p>
                <p className="text-xs text-gray-500">
                  📡 MODIS/Terra 16-day composite (250m resolution)
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-sm bg-blue-900/30 p-3 rounded-lg">
            <p className="font-semibold mb-1">💡 Why this matters:</p>
            <p className="text-gray-300 text-xs">
              Wheat flowering is highly sensitive to heat. Temperatures above 32°C can reduce 
              grain weight by 5% per degree Celsius. MODIS gives you 2-3 days warning before visible stress.
            </p>
          </div>
          
          {/* Decision Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">What will you do?</h3>
            
            {/* Option A: Emergency Irrigation */}
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                decisionConfirmed 
                  ? 'opacity-60 cursor-not-allowed border-gray-700 bg-gray-800/30' 
                  : stage2Decision === 'emergencyIrrigation'
                    ? 'border-blue-500 bg-blue-500/20 cursor-pointer'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 cursor-pointer'
              }`}
              onClick={() => !decisionConfirmed && setStage2Decision('emergencyIrrigation')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base">💧 Option A: Emergency Cooling Irrigation</h3>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">SAFE</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Apply overhead irrigation to lower canopy temperature during peak heat hours
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Costs:</p>
                  <ul className="text-xs space-y-1 text-gray-300">
                    <li>💰 $3,000</li>
                    <li>💧 30% water reserve</li>
                    <li>⏰ Labor + equipment</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Benefits:</p>
                  <ul className="text-xs space-y-1 text-green-400">
                    <li>✅ Reduces heat stress</li>
                    <li>✅ Protects grain development</li>
                    <li>✅ ~4% loss vs ~10%</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Option B: Accept Heat Stress */}
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                decisionConfirmed 
                  ? 'opacity-60 cursor-not-allowed border-gray-700 bg-gray-800/30' 
                  : stage2Decision === 'acceptHeatStress'
                    ? 'border-yellow-500 bg-yellow-500/20 cursor-pointer'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 cursor-pointer'
              }`}
              onClick={() => !decisionConfirmed && setStage2Decision('acceptHeatStress')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base">🌾 Option B: Accept Heat Stress</h3>
                <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">RISKY</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Save water and money, accept some yield reduction from heat stress
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Costs:</p>
                  <ul className="text-xs space-y-1 text-yellow-400">
                    <li>📉 Expected ~10% yield loss</li>
                    <li>⚠️ Quality reduction</li>
                    <li>📊 Heat factor: ~0.90</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Benefits:</p>
                  <ul className="text-xs space-y-1 text-gray-300">
                    <li>💰 Saves $3,000</li>
                    <li>💧 Conserves water</li>
                    <li>⏰ No action needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* NASA Resource Links */}
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <p className="text-xs font-semibold mb-2">📚 Consult NASA Resources:</p>
            <div className="space-y-1">
              <a
                href="https://worldview.earthdata.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                → View Real MODIS Temperature Data
              </a>
              <a
                href="https://giovanni.gsfc.nasa.gov/giovanni/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                → Check Real-Time NDVI (Giovanni)
              </a>
            </div>
          </div>
          
          <Button
            className="w-full"
            disabled={!stage2Decision || decisionConfirmed}
            onClick={handleConfirm}
          >
            {decisionConfirmed 
              ? 'Decision Confirmed ✓'
              : stage2Decision 
                ? stage2Decision === 'emergencyIrrigation' 
                  ? 'Confirm: Emergency Irrigation' 
                  : 'Confirm: Accept Heat Stress'
                : 'Select an Option'
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
