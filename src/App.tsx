import { Scale, Users, ShieldAlert, Wallet } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameEngine } from './hooks/useGameEngine';
import { ScenarioCard } from './components/ScenarioCard';
import { StatItem } from './components/StatItem';
import { GameOverScreen } from './components/GameOverScreen';

/**
 * @function App
 * @description Orchestrator utama VETO. Hanya bertanggung jawab merakit
 * komponen dan menghubungkan event ke engine — tidak mengandung logika bisnis.
 */
function App() {
  const { state, makeChoice, restartGame } = useGameEngine();
  const { stats, day, currentScenario, isGameOver, gameOverReason } = state;

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
            currentScenario && (
              <motion.div key="gameplay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ScenarioCard scenario={currentScenario} day={day} onChoice={makeChoice} />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 text-slate-600 text-[10px] uppercase tracking-[0.25em]">
        VETO v0.1 | Decentralized Authority
      </footer>
    </div>
  );
}

export default App;
