import React, { useState } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { LOCATIONS } from '@/lib/gameConstants';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WelcomeScreen: React.FC = () => {
  const { setLocation, setPhase, loadDivisionData } = useFarmGame();
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [customLocation, setCustomLocation] = useState({
    name: '',
    lat: 0,
    lon: 0
  });
  const [showCustom, setShowCustom] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

const handleRegionChange = async (value: string) => {
  console.log('Selected region:', value); // Debug log
  setSelectedRegion(value);
  if (value === 'custom') {
    setShowCustom(true);
  } else {
    setShowCustom(false);
    if (value) {
      console.log('Calling loadDivisionData with:', value); // Debug log
      setIsLoadingData(true);
      try {
        await loadDivisionData(value);
        console.log(`✅ Real ${value} data loaded successfully`);
      } catch (error) {
        console.error('❌ Error loading real data:', error);
      } finally {
        setIsLoadingData(false);
      }
    }
  }
};

  const handleContinue = () => {
    if (showCustom) {
      setLocation({
        name: customLocation.name,
        coordinates: { lat: customLocation.lat, lon: customLocation.lon },
        country: 'Custom'
      });
    }
    setPhase('tutorial');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-green-600 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full bg-white/95">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-green-800">
            🌾 NASA Farm Navigators
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Learn to use satellite data for smarter farming
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              📍 Where is your farm located?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose your location to load real regional climate data
            </p>
            
            <Select value={selectedRegion} onValueChange={handleRegionChange} disabled={isLoadingData}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingData ? "Loading real NASA data..." : "-- Select District in Rajshahi --"} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="barishal">🌾 Barishal Division</SelectItem>
                <SelectItem value="rangpur">🌾 Rangpur Division</SelectItem>
                <SelectItem value="khulna">🌾 Khulna Division</SelectItem>
                <SelectItem value="chittagong">🌾 Chittagong Division</SelectItem>
                <SelectItem value="sylhet">🌾 Sylhet Division</SelectItem>
            
                <SelectItem value="rajshahi">🌾 Rajshahi Division</SelectItem>
               
              </SelectContent>
            </Select>
            
            {isLoadingData && (
              <p className="text-sm text-blue-600 mt-2 animate-pulse">
                📊 Loading real soil moisture, temperature, and vegetation data from {selectedRegion}...
              </p>
            )}
            
            {showCustom && (
              <div className="mt-4 space-y-3">
                <Input
                  placeholder="e.g., Nebraska, USA"
                  value={customLocation.name}
                  onChange={(e) => setCustomLocation({ ...customLocation, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Latitude"
                    value={customLocation.lat || ''}
                    onChange={(e) => setCustomLocation({ ...customLocation, lat: parseFloat(e.target.value) })}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Longitude"
                    value={customLocation.lon || ''}
                    onChange={(e) => setCustomLocation({ ...customLocation, lon: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            )}
            
            <Button
              className="w-full mt-4"
              onClick={handleContinue}
              disabled={!selectedRegion}
            >
              Continue →
            </Button>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              🛰️ You'll use these FREE NASA tools:
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">🛰️</div>
                <h4 className="font-semibold">SMAP</h4>
                <p className="text-sm text-gray-600">Soil Moisture</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-3xl mb-2">🌡️</div>
                <h4 className="font-semibold">MODIS</h4>
                <p className="text-sm text-gray-600">Temperature & Health</p>
              </div>
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <div className="text-3xl mb-2">🌊</div>
                <h4 className="font-semibold">Flood Pathfinder</h4>
                <p className="text-sm text-gray-600">Risk Forecasts</p>
              </div>
            </div>
            <p className="text-center text-sm text-green-700 mt-4">
              ✨ Bonus: Unlock real NASA platform tutorials as you play!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
