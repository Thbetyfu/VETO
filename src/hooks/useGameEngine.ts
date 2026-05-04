import { useState, useCallback, useEffect } from 'react';
import type { GameState, Scenario, ScenarioOption, Impact } from '../types/scenario';
import { GameEngineCore } from '../lib/engine/GameEngineCore';
import { ImpactCalculator } from '../lib/engine/ImpactCalculator';
import { ScenarioPicker, SCENARIOS } from '../lib/engine/ScenarioPicker';
import { StateManager } from '../lib/engine/StateManager';
import { RealityService } from '../lib/engine/RealityService';
import { p2pService } from '../lib/p2p/P2PService';

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
export const useGameEngine = (aiService: IAIService, playerName: string) => {
  const [engine] = useState(() => createEngine(aiService));
  const [state, setState] = useState<GameState>(() => {
    // Inisialisasi: Hari ke-1, Profile Default
    const { scenario } = picker.pick([], 0, [], 1, 'Pemimpin Transisional');
    return StateManager.createInitialState(scenario as Scenario, INITIAL_STATS);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [globalMetrics, setGlobalMetrics] = useState<any>(null);
  
  // Multiplayer State
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Fase 1 & 2: Listen ke World State Global
  useEffect(() => {
    p2pService.getWorldState((data) => {
      setGlobalMetrics(data);
    });
  }, []);

  // Fase 9: Reality Sync
  useEffect(() => {
    const syncReality = async () => {
      const trend = await RealityService.getActiveTrend();
      setState(prev => ({ ...prev, realityTrend: trend }));
    };
    syncReality();
  }, []);

  const makeChoice = useCallback(async (option: ScenarioOption) => {
    if (isMultiplayer) {
      setIsWaiting(true);
      p2pService.submitRoomChoice(roomId!, playerName, state.currentScenario!.id, option.id);
      // Timer akan di-reset saat skenario berganti (dipicu oleh room sync)
      return;
    }

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

      // Fase 1: Sync ke World State Global
      p2pService.syncGlobalMetrics(nextState.stats);
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
          state.profile,
          globalMetrics // Pass Global Context
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

  /**
   * Diplomacy Mode: Inisialisasi Multiplayer.
   */
  const initMultiplayer = useCallback((playerName: string, mode: 'create' | 'join', rId?: string) => {
    setIsMultiplayer(true);
    if (mode === 'create') {
      p2pService.createRoom(playerName, (id) => {
        setRoomId(id);
        startRoomListener(id, playerName);
      });
    } else if (rId) {
      setRoomId(rId);
      startRoomListener(rId, playerName);
    }
  }, []);

  const startRoomListener = (id: string, playerName: string) => {
    p2pService.joinRoom(id, playerName, async (data) => {
      setRoomData(data);
      
      // Sinkronisasi Skenario: Jika skenario di room berbeda dengan lokal, update lokal
      if (data.currentScenarioId && data.currentScenarioId !== state.currentScenario?.id) {
        const newScenario = SCENARIOS.find(s => s.id === data.currentScenarioId);
        if (newScenario) {
          setState(prev => ({ 
            ...prev, 
            currentScenario: newScenario as Scenario, 
            day: prev.day === 1 ? 1 : prev.day + 1 // Cegah double increment di hari pertama
          }));
          setTimeLeft(20);
          setIsWaiting(false);
        }
      }

      const players = Object.keys(data.players || {});
      const responses = Object.keys(data.responses || {});
      const playerCount = players.length;
      const responseCount = responses.length;
      
      // Auto-advance logic: Jika semua pemain sudah menjawab
      if (playerCount > 1 && responseCount === playerCount && isWaiting) {
        console.log("[VETO Diplomacy] All responses received. Calculating Collective Impact...");
        
        // 1. Hitung Akumulasi Dampak dari semua pilihan presiden
        const impactTotals = { law: 0, humanity: 0, order: 0, budget: 0 };
        responses.forEach(pName => {
          const resp = data.responses[pName];
          const scenario = SCENARIOS.find(s => s.id === resp.scenarioId);
          const option = scenario?.options.find(o => o.id === resp.choiceId);
          if (option) {
            impactTotals.law += option.impact.law;
            impactTotals.humanity += option.impact.humanity;
            impactTotals.order += option.impact.order;
            impactTotals.budget += option.impact.budget;
          }
        });

        // 2. Rata-ratakan dampak (Collective Weight)
        const averageImpact: Impact = {
          law: Math.round(impactTotals.law / playerCount),
          humanity: Math.round(impactTotals.humanity / playerCount),
          order: Math.round(impactTotals.order / playerCount),
          budget: Math.round(impactTotals.budget / playerCount)
        };

        // 3. Update State Lokal dengan Dampak Kolektif
        // Kita gunakan dummy option untuk processTurn
        const nextState = await engine.processTurn(state, { 
          id: 'COLLECTIVE', 
          label: 'Diplomacy Result', 
          impact: averageImpact 
        } as any);
        
        setState(nextState);
        setIsWaiting(false);

        // 4. Jika Anda adalah Host (alfabet pertama), pilih skenario berikutnya untuk semua
        const sortedPlayers = players.sort();
        if (sortedPlayers[0] === playerName) {
          const { scenario: nextScenario } = picker.pick(
            nextState.history.map(h => h.scenarioId),
            nextState.normalStreak,
            nextState.activeFlags,
            nextState.day,
            nextState.profile,
            globalMetrics
          );
          if (nextScenario) {
            p2pService.advanceRoom(id, nextScenario.id);
          }
        }
      }
    });
  };

  // Timer Logic (20s)
  useEffect(() => {
    if (isMultiplayer && !isWaiting && !isGameOver && timeLeft !== null) {
      if (timeLeft === 0) {
        // Auto-select pilihan pertama jika waktu habis
        if (state.currentScenario?.options[0]) {
          makeChoice(state.currentScenario.options[0]);
        }
        return;
      }
      const timer = setInterval(() => setTimeLeft(prev => (prev || 20) - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isMultiplayer, isWaiting, timeLeft, state.currentScenario]);

  return { 
    state, 
    isLoading, 
    makeChoice, 
    restartGame, 
    closeReport,
    multiplayer: {
      active: isMultiplayer,
      roomId,
      roomData,
      isWaiting,
      timeLeft,
      init: initMultiplayer
    }
  };
};
