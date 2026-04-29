import { describe, it, expect } from 'vitest';
import { ImpactCalculator } from './ImpactCalculator';
import { Impact } from '../../types/scenario';

describe('ImpactCalculator (Neuron-Based)', () => {
  const calculator = new ImpactCalculator();

  it('should calculate new stats correctly (Weighted Sum principle)', () => {
    const current: Impact = { law: 50, humanity: 50, order: 50, budget: 50 };
    const weight: Impact = { law: 10, humanity: -5, order: 0, budget: 20 };
    
    const result = calculator.calculate(current, weight);
    
    expect(result.law).toBe(60);
    expect(result.humanity).toBe(45);
    expect(result.budget).toBe(70);
  });

  it('should apply Activation Function (Clamping 0-100)', () => {
    const current: Impact = { law: 95, humanity: 5, order: 50, budget: 50 };
    const weight: Impact = { law: 10, humanity: -10, order: 0, budget: 0 };
    
    const result = calculator.calculate(current, weight);
    
    expect(result.law).toBe(100);
    expect(result.humanity).toBe(0);
  });
});
