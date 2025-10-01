import React from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';

export const GameHUD: React.FC = () => {
  const { currentStage, location } = useFarmGame();
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <div className="bg-gray-900/90 text-white px-6 py-3 rounded-full border border-gray-700">
        <div className="flex items-center gap-6">
          <div className="text-sm">
            <span className="text-gray-400">Farm:</span>{' '}
            <span className="font-semibold text-green-400">{location?.name || 'Unknown'}</span>
          </div>
          
          <div className="h-4 w-px bg-gray-600" />
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStage >= 1 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              1
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStage >= 2 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              2
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStage >= 3 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
