import { GameState, ScenarioOption, Impact } from '../../../types/scenario';

/**
 * @class StateManager
 * @description SRP: Mengelola transisi state permainan (Fase 10).
 * Memisahkan logika update state dari orchestrator utama.
 */
export class StateManager {
  static createInitialState(initialScenario: any, initialStats: Impact): GameState {
    return {
      stats: initialStats,
      day: 1,
      currentScenario: initialScenario,
      lastChoice: null,
      isGameOver: false,
      isReportOpen: false,
      gameOverReason: '',
      history: [],
      statsHistory: [{ day: 1, ...initialStats }],
      normalStreak: 0,
      activeFlags: [],
      profile: 'Pragmatis Moderat'
    };
  }

  static updateTurn(prev: GameState, nextStats: Impact, option: ScenarioOption): Partial<GameState> {
    const nextDay = prev.day + 1;
    const nextHistory = [...prev.history, { 
      scenarioId: prev.currentScenario?.id || 'unknown', 
      choiceLabel: option.label,
      impact: option.impact 
    }];
    
    const isNormal = prev.currentScenario?.type === 'normal';
    const nextStreak = isNormal ? prev.normalStreak + 1 : 0;
    
    // Flag Management (Neural Weave)
    const nextFlags = [...prev.activeFlags];
    if (option.trigger_flags) {
      option.trigger_flags.forEach(flag => {
        if (!nextFlags.includes(flag)) {
          nextFlags.push(flag);
        }
      });
    }

    return {
      stats: nextStats,
      day: nextDay,
      history: nextHistory,
      statsHistory: [...(prev.statsHistory || []), { day: nextDay, ...nextStats }],
      normalStreak: nextStreak,
      activeFlags: nextFlags,
      lastChoice: option
    };
  }
}
