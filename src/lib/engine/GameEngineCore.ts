import { GameState, ScenarioOption } from '../../types/scenario';
import { IImpactCalculator, IScenarioPicker } from './types';
import { ProfileService } from './ProfileService';
import { StateManager } from './StateManager';
import { TermManager } from './TermManager';
import { RoutineGenerator } from './RoutineGenerator';
import { IAIService } from '../ai/WebLLMService';

/**
 * @class GameEngineCore
 * @description Fase 12-13: Professor-Level Orchestrator (Scale & AI Expansion).
 * Mengatur koordinasi antar layanan (Calculator, Picker, StateManager, TermManager, RoutineGenerator).
 * Mampu menangani simulasi hingga 720 hari (2 Periode) dengan narasi prosedural.
 */
export class GameEngineCore {
  private termManager = new TermManager();
  private routineGenerator: RoutineGenerator;

  constructor(
    private calculator: IImpactCalculator,
    private picker: IScenarioPicker,
    private aiService: IAIService
  ) {
    this.routineGenerator = new RoutineGenerator(aiService);
  }

  async processTurn(prevState: GameState, option: ScenarioOption): Promise<GameState> {
    // 1. Trap Recognition
    if (option.is_trap) {
      return {
        ...prevState,
        isGameOver: true,
        gameOverReason: `KEPUTUSAN FATAL: ${option.label}. ${option.legal_basis || ''}`,
        lastChoice: option.label,
      };
    }

    // 2. Neural Impact Calculation with Entropy (Fase 12)
    const nextStats = this.calculator.calculate(prevState.stats, option.impact, prevState.day);
    
    // 3. State Management
    const turnUpdates = StateManager.updateTurn(prevState, nextStats, option);
    
    const combinedState = {
      ...prevState,
      ...turnUpdates
    } as GameState;

    // 4. Constitutional Milestone Check (Term Manager)
    if (this.termManager.isElectionDay(combinedState.day)) {
      const electionResult = this.termManager.evaluateReelection(nextStats);
      if (!electionResult.isEligible) {
        combinedState.isGameOver = true;
        combinedState.gameOverReason = electionResult.reason;
      } else {
        console.log('[TermManager] Re-elected for Term 2');
      }
    }

    // 5. Final Term Check
    if (this.termManager.isFinalTermEnd(combinedState.day)) {
      combinedState.isGameOver = true;
      combinedState.gameOverReason = 'Anda telah menyelesaikan masa jabatan maksimal (10 Tahun). Warisan Anda telah terukir selamanya.';
    }

    // 6. Character Analysis
    combinedState.profile = ProfileService.analyze(nextStats).title;

    // 7. Scenario Pipeline (Fase 13: Hybrid Narrative)
    const isReportDue = combinedState.day % 10 === 0;
    if (!isReportDue && !combinedState.isGameOver) {
      // Logic: 30% Crisis/Hand-crafted, 70% Routine/Procedural
      const shouldBeRoutine = combinedState.day % 3 !== 0; // Setiap hari ke-3 adalah hari 'Penting'
      
      let nextScenario;
      
      if (!shouldBeRoutine) {
        const { scenario } = this.picker.pick(
          combinedState.history.map(h => h.scenarioId),
          combinedState.normalStreak,
          combinedState.activeFlags,
          combinedState.day
        );
        nextScenario = scenario;
      }

      // Jika tidak ada skenario penting atau memang hari rutin, generate lewat AI
      if (!nextScenario) {
        nextScenario = await this.routineGenerator.generate(combinedState.day, combinedState.profile);
      }
      
      combinedState.currentScenario = nextScenario;
    }

    return combinedState;
  }
}
