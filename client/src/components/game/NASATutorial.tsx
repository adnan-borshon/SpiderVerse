import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { NASA_TOOLS } from '@/lib/gameConstants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const NASATutorial: React.FC = () => {
  const { location, tutorialStep, setTutorialStep, markNASAToolUsed, setPhase } = useFarmGame();

  const openTool = (tool: 'worldview' | 'cropCASMA' | 'giovanni' | 'floodPathfinder', url: string) => {
    markNASAToolUsed(tool);
    
    // Build location-specific URL
    let fullUrl = url;
    if (tool === 'worldview' && location) {
      const { lat, lon } = location.coordinates;
      fullUrl = `${url}?v=${lon-2},${lat-2},${lon+2},${lat+2}&l=MODIS_Terra_CorrectedReflectance_TrueColor`;
    }
    
    window.open(fullUrl, '_blank');
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
          
          {/* Step 1: Worldview */}
          {tutorialStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">📡 Step 1: See Your Farm from Space</h3>
              <p className="text-gray-300">NASA Worldview lets you view satellite imagery of your exact location</p>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <iframe
                  src={NASA_TOOLS.worldview}
                  className="w-full h-64 rounded"
                  title="NASA Worldview"
                />
                <Button
                  className="w-full mt-4"
                  onClick={() => openTool('worldview', NASA_TOOLS.worldview)}
                >
                  🌍 Open Worldview for Your Location
                </Button>
              </div>
              
              <div className="bg-blue-900/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What you can see:</h4>
                <ul className="space-y-1 text-sm">
                  <li>✅ Real-time satellite images of <strong>{location?.name}</strong></li>
                  <li>✅ Cloud cover, vegetation, water bodies</li>
                  <li>✅ Updated daily (some layers hourly)</li>
                </ul>
              </div>
              
              <Button onClick={nextStep} className="w-full">
                Next: Check Soil Moisture →
              </Button>
            </div>
          )}
          
          {/* Step 2: Crop-CASMA */}
          {tutorialStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">💧 Step 2: Check Soil Moisture (SMAP)</h3>
              <p className="text-gray-300">Crop-CASMA shows SMAP soil moisture data in farmer-friendly format</p>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <iframe
                  src={NASA_TOOLS.cropCASMA}
                  className="w-full h-64 rounded"
                  title="Crop-CASMA"
                />
                <Button
                  className="w-full mt-4"
                  onClick={() => openTool('cropCASMA', NASA_TOOLS.cropCASMA)}
                >
                  💧 Open Crop-CASMA for {location?.name}
                </Button>
              </div>
              
              <div className="bg-blue-900/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">How to read it:</h4>
                <ul className="space-y-1 text-sm">
                  <li>🔴 Red = Dry soil (need irrigation)</li>
                  <li>🟡 Yellow = Moderate</li>
                  <li>🟢 Green = Good moisture</li>
                  <li>🔵 Blue = Saturated (possible flooding)</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Tip: SMAP measures 0-5cm deep. For deeper roots, check trends over weeks.
                </p>
              </div>
              
              <Button onClick={nextStep} className="w-full">
                Next: Monitor Temperature →
              </Button>
            </div>
          )}
          
          {/* Step 3: Giovanni */}
          {tutorialStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">🌡️ Step 3: Track Temperature & Climate</h3>
              <p className="text-gray-300">Giovanni analyzes MODIS temperature data and trends</p>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <iframe
                  src={NASA_TOOLS.giovanni}
                  className="w-full h-64 rounded"
                  title="Giovanni"
                />
                <Button
                  className="w-full mt-4"
                  onClick={() => openTool('giovanni', NASA_TOOLS.giovanni)}
                >
                  🌡️ Open Giovanni for {location?.name}
                </Button>
              </div>
              
              <div className="bg-orange-900/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What to monitor:</h4>
                <ul className="space-y-1 text-sm">
                  <li>📈 Temperature anomalies (how much hotter than normal)</li>
                  <li>🌾 Growing Degree Days (crop development pace)</li>
                  <li>☀️ Heatwave predictions (stress on flowering crops)</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Tip: MODIS LST measures surface temp (not air temp). Daytime readings can be 10-15°C higher.
                </p>
              </div>
              
              <Button onClick={nextStep} className="w-full">
                Next: Check Flood Risk →
              </Button>
            </div>
          )}
          
          {/* Step 4: Flood Pathfinder */}
          {tutorialStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">🌊 Step 4: Assess Flood Risk</h3>
              <p className="text-gray-300">NASA Flood Pathfinder provides precipitation forecasts and flood alerts</p>
              
              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                <Button
                  className="w-full"
                  onClick={() => openTool('floodPathfinder', NASA_TOOLS.floodPathfinder)}
                >
                  🌊 Open Flood Data Pathfinder
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open('https://www.drought.gov/', '_blank')}
                >
                  📊 U.S. Drought Monitor (uses NASA SMAP data)
                </Button>
              </div>
              
              <div className="bg-cyan-900/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">How to use it:</h4>
                <ul className="space-y-1 text-sm">
                  <li>🔍 Search for your region: <strong>{location?.name}</strong></li>
                  <li>📅 Check 7-day precipitation forecast</li>
                  <li>🚨 Set up alerts for extreme events</li>
                  <li>🗺️ View historical flood patterns</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Tip: Cross-reference with local terrain maps. Low-lying areas flood first.
                </p>
              </div>
              
              <Button onClick={nextStep} className="w-full bg-green-600 hover:bg-green-700">
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
