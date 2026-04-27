import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatItemProps {
  icon: ReactNode;
  label: string;
  value: number;
  colorClass: string;
}

/**
 * @component StatItem
 * @description Satu indikator pilar (Law/Humanity/Order/Budget) di header dashboard.
 * MENGAPA: Nilai `colorClass` diterima sebagai string Tailwind penuh dari parent
 * agar Tailwind tidak mem-purge class yang dibangun secara dinamis.
 */
export const StatItem = ({ icon, label, value, colorClass }: StatItemProps) => (
  <div className="flex flex-col items-center gap-1 min-w-[60px]">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-tighter opacity-50">{label}</span>
    </div>
    <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
    <span className="text-[10px] opacity-40 font-mono">{value}</span>
  </div>
);
