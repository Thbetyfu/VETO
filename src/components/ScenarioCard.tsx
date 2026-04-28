import { motion, AnimatePresence } from 'framer-motion';
import type { Scenario, ScenarioOption } from '../types/scenario';

interface ScenarioCardProps {
  scenario: Scenario;
  day: number;
  onChoice: (option: ScenarioOption) => void;
}

/**
 * @component ScenarioCard
 * @description Kartu utama yang menampilkan narasi dan opsi kebijakan.
 * 
 * FIX FASE 6 (v2): Visual trap dihilangkan agar pemain harus benar-benar 
 * membaca dan menganalisis risiko hukum sendiri tanpa "petunjuk" visual.
 */
export const ScenarioCard = ({ scenario, day, onChoice }: ScenarioCardProps) => {
  const isCrucial = scenario.type === 'crucial';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scenario.id + day}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 300, damping: 28 },
        }}
        exit={{ opacity: 0, x: -80, rotate: -4, transition: { duration: 0.25 } }}
        className={`glass-card p-8 relative overflow-hidden ${
          isCrucial ? 'ring-1 ring-red-500/30' : ''
        }`}
      >
        {/* Crucial Glow (Subtle) */}
        {isCrucial && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          </div>
        )}

        {/* Day Badge */}
        <div
          className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-bl-xl ${
            isCrucial ? 'bg-red-900/80 text-white animate-pulse' : 'bg-president-gold text-black'
          }`}
        >
          {isCrucial ? '‼️ KRISIS' : `Hari ke-${day}`}
        </div>

        {/* Context Tags */}
        <div className="flex flex-wrap gap-2 mb-5 mt-1">
          {scenario.context_tags.map(tag => (
            <span
              key={tag}
              className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border border-white/10 text-slate-400`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          className={`text-xl font-bold mb-3 leading-snug ${
            isCrucial ? 'text-red-400' : 'text-president-gold'
          }`}
        >
          {scenario.title}
        </h2>

        {/* Narrative */}
        <p
          className={`text-slate-300 text-sm leading-relaxed mb-8 border-l-2 pl-4 border-president-gold/40`}
        >
          {scenario.narrative}
        </p>

        {/* Options (Uniform Design) */}
        <div className="space-y-3">
          {scenario.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChoice(opt)}
              className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-president-gold/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="font-bold text-xs mt-0.5 shrink-0 text-president-gold/60">
                  {String.fromCharCode(64 + i + 1)}.
                </span>
                <div>
                  <p className="text-sm font-medium group-hover:text-president-gold transition-colors">
                    {opt.label}
                  </p>
                  <p className="text-[11px] mt-1 text-slate-500">
                    {opt.legal_basis}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
