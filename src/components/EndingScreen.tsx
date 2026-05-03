import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, History, ArrowRight, Share2 } from 'lucide-react';

interface EndingScreenProps {
  ending: {
    title: string;
    narrative: string;
    type: 'VISIONARY' | 'TYRANT' | 'MARTYR' | 'FALLEN' | 'PRESERVER';
  };
  playerName: string;
  onRestart: () => void;
  onViewGallery: () => void;
}

const BG_IMAGES = {
  VISIONARY: '/assets/endings/visionary.png',
  TYRANT: '/assets/endings/tyrant.png',
  MARTYR: '/assets/endings/martyr.png',
  FALLEN: '/assets/endings/fallen.png',
  PRESERVER: '/assets/endings/preserver.png',
};

const THEMES = {
  VISIONARY: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  TYRANT: 'text-red-500 border-red-500/30 bg-red-500/10',
  MARTYR: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  FALLEN: 'text-slate-500 border-slate-500/30 bg-slate-500/10',
  PRESERVER: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
};

/**
 * @component EndingScreen
 * @description Layar sinematik akhir permainan untuk VETO.
 * Memberikan penutupan naratif yang megah dengan visual representatif.
 */
export const EndingScreen: React.FC<EndingScreenProps> = ({ ending, playerName, onRestart, onViewGallery }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Cinematic Background */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={BG_IMAGES[ending.type]} 
          alt={ending.title}
          className="w-full h-full object-cover filter blur-[2px] brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl w-full px-6 text-center space-y-12">
        
        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="space-y-4"
        >
          <div className="flex justify-center">
             <div className={`px-4 py-1 rounded-full border text-[10px] font-black tracking-[0.3em] uppercase ${THEMES[ending.type]}`}>
               Masa Jabatan 720 Hari Selesai
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
            {ending.title}
          </h1>
          <div className="h-1 w-24 bg-president-gold mx-auto rounded-full" />
        </motion.div>

        {/* Narrative Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl"
        >
          <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light italic">
            "{ending.narrative}"
          </p>
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-slate-500 text-sm uppercase tracking-widest">Presiden</p>
            <p className="text-white text-2xl font-bold">{playerName}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <button 
            onClick={onViewGallery}
            className="group flex items-center justify-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all"
          >
            <History size={20} className="text-president-gold" />
            <span>Lihat Galeri Warisan</span>
            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </button>
          
          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-3 p-5 bg-president-gold text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all"
          >
            <Trophy size={20} />
            <span>Bangun Legasi Baru</span>
          </button>
        </motion.div>

        {/* Social / Share Placeholder */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
          className="flex items-center gap-2 mx-auto text-slate-400 text-xs uppercase tracking-widest"
        >
          <Share2 size={14} />
          Bagikan Kisah Anda
        </motion.button>
      </div>

      {/* Ambient FX */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />
    </motion.div>
  );
};
