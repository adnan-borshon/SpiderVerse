import React, { useEffect, useState } from 'react';

interface StageTransitionProps {
  title: string;
  subtitle: string;
  onComplete: () => void;
  duration?: number;
}

export const StageTransition: React.FC<StageTransitionProps> = ({ 
  title, 
  subtitle, 
  onComplete, 
  duration = 2500 
}) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, duration - 500);
    
    return () => clearTimeout(timer);
  }, [duration, onComplete]);
  
  return (
    <div 
      className={`fixed inset-0 bg-black/90 flex items-center justify-center z-50 pointer-events-auto transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center text-white animate-in fade-in slide-in-from-bottom-4 duration-800">
        <h2 className="text-6xl font-bold mb-4">{title}</h2>
        <p className="text-2xl text-gray-300 mb-8">{subtitle}</p>
        <div className="flex gap-3 justify-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
