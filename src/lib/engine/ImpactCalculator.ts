import { Impact } from '../../types/scenario';
import { IImpactCalculator } from './types';

/**
 * @class ImpactCalculator
 * @description Fase 10: Neural Logic Unit (NLU).
 * Mengimplementasikan perhitungan dampak menggunakan arsitektur Neuron:
 * Result = Activation( (Input * Weight) + Bias )
 */
export class ImpactCalculator implements IImpactCalculator {
  // Bobot Ketahanan Pilar (Weights) - Seberapa 'elastis' sebuah pilar
  private readonly weights = {
    law: 1.2,      // Hukum sangat sensitif (perlu bobot tinggi)
    humanity: 1.0, 
    order: 0.9,    // Ketertiban lebih stabil
    budget: 0.8    // Anggaran paling volatil/mudah berubah
  };

  // Bias Dasar (Systemic Decay)
  private readonly initialBias = -0.3;

  /**
   * Menghitung Entropy (Degradasi Sistemik) berdasarkan jumlah hari menjabat.
   * Semakin lama menjabat, semakin besar tekanan negatif alami pada pilar.
   */
  private calculateEntropy(day: number): number {
    const entropyFactor = Math.floor(day / 100) * 0.15; // Setiap 100 hari, bias negatif bertambah -0.15
    return this.initialBias - entropyFactor;
  }

  /**
   * Fungsi Aktivasi (Clamping 0-100)
   */
  private activate(value: number): number {
    return Math.round(Math.max(0, Math.min(100, value)));
  }

  /**
   * Neural Weighted Sum Calculation
   */
  calculate(currentStats: Impact, optionImpact: Impact, day: number = 1): Impact {
    const currentBias = this.calculateEntropy(day);
    
    return {
      law: this.activate(currentStats.law + (optionImpact.law * this.weights.law) + currentBias),
      humanity: this.activate(currentStats.humanity + (optionImpact.humanity * this.weights.humanity) + currentBias),
      order: this.activate(currentStats.order + (optionImpact.order * this.weights.order) + currentBias),
      budget: this.activate(currentStats.budget + (optionImpact.budget * this.weights.budget) + currentBias),
    };
  }
}
