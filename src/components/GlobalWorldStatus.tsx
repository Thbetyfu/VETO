import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Activity } from 'lucide-react';
import { p2pService } from '../lib/p2p/P2PService';
import { Impact } from '../types/scenario';

/**
 * @component GlobalWorldStatus
 * @description Fase 1: Menampilkan Indikator Dunia Global (Shared P2P State).
 * Memberikan rasa keterhubungan antar pemain melalui metrik agregat.
 */
export const GlobalWorldStatus: React.FC = () => {
  const [globalMetrics, setGlobalMetrics] = useState<Impact & { activePeers: number } | null>(null);

  useEffect(() => {
    // Listen ke perubahan World State di GunDB
    p2pService.getWorldState((data) => {
      setGlobalMetrics(data);
    });
  }, []);

  const isSyncing = !globalMetrics;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md"
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${isSyncing ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-blue-500/20 text-blue-400'}`}>
          <Globe size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Status Dunia</span>
          <span className="text-xs font-black text-white uppercase">
            {isSyncing ? 'MENYINKRONKAN...' : 'SINKRONISASI AKTIF'}
          </span>
        </div>
      </div>

      <div className="h-8 w-px bg-white/10" />

      <div className="flex gap-4">
        <StatItem label="Law" value={globalMetrics?.law || 0} color="text-president-gold" />
        <StatItem label="Hum" value={globalMetrics?.humanity || 0} color="text-blue-400" />
        <StatItem label="Ord" value={globalMetrics?.order || 0} color="text-red-400" />
        <StatItem label="Bud" value={globalMetrics?.budget || 0} color="text-emerald-400" />
      </div>

      <div className="h-8 w-px bg-white/10" />

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[...Array(Math.min(globalMetrics?.activePeers || 1, 3))].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center">
              <Users size={10} className="text-slate-400" />
            </div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-slate-400">
          {globalMetrics?.activePeers || 1} PRESIDEN ONLINE
        </span>
      </div>
    </motion.div>
  );
};

const StatItem = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-[8px] font-bold text-slate-500 uppercase">{label}</span>
    <span className={`text-xs font-black ${color}`}>{value}%</span>
  </div>
);
