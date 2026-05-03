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
    try {
      await aiService.init((progress) => {
        setLoadProgress(progress);
      });
      setStatus('ready');
    } catch (err) {
      console.error('[VETO AI] Failed to init AI:', err);
      setStatus('error');
    }
  }, [aiService]);

  const generateFeedback = useCallback(async (
    lastChoice: string, 
    context: { stats: Impact, profile: string, toneType?: string, realityTrend?: string }
  ) => {
    if (status !== 'ready') return;

    setStatus('generating');
    try {
      const result = await orchestrator.generateMultiAgentNarrative({
        stats: context.stats,
        profile: context.profile,
        recentEvent: lastChoice,
        toneType: context.toneType,
        realityKeyword: context.realityTrend
      });
      
      setFeedback({
        tone: 'neutral', // Nanti bisa di-improve berbasis Drafter output
        message: result.narasi_final,
        moralProfile: context.profile
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
    aiService: aiService as IAIService
  };
};
