import React, { useEffect, useState } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Confetti from 'react-confetti';

export const FinalResults: React.FC = () => {
  const { 
    potentialYield, 
    multipliers, 
    pricePerBushel,
    budget,
    waterReserve,
    stage1Decision,
    stage2Decision,
    stage3Decision,
    floodOccurred,
    quizScore,
    location,
    resetGame
  } = useFarmGame();
  
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Calculate final metrics
  const finalYieldKg = potentialYield * 
    multipliers.germination * 
    multipliers.drought * 
    multipliers.heat * 
    multipliers.flood;
  
  const finalYieldBushels = finalYieldKg / 27.2; // 1 bushel = 27.2 kg of wheat
  
  const revenue = finalYieldBushels * pricePerBushel;
  const initialBudget = 10000;
  const costs = initialBudget - budget;
  const profit = revenue - costs;
  
  // Water efficiency score (0-100)
  const waterUsed = 100 - waterReserve;
  const waterEfficiency = Math.max(0, 100 - waterUsed);
  
  // Resilience rating based on decisions and outcomes
  let resilienceScore = 50;
  if (stage1Decision === 'irrigate') resilienceScore += 15;
  if (stage2Decision === 'emergencyIrrigation') resilienceScore += 15;
  if (stage3Decision === 'harvestEarly') resilienceScore += 20;
  if (!floodOccurred) resilienceScore += 10;
  resilienceScore = Math.min(100, resilienceScore);
  
  const getResilienceRating = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-green-400' };
    if (score >= 60) return { text: 'Good', color: 'text-blue-400' };
    if (score >= 40) return { text: 'Fair', color: 'text-yellow-400' };
    return { text: 'Poor', color: 'text-red-400' };
  };
  
  const resilience = getResilienceRating(resilienceScore);
  
  useEffect(() => {
    if (profit > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [profit]);
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-y-auto pointer-events-auto">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="max-w-4xl w-full mx-4 my-8">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-yellow-600 border-2">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              🌾 NASA Farm Navigators: Final Results
            </CardTitle>
            <p className="text-center text-gray-300 mt-2">
              {location?.name} - Growing Season Complete
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Yield Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900/40 p-4 rounded-lg border border-blue-600">
                <p className="text-xs text-gray-400 mb-1">Final Yield</p>
                <p className="text-3xl font-bold text-blue-400">{finalYieldKg.toFixed(0)}</p>
                <p className="text-sm text-gray-300">kg ({finalYieldBushels.toFixed(1)} bushels)</p>
              </div>
              
              <div className={`p-4 rounded-lg border ${profit > 0 ? 'bg-green-900/40 border-green-600' : 'bg-red-900/40 border-red-600'}`}>
                <p className="text-xs text-gray-400 mb-1">Total Profit/Loss</p>
                <p className={`text-3xl font-bold ${profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${profit.toFixed(0)}
                </p>
                <p className="text-sm text-gray-300">Revenue: ${revenue.toFixed(0)} - Costs: ${costs.toFixed(0)}</p>
              </div>
              
              <div className="bg-purple-900/40 p-4 rounded-lg border border-purple-600">
                <p className="text-xs text-gray-400 mb-1">Quiz Score</p>
                <p className="text-3xl font-bold text-purple-400">{quizScore}/9</p>
                <p className="text-sm text-gray-300">NASA Knowledge</p>
              </div>
            </div>
            
            {/* Efficiency Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyan-900/40 p-4 rounded-lg border border-cyan-600">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">💧 Water Efficiency</p>
                  <p className="text-2xl font-bold text-cyan-400">{waterEfficiency.toFixed(0)}%</p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-cyan-500 h-3 rounded-full transition-all"
                    style={{ width: `${waterEfficiency}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Water remaining: {waterReserve}%</p>
              </div>
              
              <div className={`p-4 rounded-lg border border-yellow-600 ${resilience.color === 'text-green-400' ? 'bg-green-900/40' : resilience.color === 'text-yellow-400' ? 'bg-yellow-900/40' : 'bg-red-900/40'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">🛡️ Resilience Rating</p>
                  <p className={`text-2xl font-bold ${resilience.color}`}>{resilience.text}</p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      resilience.color === 'text-green-400' ? 'bg-green-500' :
                      resilience.color === 'text-blue-400' ? 'bg-blue-500' :
                      resilience.color === 'text-yellow-400' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${resilienceScore}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Risk management score: {resilienceScore}/100</p>
              </div>
            </div>
            
            {/* Decision Summary */}
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
              <h3 className="text-xl font-semibold mb-3">📋 Decision Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <p className="font-semibold">Stage 1: Sowing Decision</p>
                    <p className="text-sm text-gray-300">
                      {stage1Decision === 'irrigate' 
                        ? '✅ Irrigated before sowing - Achieved 95% germination'
                        : '⚠️ Sowed without irrigation - Only 70% germination due to dry soil'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      SMAP data showed dry conditions. {stage1Decision === 'irrigate' ? 'You invested in irrigation for better results.' : 'You saved costs but accepted lower germination.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <p className="font-semibold">Stage 2: Heatwave Crisis</p>
                    <p className="text-sm text-gray-300">
                      {stage2Decision === 'emergencyIrrigation'
                        ? '✅ Applied emergency irrigation - Reduced heat stress damage'
                        : '⚠️ Accepted heat stress - Lost ~10% yield to high temperatures'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      MODIS detected +{(multipliers.heat * 2.5).toFixed(1)}°C anomaly during flowering. {stage2Decision === 'emergencyIrrigation' ? 'Emergency cooling protected grain development.' : 'You conserved resources but crops suffered heat damage.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <p className="font-semibold">Stage 3: Harvest Timing</p>
                    <p className="text-sm text-gray-300">
                      {stage3Decision === 'harvestEarly'
                        ? '✅ Harvested early at 90% maturity - Avoided flood risk but lower price'
                        : floodOccurred
                          ? '❌ Waited for full ripeness - FLOOD OCCURRED! Lost 54% of crop'
                          : '✅ Waited for full ripeness - Perfect conditions! Got premium price'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Flood Data Pathfinder showed 60% probability. {stage3Decision === 'harvestEarly' ? 'You played it safe and guaranteed harvest.' : floodOccurred ? 'High-risk gamble resulted in catastrophic losses.' : 'High-risk gamble paid off with maximum profit!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Yield Breakdown */}
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
              <h3 className="text-xl font-semibold mb-3">📊 Yield Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Base Potential Yield:</span>
                  <span className="font-mono">4,000 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">× Germination Factor:</span>
                  <span className="font-mono">{(multipliers.germination * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">× Drought Factor:</span>
                  <span className="font-mono">{(multipliers.drought * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">× Heat Stress Factor:</span>
                  <span className="font-mono">{(multipliers.heat * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">× Flood/Maturity Factor:</span>
                  <span className="font-mono">{(multipliers.flood * 100).toFixed(0)}%</span>
                </div>
                <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
                  <span>Final Yield:</span>
                  <span className="text-blue-400">{finalYieldKg.toFixed(0)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Market Price:</span>
                  <span className="font-mono">${pricePerBushel}/bushel</span>
                </div>
                <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
                  <span>Total Revenue:</span>
                  <span className="text-green-400">${revenue.toFixed(0)}</span>
                </div>
              </div>
            </div>
            
            {/* Learning Points */}
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-600">
              <h3 className="text-xl font-semibold mb-3">🎓 Key Learning Points</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong>SMAP satellite</strong> provides critical soil moisture data for planting decisions, helping farmers avoid germination failures in dry conditions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400">•</span>
                  <span><strong>MODIS LST</strong> detects heat stress 2-3 days before visible crop damage, giving farmers time to apply cooling irrigation during sensitive growth stages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Flood Data Pathfinder</strong> combines satellite rainfall with terrain models to predict flood probability, helping farmers make harvest timing decisions worth thousands of dollars.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Risk management</strong> using satellite forecasts balances potential rewards against catastrophic losses. Sometimes the safe choice is the smart choice!</span>
                </li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3"
                onClick={resetGame}
              >
                🔄 Play Again
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
                onClick={() => window.open('https://earthdata.nasa.gov/', '_blank')}
              >
                🚀 Explore Real NASA Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
