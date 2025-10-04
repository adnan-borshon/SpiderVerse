import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { TOOLTIPS } from '@/lib/gameConstants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const NASADataPanel: React.FC = () => {
  const { nasaData, budget, waterReserve, location } = useFarmGame();
  
  // Debug logging
  React.useEffect(() => {
    console.log('🔍 NASADataPanel Debug:', {
      nasaData,
      location,
      budget,
      waterReserve
    });
  }, [nasaData, location, budget, waterReserve]);

  // Handle null nasaData with fallback values
  const currentNASAData = nasaData || {
    smapAnomaly: -0.3,
    modisLST: 2.5,
    floodRisk: 0.6,
    ndvi: 0.75
  };

  // Map anomaly to color gradient
  const getColorForAnomaly = (anomaly: number) => {
    if (anomaly < -0.4) return '#DC2626'; // Red - very dry
    if (anomaly < -0.2) return '#F59E0B'; // Orange - dry
    if (anomaly < 0) return '#EAB308'; // Yellow - slightly dry
    if (anomaly < 0.2) return '#84CC16'; // Light green - good
    return '#22C55E'; // Green - wet
  };
  
  const smapColor = getColorForAnomaly(currentNASAData.smapAnomaly);
  const smapPercentage = ((currentNASAData.smapAnomaly + 1) / 2) * 100; // Map -1 to 1 to 0-100%
  
  console.log('🎯 Current NASA Data:', {
    smapAnomaly: currentNASAData.smapAnomaly,
    modisLST: currentNASAData.modisLST,
    ndvi: currentNASAData.ndvi,
    floodRisk: currentNASAData.floodRisk,
    location: location?.name
  });

  return (
    <div className="fixed left-4 top-4 w-80 space-y-3 z-10 pointer-events-auto">
      <Card className="bg-gray-900/95 text-white border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">🛰️ NASA Satellite Data</CardTitle>
          {location && (
            <div className="text-xs text-gray-400">
              Location: {location.name}
              {location.mainCrop && ` | Crop: ${location.mainCrop}`}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SMAP Soil Moisture */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">SMAP Soil Moisture</span>
              <span className="text-xs text-gray-400">📊</span>
            </div>
            <div className="relative h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full w-1 bg-white shadow-lg"
                style={{ left: `${smapPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Anomaly: <span style={{ color: smapColor }}>{currentNASAData.smapAnomaly.toFixed(2)}</span>
              {currentNASAData.smapAnomaly < -0.3 ? ' (Dry - Irrigation recommended)' : 
               currentNASAData.smapAnomaly < 0 ? ' (Slightly Dry)' : ' (Adequate)'}
            </p>
          </div>
          
          {/* MODIS Temperature */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">MODIS LST</span>
              <span className="text-xs text-gray-400">🌡️</span>
            </div>
            <Progress value={(currentNASAData.modisLST / 5) * 100} className="h-2" />
            <p className="text-xs text-gray-400 mt-1">
              Temp anomaly: {currentNASAData.modisLST > 0 ? '+' : ''}{currentNASAData.modisLST.toFixed(1)}°C
              {currentNASAData.modisLST > 3.0 ? ' (High heat stress)' : 
               currentNASAData.modisLST > 2.0 ? ' (Heat stress risk)' : 
               currentNASAData.modisLST > 1.0 ? ' (Warm conditions)' : ' (Normal)'}
            </p>
          </div>
          
          {/* NDVI */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">NDVI (Vegetation Health)</span>
              <span className="text-xs text-gray-400">🌿</span>
            </div>
            <Progress value={currentNASAData.ndvi * 100} className="h-2" />
            <p className="text-xs text-gray-400 mt-1">
              Index: {currentNASAData.ndvi.toFixed(2)}
              {currentNASAData.ndvi > 0.7 ? ' (Very Healthy)' : 
               currentNASAData.ndvi > 0.6 ? ' (Healthy)' : 
               currentNASAData.ndvi > 0.5 ? ' (Moderate)' : 
               currentNASAData.ndvi > 0.3 ? ' (Poor)' : ' (Very Poor)'}
            </p>
          </div>
          
          {/* Flood Risk */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Flood Risk (Pathfinder)</span>
              <span className="text-xs text-gray-400">🌊</span>
            </div>
            <Progress value={currentNASAData.floodRisk * 100} className="h-2" />
            <p className="text-xs text-gray-400 mt-1">
              Probability: {(currentNASAData.floodRisk * 100).toFixed(0)}%
              {currentNASAData.floodRisk > 0.7 ? ' (Very High risk)' : 
               currentNASAData.floodRisk > 0.5 ? ' (High risk)' : 
               currentNASAData.floodRisk > 0.3 ? ' (Moderate)' : ' (Low)'}
            </p>
          </div>

          {/* Data Status Indicator */}
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-center text-gray-500">
              {!nasaData ? '⚠️ Using simulated data' : '✅ Live satellite data'}
              {location && ` • ${location.name}`}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Farm Stats */}
      <Card className="bg-gray-900/95 text-white border-gray-700">
        <CardContent className="pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">💰 Budget:</span>
            <span className="text-sm font-semibold">${budget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">💧 Water Reserve:</span>
            <span className="text-sm font-semibold">{waterReserve}%</span>
          </div>
          <Progress value={waterReserve} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
};