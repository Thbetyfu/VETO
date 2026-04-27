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
