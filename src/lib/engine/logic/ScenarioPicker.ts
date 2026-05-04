import { Scenario } from '../../../types/scenario';
import { IScenarioPicker } from '../core/types';

/**
 * @class ScenarioPicker
 * @description Implementasi Lazy Loading untuk data skenario.
 * Mengurangi beban initial bundle size dengan memuat batch JSON secara on-demand.
 */
export class ScenarioPicker implements IScenarioPicker {
  public scenarios: Scenario[] = [];
  private isLoaded = false;

  private async ensureLoaded() {
    if (this.isLoaded) return;
    
    console.log("[ScenarioPicker] Lazy loading scenario batches...");
    
    // Vite Dynamic Import (Chunking)
    const batches = await Promise.all([
      import('../../../../scenarios/initial_batch.json'),
      import('../../../../scenarios/fase_15_1.json'),
      import('../../../../scenarios/fase_15_5.json'),
      import('../../../../scenarios/fase_15_9.json'),
      import('../../../../scenarios/fase_15_13.json'),
      import('../../../../scenarios/advanced_chaining.json'),
      import('../../../../scenarios/diplomatic_scenarios.json')
    ]);

    this.scenarios = batches.flatMap(b => b.default || b) as Scenario[];
    this.isLoaded = true;
    console.log(`[ScenarioPicker] Successfully loaded ${this.scenarios.length} scenarios.`);
  }

  async pick(
    historyIds: string[], 
    streak: number, 
    activeFlags: string[], 
    day: number, 
    profile: string, 
    globalMetrics?: any
  ): Promise<{ scenario: Scenario | null; isPoolEmpty: boolean }> {
    
    await this.ensureLoaded();

    // 0. Hardcoded Start (Fase 15.1: The Inauguration)
    if (day === 1) {
      const startScenario = this.scenarios.find(s => s.id === 'SCN-15-01');
      return { scenario: startScenario || null, isPoolEmpty: !startScenario };
    }

    // Fase 2: Global Butterfly Effect
    const globalChaosDrift = globalMetrics && globalMetrics.order < 40;
    const isCrisisTime = streak >= 5 || globalChaosDrift;
    
    const pool = this.scenarios.filter(s => {
      // 1. Bukan yang sudah pernah muncul
      if (historyIds.includes(s.id)) return false;
      
      // 2. Prioritaskan Diplomatik di Multiplayer (Fase 15)
      if (globalMetrics?.isMultiplayer && !s.is_diplomatic && Math.random() > 0.3) return false;

      // 3. Filter Tipe (Normal vs Crucial)
      if (isCrisisTime && s.type !== 'crucial') return false;
      if (!isCrisisTime && s.type !== 'normal') return false;
      
      // 4. Filter Flag (Neural Weave Logic)
      if (s.required_flags && !s.required_flags.every((f: string) => activeFlags.includes(f))) return false;
      if (s.forbidden_flags && s.forbidden_flags.some((f: string) => activeFlags.includes(f))) return false;

      // 5. Filter Arketipe (The Divergent Path)
      if (s.required_archetypes && !s.required_archetypes.includes(profile)) return false;
      
      return true;
    });

    if (pool.length === 0) return { scenario: null, isPoolEmpty: true };
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    return { scenario: pool[randomIndex], isPoolEmpty: false };
  }
}

// Export empty SCENARIOS array for backward compatibility if needed, 
// though we should avoid using it directly now.
export const SCENARIOS: Scenario[] = [];
