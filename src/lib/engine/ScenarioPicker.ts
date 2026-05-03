import INITIAL_BATCH from '../../../scenarios/initial_batch.json';
import FASE_15_1 from '../../../scenarios/fase_15_1.json';
import FASE_15_5 from '../../../scenarios/fase_15_5.json';
import FASE_15_9 from '../../../scenarios/fase_15_9.json';
import FASE_15_13 from '../../../scenarios/fase_15_13.json';
import ADVANCED_CHAINING from '../../../scenarios/advanced_chaining.json';
import { Scenario } from '../../types/scenario';
import { IScenarioPicker } from './types';

// Gabungkan semua batch skenario
export const SCENARIOS = [
  ...INITIAL_BATCH, 
  ...FASE_15_1, 
  ...FASE_15_5, 
  ...FASE_15_9, 
  ...FASE_15_13,
  ...ADVANCED_CHAINING
] as Scenario[];

export class ScenarioPicker implements IScenarioPicker {
  pick(historyIds: string[], streak: number, activeFlags: string[], day: number, profile: string, globalMetrics?: any): { scenario: Scenario | null; isPoolEmpty: boolean } {
    // 0. Hardcoded Start (Fase 15.1: The Inauguration)
    if (day === 1) {
      const startScenario = SCENARIOS.find(s => s.id === 'SCN-15-01');
      return { scenario: startScenario || null, isPoolEmpty: !startScenario };
    }

    // Fase 2: Global Butterfly Effect
    // Jika rata-rata 'Order' dunia rendah, probabilitas krisis meningkat bagi semua orang
    const globalChaosDrift = globalMetrics && globalMetrics.order < 40;
    const isCrisisTime = streak >= 5 || globalChaosDrift;
    
    const pool = SCENARIOS.filter(s => {
      // 1. Bukan yang sudah pernah muncul
      if (historyIds.includes(s.id)) return false;
      
      // 2. Filter Tipe (Normal vs Crucial)
      if (isCrisisTime && s.type !== 'crucial') return false;
      if (!isCrisisTime && s.type !== 'normal') return false;
      
      // 3. Filter Flag (Neural Weave Logic)
      if (s.required_flags && !s.required_flags.every(f => activeFlags.includes(f))) return false;
      if (s.forbidden_flags && s.forbidden_flags.some(f => activeFlags.includes(f))) return false;

      // 4. Filter Arketipe (The Divergent Path)
      if (s.required_archetypes && !s.required_archetypes.includes(profile)) return false;
      
      return true;
    });

    if (pool.length === 0) return { scenario: null, isPoolEmpty: true };
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    return { scenario: pool[randomIndex], isPoolEmpty: false };
  }
}
