import { Impact } from '../../types/scenario';

export interface LeadershipProfile {
  title: string;
  description: string;
  sacrifices: string[];
}

/**
 * @class ProfileService
 * @description Fase 8: Analisis Profil Kepemimpinan (Moral Reflection).
 * SRP: Menghasilkan arketipe kepemimpinan berdasarkan keseimbangan pilar.
 * Neuron Logic: Setiap pilar memberikan sinyal bobot ke arketipe tertentu.
 */
export class ProfileService {
  static analyze(stats: Impact): LeadershipProfile {
    const { law, humanity, order, budget } = stats;
    
    // Logic Arketipe (Neuron Weights)
    if (law > 75 && humanity > 75) {
      return {
        title: 'Sang Penjaga Konstitusi',
        description: 'Anda mengutamakan keadilan tanpa mengorbankan martabat rakyat.',
        sacrifices: ['Keputusan cepat sering tertunda demi prosedur.']
      };
    }
    
    if (order > 75 && budget > 75) {
      return {
        title: 'Arsitek Stabilitas',
        description: 'Negara aman dan kas terisi, namun suara rakyat mungkin teredam.',
        sacrifices: ['Kebebasan sipil sering menjadi tumbal stabilitas.']
      };
    }
    
    if (humanity > 75 && budget < 40) {
      return {
        title: 'Populis Filantropis',
        description: 'Anda dicintai rakyat, namun keuangan negara berada dalam bahaya.',
        sacrifices: ['Masa depan fiskal dikorbankan untuk bantuan jangka pendek.']
      };
    }

    if (law < 40 && order > 80) {
      return {
        title: 'Otoritarian Pragmatis',
        description: 'Hukum hanyalah alat bagi Anda untuk mencapai ketertiban mutlak.',
        sacrifices: ['Etika dan moralitas sering diabaikan demi efektivitas.']
      };
    }

    return {
      title: 'Pemimpin Transisional',
      description: 'Anda masih mencari keseimbangan di tengah badai krisis.',
      sacrifices: ['Kebijakan seringkali tidak memiliki arah yang konsisten.']
    };
  }

  /**
   * Menghitung Indeks Pengorbanan (Sacrifice Index)
   * Mengukur seberapa banyak nilai yang hilang demi mencapai nilai lain.
   */
  static calculateSacrificeIndex(history: any[]): number {
    return history.reduce((acc, curr) => {
      const impacts = Object.values(curr.impact || {}) as number[];
      const negativeImpacts = impacts.filter(v => v < 0);
      return acc + Math.abs(negativeImpacts.reduce((a, b) => a + b, 0));
    }, 0);
  }
}
