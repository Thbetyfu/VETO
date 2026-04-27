import { useState, useCallback } from 'react';
import type { GameState, Scenario, ScenarioOption, Impact } from '../types/scenario';
import scenariosData from '../../scenarios/initial_batch.json';

/**
 * @hook useGameEngine
 * @description Otak utama VETO — mengelola seluruh state permainan.
 *
 * === PANDUAN BALANCING UNTUK PENGEMBANG ===
 * Sistem ini menggunakan dua tingkat dampak:
 *
 * 1. NORMAL Scenario (type: 'normal')
 *    - Impact range: ±3 hingga ±12 per pilar.
 *    - Filosofi: Keputusan sehari-hari. Satu pilihan buruk tidak langsung fatal.
 *    - Rasio kemunculan: 3 dari 4 skenario (75%).
 *
 * 2. CRUCIAL Scenario (type: 'crucial')
 *    - Impact range: ±15 hingga ±35 per pilar.
 *    - Filosofi: Krisis nasional. Satu keputusan salah bisa membalikkan permainan.
 *    - Rasio kemunculan: 1 dari 4 skenario (25%). Ditandai "‼️" di judul.
 *    - Selalu muncul setelah minimal 3 skenario normal berturut-turut.
 *
 * 3. TRAP Option (is_trap: true)
 *    - Impact: -100 di semua pilar → GAME OVER instan.
 *    - Filosofi: Pilihan yang secara moral atau hukum jelas tidak dapat ditoleransi.
 *    - Aturan: Maksimal 1 trap per skenario, letakkan di opsi urutan ke-4.
 *    - JANGAN buat trap pada skenario normal yang terlalu awal (hari 1-3).
 *
 * 4. STAT FLOOR
 *    - Game Over dipicu ketika SATU pilar mencapai 0.
 *    - Initial stats: semua 75. Desain impact agar pemain butuh ~10-15 keputusan
 *      buruk berturut-turut untuk kalah, kecuali memilih Trap.
 * ==========================================
 */

const SCENARIOS: Scenario[] = scenariosData as Scenario[];

const NORMAL_SCENARIOS = SCENARIOS.filter(s => s.type === 'normal');
const CRUCIAL_SCENARIOS = SCENARIOS.filter(s => s.type === 'crucial');

/** Batas bawah/atas setiap indikator sebelum game over. */
const STAT_MIN = 0;
const STAT_MAX = 100;
const INITIAL_STATS: Impact = { law: 75, humanity: 75, order: 75, budget: 75 };

/**
 * Logika pemilihan skenario berikutnya.
 * Rasio 1:3 (crucial:normal) dijaga dengan counter `normalStreak`.
 * Setelah 3 skenario normal berturut-turut, crucial akan diprioritaskan.
 */
const pickNextScenario = (
  historyIds: string[],
  normalStreak: number,
): { scenario: Scenario; isForced: boolean } => {
  const lastId = historyIds[historyIds.length - 1];

  // Force crucial setelah 3 normal berturut-turut (jaga rasio 1:3)
  if (normalStreak >= 3 && CRUCIAL_SCENARIOS.length > 0) {
    const availableCrucials = CRUCIAL_SCENARIOS.filter(s => s.id !== lastId);
    const pool = availableCrucials.length > 0 ? availableCrucials : CRUCIAL_SCENARIOS;
    return { scenario: pool[Math.floor(Math.random() * pool.length)], isForced: true };
  }

  // Biasanya ambil normal
  const availableNormals = NORMAL_SCENARIOS.filter(s => s.id !== lastId);
  const pool = availableNormals.length > 0 ? availableNormals : NORMAL_SCENARIOS;
  return { scenario: pool[Math.floor(Math.random() * pool.length)], isForced: false };
};

/** Periksa apakah ada indikator yang menyebabkan game over. */
const checkGameOver = (stats: Impact): { over: boolean; reason: string } => {
  if (stats.law <= STAT_MIN) return { over: true, reason: 'Konstitusi dilanggar. Anda dimakzulkan oleh Mahkamah Agung.' };
  if (stats.humanity <= STAT_MIN) return { over: true, reason: 'Rakyat kehilangan kepercayaan. Anda dipaksa mundur oleh demonstrasi massal.' };
  if (stats.order <= STAT_MIN) return { over: true, reason: 'Negara dalam kekacauan total. Kudeta militer terjadi.' };
  if (stats.budget <= STAT_MIN) return { over: true, reason: 'Kas negara bangkrut. DPR membekukan jabatan Anda.' };
  return { over: false, reason: '' };
};

/** Clamp nilai stat antara MIN dan MAX. */
const clamp = (val: number) => Math.min(STAT_MAX, Math.max(STAT_MIN, val));

export interface EngineState extends GameState {
  normalStreak: number;
}

const INITIAL_STATE = (): EngineState => {
  const { scenario } = pickNextScenario([], 0);
  return {
    stats: INITIAL_STATS,
    day: 1,
    currentScenario: scenario,
    lastChoice: null,
    isGameOver: false,
    gameOverReason: '',
    history: [],
    normalStreak: 0,
  };
};

export const useGameEngine = () => {
  const [state, setState] = useState<EngineState>(INITIAL_STATE);

  /**
   * Memproses pilihan pemain dan memperbarui state.
   *
   * Alur:
   * 1. Jika is_trap → GAME OVER tanpa komputasi (instan)
   * 2. Hitung dampak → Clamp stat
   * 3. Cek game over biasa (pilar di nol)
   * 4. Update normalStreak → Pilih skenario berikutnya
   */
  const makeChoice = useCallback((option: ScenarioOption) => {
    setState(prev => {
      // === TRAP HANDLING — Prioritas tertinggi ===
      if (option.is_trap) {
        return {
          ...prev,
          isGameOver: true,
          gameOverReason: `Anda memilih "${option.label}". ${option.legal_basis}`,
          lastChoice: option,
        };
      }

      // === Normal Flow ===
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

      // Update streak: crucial mereset ke 0, normal naikkan +1
      const isCrucialJustPlayed = prev.currentScenario?.type === 'crucial';
      const newStreak = isCrucialJustPlayed ? 0 : prev.normalStreak + 1;

      const { scenario: nextScenario } = pickNextScenario(
        newHistory.map(h => h.scenarioId),
        newStreak,
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
      };
    });
  }, []);

  /** Restart permainan dari awal — tanpa reload halaman. */
  const restartGame = useCallback(() => {
    setState(INITIAL_STATE());
  }, []);

  return { state, makeChoice, restartGame };
};
