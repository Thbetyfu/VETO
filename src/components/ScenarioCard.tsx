import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Scenario, ScenarioOption } from '../types/scenario';

interface ScenarioCardProps {
  scenario: Scenario;
  day: number;
  onChoice: (option: ScenarioOption) => void;
  disabled?: boolean;
}

/**
 * @component ScenarioCard
 * @description Fase 3: Decision Interface (UI/UX).
 * SRP: Hanya menangani presentasi skenario.
 * Menggunakan prinsip 'Focus Neuron' - Menyederhanakan visual agar pemain fokus pada konten hukum.
 */
export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, day, onChoice, disabled }) => {
  const isCrucial = scenario.type === 'crucial';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${scenario.id}-${day}`}
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className={`glass-card p-8 md:p-10 relative overflow-hidden ${
          isCrucial ? 'border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : ''
        }`}
      >
        {/* Status Indicator */}
        <div className="absolute top-0 right-0 px-6 py-2 flex items-center gap-2 rounded-bl-2xl bg-white/5 border-l border-b border-white/10">
          {isCrucial ? (
            <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-black tracking-widest animate-pulse">
              <AlertTriangle size={12} />
              STATUS: KRISIS NASIONAL
            </div>
          ) : (
            <div className="text-president-gold text-[10px] font-black tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={12} />
              HARI KE-{day}
            </div>
          )}
        </div>

        {/* Header Tags */}
        <div className="flex gap-2 mb-8">
          {scenario.context_tags?.map((tag) => (
            <span 
              key={tag}
              className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-md bg-white/5 border border-white/5 text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Narrative Section */}
        <div className="space-y-4 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {scenario.title}
          </h2>
          <div className="h-px w-20 bg-president-gold/40" />
          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light italic">
            "{scenario.narrative}"
          </p>
        </div>

        {/* Options Grid (Neural Selectors) */}
        <div className="grid gap-4">
          {scenario.options?.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={!disabled ? { x: 6, backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
              whileTap={!disabled ? { scale: 0.99 } : {}}
              onClick={() => !disabled && onChoice(option)}
              disabled={disabled}
              className={`group flex items-start gap-5 p-5 rounded-xl border border-white/5 bg-white/[0.02] transition-all ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-president-gold/40'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-president-gold/20 group-hover:text-president-gold transition-colors">
                <span className="text-xs font-black">{String.fromCharCode(65 + idx)}</span>
              </div>
              <div className="text-left space-y-1">
                <p className="text-sm md:text-base font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {option.label}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono tracking-wide uppercase">
                  <Gavel size={10} />
                  Dasar Hukum: {option.legal_basis}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
