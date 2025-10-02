import { Suspense, useState, useEffect } from "react";
import "@fontsource/inter";
import { useFarmGame } from "@/lib/stores/useFarmGame";
import { WelcomeScreen } from "@/components/game/WelcomeScreen";
import { NASATutorial } from "@/components/game/NASATutorial";
import { FarmScene } from "@/components/game/FarmScene";
import { NASADataPanel } from "@/components/game/NASADataPanel";
import { Stage1Panel } from "@/components/game/Stage1Panel";
import { Stage2Panel } from "@/components/game/Stage2Panel";
import { Stage3Panel } from "@/components/game/Stage3Panel";
import { StageTransition } from "@/components/game/StageTransition";
import { Quiz } from "@/components/game/Quiz";
import { GameHUD } from "@/components/game/GameHUD";
import { SoundManager } from "@/components/game/SoundManager";

function App() {
  const { phase, quizActive, questionsAnswered, setPhase } = useFarmGame();
  const [showTransition, setShowTransition] = useState(false);
  const [stage2Ready, setStage2Ready] = useState(false);
  const [stage3Ready, setStage3Ready] = useState(false);
  
  // Show transition when entering Stage 2
  useEffect(() => {
    if (phase === 'stage2' && !showTransition) {
      setShowTransition(true);
    }
  }, [phase]);
  
  // Auto-advance to Stage 2 after Stage 1 quiz complete and crop fully grown
  useEffect(() => {
    if (phase === 'stage1' && !quizActive && questionsAnswered >= 3) {
      setStage2Ready(true);
    }
  }, [phase, quizActive, questionsAnswered]);
  
  // Auto-advance to Stage 3 after Stage 2 quiz complete
  useEffect(() => {
    if (phase === 'stage2' && !quizActive && questionsAnswered >= 3) {
      setStage3Ready(true);
    }
  }, [phase, quizActive, questionsAnswered]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Sound Manager - always active */}
      <SoundManager />
      
      {/* Welcome Screen */}
      {phase === 'welcome' && <WelcomeScreen />}
      
      {/* NASA Tutorial */}
      {phase === 'tutorial' && <NASATutorial />}
      
      {/* Stage 1 Game */}
      {phase === 'stage1' && (
        <>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
              <p>Loading farm...</p>
            </div>
          }>
            <FarmScene />
          </Suspense>
          
          <GameHUD />
          <NASADataPanel />
          <Stage1Panel />
          <Quiz />
          
          {/* Advance to Stage 2 button */}
          {stage2Ready && !quizActive && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
              <button
                onClick={() => {
                  // Reset quiz counters for Stage 2
                  const { resetGame, ...gameState } = useFarmGame.getState();
                  useFarmGame.setState({ questionsAnswered: 0, quizScore: 0 });
                  setPhase('stage2');
                  setStage2Ready(false);
                }}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse"
              >
                ⏭️ Advance to Stage 2: Heatwave Crisis
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Stage 2 Game */}
      {phase === 'stage2' && (
        <>
          {showTransition && (
            <StageTransition
              title="⏰ 60 Days Later..."
              subtitle="Your wheat is flowering - a critical growth stage"
              onComplete={() => setShowTransition(false)}
              duration={2500}
            />
          )}
          
          {!showTransition && (
            <>
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                  <p>Loading farm...</p>
                </div>
              }>
                <FarmScene />
              </Suspense>
              
              <GameHUD />
              <NASADataPanel />
              <Stage2Panel />
              <Quiz />
              
              {/* Advance to Stage 3 button */}
              {stage3Ready && !quizActive && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
                  <button
                    onClick={() => {
                      // Reset quiz counters for Stage 3
                      useFarmGame.setState({ questionsAnswered: 0, quizScore: 0 });
                      setPhase('stage3');
                      setStage3Ready(false);
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse"
                  >
                    ⏭️ Advance to Stage 3: Harvest Decision
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {/* Stage 3 Game */}
      {phase === 'stage3' && (
        <>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
              <p>Loading farm...</p>
            </div>
          }>
            <FarmScene />
          </Suspense>
          
          <GameHUD />
          <NASADataPanel />
          <Stage3Panel />
          <Quiz />
        </>
      )}
      
      {/* Results placeholder */}
      {phase === 'results' && (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
          <p className="text-2xl">Results - Coming Soon!</p>
        </div>
      )}
    </div>
  );
}

export default App;
