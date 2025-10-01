import { Suspense } from "react";
import "@fontsource/inter";
import { useFarmGame } from "@/lib/stores/useFarmGame";
import { WelcomeScreen } from "@/components/game/WelcomeScreen";
import { NASATutorial } from "@/components/game/NASATutorial";
import { FarmScene } from "@/components/game/FarmScene";
import { NASADataPanel } from "@/components/game/NASADataPanel";
import { Stage1Panel } from "@/components/game/Stage1Panel";
import { Quiz } from "@/components/game/Quiz";
import { GameHUD } from "@/components/game/GameHUD";

function App() {
  const { phase } = useFarmGame();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
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
        </>
      )}
      
      {/* Stage 2 & 3 placeholder */}
      {(phase === 'stage2' || phase === 'stage3') && (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
          <p className="text-2xl">Stage {phase === 'stage2' ? '2' : '3'} - Coming Soon!</p>
        </div>
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
