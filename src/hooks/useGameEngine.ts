import { useState, useCallback, useEffect } from 'react';
import type { GameState, Scenario, ScenarioOption, Impact } from '../types/scenario';
import { GameEngineCore } from '../lib/engine/GameEngineCore';
import { ImpactCalculator } from '../lib/engine/ImpactCalculator';
import { ScenarioPicker } from '../lib/engine/ScenarioPicker';
import { StateManager } from '../lib/engine/StateManager';
import { RealityService } from '../lib/engine/RealityService';

import { IAIService } from '../lib/ai/WebLLMService';

const INITIAL_STATS: Impact = { law: 75, humanity: 75, order: 75, budget: 75 };

// Dependency Injection Factory
const createEngine = (aiService: IAIService) => {
  const calculator = new ImpactCalculator();
  const picker = new ScenarioPicker();
  return new GameEngineCore(calculator, picker, aiService);
};

const picker = new ScenarioPicker(); // Untuk initial pick

/**
 * @hook useGameEngine
 * @description Fase 12: Async Engine Bridge.
 * Mendukung simulasi 720 hari dengan pemrosesan asynchronous.
 */
export const useGameEngine = (aiService: IAIService) => {
  const [engine] = useState(() => createEngine(aiService));
  const [state, setState] = useState<GameState>(() => {
    // Inisialisasi: Hari ke-1, Profile Default
    const { scenario } = picker.pick([], 0, [], 1, 'Pemimpin Transisional');
    return StateManager.createInitialState(scenario as Scenario, INITIAL_STATS);
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fase 9: Reality Sync
  useEffect(() => {
    const syncReality = async () => {
      const trend = await RealityService.getActiveTrend();
      setState(prev => ({ ...prev, realityTrend: trend }));
    };
    syncReality();
  }, []);

  const makeChoice = useCallback(async (option: ScenarioOption) => {
    setIsLoading(true);
    try {
      const nextState = await engine.processTurn(state, option);

      // Final Check (Activation Thresholds)
      const isOver = nextState.isGameOver || Object.values(nextState.stats).some(v => v <= 0);
      let reason = nextState.gameOverReason;

      if (!reason && isOver) {
        if (nextState.stats.law <= 0) reason = 'MA membatalkan legitimasi Anda karena pelanggaran hukum berat.';
        else if (nextState.stats.humanity <= 0) reason = 'Demonstrasi besar-besaran menuntut Anda turun dari jabatan.';
        else if (nextState.stats.order <= 0) reason = 'Aparat keamanan mengambil alih kekuasaan karena anarki.';
        else if (nextState.stats.budget <= 0) reason = 'Krisis utang luar negeri menyebabkan kejatuhan ekonomi total.';
      }

      const isReportDue = (nextState.day % 10 === 0);

      setState({
        ...nextState,
        isGameOver: isOver,
        gameOverReason: reason,
        isReportOpen: isReportDue && !isOver
      });
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  const closeReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const isReportDue = (state.day % 10 === 0);
      const shouldBeRoutine = state.day % 3 !== 0;

      let nextScenario;
      if (!shouldBeRoutine) {
        const { scenario } = picker.pick(
          state.history.map(h => h.scenarioId),
          state.normalStreak,
          state.activeFlags,
          state.day,
          state.profile
        );
        nextScenario = scenario;
      }

      if (!nextScenario) {
        // Fallback or Routine Generation logic
        // Di sini kita bisa panggil engine.getNextScenario() jika ingin lebih bersih (SOLID)
      }

      // Untuk sementara, kita serahkan ke engine untuk konsistensi
      // Tapi karena closeReport biasanya hanya menutup UI, kita perlu memastikan 
      // currentScenario sudah ter-update di turn sebelumnya.
      
      setState(prev => ({ ...prev, isReportOpen: false }));
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  const restartGame = useCallback(() => {
    const { scenario } = picker.pick([], 0, [], 1, 'Pemimpin Transisional');
    setState(StateManager.createInitialState(scenario as Scenario, INITIAL_STATS));
  }, []);

  return { state, isLoading, makeChoice, restartGame, closeReport };
};
