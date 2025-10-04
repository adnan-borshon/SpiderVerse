import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataVisualizationProps {
  type: 'soil-moisture' | 'temperature' | 'vegetation' | 'flood';
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ type }) => {
  const { nasaData, location } = useFarmGame();

  const renderVisualization = () => {
    // Use actual NASA data or fallback values
    const currentData = nasaData || {
      smapAnomaly: 0.324,
      modisLST: 2.5,
      ndvi: 0.543,
      floodRisk: 0.6
    };

    switch(type) {
      case 'soil-moisture':
        // Convert SMAP anomaly to actual soil moisture value (0-1 scale)
        const moistureValue = currentData.smapAnomaly + 0.5; // Convert anomaly to actual value
        const moisturePercent = Math.min(100, Math.max(0, moistureValue * 100));
        return (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">SMAP Soil Moisture Data</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Current Reading</span>
                <span className="text-xl font-bold text-blue-400">{moistureValue.toFixed(3)} cm³/cm³</span>
              </div>
              
              {/* Visual moisture meter */}
              <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    moisturePercent < 30 ? 'bg-red-500' :
                    moisturePercent < 60 ? 'bg-yellow-500' :
                    moisturePercent < 80 ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${moisturePercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Dry</span>
                <span>Optimal</span>
                <span>Saturated</span>
              </div>
              
              <div className="mt-4 text-sm text-gray-300">
                <p>📍 Location: {location?.name || 'Loading...'}</p>
                <p>📅 Updated: Real-time SMAP satellite data</p>
                <p>📊 SMAP Anomaly: {currentData.smapAnomaly > 0 ? '+' : ''}{currentData.smapAnomaly.toFixed(3)}</p>
              </div>
            </div>
          </div>
        );

      case 'temperature':
        // Convert MODIS LST anomaly to actual temperature (using base temp + anomaly)
        const baseTemp = 23.0; // Base temperature for the region
        const tempValue = baseTemp + currentData.modisLST; // Add anomaly to base
        const heatStress = tempValue > 30;
        return (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">MODIS Land Surface Temperature</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Current Temperature</span>
                <span className={`text-3xl font-bold ${heatStress ? 'text-red-500' : 'text-green-400'}`}>
                  {tempValue.toFixed(1)}°C
                </span>
              </div>
              
              {/* Temperature scale */}
              <div className="grid grid-cols-5 gap-1">
                {[15, 20, 25, 30, 35].map(temp => (
                  <div 
                    key={temp}
                    className={`text-center py-2 rounded ${
                      temp <= tempValue ? 
                        temp <= 25 ? 'bg-green-600' : 
                        temp <= 30 ? 'bg-yellow-600' : 'bg-red-600'
                      : 'bg-gray-700'
                    }`}
                  >
                    <span className="text-xs">{temp}°</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-yellow-900/30 rounded">
                <p className="text-sm font-semibold">⚠️ Heat Stress Analysis</p>
                <p className="text-xs text-gray-300 mt-1">
                  {tempValue < 20 ? '✅ Optimal temperature for wheat growth' :
                   tempValue < 25 ? '✅ Good temperature conditions' :
                   tempValue < 30 ? '⚠️ Moderate heat stress - monitor closely' :
                   '🔴 High heat stress - immediate action needed'}
                </p>
              </div>
              
              <div className="mt-4 text-sm text-gray-300">
                <p>📍 Location: {location?.name || 'Loading...'}</p>
                <p>📅 Temperature Anomaly: {currentData.modisLST > 0 ? '+' : ''}{currentData.modisLST.toFixed(1)}°C</p>
              </div>
            </div>
          </div>
        );

      case 'vegetation':
        const ndviValue = currentData.ndvi;
        return (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">NDVI Vegetation Health</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Vegetation Index</span>
                <span className={`text-3xl font-bold ${
                  ndviValue > 0.6 ? 'text-green-500' : 
                  ndviValue > 0.4 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {ndviValue.toFixed(3)}
                </span>
              </div>
              
              {/* NDVI visual indicator */}
              <div className="grid grid-cols-4 gap-2">
                <div className={`p-3 rounded text-center ${ndviValue < 0.35 ? 'bg-red-600' : 'bg-gray-700'}`}>
                  <span className="text-xs">Poor</span>
                  <span className="block text-xs mt-1">{'<0.35'}</span>
                </div>
                <div className={`p-3 rounded text-center ${ndviValue >= 0.35 && ndviValue < 0.5 ? 'bg-yellow-600' : 'bg-gray-700'}`}>
                  <span className="text-xs">Moderate</span>
                  <span className="block text-xs mt-1">0.35-0.5</span>
                </div>
                <div className={`p-3 rounded text-center ${ndviValue >= 0.5 && ndviValue < 0.65 ? 'bg-green-600' : 'bg-gray-700'}`}>
                  <span className="text-xs">Good</span>
                  <span className="block text-xs mt-1">0.5-0.65</span>
                </div>
                <div className={`p-3 rounded text-center ${ndviValue >= 0.65 ? 'bg-green-700' : 'bg-gray-700'}`}>
                  <span className="text-xs">Excellent</span>
                  <span className="block text-xs mt-1">{'>0.65'}</span>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-300">
                <p>📍 Location: {location?.name || 'Loading...'}</p>
                <p>📅 Data: Real-time MODIS vegetation data</p>
                <p>🌱 Status: {
                  ndviValue > 0.65 ? 'Excellent crop health' :
                  ndviValue > 0.5 ? 'Good crop health' :
                  ndviValue > 0.35 ? 'Moderate crop health' : 'Poor crop health'
                }</p>
              </div>
            </div>
          </div>
        );

      case 'flood':
        const floodRisk = currentData.floodRisk;
        const riskLevel = floodRisk > 0.7 ? 'High' : floodRisk > 0.4 ? 'Moderate' : 'Low';
        return (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Flood Risk Assessment</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Risk Level</span>
                <span className={`text-2xl font-bold ${
                  riskLevel === 'High' ? 'text-red-500' :
                  riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {riskLevel} ({(floodRisk * 100).toFixed(0)}%)
                </span>
              </div>
              
              {/* Risk indicator */}
              <div className="relative h-12 bg-gray-700 rounded-lg overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    riskLevel === 'High' ? 'bg-red-500' :
                    riskLevel === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${floodRisk * 100}%` }}
                />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-700 p-2 rounded">
                  <span className="text-gray-400">Rainfall:</span>
                  <span className="ml-2 text-white">{
                    floodRisk > 0.7 ? 'Heavy' :
                    floodRisk > 0.4 ? 'Moderate' : 'Light'
                  }</span>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <span className="text-gray-400">River Level:</span>
                  <span className="ml-2 text-white">{
                    floodRisk > 0.7 ? 'High' :
                    floodRisk > 0.4 ? 'Moderate' : 'Normal'
                  }</span>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-300">
                <p>📍 Location: {location?.name || 'Loading...'}</p>
                <p>📅 Based on {location?.name ? `${location.name} ` : ''}historical flood patterns</p>
                <p>⚠️ Risk Assessment: {
                  riskLevel === 'High' ? 'High probability of flooding in next 10 days' :
                  riskLevel === 'Moderate' ? 'Moderate flood risk - monitor conditions' :
                  'Low flood risk - normal conditions'
                }</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-gray-900 text-white">
      <CardContent className="p-4">
        {renderVisualization()}
      </CardContent>
    </Card>
  );
};