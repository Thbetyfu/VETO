import { Impact } from '../../../types/scenario';

export interface TermResult {
  isEligible: boolean;
  reason: string;
  nextTerm: number;
}

/**
 * @class TermManager
 * @description Fase 12: Logika Konstitusional & Milestone Pemilu.
 * SRP: Mengelola siklus jabatan (Election) dan validasi kelayakan lanjut periode.
 * Patuh pada Konstitusi: Maksimal 2 Periode (720 Hari).
 */
export class TermManager {
  private readonly ELECTION_DAY = 360;
  private readonly MAX_DAYS = 720;
  private readonly REELECTION_THRESHOLD = 50; // Rata-rata pilar minimal untuk terpilih kembali

  /**
   * Menentukan apakah hari ini adalah hari Pemilu.
   */
  isElectionDay(day: number): boolean {
    return day === this.ELECTION_DAY;
  }

  /**
   * Menilai kelayakan Presiden untuk periode kedua berdasarkan performa pilar.
   */
  evaluateReelection(stats: Impact): TermResult {
    const avgScore = (stats.law + stats.humanity + stats.order + stats.budget) / 4;
    
    if (avgScore >= this.REELECTION_THRESHOLD) {
      return {
        isEligible: true,
        reason: 'Rakyat mempercayai integritas Anda untuk memimpin 5 tahun ke depan.',
        nextTerm: 2
      };
    }

    return {
      isEligible: false,
      reason: 'Rapor merah pada stabilitas pilar negara membuat Anda kehilangan kepercayaan rakyat.',
      nextTerm: 1
    };
  }

  /**
   * Mengecek apakah Presiden sudah mencapai batas masa jabatan (720 hari).
   */
  isFinalTermEnd(day: number): boolean {
    return day >= this.MAX_DAYS;
  }
}
