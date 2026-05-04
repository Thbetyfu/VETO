import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { motion } from 'framer-motion';
import { Impact } from '../../types/scenario';
import { History, TrendingUp, Calendar, Activity, X } from 'lucide-react';

interface InteractiveTimelineProps {
  statsHistory: Array<{ day: number } & Impact>;
  onClose?: () => void;
}

type TabType = 'all' | keyof Impact;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-slate-300 mb-2 font-mono text-sm border-b border-slate-700 pb-1">
          Hari ke-{label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <span style={{ color: entry.color }} className="font-semibold text-sm">
              {entry.name}
            </span>
            <span className="text-white font-mono text-sm">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({ statsHistory, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const getMetricConfig = (key: keyof Impact) => {
    switch (key) {
      case 'law': return { name: 'Keadilan', color: '#38bdf8', id: 'colorLaw' };
      case 'humanity': return { name: 'Kemanusiaan', color: '#34d399', id: 'colorHumanity' };
      case 'order': return { name: 'Ketertiban', color: '#facc15', id: 'colorOrder' };
      case 'budget': return { name: 'Anggaran', color: '#a78bfa', id: 'colorBudget' };
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'Semua Indikator' },
    { id: 'law', label: 'Keadilan' },
    { id: 'humanity', label: 'Kemanusiaan' },
    { id: 'order', label: 'Ketertiban' },
    { id: 'budget', label: 'Anggaran' }
  ];

  const chartData = useMemo(() => {
    return statsHistory.map(stat => ({
      day: stat.day,
      law: Math.max(0, Math.min(100, stat.law)),
      humanity: Math.max(0, Math.min(100, stat.humanity)),
      order: Math.max(0, Math.min(100, stat.order)),
      budget: Math.max(0, Math.min(100, stat.budget)),
    }));
  }, [statsHistory]);

  const renderArea = (key: keyof Impact) => {
    if (activeTab !== 'all' && activeTab !== key) return null;
    const config = getMetricConfig(key);
    
    return (
      <Area
        key={key}
        type="monotone"
        dataKey={key}
        name={config.name}
        stroke={config.color}
        strokeWidth={activeTab === 'all' ? 2 : 4}
        fillOpacity={1}
        fill={`url(#${config.id})`}
        animationDuration={1500}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-[85vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-32 bg-purple-500/10 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <History className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Timeline Rekam Jejak
                <span className="text-xs font-mono px-2 py-1 bg-slate-800 text-slate-400 rounded">
                  720-DAYS
                </span>
              </h2>
              <p className="text-sm text-slate-400">Analisis fluktuasi stabilitas negara selama masa jabatan Anda.</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 p-6 pb-0 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-700 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 p-6 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {(['law', 'humanity', 'order', 'budget'] as const).map(key => {
                  const config = getMetricConfig(key);
                  return (
                    <linearGradient key={key} id={config.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={config.color} stopOpacity={activeTab === key ? 0.3 : 0.1} />
                      <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(val) => `H-${val}`}
                minTickGap={30}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {renderArea('law')}
              {renderArea('humanity')}
              {renderArea('order')}
              {renderArea('budget')}

              {/* Critical Zones Indicator */}
              {activeTab !== 'all' && (
                <ReferenceDot y={30} r={0} stroke="red" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Batas Kritis (30%)', fill: '#ef4444', fontSize: 10 }} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Summary Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-800/30 border-t border-slate-800">
          {(['law', 'humanity', 'order', 'budget'] as const).map(key => {
            const current = chartData[chartData.length - 1]?.[key] || 0;
            const start = chartData[0]?.[key] || 0;
            const diff = current - start;
            const config = getMetricConfig(key);
            
            return (
              <div key={key} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">{config.name}</div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold text-white">{Math.round(current)}%</div>
                  <div className={`flex items-center text-xs font-medium ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {diff >= 0 ? '+' : ''}{Math.round(diff)}%
                    <Activity className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
