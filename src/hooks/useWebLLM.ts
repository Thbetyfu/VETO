import { useState, useCallback, useRef, useMemo } from 'react';
import type { AIStatus, AIFeedbackData, ScenarioOption, Impact } from '../types/scenario';
import { WebLLMService, IAIService } from '../lib/ai/WebLLMService';
import { AgentOrchestrator } from '../lib/ai/AgentOrchestrator';

/**
 * @hook useWebLLM
 * @description Fase 5-13: Integrasi WebLLM (Advanced).
 * SRP: Mengelola sinkronisasi state UI dengan WebLLMService.
 */
export const useWebLLM = () => {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [loadProgress, setLoadProgress] = useState(0);
  const [feedback, setFeedback] = useState<AIFeedbackData | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const watchdogTimer = useRef<any>(null);
  
  // Singleton instances
  const aiService = useMemo(() => new WebLLMService(), []);
  const orchestrator = useMemo(() => new AgentOrchestrator(aiService), [aiService]);

  const initModel = useCallback(async () => {
    // Security/Capability Check
    if (!navigator.gpu) {
      console.warn('[VETO AI] WebGPU not available. Fallback to Heuristics.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setIsStuck(false);

    // Watchdog: Jika dalam 20 detik tetap 0%, tandai sebagai stuck
    watchdogTimer.current = setTimeout(() => {
      setIsStuck(true);
      console.warn('[VETO AI] Loading stuck at 0%. Possibly network or header issue.');
    }, 20000);

    try {
      await aiService.init((progress) => {
        setLoadProgress(progress);
        if (progress > 0 && watchdogTimer.current) {
          clearTimeout(watchdogTimer.current);
          setIsStuck(false);
        }
      });
      if (watchdogTimer.current) clearTimeout(watchdogTimer.current);
      setStatus('ready');
    } catch (err) {
      console.error('[VETO AI] Failed to init AI:', err);
      setStatus('error');
      if (watchdogTimer.current) clearTimeout(watchdogTimer.current);
    }
  }, [aiService]);

  const generateFeedback = useCallback(async (
    lastChoice: string, 
    context: { stats: Impact, profile: string, toneType?: string, realityTrend?: string, activeFlags?: string[] }
  ) => {
    // Jika stuck, langsung masuk ke mode Heuristik (Fase 15.20: Auto-Fallback)
    if (isStuck || status !== 'ready') {
      console.log("[VETO AI] Using Heuristic Fallback Engine...");
      setFeedback({
        tone: 'neutral',
        message: `Keputusan Anda tentang "${lastChoice}" telah dicatat. Sebagai ${context.profile}, Anda memilih untuk memprioritaskan stabilitas, meskipun sejarah akan mencatat konsekuensi dari flags: ${context.activeFlags?.join(', ') || 'awal baru'}.`,
        moralProfile: context.profile,
        isStreaming: false
      });
      return;
    }

    setStatus('generating');
    try {
      const result = await orchestrator.generateMultiAgentNarrative(
        {
          stats: context.stats,
          profile: context.profile,
          recentEvent: lastChoice,
          toneType: context.toneType,
          realityKeyword: context.realityTrend,
          activeFlags: context.activeFlags
        },
        (partial) => {
          // Fase 11: Update UI secara real-time (streaming)
          setFeedback(prev => ({
            tone: 'neutral',
            message: partial,
            moralProfile: context.profile,
            isStreaming: true
          }));
        }
      );
      
      setFeedback({
        tone: 'neutral', // Nanti bisa di-improve berbasis Drafter output
        message: result.narasi_final,
        moralProfile: context.profile,
        isStreaming: false
      });
      
      if (result.analisis_situasi) {
        console.log("[VETO Multi-Agent Analysis]", result.analisis_situasi);
      }
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setStatus('ready');
    }
  }, [status, orchestrator]);

  return { 
    status, 
    loadProgress, 
    feedback, 
    initModel, 
    generateFeedback, 
    clearFeedback: () => setFeedback(null),
    aiService: aiService as IAIService,
    isStuck
  };
};
