import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Stage1Panel: React.FC = () => {
  const { 
    stage1Decision, 
    setStage1Decision, 
    processStage1Decision, 
    setCropStage, 
    setQuizActive,
    nasaData,
    location,
    isLoading
  } = useFarmGame();
  
  // Get actual soil moisture data or fallback
  const soilMoistureData = nasaData?.smapAnomaly ?? -0.3;
  
  // Determine soil condition message based on actual SMAP anomaly
  const getSoilConditionMessage = (anomaly: number) => {
    if (anomaly >= 0.1) return 'excellent soil moisture conditions';
    if (anomaly >= 0) return 'good soil moisture conditions';
    if (anomaly >= -0.15) return 'moderately dry soil conditions';
    if (anomaly >= -0.3) return 'dry soil conditions - drought stress likely';
    return 'very dry soil conditions - critical drought stress';
  };

  // Calculate dynamic germination rates based on actual soil moisture
  const getGerminationRates = (anomaly: number) => {
    const baseNoIrrigateRate = 0.70;
    const baseIrrigateRate = 0.95;
    
    // Adjust rates based on soil moisture anomaly
    // Better soil moisture = higher base germination even without irrigation
    const moistureAdjustment = Math.max(-0.25, Math.min(0.15, anomaly * 0.5));
    
    return {
      noIrrigate: Math.max(0.3, Math.min(0.9, baseNoIrrigateRate + moistureAdjustment)),
      irrigate: Math.max(0.85, Math.min(0.99, baseIrrigateRate + (moistureAdjustment * 0.5)))
    };
  };

  const soilConditionMessage = getSoilConditionMessage(soilMoistureData);
  const germinationRates = getGerminationRates(soilMoistureData);

  const handleConfirm = () => {
    if (!stage1Decision) return;
    
    setCropStage('planting');
    
    // Show planting animation briefly
    setTimeout(() => {
      processStage1Decision();
      
      // Show quiz after decision
      setTimeout(() => {
        setQuizActive(true);
      }, 2000);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="fixed right-4 top-4 w-96 z-10 pointer-events-auto">
        <Card className="bg-gray-900/95 text-white border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-300">Loading NASA soil data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="fixed right-4 top-4 w-96 z-10 pointer-events-auto">
      <Card className="bg-gray-900/95 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">🌱 Stage 1: Sowing Decision</CardTitle>
          <div className="space-y-2">
            <p className="text-sm text-gray-300 mt-2">
              <strong>NASA SMAP Data</strong> shows {soilConditionMessage} in {location?.name}.
            </p>
            <div className="bg-gray-800/50 p-2 rounded text-xs">
              <p>📊 <strong>Soil Moisture Anomaly:</strong> {soilMoistureData > 0 ? '+' : ''}{soilMoistureData.toFixed(2)}</p>
              <p className={`text-xs mt-1 ${
                soilMoistureData >= 0 ? 'text-green-400' : 
                soilMoistureData >= -0.15 ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                {soilMoistureData >= 0 ? '✅ Above normal' : 
                 soilMoistureData >= -0.15 ? '⚠️ Slightly below normal' : 
                 '❌ Well below normal'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Option A: No Irrigation */}
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              stage1Decision === 'noIrrigate'
                ? 'border-yellow-500 bg-yellow-500/20'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
            onClick={() => setStage1Decision('noIrrigate')}
          >
            <h3 className="font-semibold text-lg mb-2">Option A: Sow without irrigation</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-300">💰 Cost: $0</p>
              <p className="text-gray-300">🌱 Expected germination: ~{(germinationRates.noIrrigate * 100).toFixed(0)}%</p>
              <p className="text-yellow-400">
                ⚠️ Risk: {soilMoistureData < -0.2 ? 'Very poor' : soilMoistureData < -0.1 ? 'Poor' : 'Moderate'} germination in dry soil
              </p>
              {soilMoistureData < -0.2 && (
                <p className="text-red-400 text-xs">❗ Critical drought conditions detected</p>
              )}
            </div>
          </div>
          
          {/* Option B: Irrigate */}
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              stage1Decision === 'irrigate'
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
            onClick={() => setStage1Decision('irrigate')}
          >
            <h3 className="font-semibold text-lg mb-2">Option B: Irrigate before sowing</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-300">💰 Cost: $2,000</p>
              <p className="text-gray-300">💧 Water use: 20% of reserve</p>
              <p className="text-gray-300">🌱 Expected germination: ~{(germinationRates.irrigate * 100).toFixed(0)}%</p>
              <p className="text-green-400">
                ✅ Benefit: {soilMoistureData < -0.2 ? 'Critical irrigation needed' : 'Strong germination guaranteed'}
              </p>
            </div>
          </div>
          
          {/* NASA Resource Links */}
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <p className="text-xs font-semibold mb-2">📚 Consult NASA Resources:</p>
            <div className="space-y-1">
              <a
                href="https://nassgeo.csiss.gmu.edu/CropCASMA/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                → View current SMAP soil moisture data
              </a>
              <a
                href="https://giovanni.gsfc.nasa.gov/giovanni/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                → Check temperature trends
              </a>
              <a
                href={`https://worldview.earthdata.nasa.gov/?v=-77.84527777778647,-179.767361111126,78.15472222221353,179.767361111126&l=Reference_Labels_15m(hidden),Reference_Features_15m(hidden),Coastlines_15m,VIIRS_SNPP_CorrectedReflectance_TrueColor(hidden),MODIS_Aqua_CorrectedReflectance_TrueColor(hidden),MODIS_Terra_CorrectedReflectance_TrueColor,SMAP_L3_Active_Passive_Soil_Moisture(${location?.coordinates.lon},${location?.coordinates.lat},0.07)`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                → See real-time satellite view of {location?.name}
              </a>
            </div>
          </div>
          
          <Button
            className="w-full"
            disabled={!stage1Decision}
            onClick={handleConfirm}
          >
            {stage1Decision ? 'Confirm Decision' : 'Select an Option'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};