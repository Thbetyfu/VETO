import { describe, it, expect, vi } from 'vitest';
import { GameEngineCore } from '../core/GameEngineCore';
import { ImpactCalculator } from './ImpactCalculator';
import { ScenarioPicker } from './ScenarioPicker';
import { IAIService } from '../../ai/WebLLMService';

const mockAiService: IAIService = {
  init: vi.fn(),
  analyze: vi.fn(),
  generateRollingSummary: vi.fn(),
  chatRaw: vi.fn(),
  chatStream: vi.fn()
};

describe('GameEngineCore (SOLID - DIP)', () => {
  // Mock dependencies
  const calculator = new ImpactCalculator();
  const picker = new ScenarioPicker();
  
  const engine = new GameEngineCore(calculator, picker, mockAiService);

  it('should process a turn and return new state', async () => {
    const prevState = {
      stats: { law: 50, humanity: 50, order: 50, budget: 50 },
      history: [],
      normalStreak: 0,
      activeFlags: []
    };

    const option = {
      label: 'Test',
      impact: { law: 10, humanity: 0, order: 0, budget: 0 },
      trigger_flags: ['test_flag'],
      is_trap: false,
      next_node: 'next',
      legal_basis: 'UUD'
    };

    const newState = await engine.processTurn(prevState as any, option as any);

    expect(newState.stats.law).toBe(60);
    expect(newState.activeFlags).toContain('test_flag');
    expect(newState.normalStreak).toBe(1);
  });
});
