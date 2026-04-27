import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ThumbsUp, Minus, ThumbsDown, Loader2 } from 'lucide-react';
import type { AIFeedbackData, AIStatus } from '../types/scenario';

interface AIFeedbackProps {
  feedback: AIFeedbackData | null;
  status: AIStatus;
  loadProgress: number;
}

/**
 * @component AIFeedback
 * @description Panel analisis moral dari AI yang muncul setelah pemain memilih.
 * MENGAPA: Komponen ini memiliki 4 state visual yang berbeda:
 * 1. idle/error → tidak tampil
 * 2. loading   → bar progres download model
 * 3. generating → indikator "AI sedang berpikir"
 * 4. ready + feedback → panel analisis dengan tone berwarna
 */
export const AIFeedback = ({ feedback, status, loadProgress }: AIFeedbackProps) => {
  if (status === 'idle' || status === 'error') return null;

  return (
    <AnimatePresence mode="wait">
      {/* Loading Model Bar */}
      {status === 'loading' && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-4 glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="text-president-accent animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-slate-400">
              Memuat Kecerdasan Lokal... {loadProgress}%
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${loadProgress}%` }}
              transition={{ ease: 'easeOut' }}
              className="h-full bg-president-accent rounded-full"
            />
          </div>
          <p className="text-[10px] text-slate-600 mt-2">AI dimuat di latar belakang — game tetap bisa dimainkan.</p>
        </motion.div>
      )}

      {/* AI Generating */}
      {status === 'generating' && (
        <motion.div
          key="generating"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-4 glass-card p-4 flex items-center gap-3"
        >
          <Loader2 size={16} className="text-president-accent animate-spin shrink-0" />
          <span className="text-[11px] text-slate-400 uppercase tracking-widest">Rakyat sedang menilai keputusan Anda...</span>
        </motion.div>
      )}

      {/* Feedback Result */}
      {status === 'ready' && feedback && (
        <motion.div
          key="feedback"
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 250, damping: 22 } }}
          exit={{ opacity: 0, y: -8 }}
          className={`mt-4 glass-card p-5 border-l-4 ${toneStyle[feedback.tone].border}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-lg ${toneStyle[feedback.tone].bg}`}>
              {toneStyle[feedback.tone].icon}
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${toneStyle[feedback.tone].text}`}>
                Suara Rakyat
              </p>
              <p className="text-[10px] text-slate-500">
                Profil Kepemimpinan: <span className="text-slate-300 font-semibold">{feedback.moralProfile}</span>
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed italic">"{feedback.message}"</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Gaya Tone ────────────────────────────────────────────────────────────────
const toneStyle = {
  praise: {
    border: 'border-emerald-500/60',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    icon: <ThumbsUp size={14} className="text-emerald-400" />,
  },
  neutral: {
    border: 'border-yellow-500/60',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    icon: <Minus size={14} className="text-yellow-400" />,
  },
  critique: {
    border: 'border-red-500/60',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    icon: <ThumbsDown size={14} className="text-red-400" />,
  },
};
