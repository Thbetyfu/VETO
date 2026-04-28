import { motion } from 'framer-motion';
import { ShieldCheck, BrainCircuit } from 'lucide-react';

interface PrologueProps {
  onStart: () => void;
  aiStatus: string;
  loadProgress: number;
}

/**
 * @component Prologue
 * @description Layar pembuka sinematik untuk membangun narasi (world-building)
 * dan menutupi waktu pemuatan AI di latar belakang.
 */
export const Prologue = ({ onStart, aiStatus, loadProgress }: PrologueProps) => {
  const isReady = aiStatus === 'ready' || aiStatus === 'error' || aiStatus === 'idle';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-president-dark"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-president-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-president-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-lg w-full text-center space-y-12 relative z-10">
        {/* Emblem */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="p-4 rounded-full border border-president-gold/20 bg-president-gold/5">
            <ShieldCheck className="text-president-gold w-12 h-12" />
          </div>
        </motion.div>

        {/* Text Narasi */}
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
          >
            SELAMAT DATANG, <br />
            <span className="text-president-gold">BAPAK PRESIDEN.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-4 text-slate-400 text-sm md:text-base leading-relaxed text-center"
          >
            <p>
              Hujan deras mengguyur Istana Negara sesaat setelah sumpah jabatan Anda ucapkan. 
              Negara sedang berada di persimpangan jalan—krisis moral, ketimpangan hukum, 
              dan gejolak ekonomi menanti keputusan pertama Anda.
            </p>
            <p className="italic text-president-gold/70">
              "Setiap pilihan memiliki harga. Setiap pasal memiliki konsekuensi."
            </p>
          </motion.div>
        </div>

        {/* AI Loading Progress (Subtle) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="pt-8 space-y-3"
        >
          {aiStatus === 'loading' ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                <BrainCircuit size={14} className="animate-pulse" />
                <span>Mensinkronkan Kesadaran Digital ({loadProgress}%)</span>
              </div>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-president-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Sistem Intelijen Siap</span>
            </div>
          )}

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-president-gold transition-colors"
            >
              Mulai Menjabat
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Version Tag */}
      <div className="absolute bottom-6 text-[10px] text-slate-700 uppercase tracking-widest">
        VETO Project // Secure Terminal Protocol
      </div>
    </motion.div>
  );
};
