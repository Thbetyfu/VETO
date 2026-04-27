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

/** Satu opsi pilihan yang tersedia bagi pemain. */
export interface ScenarioOption {
  label: string;
  impact: Impact;
  legal_basis: string;
  next_node: string;
}

/** Satu kartu skenario lengkap. */
export interface Scenario {
  id: string;
  title: string;
  narrative: string;
  context_tags: string[];
  options: ScenarioOption[];
}

/** State global permainan yang dikelola oleh useGameEngine. */
export interface GameState {
  stats: Impact;
  day: number;
  currentScenario: Scenario | null;
  lastChoice: ScenarioOption | null;
  isGameOver: boolean;
  gameOverReason: string;
  history: Array<{ scenarioId: string; choiceLabel: string }>;
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
}
