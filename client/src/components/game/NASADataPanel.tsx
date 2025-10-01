import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { TOOLTIPS } from '@/lib/gameConstants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const NASADataPanel: React.FC = () => {
  const { nasaData, budget, waterReserve } = useFarmGame();
  
  // Map anomaly to color gradient
  const getColorForAnomaly = (anomaly: number) => {
    if (anomaly < -0.4) return '#DC2626'; // Red - very dry
    if (anomaly < -0.2) return '#F59E0B'; // Orange - dry
    if (anomaly < 0) return '#EAB308'; // Yellow - slightly dry
    if (anomaly < 0.2) return '#84CC16'; // Light green - good
    return '#22C55E'; // Green - wet
  };
  
  const smapColor = getColorForAnomaly(nasaData.smapAnomaly);
  const smapPercentage = ((nasaData.smapAnomaly + 1) / 2) * 100; // Map -1 to 1 to 0-100%
  
  return (
    <div className="fixed left-4 top-4 w-80 space-y-3 z-10 pointer-events-auto">
      <Card className="bg-gray-900/95 text-white border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">🛰️ NASA Satellite Data</CardTitle>
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
              Anomaly: <span style={{ color: smapColor }}>{nasaData.smapAnomaly.toFixed(2)}</span>
              {nasaData.smapAnomaly < -0.3 ? ' (Dry - Irrigation recommended)' : ' (Adequate)'}
            </p>
          </div>
          
          {/* MODIS Temperature */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">MODIS LST</span>
              <span className="text-xs text-gray-400">🌡️</span>
            </div>
            <Progress value={(nasaData.modisLST / 5) * 100} className="h-2" />
            <p className="text-xs text-gray-400 mt-1">
              Temp anomaly: +{nasaData.modisLST.toFixed(1)}°C
              {nasaData.modisLST > 2.0 ? ' (Heat stress risk)' : ' (Normal)'}
            </p>
          </div>
          
          {/* NDVI */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">NDVI (Vegetation Health)</span>
              <span className="text-xs text-gray-400">🌿</span>
            </div>
            <Progress value={nasaData.ndvi * 100} className="h-2" />
            <p className="text-xs text-gray-400 mt-1">
              Index: {nasaData.ndvi.toFixed(2)}
              {nasaData.ndvi > 0.7 ? ' (Healthy)' : nasaData.ndvi > 0.5 ? ' (Moderate)' : ' (Poor)'}
            </p>
          </div>
          
          {/* Flood Risk */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Flood Risk (Pathfinder)</span>
              <span className="text-xs text-gray-400">🌊</span>
            </div>
            <Progress value={nasaData.floodRisk * 100} className="h-2" />
            <p className="text-xs text-gray-400 mt-1">
              Probability: {(nasaData.floodRisk * 100).toFixed(0)}%
              {nasaData.floodRisk > 0.6 ? ' (High risk)' : nasaData.floodRisk > 0.3 ? ' (Moderate)' : ' (Low)'}
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
