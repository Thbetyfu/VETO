import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, BrainCircuit, ArrowRight, BookOpen } from 'lucide-react';
import { PlayerService } from '../../lib/player/PlayerService';

interface PrologueProps {
  onStart: (name: string, mode: 'single' | 'multi', roomOptions?: { action: 'create' | 'join', roomId?: string }) => void;
  aiStatus: string;
  loadProgress: number;
}

/**
 * @component Prologue
 * @description Fase 11: Peluncuran & Ekosistem P5.
 * Menambahkan badge penyelarasan kurikulum nasional dan pembersihan visual akhir.
 */
export const Prologue: React.FC<PrologueProps> = ({ onStart, aiStatus, loadProgress }) => {
  const [step, setStep] = useState<'identity' | 'mode' | 'room'>('identity');
  const [name, setName] = useState('');
  const [gameMode, setGameMode] = useState<'single' | 'multi'>('single');
  const [roomId, setRoomId] = useState('');
  
  const isReady = aiStatus === 'ready' || aiStatus === 'error' || aiStatus === 'idle';
  const isValid = PlayerService.isValid(name);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-president-dark overflow-hidden"
    >
      {/* P5 Alignment Badge (Fase 11) */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
      >
        <BookOpen size={14} className="text-president-gold" />
        <span className="text-[10px] text-white font-bold uppercase tracking-widest">Aligned with P5 Curriculum</span>
      </motion.div>

      {/* Neural Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-president-gold/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-president-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-lg w-full text-center space-y-12 relative z-10 stagger-load">
        {/* Emblem Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="p-5 rounded-full border border-president-gold/20 bg-president-gold/5 shadow-neural">
            <ShieldCheck className="text-president-gold w-14 h-14" />
          </div>
        </motion.div>

        {/* Narrative Section */}
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight"
          >
            SELAMAT DATANG, <br />
            <span className="text-president-gold uppercase">Pemimpin Bangsa.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 text-slate-400 text-sm md:text-base leading-relaxed text-center font-light"
          >
            <p className="max-w-md mx-auto">
              Negara sedang berada di persimpangan jalan—setiap pilihan Anda akan mengukir sejarah baru di Hall of Founders.
            </p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'identity' && (
            <motion.div 
              key="step-identity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="relative max-w-sm mx-auto">
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ketikkan Nama Anda..."
                  className="neural-input w-full text-center text-lg tracking-wide bg-transparent border-b border-white/20 py-3 text-white focus:border-president-gold outline-none transition-all"
                />
                <label className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 bg-president-dark text-[9px] text-president-gold uppercase tracking-[0.3em] font-black">
                  Identitas Presiden
                </label>
              </div>

              {isValid && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('mode')}
                  className="flex items-center gap-3 mx-auto px-10 py-4 bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-white/20 transition-all"
                >
                  Konfirmasi Identitas <ArrowRight size={14} />
                </motion.button>
              )}
            </motion.div>
          )}

          {step === 'mode' && (
            <motion.div 
              key="step-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-president-gold text-xs font-black uppercase tracking-[0.4em]">Pilih Paradigma Kekuasaan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                <button 
                  onClick={() => onStart(name, 'single')}
                  className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="text-white font-bold mb-2 group-hover:text-president-gold transition-colors">SINGLEPLAYER</div>
                  <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">Kendalikan negara secara absolut. Keputusan murni di tangan Anda.</p>
                </button>
                <button 
                  onClick={() => setStep('room')}
                  className="p-8 rounded-2xl border border-president-gold/20 bg-president-gold/5 hover:bg-president-gold/10 transition-all text-left group"
                >
                  <div className="text-president-gold font-bold mb-2">MULTIPLAYER (P2P)</div>
                  <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">Bergabung dalam diplomasi global. Setiap keputusan butuh mufakat.</p>
                </button>
              </div>
              <button onClick={() => setStep('identity')} className="text-[9px] text-slate-600 hover:text-white uppercase tracking-widest">Kembali</button>
            </motion.div>
          )}

          {step === 'room' && (
            <motion.div 
              key="step-room"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-8"
            >
              <h2 className="text-president-gold text-xs font-black uppercase tracking-[0.4em]">Inisiasi Hubungan Internasional</h2>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button 
                  onClick={() => onStart(name, 'multi', { action: 'create' })}
                  className="w-full py-4 bg-president-gold text-black font-black uppercase tracking-widest text-[10px] rounded-xl"
                >
                  Bentuk Koalisi Baru (Create)
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <div className="relative flex justify-center text-[8px] uppercase text-slate-700 bg-president-dark px-2">ATAU</div>
                </div>

                <div className="space-y-3">
                  <input 
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Masukan Kode Room..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-center text-white text-sm tracking-[0.5em] outline-none focus:border-president-gold transition-all"
                  />
                  {roomId.length > 3 && (
                    <button 
                      onClick={() => onStart(name, 'multi', { action: 'join', roomId })}
                      className="w-full py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/5"
                    >
                      Bergabung ke Aliansi (Join)
                    </button>
                  )}
                </div>
              </div>
              <button onClick={() => setStep('mode')} className="text-[9px] text-slate-600 hover:text-white uppercase tracking-widest">Ganti Mode</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Intelligence Status */}
        <div className="flex flex-col items-center gap-3 mt-12">
          {aiStatus === 'loading' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                <BrainCircuit size={14} className="animate-spin text-president-gold" />
                <span>Activating Neural Core ({loadProgress}%)</span>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-[10px] text-emerald-500 uppercase tracking-widest font-black"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Advanced AI Synchronized</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Protocol Tag */}
      <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center text-[10px] text-slate-700 uppercase tracking-[0.3em] font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>VETO_STABILITY_PROTOCOL_V3.0</span>
        </div>
        <span>ISTANA_NEGARA_TERMINAL</span>
      </div>
    </motion.div>
  );
};
