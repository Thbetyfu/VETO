import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { p2pService } from '../lib/p2p/P2PService';
import { BarChart3, MessageSquare, ThumbsUp, ThumbsDown, ShieldCheck, Cpu, Database, ArrowLeft } from 'lucide-react';

interface TelemetryRecord {
  id: string;
  type: 'positive' | 'negative';
  prompt: string;
  response: string;
  timestamp: number;
}

interface TelemetryDashboardProps {
  onBack: () => void;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({ onBack }) => {
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    p2pService.getAITelemetry((data) => {
      setTelemetry(data);
      setIsLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const positive = telemetry.filter(t => t.type === 'positive').length;
    const negative = telemetry.filter(t => t.type === 'negative').length;
    const total = telemetry.length;
    const accuracy = total > 0 ? Math.round((positive / total) * 100) : 100;
    
    return { positive, negative, total, accuracy };
  }, [telemetry]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col h-full text-white"
    >
      {/* Header Dashboard */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Cpu className="text-president-gold" size={24} />
              AI <span className="text-president-gold">Intelligence</span> Terminal
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Neural Telemetry Pipeline (P2P)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
          <Database size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GunDB Live Sync</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatItem 
          icon={<BarChart3 className="text-sky-500" />} 
          label="Neural Accuracy" 
          value={`${stats.accuracy}%`} 
          subtitle="Prompt Relevance"
        />
        <StatItem 
          icon={<ThumbsUp className="text-emerald-500" />} 
          label="Validated" 
          value={stats.positive} 
          subtitle="User Approved"
        />
        <StatItem 
          icon={<ThumbsDown className="text-red-500" />} 
          label="Flagged" 
          value={stats.negative} 
          subtitle="Needs Refinement"
        />
        <StatItem 
          icon={<ShieldCheck className="text-purple-500" />} 
          label="Telemetry Nodes" 
          value={stats.total} 
          subtitle="Peer Consensus"
        />
      </div>

      {/* Feed List */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-4 pb-12">
          {telemetry.length === 0 && !isLoading ? (
            <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
              <MessageSquare size={48} className="mx-auto text-slate-800 mb-4" />
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No neural data captured yet</p>
            </div>
          ) : (
            telemetry.map((item, idx) => (
              <TelemetryCard key={item.id} record={item} index={idx} />
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatItem = ({ icon, label, value, subtitle }: { icon: any, label: string, value: string | number, subtitle: string }) => (
  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-2xl font-black text-white mb-1">{value}</div>
    <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{subtitle}</div>
  </div>
);

const TelemetryCard = ({ record, index }: { record: TelemetryRecord, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
          record.type === 'positive' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
            : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {record.type === 'positive' ? 'Valid' : 'Flagged'}
        </div>
        <span className="text-[9px] text-slate-600 font-bold tracking-widest">
          {new Date(record.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="text-slate-800 group-hover:text-slate-700 transition-colors">
        <MessageSquare size={14} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block">Input Prompt</span>
        <div className="p-3 rounded-xl bg-black/20 text-xs text-slate-300 font-medium leading-relaxed">
          {record.prompt}
        </div>
      </div>
      <div className="space-y-2">
        <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block">Neural Output</span>
        <div className="p-3 rounded-xl bg-president-gold/5 border border-president-gold/10 text-xs text-president-gold font-medium leading-relaxed italic">
          "{record.response}"
        </div>
      </div>
    </div>
  </motion.div>
);
