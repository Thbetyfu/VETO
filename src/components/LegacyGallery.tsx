import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, History, Scale, Users, ShieldAlert, Wallet, Globe, Activity, Award } from 'lucide-react';
import { PresidentLegacy } from '../lib/gun-bridge';
import { p2pService } from '../lib/p2p/P2PService';
import { AnalyticsService, GlobalStats } from '../lib/engine/AnalyticsService';
import { TelemetryDashboard } from './TelemetryDashboard';

interface LegacyGalleryProps {
  onBack: () => void;
}

/**
 * @component LegacyGallery
 * @description Fase 9: Galeri Warisan & Dashboard Global.
 * Menampilkan data P2P dengan visualisasi agregat tingkat nasional/global.
 */
export const LegacyGallery: React.FC<LegacyGalleryProps> = ({ onBack }) => {
  const [legacies, setLegacies] = useState<PresidentLegacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'legacy' | 'telemetry'>('legacy');

  useEffect(() => {
    p2pService.getHallOfFame((data) => {
      setLegacies(data);
      setIsLoading(false);
    });
  }, []);

  const globalStats = useMemo(() => AnalyticsService.calculateGlobalStats(legacies), [legacies]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-president-dark overflow-y-auto"
    >
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(234,179,8,0.03)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.03)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between mb-16">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Archive</span>
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
              Hall of <span className="text-president-gold">Founders</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="h-[1px] w-8 bg-president-gold/30" />
              <p className="text-[9px] text-president-gold font-bold uppercase tracking-[0.4em]">Decentralized History</p>
              <span className="h-[1px] w-8 bg-president-gold/30" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('legacy')}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'legacy' ? 'bg-president-gold text-president-dark' : 'text-slate-500 hover:text-white'}`}
              >
                Legacies
              </button>
              <button 
                onClick={() => setViewMode('telemetry')}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'telemetry' ? 'bg-president-gold text-president-dark' : 'text-slate-500 hover:text-white'}`}
              >
                AI Telemetry
              </button>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 ${isLoading ? 'animate-pulse' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                {isLoading ? 'Syncing' : 'P2P Live'}
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'legacy' ? (
            <motion.div
              key="legacy-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Global Analytics Section (Fase 9 Core) */}
              {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                  <StatCard icon={<Users className="text-president-gold" size={16}/>} label="Total Presidents" value={globalStats.totalPresidents} />
                  <StatCard icon={<Activity className="text-emerald-500" size={16}/>} label="Avg. Stability" value={`${globalStats.avgStability}%`} />
                  <StatCard icon={<Globe className="text-sky-500" size={16}/>} label="Days Governed" value={globalStats.totalDaysGoverned} />
                  <StatCard icon={<Award className="text-purple-500" size={16}/>} label="Top Archetype" value={globalStats.commonArchetype} smallValue />
                </div>
              )}

              {/* Legacy Feed */}
              <div className="space-y-4">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : legacies.length === 0 ? (
                  <EmptyState />
                ) : (
                  legacies.map((legacy, index) => (
                    <LegacyCard key={legacy.id} legacy={legacy} index={index} />
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <TelemetryDashboard key="telemetry-view" onBack={() => setViewMode('legacy')} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, smallValue }: { icon: any, label: string, value: string | number, smallValue?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
  >
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className={`font-black text-white ${smallValue ? 'text-lg' : 'text-2xl'} truncate`}>
      {value}
    </div>
  </motion.div>
);

const LegacyCard = ({ legacy, index }: { legacy: PresidentLegacy; index: number }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group relative glass-card p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center hover:bg-white/[0.03] transition-all overflow-hidden border-white/5 hover:border-president-gold/20"
  >
    {/* Rank Indicator */}
    <div className="flex-shrink-0 relative">
      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-president-gold/30 transition-all">
        {index < 3 ? (
          <Trophy className={`${index === 0 ? 'text-president-gold' : index === 1 ? 'text-slate-300' : 'text-amber-700'}`} size={24} />
        ) : (
          <span className="text-lg font-black text-slate-700 group-hover:text-slate-500 transition-colors">#{index + 1}</span>
        )}
      </div>
    </div>

    {/* Identity & Story */}
    <div className="flex-grow space-y-3 min-w-0">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-black text-white tracking-tight uppercase truncate">{legacy.playerName}</h3>
        <span className="px-2 py-0.5 rounded-md bg-president-gold/10 border border-president-gold/20 text-[9px] text-president-gold font-black uppercase tracking-widest">
          {legacy.profile || "Pragmatis"}
        </span>
      </div>
      <p className="text-slate-400 text-sm italic leading-relaxed line-clamp-2 pr-4">
        "{legacy.reason}"
      </p>
      <div className="flex items-center gap-4 text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">
        <span className="flex items-center gap-1.5"><History size={10} /> {legacy.day} Hari Menjabat</span>
        <span className="w-1 h-1 rounded-full bg-slate-800" />
        <span>{new Date(legacy.timestamp).toLocaleDateString()}</span>
      </div>
    </div>

    {/* Detailed Stats */}
    <div className="grid grid-cols-4 gap-6 md:border-l border-white/5 md:pl-8 flex-shrink-0">
      <StatBox label="LAW" value={legacy.finalStats?.law ?? 0} color="text-president-gold" />
      <StatBox label="HUM" value={legacy.finalStats?.humanity ?? 0} color="text-sky-400" />
      <StatBox label="ORD" value={legacy.finalStats?.order ?? 0} color="text-red-400" />
      <StatBox label="BUD" value={legacy.finalStats?.budget ?? 0} color="text-emerald-400" />
    </div>
  </motion.div>
);

const StatBox = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="text-center space-y-1">
    <span className="block text-[8px] font-black text-slate-600 tracking-widest">{label}</span>
    <span className={`block text-sm font-black ${color}`}>{value}</span>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-32 rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem]">
    <History size={64} className="mx-auto text-slate-800 mb-6" />
    <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">The Archive is Silent</h3>
    <p className="text-slate-600 text-sm mt-2">Belum ada sejarah kepemimpinan yang tercatat di jaringan.</p>
  </div>
);
