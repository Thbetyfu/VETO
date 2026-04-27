import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
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
 * === VISUAL SYSTEM ===
 * - Normal scenario    : border putih normal.
 * - Crucial scenario   : border merah berdenyut (pulse) + badge KRISIS.
 * - Trap option        : border merah solid + ikon peringatan. Pemain harus sadar
 *                        risiko sebelum klik — ini adalah desain yang disengaja
 *                        agar edukasi "pilihan tidak etis" terasa nyata.
 * =====================
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
          isCrucial ? 'ring-1 ring-red-500/50' : ''
        }`}
      >
        {/* Crucial Glow */}
        {isCrucial && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
          </div>
        )}

        {/* Day Badge */}
        <div
          className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-bl-xl ${
            isCrucial ? 'bg-red-500 text-white animate-pulse' : 'bg-president-gold text-black'
          }`}
        >
          {isCrucial ? '‼️ KRISIS' : `Hari ke-${day}`}
        </div>

        {/* Context Tags */}
        <div className="flex flex-wrap gap-2 mb-5 mt-1">
          {scenario.context_tags.map(tag => (
            <span
              key={tag}
              className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border ${
                isCrucial
                  ? 'border-red-500/30 text-red-400'
                  : 'border-white/10 text-slate-400'
              }`}
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
          className={`text-slate-300 text-sm leading-relaxed mb-8 border-l-2 pl-4 ${
            isCrucial ? 'border-red-500/50' : 'border-president-gold/40'
          }`}
        >
          {scenario.narrative}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {scenario.options.map((opt, i) => (
            <TrapAwareButton
              key={i}
              option={opt}
              index={i}
              onChoice={onChoice}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Sub-component: Tombol dengan visual trap ──────────────────────────────────
interface TrapButtonProps {
  option: ScenarioOption;
  index: number;
  onChoice: (opt: ScenarioOption) => void;
}

/**
 * @component TrapAwareButton
 * @description Tombol pilihan yang tahu apakah opsinya adalah "jebakan".
 *
 * Visual Trap:
 * - Border merah tipis + ikon ⚠️ di sebelah kiri indeks.
 * - Hover: border merah terang (bukan emas).
 * - Teks legal_basis: muncul dalam warna merah muted sebagai peringatan tersirat.
 *
 * Filosofi UX: Beri sinyal visual subtle — siswa yang teliti akan menyadarinya,
 * yang tidak teliti akan kena. Ini adalah learning moment yang disengaja.
 */
const TrapAwareButton = ({ option, index, onChoice }: TrapButtonProps) => {
  const isTrap = option.is_trap;

  return (
    <motion.button
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onChoice(option)}
      className={`w-full text-left p-4 rounded-xl border transition-colors group ${
        isTrap
          ? 'border-red-900/40 bg-red-950/20 hover:border-red-500/60 hover:bg-red-950/30'
          : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-president-gold/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`font-bold text-xs mt-0.5 shrink-0 ${
            isTrap ? 'text-red-700/80' : 'text-president-gold/60'
          }`}
        >
          {isTrap ? <AlertTriangle size={14} className="text-red-700/80" /> : `${String.fromCharCode(64 + index + 1)}.`}
        </span>
        <div>
          <p
            className={`text-sm font-medium transition-colors ${
              isTrap
                ? 'group-hover:text-red-400'
                : 'group-hover:text-president-gold'
            }`}
          >
            {option.label}
          </p>
          <p className={`text-[11px] mt-1 ${isTrap ? 'text-red-900/70' : 'text-slate-500'}`}>
            {option.legal_basis}
          </p>
        </div>
      </div>
    </motion.button>
  );
};
