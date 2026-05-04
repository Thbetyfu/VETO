import { useState, useCallback, useEffect } from 'react';
import type { GameState, Scenario, ScenarioOption, Impact } from '../types/scenario';
import { GameEngineCore } from '../lib/engine/core/GameEngineCore';
import { ImpactCalculator } from '../lib/engine/logic/ImpactCalculator';
import { ScenarioPicker } from '../lib/engine/logic/ScenarioPicker';
import { StateManager } from '../lib/engine/core/StateManager';
import { RealityService } from '../lib/engine/services/RealityService';
import { p2pService } from '../lib/p2p/P2PService';

import { IAIService } from '../lib/ai/WebLLMService';

const INITIAL_STATS: Impact = { law: 75, humanity: 75, order: 75, budget: 75 };

// Dependency Injection Factory
const createEngine = (aiService: IAIService) => {
  const calculator = new ImpactCalculator();
  const picker = new ScenarioPicker();
  return new GameEngineCore(calculator, picker, aiService);
};

// Initial scenario handled inside factory

/**
 * @hook useGameEngine
 * @description Fase 12: Async Engine Bridge.
 * Mendukung simulasi 720 hari dengan pemrosesan asynchronous.
 */
export const useGameEngine = (aiService: IAIService, playerName: string) => {
  const [engine] = useState(() => createEngine(aiService));
  const [state, setState] = useState<GameState>(() => {
    // Inisialisasi awal: Gunakan placeholder sementara menunggu async pick
    return StateManager.createInitialState(null as any, INITIAL_STATS);
  });

  // Fase 13: Lazy Initialization Core
  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      const { scenario } = await engine.picker.pick([], 0, [], 1, 'Pemimpin Transisional');
      setState(prev => ({ ...prev, currentScenario: scenario }));
      setIsLoading(false);
    };
    initGame();
  }, [engine]);
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
      p2pService.submitRoomChoice(roomId!, playerName, state.currentScenario!.id, option.id || 'default');
      // Timer akan di-reset saat skenario berganti (dipicu oleh room sync)
      return;
    }

    setIsLoading(true);
    try {
      const nextState = await engine.processTurn(state, option);

      // Final Check (Activation Thresholds)
      const isOver = nextState.isGameOver || Object.values(nextState.stats).some((v: any) => v <= 0);
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
        const { scenario } = await engine.picker.pick(
          state.history.map((h: any) => h.scenarioId),
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

  const restartGame = useCallback(async () => {
    const { scenario } = await engine.picker.pick([], 0, [], 1, 'Pemimpin Transisional');
    setState(StateManager.createInitialState(scenario as Scenario, INITIAL_STATS));
  }, [engine]);

  /**
   * Diplomacy Mode: Inisialisasi Multiplayer.
   */
  const initMultiplayer = useCallback((pName: string, mode: 'create' | 'join', rId?: string) => {
    setIsMultiplayer(true);
    if (mode === 'create') {
      p2pService.createRoom(pName, (id) => {
        setRoomId(id);
        // Berikan jeda kecil agar GunDB meregistrasi node
        setTimeout(() => startRoomListener(id, pName), 100);
      });
    } else if (rId) {
      setRoomId(rId);
      startRoomListener(rId, pName);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [diplomaticMessage, setDiplomaticMessage] = useState<string | null>(null);

  const startRoomListener = (id: string, pName: string) => {
    p2pService.joinRoom(id, pName, (data) => {
      setRoomData(data);
      
      if (data.status !== 'playing') return;

      setState(prev => {
        if (data.currentScenarioId && data.currentScenarioId !== prev.currentScenario?.id) {
          const newScenario = engine.picker.scenarios.find((s: Scenario) => s.id === data.currentScenarioId);
          if (newScenario) {
            setTimeLeft(20);
            setIsWaiting(false);
            setDiplomaticMessage(null);
            return { 
              ...prev, 
              currentScenario: newScenario as Scenario, 
              day: prev.day + 1
            };
          }
        }
        return prev;
      });

      const players = Object.keys(data.players || {});
      const responses = data.responses || {};
      const responseKeys = Object.keys(responses);
      
      // Pastikan semua player sudah menjawab scenario saat ini
      const currentScenarioId = data.currentScenarioId;
      const allResponded = players.length > 1 && 
        players.every(p => responses[p] && responses[p].scenarioId === currentScenarioId);

      if (allResponded) {
        handleCollectiveImpact(id, data, pName, players);
      }
    });
  };

  const handleCollectiveImpact = async (id: string, data: any, pName: string, players: string[]) => {
    const myResponse = data.responses[pName];
    if (!myResponse) return; // Belum menjawab

    const myScenario = engine.picker.scenarios.find((s: Scenario) => s.id === myResponse.scenarioId);
    const myChoice = myScenario?.options.find((o: ScenarioOption) => o.id === myResponse.choiceId || o.label === myResponse.choiceId);

    if (!myChoice) return;

    // Hitung Tekanan Diplomatik dari Pemain Lain
    const diplomaticImpact: Impact = { law: 0, humanity: 0, order: 0, budget: 0 };
    let diplomaticNotif = "";

    players.forEach(otherName => {
      if (otherName === pName) return;
      
      const otherResp = data.responses[otherName];
      const otherScenario = engine.picker.scenarios.find((s: Scenario) => s.id === otherResp.scenarioId);
      const otherChoice = otherScenario?.options.find((o: ScenarioOption) => o.id === otherResp.choiceId || o.label === otherResp.choiceId);

      if (otherChoice?.diplomatic_to_others) {
        const d = otherChoice.diplomatic_to_others;
        diplomaticImpact.law += d.law || 0;
        diplomaticImpact.humanity += d.humanity || 0;
        diplomaticImpact.order += d.order || 0;
        diplomaticImpact.budget += d.budget || 0;
        diplomaticNotif += `${otherName} memilih "${otherChoice.label}". `;
      }
    });

    // Final Impact: Pilihan Sendiri + Pengaruh Orang Lain
    const finalImpact: Impact = {
      law: myChoice.impact.law + diplomaticImpact.law,
      humanity: myChoice.impact.humanity + diplomaticImpact.humanity,
      order: myChoice.impact.order + diplomaticImpact.order,
      budget: myChoice.impact.budget + diplomaticImpact.budget
    };

    if (diplomaticNotif) {
      setDiplomaticMessage(`TEKANAN DIPLOMATIK: ${diplomaticNotif}`);
    }

    setIsLoading(true);
    setState(prev => {
      // Pastikan kita tidak memproses turn yang sama dua kali
      if (prev.history.some(h => h.scenarioId === myResponse.scenarioId)) return prev;

      const next = engine.processTurnSync(prev, { 
        ...myChoice,
        impact: finalImpact,
        label: `${myChoice.label} (Global Impact)`
      });

      // Host Advance Logic (pindah skenario)
      const sortedPlayers = players.sort();
      if (sortedPlayers[0] === pName) {
        // Beri jeda sedikit agar player lain bisa melihat hasil/notifikasi
        setTimeout(async () => {
          const { scenario: nextScenario } = await engine.picker.pick(
            next.history.map((h: any) => h.scenarioId),
            next.normalStreak,
            next.activeFlags,
            next.day,
            next.profile,
            { ...globalMetrics, isMultiplayer }
          );
          if (nextScenario) {
            p2pService.advanceRoom(id, nextScenario.id);
          }
        }, 2000);
      }

      return next;
    });
    
    setIsWaiting(false);
    setIsLoading(false);
  };

  // Timer Logic (20s)
  useEffect(() => {
    if (isMultiplayer && !isWaiting && !state.isGameOver && timeLeft !== null) {
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
      diplomaticMessage,
      init: initMultiplayer
    }
  };
};
