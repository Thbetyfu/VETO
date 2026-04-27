import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Users, ShieldAlert, Wallet } from 'lucide-react';

/**
 * @function App
 * @description Komponen utama JUSTICE CORE - Prototipe UI Fase 3.
 */
function App() {
  const [day, setDay] = useState(1);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-president-gold/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-president-accent/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header Stat Dashboard */}
      <header className="fixed top-6 left-0 w-full flex justify-center px-4">
        <div className="glass-card px-8 py-4 flex items-center gap-12">
          <StatItem icon={<Scale className="text-president-gold" size={20} />} label="Law" value={85} color="gold" />
          <StatItem icon={<Users className="text-president-accent" size={20} />} label="Humanity" value={70} color="accent" />
          <StatItem icon={<ShieldAlert className="text-red-400" size={20} />} label="Order" value={60} color="red" />
          <StatItem icon={<Wallet className="text-green-400" size={20} />} label="Budget" value={50} color="green" />
        </div>
      </header>

      {/* Main Gameplay Card */}
      <main className="max-w-md w-full mt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, rotate: -5 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            {/* Day Badge */}
            <div className="absolute top-0 right-0 bg-president-gold text-black px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-bl-xl">
              Day {day}
            </div>

            <h2 className="text-xl font-bold mb-4 text-president-gold">Laporan Krisis Pagi</h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              "Bapak Presiden, terjadi polemik mengenai Dana BOS di wilayah Timur. Apakah kita harus segera melakukan audit menyeluruh atau memberikan toleransi sementara?"
            </p>

            <div className="space-y-4">
               {['Lakukan Audit Tegas', 'Beri Toleransi', 'Alihkan Fokus', 'Mediasi Publik'].map((opt, i) => (
                 <button 
                  key={i}
                  onClick={() => setDay(d => d + 1)}
                  className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-president-gold/50 transition-all group"
                 >
                   <span className="text-sm font-medium group-hover:text-president-gold">{opt}</span>
                 </button>
               ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-6 text-slate-500 text-xs uppercase tracking-[0.2em]">
        JUSTICE CORE v0.1 | Decentralized Authority
      </footer>
    </div>
  );
}

function StatItem({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  const colorMap: any = {
    gold: 'bg-president-gold',
    accent: 'bg-president-accent',
    red: 'bg-red-500',
    green: 'bg-green-500'
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-50">{label}</span>
      </div>
      <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${colorMap[color]}`}
        />
      </div>
    </div>
  );
}

export default App;
