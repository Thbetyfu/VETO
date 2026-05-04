import { PresidentLegacy } from '../../gun-bridge';

export interface GlobalStats {
  totalPresidents: number;
  avgStability: number;
  totalDaysGoverned: number;
  commonArchetype: string;
}

/**
 * @class AnalyticsService
 * @description SRP: Memproses data P2P untuk menghasilkan statistik agregat global.
 * Digunakan untuk menampilkan dampak kolektif dari seluruh pemain VETO.
 */
export class AnalyticsService {
  static calculateGlobalStats(legacies: PresidentLegacy[]): GlobalStats {
    if (legacies.length === 0) {
      return { totalPresidents: 0, avgStability: 0, totalDaysGoverned: 0, commonArchetype: '-' };
    }

    const totalPresidents = legacies.length;
    const totalDaysGoverned = legacies.reduce((acc, curr) => acc + curr.day, 0);
    
    const avgStability = legacies.reduce((acc, curr) => {
      const { law, humanity, order, budget } = curr.finalStats;
      return acc + (law + humanity + order + budget) / 4;
    }, 0) / totalPresidents;

    // Menentukan Arketipe Terbanyak
    const archetypes: Record<string, number> = {};
    legacies.forEach(l => {
      const type = l.profile || 'Pragmatis';
      archetypes[type] = (archetypes[type] || 0) + 1;
    });

    const commonArchetype = Object.entries(archetypes)
      .sort((a, b) => b[1] - a[1])[0][0];

    return {
      totalPresidents,
      avgStability: Math.round(avgStability),
      totalDaysGoverned,
      commonArchetype
    };
  }
}
