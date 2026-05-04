import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Play, ShieldCheck, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface RoomLobbyProps {
  roomId: string;
  players: Record<string, any>;
  isHost: boolean;
  onStart: () => void;
  playerName: string;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({ roomId, players, isHost, onStart, playerName }) => {
  const [copied, setCopied] = useState(false);
  const playerList = Object.keys(players);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-president-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header Lobby */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-president-gold/30"></div>
            <span className="text-[10px] text-president-gold uppercase tracking-[0.5em] font-black">Diplomatic Lobby</span>
            <div className="h-[1px] w-12 bg-president-gold/30"></div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">MENUNGGU KOALISI</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest">Kumpulkan pimpinan negara untuk memulai mandat kolektif</p>
        </motion.div>

        {/* Room ID Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-president-gold to-transparent opacity-30"></div>
          
          <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-4">Kode Akses Ruangan</span>
          <div className="flex items-center justify-center gap-6">
            <span className="text-5xl font-black text-white tracking-[0.3em] font-mono pl-4">{roomId}</span>
            <button 
              onClick={copyRoomId}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-president-gold transition-all"
            >
              {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Player List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <AnimatePresence>
            {playerList.map((p, idx) => (
              <motion.div 
                key={p}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${p === playerName ? 'bg-president-gold/10 border-president-gold/30' : 'bg-white/5 border-white/10'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${p === playerName ? 'bg-president-gold text-black' : 'bg-white/10 text-white'}`}>
                  <Users size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">{p}</div>
                  <div className="text-[8px] text-slate-500 uppercase tracking-tighter">
                    {idx === 0 ? 'Pimpinan Koalisi (Host)' : 'Anggota Aliansi'}
                  </div>
                </div>
                <ShieldCheck size={14} className="text-emerald-500/50" />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {playerList.length < 2 && (
            <div className="p-4 rounded-2xl border border-dashed border-white/5 flex items-center justify-center gap-3 grayscale opacity-30">
              <div className="w-8 h-8 rounded-full border border-white/20 animate-pulse"></div>
              <span className="text-[10px] text-white uppercase tracking-widest">Menunggu Rekan...</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4">
          {isHost ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={playerList.length < 2}
              onClick={onStart}
              className={`flex items-center gap-3 px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all ${
                playerList.length >= 2 
                ? 'bg-white text-black hover:bg-president-gold shadow-xl' 
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Play size={16} fill="currentColor" />
              <span>Mulai Mandat Kolektif</span>
            </motion.button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Terhubung ke Jaringan
              </div>
              <p className="text-slate-600 text-[9px] uppercase tracking-widest text-center">Menunggu Pimpinan Koalisi memulai permainan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
