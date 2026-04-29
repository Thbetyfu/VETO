import { useEffect, useState } from 'react';
import { Scale, Users, ShieldAlert, Wallet, Trophy } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameEngine } from './hooks/useGameEngine';
import { useWebLLM } from './hooks/useWebLLM';
import { ScenarioCard } from './components/ScenarioCard';
import { StatItem } from './components/StatItem';
import { GameOverScreen } from './components/GameOverScreen';
import { AIFeedback } from './components/AIFeedback';
import { Prologue } from './components/Prologue';
import { MonthlyReport } from './components/MonthlyReport';
import { CalendarService } from './lib/engine/CalendarService';
import { ElectionNight } from './components/ElectionNight';
import { saveLegacy } from './lib/gun-bridge';
import type { ScenarioOption } from './types/scenario';

/**
 * @function App
 * @description Orchestrator utama VETO. Merakitkan Game Engine + WebLLM
 * dan menghubungkan event ke setiap layer.
 */
function App() {
  const { 
    status: aiStatus, 
    loadProgress, 
    feedback, 
    initModel, 
    generateFeedback, 
    clearFeedback,
    aiService
  } = useWebLLM();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('Presiden Anonim');
  const [showGallery, setShowGallery] = useState(false);
  const [isHapticFlash, setIsHapticFlash] = useState(false);
  const [isElectionNight, setIsElectionNight] = useState(false);

  const { state, isLoading, makeChoice, restartGame, closeReport } = useGameEngine(aiService);
  const { stats, day, currentScenario, isGameOver, isReportOpen, gameOverReason, history } = state;

  // Mulai muat model AI dengan delay agar tidak mengganggu rendering awal (Latency Zero)
  useEffect(() => {
    const timer = setTimeout(() => {
      initModel();
    }, 1500); // Tunggu animasi awal selesai
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // === Hall of Fame Integration ===
  useEffect(() => {
    if (isGameOver) {
      saveLegacy({
        id: `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        playerName: playerName,
        day: day,
        reason: gameOverReason,
        finalStats: stats,
        timestamp: Date.now(),
        profile: state.profile
      });
    }
  }, [isGameOver, playerName, day, gameOverReason, stats, state.profile]);

  /**
   * Handler pilihan — menggabungkan Game Engine + AI + UX Effects.
   */
  const handleChoice = async (option: ScenarioOption) => {
    // 1. Trigger Haptic (Flash & Vibration)
    setIsHapticFlash(true);
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Feedback fisik singkat
    }
    setTimeout(() => setIsHapticFlash(false), 200);

    // 2. Logic & AI
    clearFeedback();
    await makeChoice(option);
    
    // Jalankan AI analysis setelah state update (tidak blocking UX)
    if (aiStatus === 'ready') {
      await generateFeedback(option.label);
    }
  };

  // === Milestone Triggers (Fase 14) ===
  useEffect(() => {
    if (day === 360) {
      setIsElectionNight(true);
    }
  }, [day]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-president-dark overflow-x-hidden">
      
      {/* 1. LAYER: PROLOGUE (Fase 6) */}
      <AnimatePresence>
        {!gameStarted && !showGallery && (
          <Prologue 
            onStart={(name) => {
              setPlayerName(name);
              setGameStarted(true);
            }} 
            aiStatus={aiStatus}
            loadProgress={loadProgress}
          />
        )}
      </AnimatePresence>

      {/* 1b. LAYER: HALL OF FAME (Fase 9) */}
      <AnimatePresence>
        {showGallery && (
          <LegacyGallery onBack={() => setShowGallery(false)} />
        )}
      </AnimatePresence>

      {/* 2. LAYER: MONTHLY REPORT (Fase 8 - Reflection) */}
      <AnimatePresence>
        {isReportOpen && (
          <MonthlyReport 
            day={day}
            stats={stats}
            history={history}
            onContinue={closeReport}
            aiStatus={aiStatus}
          />
        )}
      </AnimatePresence>

      {/* 2b. LAYER: ELECTION NIGHT (Fase 14 - Milestone) */}
      <AnimatePresence>
        {isElectionNight && (
          <ElectionNight 
            stats={stats}
            isWinner={!isGameOver} 
            onContinue={() => {
              setIsElectionNight(false);
              if (isGameOver) restartGame();
            }}
          />
        )}
      </AnimatePresence>

      {/* 3. LAYER: HAPTIC FLASH (Fase 6) */}
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

      {/* 4. LAYER: DASHBOARD HEADER */}
      <header className="fixed top-0 w-full z-40 flex items-center justify-between px-6 py-4 bg-president-dark/60 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowGallery(true)}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-president-gold"
            title="Hall of Fame"
          >
            <Trophy size={20} />
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="text-left">
            <h1 className="text-sm font-bold text-white tracking-tighter uppercase">VETO Terminal</h1>
            <p className="text-[9px] text-president-gold uppercase tracking-widest font-black">
              {CalendarService.getLabel(day)} • {playerName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-8 md:gap-12">
          <StatItem icon={<Scale size={18} />} label="Law" value={stats.law} themeColor="gold" />
          <StatItem icon={<Users size={18} />} label="Humanity" value={stats.humanity} themeColor="blue" />
          <StatItem icon={<ShieldAlert size={18} />} label="Order" value={stats.order} themeColor="red" />
          <StatItem icon={<Wallet size={18} />} label="Budget" value={stats.budget} themeColor="emerald" />
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
              <GameOverScreen 
                reason={gameOverReason} 
                day={day} 
                onRestart={restartGame} 
                onViewGallery={() => setShowGallery(true)}
              />
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
                  disabled={isLoading}
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
