/**
 * @file scenario.ts
 * @description Kontrak TypeScript untuk seluruh data skenario VETO.
 * Setiap perubahan di JSON harus mencerminkan interface ini.
 */

/** Dampak sebuah pilihan terhadap 4 pilar indikator Presiden. */
export interface Impact {
  law: number;
  humanity: number;
  order: number;
  budget: number;
}

/** Tipe skenario — menentukan magnitude impact & probabilitas kemunculan.
 *  - normal  : keputusan sehari-hari, impact kecil (±3–11)
 *  - crucial  : krisis nasional, impact besar (±15–35). Rasio 1:3 vs normal.
 */
export type ScenarioType = 'normal' | 'crucial';

/** Satu opsi pilihan yang tersedia bagi pemain. */
export interface ScenarioOption {
  label: string;
  impact: Impact;
  legal_basis: string;
  is_trap: boolean;
  next_node: string;
  /** Flag yang akan diaktifkan di global state jika opsi ini dipilih. */
  trigger_flags?: string[];
}

/** Satu kartu skenario lengkap. */
export interface Scenario {
  id: string;
  type: ScenarioType;
  title: string;
  narrative: string;
  context_tags: string[];
  options: ScenarioOption[];
  /** Flag yang dibutuhkan agar skenario ini bisa muncul dalam pool. */
  required_flags?: string[];
  /** Flag yang jika aktif akan melarang skenario ini muncul. */
  forbidden_flags?: string[];
  /** Arketipe kepemimpinan yang dibutuhkan agar skenario ini muncul. */
  required_archetypes?: string[];
}

/** State global permainan yang dikelola oleh useGameEngine. */
export interface GameState {
  stats: Impact;
  day: number;
  currentScenario: Scenario | null;
  lastChoice: ScenarioOption | null;
  isGameOver: boolean;
  isReportOpen: boolean; // Baru: Menandai jeda laporan 10/30 hari
  gameOverReason: string;
  history: Array<{ scenarioId: string; choiceLabel: string; impact: Impact }>;
  normalStreak: number;
  activeFlags: string[];
  profile: string;
  rollingSummary?: string;
  realityTrend?: string; // Fase 9: Kata kunci tren dunia nyata
  ending?: { title: string; narrative: string; type: string };
}

/** Status lifecycle model WebLLM. */
export type AIStatus =
  | 'idle'        // Belum dimuat sama sekali
  | 'loading'     // Sedang mengunduh model di background
  | 'ready'       // Model siap digunakan (Hot-Swap aktif)
  | 'generating'  // Sedang menghasilkan analisis
  | 'error';      // WebGPU tidak tersedia atau model gagal dimuat

/** Output analisis moral dari AI. */
export interface AIFeedbackData {
  tone: 'praise' | 'neutral' | 'critique';
  message: string;
  moralProfile: string; // Contoh: "Pragmatik-Humanis"
  isStreaming?: boolean; // Fase 11: Flag streaming
}
