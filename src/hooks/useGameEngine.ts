import { useState, useCallback } from 'react';
import type { GameState, Scenario, ScenarioOption, Impact } from '../types/scenario';
import scenariosData from '../../scenarios/initial_batch.json';

/**
 * @hook useGameEngine
 * @description State manager untuk VETO — Mendukung Cumulative Logic (Narasi Berantai).
 * 
 * === PANDUAN CUMULATIVE TRAP (v2.1) ===
 * 1. Pilihan Berantai:
 *    - Opsi A di Skenario 1 bisa memicu `trigger_flag: 'deal_with_mafia'`.
 *    - Skenario 2 yang berbahaya hanya akan muncul jika `required_flag: 'deal_with_mafia'`.
 * 
 * 2. Trap Tersembunyi:
 *    - Tidak ada border merah. Pemain harus menebak dari narasi & dasar hukum.
 *    - Jika is_trap: true dipilih, game berakhir instan.
 * =======================================
 */

const SCENARIOS: Scenario[] = scenariosData as Scenario[];

const STAT_MIN = 0;
const STAT_MAX = 100;
const INITIAL_STATS: Impact = { law: 75, humanity: 75, order: 75, budget: 75 };

/** Filter skenario berdasarkan flag yang aktif. */
const getAvailablePool = (historyIds: string[], activeFlags: string[]) => {
  return SCENARIOS.filter(s => {
    // Jangan munculkan yang sudah pernah (kecuali sistem pool habis)
    if (historyIds.includes(s.id)) return false;
    
    // Cek syarat flag
    if (s.required_flag && !activeFlags.includes(s.required_flag)) return false;
    
    return true;
  });
};

const pickNextScenario = (
  historyIds: string[],
  normalStreak: number,
  activeFlags: string[],
): { scenario: Scenario; isForced: boolean } => {
  const pool = getAvailablePool(historyIds, activeFlags);
  
  // Jika pool khusus/berantai tersedia, prioritaskan (untuk narrative flow)
  const chainedScenarios = pool.filter(s => s.required_flag);
  if (chainedScenarios.length > 0 && Math.random() > 0.3) {
    return { scenario: chainedScenarios[Math.floor(Math.random() * chainedScenarios.length)], isForced: false };
  }

  const normals = pool.filter(s => s.type === 'normal');
  const crucials = pool.filter(s => s.type === 'crucial');

  if (normalStreak >= 3 && crucials.length > 0) {
    return { scenario: crucials[Math.floor(Math.random() * crucials.length)], isForced: true };
  }

  const finalPool = normals.length > 0 ? normals : (pool.length > 0 ? pool : SCENARIOS);
  return { scenario: finalPool[Math.floor(Math.random() * finalPool.length)], isForced: false };
};

const checkGameOver = (stats: Impact): { over: boolean; reason: string } => {
  if (stats.law <= STAT_MIN) return { over: true, reason: 'MA membatalkan legitimasi Anda karena pelanggaran hukum berat.' };
  if (stats.humanity <= STAT_MIN) return { over: true, reason: 'Demonstrasi besar-besaran menuntut Anda turun dari jabatan.' };
  if (stats.order <= STAT_MIN) return { over: true, reason: 'Aparat keamanan mengambil alih kekuasaan karena anarki.' };
  if (stats.budget <= STAT_MIN) return { over: true, reason: 'Krisis utang luar negeri menyebabkan kejatuhan ekonomi total.' };
  return { over: false, reason: '' };
};

const clamp = (val: number) => Math.min(STAT_MAX, Math.max(STAT_MIN, val));

export interface EngineState extends GameState {
  normalStreak: number;
  activeFlags: string[];
}

const INITIAL_STATE = (): EngineState => {
  const { scenario } = pickNextScenario([], 0, []);
  return {
    stats: INITIAL_STATS,
    day: 1,
    currentScenario: scenario,
    lastChoice: null,
    isGameOver: false,
    gameOverReason: '',
    history: [],
    normalStreak: 0,
    activeFlags: [],
  };
};

export const useGameEngine = () => {
  const [state, setState] = useState<EngineState>(INITIAL_STATE);

  const makeChoice = useCallback((option: ScenarioOption) => {
    setState(prev => {
      // 1. TRAP CHECK
      if (option.is_trap) {
        return {
          ...prev,
          isGameOver: true,
          gameOverReason: `KEPUTUSAN FATAL: ${option.label}. ${option.legal_basis}`,
          lastChoice: option,
        };
      }

      // 2. STAT CALCULATION
      const newStats: Impact = {
        law: clamp(prev.stats.law + option.impact.law),
        humanity: clamp(prev.stats.humanity + option.impact.humanity),
        order: clamp(prev.stats.order + option.impact.order),
        budget: clamp(prev.stats.budget + option.impact.budget),
      };

      const { over, reason } = checkGameOver(newStats);

      // 3. FLAG & HISTORY UPDATE
      const newFlags = [...prev.activeFlags];
      if (option.trigger_flag && !newFlags.includes(option.trigger_flag)) {
        newFlags.push(option.trigger_flag);
      }

      const newHistory = prev.history.concat({
        scenarioId: prev.currentScenario?.id ?? '',
        choiceLabel: option.label,
      });

      const isCrucial = prev.currentScenario?.type === 'crucial';
      const newStreak = isCrucial ? 0 : prev.normalStreak + 1;

      // 4. NEXT SCENARIO
      const { scenario: nextScenario } = pickNextScenario(
        newHistory.map(h => h.scenarioId),
        newStreak,
        newFlags
      );

      return {
        stats: newStats,
        day: prev.day + 1,
        currentScenario: over ? prev.currentScenario : nextScenario,
        lastChoice: option,
        isGameOver: over,
        gameOverReason: reason,
        history: newHistory,
        normalStreak: newStreak,
        activeFlags: newFlags,
      };
    });
  }, []);

  const restartGame = useCallback(() => {
    setState(INITIAL_STATE());
  }, []);

  return { state, makeChoice, restartGame };
};
