import { GameEngineCore } from '../lib/engine/core/GameEngineCore';
import { StateManager } from '../lib/engine/core/StateManager';
import { GameState, ScenarioOption } from '../types/scenario';
import { ImpactCalculator } from '../lib/engine/logic/ImpactCalculator';
import { ScenarioPicker } from '../lib/engine/logic/ScenarioPicker';
import { IAIService } from '../lib/ai/WebLLMService';

const dummyAIService: IAIService = {
  init: async () => {},
  analyze: async () => "Dummy analysis",
  generateRollingSummary: async () => "Dummy summary",
  chatRaw: async () => "Dummy raw response",
  chatStream: async () => "Dummy stream response"
};

/**
 * @class GameSimulationBot
 * @description Bot otomatis untuk menguji integritas naratif & logika VETO.
 */
class GameSimulationBot {
  private engine: GameEngineCore;
  private state: GameState;

  constructor(strategy: 'LAW' | 'HUMANITY' | 'ORDER' | 'RANDOM') {
    this.engine = new GameEngineCore(new ImpactCalculator(), new ScenarioPicker(), dummyAIService);
    // Initialize starting state
    this.state = {
      day: 1,
      stats: { law: 50, humanity: 50, order: 50, budget: 50 },
      history: [],
      statsHistory: [{ day: 1, law: 50, humanity: 50, order: 50, budget: 50 }],
      isGameOver: false,
      isReportOpen: false,
      gameOverReason: '',
      lastChoice: null,
      normalStreak: 0,
      activeFlags: [],
      profile: 'Pragmatis Moderat',
      currentScenario: null as any
    };
    this.strategy = strategy;
  }

  private strategy: string;

  async runSimulation() {
    console.log(`[BOT] Memulai Simulasi Strategi: ${this.strategy}`);
    
    // Start Game - Dummy option to kickstart
    const dummyOption: ScenarioOption = {
      label: 'Start',
      impact: { law: 0, humanity: 0, order: 0, budget: 0 },
      is_trap: false,
      next_node: 'root',
      legal_basis: 'UUD 1945'
    };
    this.state = await this.engine.processTurn(this.state, dummyOption);

    while (this.state.day < 720 && !this.state.isGameOver) {
      const scenario = this.state.currentScenario;
      if (!scenario) break;

      // Pilih opsi berdasarkan strategi
      const choice = this.pickChoice(scenario.options);
      
      // Terapkan pilihan
      this.state = await this.engine.processTurn(this.state, choice);
      
      if (this.state.day % 100 === 0) {
        console.log(`[BOT] Hari ke-${this.state.day} - Profile: ${this.state.profile}`);
      }
    }

    console.log(`[BOT] SIMULASI SELESAI!`);
    console.log(`[RESULT] Ending: ${this.state.ending?.title || 'Unknown'}`);
    console.log(`[RESULT] Stats Akhir:`, this.state.stats);
    console.log(`[RESULT] Flags Terkumpul:`, this.state.activeFlags);
    return this.state;
  }

  private pickChoice(options: ScenarioOption[]): ScenarioOption {
    if (this.strategy === 'RANDOM') {
      return options[Math.floor(Math.random() * options.length)];
    }

    return options.reduce((prev, curr) => {
      const pVal = this.getStatValue(prev.impact);
      const cVal = this.getStatValue(curr.impact);
      return cVal > pVal ? curr : prev;
    });
  }

  private getStatValue(impact: any): number {
    switch (this.strategy) {
      case 'LAW': return impact.law;
      case 'HUMANITY': return impact.humanity;
      case 'ORDER': return impact.order;
      default: return 0;
    }
  }
}

/**
 * Main Test Runner
 */
export async function runFullAudit() {
  const strategies: ('LAW' | 'HUMANITY' | 'ORDER' | 'RANDOM')[] = ['LAW', 'HUMANITY', 'ORDER', 'RANDOM'];
  const reports = [];

  for (const strategy of strategies) {
    const bot = new GameSimulationBot(strategy);
    const finalState = await bot.runSimulation();
    reports.push({
      strategy,
      ending: finalState.ending?.title,
      days: finalState.day,
      flags: finalState.activeFlags.length
    });
  }

  console.table(reports);
}
