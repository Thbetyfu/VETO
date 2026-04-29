import React from 'react';
import { motion } from 'framer-motion';
import { Vote, TrendingUp, Users, Award } from 'lucide-react';
import { Impact } from '../types/scenario';

interface ElectionNightProps {
  stats: Impact;
  isWinner: boolean;
  onContinue: () => void;
}

/**
 * @component ElectionNight
 * @description Fase 14: Cinematic Milestone UI.
 * Menampilkan hasil Pemilu tengah periode dengan estetika premium 'News Broadcast'.
 */
export const ElectionNight: React.FC<ElectionNightProps> = ({ stats, isWinner, onContinue }) => {
  const avgPerformance = (stats.law + stats.humanity + stats.order + stats.budget) / 4;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-president-dark/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Header Broadcast */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="px-4 py-1 rounded-full bg-red-600 text-white text-[10px] font-black tracking-widest animate-pulse">
            LIVE: HASIL PEMILU PERIODE II
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase">
            {isWinner ? 'KEMENANGAN MUTLAK' : 'KEKALAHAN TELAK'}
          </h1>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Suara Rakyat" value={`${Math.round(avgPerformance)}%`} icon={<Users size={20} />} color="text-president-gold" />
          <StatBox label="Legitimasi" value={stats.law > 50 ? 'KUAT' : 'LEMAH'} icon={<Award size={20} />} color="text-blue-400" />
          <StatBox label="Stabilitas" value={stats.order > 50 ? 'STABIL' : 'GEJOLAK'} icon={<TrendingUp size={20} />} color="text-emerald-400" />
          <StatBox label="Partisipasi" value="89.4%" icon={<Vote size={20} />} color="text-slate-400" />
        </div>

        {/* Narrative Box */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4"
        >
          <p className="text-slate-300 text-lg leading-relaxed font-light">
            {isWinner 
              ? "Berdasarkan hasil hitung cepat, rakyat memutuskan untuk memperpanjang mandat Anda. Lima tahun ke depan akan menjadi ujian terakhir bagi warisan kepemimpinan Anda."
              : "Kepercayaan publik telah mencapai titik nadir. Mahkamah Konstitusi mengesahkan kemenangan lawan politik. Anda harus meletakkan jabatan hari ini."}
          </p>
          
          <button 
            onClick={onContinue}
            className="w-full py-4 rounded-xl bg-president-gold text-president-dark font-black tracking-widest hover:bg-white hover:text-black transition-all"
          >
            {isWinner ? 'LANJUTKAN PERIODE II' : 'KEMBALI KE MENU UTAMA'}
          </button>
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-president-gold/20 to-transparent" />
      </div>
    </motion.div>
  );
};

const StatBox = ({ label, value, icon, color }: any) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
    <div className={`mx-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
    <div className="text-xl font-black text-white">{value}</div>
  </div>
);
