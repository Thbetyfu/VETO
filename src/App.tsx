import { useEffect, useState } from 'react';
import { Scale, Users, ShieldAlert, Wallet } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameEngine } from './hooks/useGameEngine';
import { useWebLLM } from './hooks/useWebLLM';
import { ScenarioCard } from './components/ScenarioCard';
import { StatItem } from './components/StatItem';
import { GameOverScreen } from './components/GameOverScreen';
import { AIFeedback } from './components/AIFeedback';
import { Prologue } from './components/Prologue';
import type { ScenarioOption } from './types/scenario';

/**
 * @function App
 * @description Orchestrator utama VETO. Merakitkan Game Engine + WebLLM
 * dan menghubungkan event ke setiap layer.
 */
function App() {
  const { state, makeChoice, restartGame } = useGameEngine();
  const { 
    status: aiStatus, 
    loadProgress, 
    feedback, 
    initModel, 
    generateFeedback, 
    clearFeedback 
  } = useWebLLM();
  
  const { stats, day, currentScenario, isGameOver, gameOverReason, history } = state;
  
  // === UX STATE (Fase 6) ===
  const [gameStarted, setGameStarted] = useState(false);
  const [isHapticFlash, setIsHapticFlash] = useState(false);

  // Mulai muat model AI di background saat app pertama dibuka (Opportunistic Loading)
  useEffect(() => {
    initModel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Handler pilihan — menggabungkan Game Engine + AI + UX Effects.
   */
  const handleChoice = async (option: ScenarioOption) => {
    // 1. Trigger Haptic (Flash)
    setIsHapticFlash(true);
    setTimeout(() => setIsHapticFlash(false), 200);

    // 2. Logic & AI
    clearFeedback();
    makeChoice(option);
    
    // Jalankan AI analysis setelah state update (tidak blocking UX)
    await generateFeedback(option, stats, day, history.length);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-president-dark overflow-x-hidden">
      
      {/* 1. LAYER: PROLOGUE (Fase 6) */}
      <AnimatePresence>
        {!gameStarted && (
          <Prologue 
            onStart={() => setGameStarted(true)} 
            aiStatus={aiStatus}
            loadProgress={loadProgress}
          />
        )}
      </AnimatePresence>

      {/* 2. LAYER: HAPTIC FLASH (Fase 6) */}
      <AnimatePresence>
        {isHapticFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 3. LAYER: AMBIENT BG */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-president-gold/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-president-accent/8 blur-[160px] rounded-full" />
      </div>

      {/* 4. LAYER: DASHBOARD SUMMARY */}
      <header className="fixed top-0 left-0 right-0 z-10 flex justify-center pt-4 pb-3 px-4 bg-president-dark/60 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-8 md:gap-12">
          <StatItem icon={<Scale className="text-president-gold" size={18} />} label="Law" value={stats.law} colorClass="bg-president-gold" />
          <StatItem icon={<Users className="text-sky-400" size={18} />} label="Humanity" value={stats.humanity} colorClass="bg-sky-400" />
          <StatItem icon={<ShieldAlert className="text-red-400" size={18} />} label="Order" value={stats.order} colorClass="bg-red-500" />
          <StatItem icon={<Wallet className="text-emerald-400" size={18} />} label="Budget" value={stats.budget} colorClass="bg-emerald-400" />
        </div>
      </header>

      {/* 5. LAYER: MAIN GAMEPLAY */}
      <main className="max-w-md w-full pt-20 pb-12">
        <AnimatePresence mode="wait">
          {isGameOver ? (
            <motion.div 
              key="gameover" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <GameOverScreen reason={gameOverReason} day={day} onRestart={restartGame} />
            </motion.div>
          ) : (
            <motion.div 
              key="gameplay" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {currentScenario && (
                <ScenarioCard
                  scenario={currentScenario}
                  day={day}
                  onChoice={handleChoice}
                />
              )}
              
              {/* Panel Analisis AI */}
              <AIFeedback
                feedback={feedback}
                status={aiStatus}
                loadProgress={loadProgress}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 6. LAYER: FOOTER STATUS */}
      <footer className="fixed bottom-4 text-slate-600 text-[10px] uppercase tracking-[0.25em] flex items-center gap-3">
        <span>VETO V0.2</span>
        <span className="w-1 h-1 rounded-full bg-slate-800" />
        <span className={aiStatus === 'ready' ? 'text-emerald-500/70' : 'text-slate-500/70'}>
          {aiStatus === 'ready' ? '🟢 AI ONLINE' : aiStatus === 'loading' ? `⏳ AI SYNC ${loadProgress}%` : '⚡ HEURISTIC'}
        </span>
      </footer>
    </div>
  );
}

export default App;
