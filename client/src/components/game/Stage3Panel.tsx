import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const Stage3Panel: React.FC = () => {
  const { 
    stage3Decision, 
    setStage3Decision, 
    processStage3Decision, 
    setQuizActive,
    nasaData,
    location,
    budget,
    waterReserve,
    cropMaturity,
    day
  } = useFarmGame();
  const [decisionConfirmed, setDecisionConfirmed] = React.useState(false);
  
  const handleConfirm = () => {
    if (!stage3Decision || decisionConfirmed) return;
    
    setDecisionConfirmed(true);
    
    processStage3Decision();
    
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
  const floodRisk = currentNASAData.floodRisk;
  const floodPercentage = Math.round(floodRisk * 100);
  
  const getFloodColor = (risk: number) => {
    if (risk < 0.3) return 'bg-green-500';
    if (risk < 0.6) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="fixed right-4 top-4 w-[550px] max-h-[90vh] overflow-y-auto z-10 pointer-events-auto">
      <Card className="bg-gray-900/95 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">🌾 Stage 3: Harvest Timing Decision</CardTitle>
          <p className="text-sm text-gray-300 mt-2">
            Day {day}: Your wheat is 90% mature. Flood risk forecast shows danger ahead.
          </p>
          <div className="mt-3 space-y-1 text-xs text-gray-400">
            <p>📍 Location: {location?.name || 'Unknown'}</p>
            <p>🌱 Crop stage: Near maturity (7 days to full ripeness)</p>
            <p>💰 Budget: ${budget.toLocaleString()} | 💧 Water: {waterReserve}%</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Maturity Progress Card */}
          <div className="bg-yellow-900/30 p-4 rounded-lg border-2 border-yellow-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">🌾 Current Crop Maturity</h3>
              <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                {cropMaturity}%
              </span>
            </div>
            
            <div className="space-y-3">
              <Progress value={cropMaturity} className="h-3" />
              
              <div className="text-sm space-y-1">
                <p className="text-gray-300">
                  <strong>Current:</strong> {cropMaturity}% mature
                </p>
                <p className="text-yellow-400">
                  <strong>Optimal harvest:</strong> 100% (7 days away)
                </p>
                <p className="text-xs text-gray-500">
                  Early harvest penalty: 15% yield reduction
                </p>
              </div>
            </div>
          </div>
          
          {/* Flood Risk Visualization Card */}
          <div className={`p-4 rounded-lg border-2 ${
            floodRisk >= 0.6 ? 'bg-red-900/30 border-red-700' : 
            floodRisk >= 0.3 ? 'bg-orange-900/30 border-orange-700' : 
            'bg-green-900/30 border-green-700'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">💧 Flood Risk Forecast</h3>
              <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse">
                HIGH RISK
              </span>
            </div>
            
            <div className="space-y-3">
              {/* Flood risk visualization */}
              <div className="relative h-32 bg-gradient-to-t from-blue-600 via-orange-500 to-green-500 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-black/70 px-4 py-2 rounded-lg">
                    <p className="text-2xl font-bold">{floodPercentage}%</p>
                    <p className="text-xs">Flood Probability</p>
                    <p className="text-xs text-gray-400">Next 7 Days</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className={`p-2 rounded ${floodRisk < 0.3 ? 'bg-green-600' : 'bg-gray-700'}`}>
                  <p className="font-semibold">Low Risk</p>
                  <p className="text-gray-300">&lt;30%</p>
                </div>
                <div className={`p-2 rounded ${floodRisk >= 0.3 && floodRisk < 0.6 ? 'bg-orange-600' : 'bg-gray-700'}`}>
                  <p className="font-semibold">Medium</p>
                  <p className="text-gray-300">30-60%</p>
                </div>
                <div className={`p-2 rounded ${floodRisk >= 0.6 ? 'bg-red-600' : 'bg-gray-700'}`}>
                  <p className="font-semibold">High Risk</p>
                  <p className="text-gray-300">&gt;60%</p>
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <p className="text-gray-300">
                  <strong>Forecast:</strong> {floodPercentage}% probability in next 7 days
                </p>
                <p className="text-red-400">
                  <strong>Potential damage:</strong> Up to 54% crop loss if flood occurs
                </p>
                <p className="text-xs text-gray-500">
                  📡 NASA Flood Data Pathfinder - Satellite rainfall + terrain model
                </p>
              </div>
            </div>
          </div>
          
          {/* Market Price Comparison */}
          <div className="bg-blue-900/30 p-4 rounded-lg border-2 border-blue-700">
            <h3 className="font-semibold mb-3">💵 Market Price Analysis</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-yellow-800/40 p-3 rounded">
                <p className="text-xs text-gray-400 mb-1">Current Price (90% mature)</p>
                <p className="text-2xl font-bold text-yellow-400">$6.50</p>
                <p className="text-xs">per bushel</p>
              </div>
              <div className="bg-green-800/40 p-3 rounded">
                <p className="text-xs text-gray-400 mb-1">Premium Price (100% mature)</p>
                <p className="text-2xl font-bold text-green-400">$8.00</p>
                <p className="text-xs">per bushel</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Premium increase: +23% for fully mature wheat
            </p>
          </div>
          
          <div className="text-sm bg-purple-900/30 p-3 rounded-lg border border-purple-700">
            <p className="font-semibold mb-1">💡 Critical Decision Point:</p>
            <p className="text-gray-300 text-xs">
              You must balance three factors: crop maturity (affects yield), flood risk (could destroy crop), 
              and market prices (affects revenue). This is where satellite flood forecasting proves its value.
            </p>
          </div>
          
          {/* Decision Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">What will you do?</h3>
            
            {/* Option A: Harvest Early */}
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                decisionConfirmed 
                  ? 'opacity-60 cursor-not-allowed border-gray-700 bg-gray-800/30' 
                  : stage3Decision === 'harvestEarly'
                    ? 'border-yellow-500 bg-yellow-500/20 cursor-pointer'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 cursor-pointer'
              }`}
              onClick={() => !decisionConfirmed && setStage3Decision('harvestEarly')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base">🌾 Option A: Harvest Early (Today)</h3>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">SAFE</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Harvest immediately at 90% maturity to avoid flood risk
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Costs:</p>
                  <ul className="text-xs space-y-1 text-yellow-400">
                    <li>💰 $0 (no extra cost)</li>
                    <li>📉 15% yield reduction</li>
                    <li>💵 Lower price: $6.50/bushel</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Benefits:</p>
                  <ul className="text-xs space-y-1 text-green-400">
                    <li>✅ No flood risk</li>
                    <li>✅ Guaranteed harvest</li>
                    <li>✅ 91% flood safety factor</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-2 bg-green-900/30 rounded text-xs">
                <strong>Impact preview:</strong> Guaranteed safe harvest but lower yield and price
              </div>
            </div>
            
            {/* Option B: Wait for Full Ripeness */}
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                decisionConfirmed 
                  ? 'opacity-60 cursor-not-allowed border-gray-700 bg-gray-800/30' 
                  : stage3Decision === 'waitForRipeness'
                    ? 'border-red-500 bg-red-500/20 cursor-pointer'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 cursor-pointer'
              }`}
              onClick={() => !decisionConfirmed && setStage3Decision('waitForRipeness')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base">⏳ Option B: Wait for Full Ripeness (7 days)</h3>
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">RISKY</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Wait 7 days for 100% maturity and better market price
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Risks:</p>
                  <ul className="text-xs space-y-1 text-red-400">
                    <li>⚠️ 60% flood probability</li>
                    <li>📉 54% crop loss if flood hits</li>
                    <li>🎲 Gambling on weather</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Rewards (if no flood):</p>
                  <ul className="text-xs space-y-1 text-green-400">
                    <li>✅ No maturity penalty</li>
                    <li>✅ Premium price: $8.00/bushel</li>
                    <li>✅ Maximum profit potential</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-2 bg-red-900/30 rounded text-xs">
                <strong>Impact preview:</strong> Higher profit potential but 60% chance of catastrophic flood losses
              </div>
            </div>
          </div>
          
          {/* NASA Resource Links */}
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <p className="text-xs font-semibold mb-2">📚 Consult NASA Resources:</p>
            <div className="space-y-1">
              <a
                href="https://earthdata.nasa.gov/learn/pathfinders/disasters/floods-data-pathfinder"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                → NASA Flood Data Pathfinder
              </a>
              <a
                href="https://worldview.earthdata.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                → View Real-Time Satellite Data
              </a>
            </div>
          </div>
          
          <Button
            className="w-full"
            disabled={!stage3Decision || decisionConfirmed}
            onClick={handleConfirm}
          >
            {decisionConfirmed 
              ? 'Decision Confirmed ✓'
              : stage3Decision 
                ? stage3Decision === 'harvestEarly' 
                  ? 'Confirm: Harvest Early' 
                  : 'Confirm: Wait for Ripeness'
                : 'Select an Option'
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
