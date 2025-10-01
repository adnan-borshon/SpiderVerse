import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Stage1Panel: React.FC = () => {
  const { stage1Decision, setStage1Decision, processStage1Decision, setCropStage, setQuizActive } = useFarmGame();
  
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
  
  return (
    <div className="fixed right-4 top-4 w-96 z-10 pointer-events-auto">
      <Card className="bg-gray-900/95 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">🌱 Stage 1: Sowing Decision</CardTitle>
          <p className="text-sm text-gray-300 mt-2">
            SMAP data shows dry soil conditions. How will you proceed?
          </p>
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
              <p className="text-gray-300">🌱 Germination rate: ~70%</p>
              <p className="text-yellow-400">⚠️ Risk: Poor germination in dry soil</p>
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
              <p className="text-gray-300">🌱 Germination rate: ~95%</p>
              <p className="text-green-400">✅ Benefit: Strong germination guaranteed</p>
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
                → View current SMAP data
              </a>
              <a
                href="https://giovanni.gsfc.nasa.gov/giovanni/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                → Check temperature trends
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
