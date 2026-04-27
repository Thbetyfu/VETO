import { useEffect } from 'react';
import { Scale, Users, ShieldAlert, Wallet } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameEngine } from './hooks/useGameEngine';
import { useWebLLM } from './hooks/useWebLLM';
import { ScenarioCard } from './components/ScenarioCard';
import { StatItem } from './components/StatItem';
import { GameOverScreen } from './components/GameOverScreen';
import { AIFeedback } from './components/AIFeedback';
import type { ScenarioOption } from './types/scenario';

/**
 * @function App
 * @description Orchestrator utama VETO. Merakitkan Game Engine + WebLLM
 * dan menghubungkan event ke setiap layer.
 *
 * MENGAPA hot-swap dilakukan di sini:
 * useWebLLM.initModel() dipanggil via useEffect saat mount — ini adalah
 * "Opportunistic Loading" sesuai Fase 6 Prologue strategy. Pemain sudah
 * bisa bermain (Fase 4 Heuristics) sementara model dimuat diam-diam.
 */
function App() {
  const { state, makeChoice, restartGame } = useGameEngine();
  const { status: aiStatus, loadProgress, feedback, initModel, generateFeedback, clearFeedback } = useWebLLM();
  const { stats, day, currentScenario, isGameOver, gameOverReason, history } = state;

  // Mulai muat model AI di background saat app pertama dibuka
  useEffect(() => {
    initModel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Handler pilihan — menggabungkan Game Engine + AI.
   * Alur: pilih → hitung skor → koreksi state → minta komentar AI.
   */
  const handleChoice = async (option: ScenarioOption) => {
    clearFeedback();
    makeChoice(option);
    // Jalankan AI analysis setelah state update (tidak blocking)
    await generateFeedback(option, stats, day, history.length);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-president-gold/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-president-accent/8 blur-[160px] rounded-full" />
      </div>

      {/* Header — Stat Dashboard */}
      <header className="fixed top-0 left-0 right-0 z-10 flex justify-center pt-4 pb-3 px-4 bg-president-dark/60 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-8 md:gap-12">
          <StatItem icon={<Scale className="text-president-gold" size={18} />} label="Law" value={stats.law} colorClass="bg-president-gold" />
          <StatItem icon={<Users className="text-sky-400" size={18} />} label="Humanity" value={stats.humanity} colorClass="bg-sky-400" />
          <StatItem icon={<ShieldAlert className="text-red-400" size={18} />} label="Order" value={stats.order} colorClass="bg-red-500" />
          <StatItem icon={<Wallet className="text-emerald-400" size={18} />} label="Budget" value={stats.budget} colorClass="bg-emerald-400" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md w-full pt-20 pb-12">
        <AnimatePresence mode="wait">
          {isGameOver ? (
            <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GameOverScreen reason={gameOverReason} day={day} onRestart={restartGame} />
            </motion.div>
          ) : (
            <motion.div key="gameplay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {currentScenario && (
                <ScenarioCard
                  scenario={currentScenario}
                  day={day}
                  onChoice={handleChoice}
                />
              )}
              {/* Panel Analisis AI — muncul di bawah kartu setelah pilihan */}
              <AIFeedback
                feedback={feedback}
                status={aiStatus}
                loadProgress={loadProgress}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 text-slate-600 text-[10px] uppercase tracking-[0.25em]">
        VETO v0.2 | {aiStatus === 'ready' ? '🟢 AI Aktif' : aiStatus === 'loading' ? `⏳ AI ${loadProgress}%` : '⚡ Heuristic Mode'}
      </footer>
    </div>
  );
}

export default App;
