import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, TrendingDown, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import { Impact } from '../types/scenario';
import { ProfileService } from '../lib/engine/ProfileService';

interface MonthlyReportProps {
  day: number;
  stats: Impact;
  history: Array<{ scenarioId: string; choiceLabel: string; impact: Impact }>;
  onContinue: () => void;
  aiStatus: string;
  rollingSummary?: string;
}

/**
 * @component MonthlyReport
 * @description Fase 8: Refleksi Moral & Arketipe Kepemimpinan.
 * Menampilkan cermin kepemimpinan Presiden melalui analisis 'Grey Area'.
 */
export const MonthlyReport: React.FC<MonthlyReportProps> = ({ 
  day, 
  stats, 
  history, 
  onContinue,
  aiStatus,
  rollingSummary
}) => {
  const profile = useMemo(() => ProfileService.analyze(stats), [stats]);
  const sacrificeIndex = useMemo(() => ProfileService.calculateSacrificeIndex(history), [history]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-president-dark/98 backdrop-blur-2xl"
    >
      <div className="max-w-3xl w-full glass-card p-10 border-president-gold/20 shadow-[0_0_100px_rgba(234,179,8,0.05)] stagger-load">
        {/* Header Sinematik */}
        <header className="text-center space-y-4 mb-12">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-president-gold/10 border border-president-gold/20">
              <History className="text-president-gold w-10 h-10" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-sm uppercase tracking-[0.3em] text-president-gold font-black">
              Laporan Konsolidasi Negara
            </h2>
            <h1 className="text-4xl font-bold text-white">HARI KE-{day}</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Arketipe Section */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
              <Award size={14} className="text-president-gold" /> Arketipe Kepemimpinan
            </h3>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xl font-bold text-president-gold">{profile.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{profile.description}</p>
            </div>
          </div>

          {/* Sacrifice Index Section */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
              <ShieldAlert size={14} className="text-red-500" /> Analisis Pengorbanan
            </h3>
            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-400">Sacrifice Index:</span>
                <span className="text-2xl font-mono font-black text-red-500">{sacrificeIndex}</span>
              </div>
              <ul className="space-y-2">
                {profile.sacrifices.map((s, i) => (
                  <li key={i} className="text-xs text-red-400/80 flex gap-2">
                    <span>•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Neural Analysis Progress */}
        <div className="mb-12 p-5 rounded-2xl bg-president-gold/5 border border-president-gold/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest text-president-gold font-bold">
              Status Meta-Analysis AI
            </span>
            <span className="text-[10px] text-emerald-500 font-black">
              {aiStatus === 'ready' ? 'SYNCHRONIZED' : 'PROCESSING...'}
            </span>
          </div>
          <p className="text-sm text-slate-400 italic">
            "{rollingSummary || "Setiap keputusan Anda telah tercatat dalam memori kolektif bangsa. Tidak ada sejarah yang benar-benar bersih, hanya ada sejarah yang berani."}"
          </p>
        </div>

        {/* Action Call */}
        <button 
          onClick={onContinue}
          className="group w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-president-gold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
        >
          Lanjutkan Kepemimpinan
        </button>
      </div>
    </motion.div>
  );
};
