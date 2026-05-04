import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  themeColor: 'gold' | 'red' | 'blue' | 'emerald';
}

/**
 * @component StatItem
 * @description Fase 3: Visualisasi Pilar Kebijakan (UI/UX).
 * Menerapkan prinsip 'Neural Activation' - Visual merepresentasikan 
 * tingkat aktivitas/kesehatan pilar secara dinamis.
 */
export const StatItem: React.FC<StatItemProps> = ({ icon, label, value, themeColor }) => {
  // Mapping tema ke warna hex untuk kontrol glow yang lebih presisi
  const themeMap = {
    gold: '#EAB308',
    red: '#EF4444',
    blue: '#3B82F6',
    emerald: '#10B981'
  };

  const activeColor = themeMap[themeColor];
  
  // Neural Scaling: Semakin rendah nilai, semakin "bergetar" indikatornya (Krisis)
  const isCritical = value < 20;

  return (
    <div className="flex flex-col items-center gap-1.5 group cursor-help">
      <div className="flex items-center gap-2">
        <motion.div
          animate={isCritical ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ color: activeColor }}
        >
          {icon}
        </motion.div>
        <span className="text-[9px] uppercase font-black tracking-[0.15em] opacity-40 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      </div>

      <div className="relative w-16 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        {/* Background Glow Overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ backgroundColor: activeColor }}
        />
        
        {/* Active Activation Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="h-full relative z-10"
          style={{ 
            backgroundColor: activeColor,
            boxShadow: `0 0 10px ${activeColor}44` 
          }}
        />
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[10px] font-mono font-bold text-slate-500">
          {Math.round(value)}
        </span>
        {isCritical && (
          <div className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
        )}
      </div>
    </div>
  );
};
