import { useState, useCallback, useRef, useMemo } from 'react';
import type { AIStatus, AIFeedbackData, ScenarioOption, Impact } from '../types/scenario';
import { WebLLMService, IAIService } from '../lib/ai/WebLLMService';

/**
 * @hook useWebLLM
 * @description Fase 5-13: Integrasi WebLLM (Advanced).
 * SRP: Mengelola sinkronisasi state UI dengan WebLLMService.
 */
export const useWebLLM = () => {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [loadProgress, setLoadProgress] = useState(0);
  const [feedback, setFeedback] = useState<AIFeedbackData | null>(null);
  
  // Singleton instance
  const aiService = useMemo(() => new WebLLMService(), []);

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
    // ... params kept for compatibility if needed elsewhere
  ) => {
    if (status !== 'ready') return;

    setStatus('generating');
    try {
      const prompt = `Berikan komentar singkat rakyat terhadap keputusan Presiden: "${lastChoice}". Format: Satu kalimat singkat.`;
      const result = await aiService.analyze(prompt);
      setFeedback({
        tone: 'neutral',
        message: result,
        moralProfile: 'Analisis Real-time'
      });
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setStatus('ready');
    }
  }, [status, aiService]);

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
