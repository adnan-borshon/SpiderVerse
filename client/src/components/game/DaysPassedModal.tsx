import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DaysPassedModalProps {
  daysPassed: number;
  message: string;
  onClose: () => void;
}

export const DaysPassedModal: React.FC<DaysPassedModalProps> = ({ daysPassed, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 pointer-events-auto">
      <Card className="max-w-md w-full mx-4 bg-gradient-to-br from-indigo-900 to-blue-900 text-white border-blue-500 animate-in fade-in slide-in-from-bottom-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            ⏰ Time Advanced
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="bg-blue-950/50 p-6 rounded-lg">
            <div className="text-5xl font-bold text-yellow-400 mb-2">
              {daysPassed}
            </div>
            <div className="text-xl text-gray-300">
              Day{daysPassed !== 1 ? 's' : ''} Passed
            </div>
          </div>
          
          <div className="bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm text-gray-200 leading-relaxed">
              {message}
            </p>
          </div>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onClose}
          >
            Continue →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
