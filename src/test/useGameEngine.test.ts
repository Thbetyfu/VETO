import { renderHook, act } from '@testing-library/react';
import { useGameEngine } from '../hooks/useGameEngine';
import { describe, it, expect, vi } from 'vitest';
import { IAIService } from '../lib/ai/WebLLMService';

const mockAiService: IAIService = {
  init: vi.fn(),
  analyze: vi.fn(),
  generateRollingSummary: vi.fn(),
  chatRaw: vi.fn()
};

describe('useGameEngine White-Box Testing', () => {
  it('harus menginisialisasi state dengan benar', () => {
    const { result } = renderHook(() => useGameEngine(mockAiService));
    
    expect(result.current.state.day).toBe(1);
    expect(result.current.state.stats.law).toBe(75);
    expect(result.current.state.isGameOver).toBe(false);
  });

  it('harus memperbarui statistik saat pilihan diambil', async () => {
    const { result } = renderHook(() => useGameEngine(mockAiService));
    
    const initialLaw = result.current.state.stats.law;
    const option = {
      label: 'Test Option',
      impact: { law: 10, humanity: -5, order: 0, budget: 0 },
      is_trap: false,
      next_node: 'DYNAMIC_NEXT',
      legal_basis: 'UUD 1945'
    };

    await act(async () => {
      await result.current.makeChoice(option);
    });

    expect(result.current.state.stats.law).toBe(initialLaw + 10);
    expect(result.current.state.day).toBe(2);
  });

  it('harus memicu Game Over jika statistik mencapai 0', async () => {
    const { result } = renderHook(() => useGameEngine(mockAiService));
    
    const lethalOption = {
      label: 'Fatal Decision',
      impact: { law: -100, humanity: 0, order: 0, budget: 0 },
      is_trap: false,
      next_node: 'DYNAMIC_NEXT',
      legal_basis: 'UUD 1945'
    };

    await act(async () => {
      await result.current.makeChoice(lethalOption);
    });

    expect(result.current.state.isGameOver).toBe(true);
    expect(result.current.state.gameOverReason).toContain('hukum');
  });

  it('harus mereset state saat restartGame dipanggil', async () => {
    const { result } = renderHook(() => useGameEngine(mockAiService));
    
    await act(async () => {
      await result.current.makeChoice({
        label: 'A',
        impact: { law: 10, humanity: 0, order: 0, budget: 0 },
        is_trap: false,
        next_node: 'DYNAMIC_NEXT',
        legal_basis: 'UUD 1945'
      });
    });

    expect(result.current.state.day).toBe(2);

    act(() => {
      result.current.restartGame();
    });

    expect(result.current.state.day).toBe(1);
    expect(result.current.state.stats.law).toBe(75);
  });
});
