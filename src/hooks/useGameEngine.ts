import { useState, useCallback } from 'react';
import type { GameState, Scenario, ScenarioOption, Impact } from '../types/scenario';
import scenariosData from '../../scenarios/initial_batch.json';

/**
 * @hook useGameEngine
 * @description Otak utama VETO — mengelola seluruh state permainan.
 * MENGAPA: Kita isolasi logika permainan di sini agar App.tsx hanya
 * bertanggung jawab terhadap presentasi, bukan komputasi.
 */

const SCENARIOS: Scenario[] = scenariosData as Scenario[];

/** Batas bawah/atas setiap indikator sebelum game over. */
const STAT_MIN = 0;
const STAT_MAX = 100;
const INITIAL_STATS: Impact = { law: 75, humanity: 75, order: 75, budget: 75 };

/** Periksa apakah ada indikator yang menyebabkan game over. */
const checkGameOver = (stats: Impact): { over: boolean; reason: string } => {
  if (stats.law <= STAT_MIN) return { over: true, reason: 'Konstitusi dilanggar. Anda dimakzulkan oleh Mahkamah.' };
  if (stats.humanity <= STAT_MIN) return { over: true, reason: 'Rakyat kehilangan kepercayaan. Anda dipaksa mundur.' };
  if (stats.order <= STAT_MIN) return { over: true, reason: 'Negara dalam kekacauan. Kudeta militer terjadi.' };
  if (stats.budget <= STAT_MIN) return { over: true, reason: 'Kas negara bangkrut. DPR membekukan jabatan Anda.' };
  return { over: false, reason: '' };
};

/** Clamp nilai stat antara MIN dan MAX. */
const clamp = (val: number) => Math.min(STAT_MAX, Math.max(STAT_MIN, val));

/** Pilih skenario acak dari pool (tidak mengulang skenario terakhir). */
const pickNextScenario = (history: string[]): Scenario => {
  const lastId = history[history.length - 1];
  const available = SCENARIOS.filter(s => s.id !== lastId);
  const pool = available.length > 0 ? available : SCENARIOS;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const useGameEngine = () => {
  const [state, setState] = useState<GameState>({
    stats: INITIAL_STATS,
    day: 1,
    currentScenario: pickNextScenario([]),
    lastChoice: null,
    isGameOver: false,
    gameOverReason: '',
    history: [],
  });

  /**
   * Memproses pilihan pemain dan memperbarui state.
   * Alur: Hitung dampak → Clamp stat → Cek game over → Muat skenario berikutnya.
   */
  const makeChoice = useCallback((option: ScenarioOption) => {
    setState(prev => {
      const newStats: Impact = {
        law: clamp(prev.stats.law + option.impact.law),
        humanity: clamp(prev.stats.humanity + option.impact.humanity),
        order: clamp(prev.stats.order + option.impact.order),
        budget: clamp(prev.stats.budget + option.impact.budget),
      };

      const { over, reason } = checkGameOver(newStats);
      const newHistory = prev.history.concat({
        scenarioId: prev.currentScenario?.id ?? '',
        choiceLabel: option.label,
      });

      return {
        stats: newStats,
        day: prev.day + 1,
        currentScenario: over ? prev.currentScenario : pickNextScenario(newHistory.map(h => h.scenarioId)),
        lastChoice: option,
        isGameOver: over,
        gameOverReason: reason,
        history: newHistory,
      };
    });
  }, []);

  /** Restart permainan dari awal — tanpa reload halaman. */
  const restartGame = useCallback(() => {
    setState({
      stats: INITIAL_STATS,
      day: 1,
      currentScenario: pickNextScenario([]),
      lastChoice: null,
      isGameOver: false,
      gameOverReason: '',
      history: [],
    });
  }, []);

  return { state, makeChoice, restartGame };
};
