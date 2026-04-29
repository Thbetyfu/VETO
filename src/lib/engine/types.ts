import { Impact, Scenario, ScenarioOption } from '../../types/scenario';

/**
 * @interface IImpactCalculator
 * @description SRP: Khusus bertanggung jawab untuk menghitung perubahan statistik.
 * Menerapkan prinsip Neuron (Input, Weight, Bias, Activation).
 */
export interface IImpactCalculator {
  calculate(currentStats: Impact, optionImpact: Impact, day: number): Impact;
}

/**
 * @interface IScenarioPicker
 * @description SRP: Khusus bertanggung jawab untuk logika pemilihan skenario berikutnya.
 */
export interface IScenarioPicker {
  pick(historyIds: string[], streak: number, activeFlags: string[], day: number): { scenario: Scenario | null; isPoolEmpty: boolean };
}

/**
 * @interface IGameStateManager
 * @description SRP: Bertanggung jawab untuk mutasi state global.
 */
export interface IGameStateManager {
  updateStats(stats: Impact): void;
  addHistory(entry: any): void;
  toggleFlag(flag: string): void;
}
