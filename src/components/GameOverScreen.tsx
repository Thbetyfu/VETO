import { motion } from 'framer-motion';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface GameOverProps {
  reason: string;
  day: number;
  onRestart: () => void;
  onViewGallery: () => void;
}

/**
 * @component GameOverScreen
 * @description Layar akhir permainan yang ditampilkan ketika salah satu
 * indikator mencapai nol. Memberikan feedback emosional dan opsi restart.
 */
export const GameOverScreen = ({ reason, day, onRestart, onViewGallery }: GameOverProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
    className="glass-card p-10 text-center max-w-md w-full"
  >
    <div className="flex justify-center mb-6">
      <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="text-red-400" size={40} />
      </div>
    </div>

    <h2 className="text-2xl font-bold text-red-400 mb-2 uppercase tracking-widest">Masa Jabatan Berakhir</h2>
    <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mb-6">Hari ke-{day}</p>

    <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
      <p className="text-slate-300 leading-relaxed text-sm">{reason}</p>
    </div>

    <div className="flex flex-col gap-3">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onRestart}
        className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-president-gold text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors"
      >
        <RotateCcw size={16} />
        Coba Lagi
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onViewGallery}
        className="flex items-center justify-center gap-3 w-full px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
      >
        Lihat Warisan (Hall of Fame)
      </motion.button>
    </div>
  </motion.div>
);
