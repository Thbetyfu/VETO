import { Impact, GameState } from '../../types/scenario';

export interface EndingResult {
  type: 'VISIONARY' | 'TYRANT' | 'MARTYR' | 'FALLEN' | 'PRESERVER';
  title: string;
  narrative: string;
  legacy_score: number;
}

/**
 * @class EndingManager
 * @description Fase 15.17: Puncak dari Neural Weave.
 * SRP: Mengevaluasi seluruh perjalanan 720 hari (Stats + Flags) untuk menentukan akhir cerita.
 */
export class EndingManager {
  static evaluate(state: GameState): EndingResult {
    const { stats, activeFlags } = state;
    
    // 1. THE IRON TYRANT (Prioritas: Order > Law + Flag Tyrant/Iron Fist)
    if ((activeFlags.includes('TYRANT_SEED') || activeFlags.includes('IRON_FIST')) && stats.order > 70) {
      return {
        type: 'TYRANT',
        title: 'Sang Tirani Besi',
        narrative: 'Anda meninggalkan kekuasaan dengan negara yang stabil namun rakyat yang membisu. Sejarah mencatat Anda sebagai pemimpin yang membangun dengan tangan berdarah.',
        legacy_score: 40
      };
    }

    // 2. THE BENEVOLENT MARTYR (Prioritas: Humanity > Budget + Flag Martyr/Humble)
    if ((activeFlags.includes('MARTYR_SEED') || activeFlags.includes('HUMBLE_LEGACY')) && stats.humanity > 80) {
      return {
        type: 'MARTYR',
        title: 'Martir Kemanusiaan',
        narrative: 'Anda mengosongkan kas negara demi menyelamatkan setiap nyawa. Rakyat menangis saat Anda turun takhta, namun penerus Anda menghadapi beban utang yang berat.',
        legacy_score: 85
      };
    }

    // 3. THE VISIONARY REFORMER (Prioritas: Law & Humanity High + Flag Visionary)
    if (stats.law > 75 && stats.humanity > 70 && activeFlags.includes('VISIONARY_SEED')) {
      return {
        type: 'VISIONARY',
        title: 'Sang Pembaharu Visioner',
        narrative: 'Anda berhasil menyeimbangkan pedang hukum dengan kasih sayang. Indonesia menjadi mercusuar keadilan dunia di bawah warisan kepemimpinan 10 tahun Anda.',
        legacy_score: 100
      };
    }

    // 4. THE FALLEN IDEALIST (Prioritas: Banyak krisis lingkungan/fiskal)
    if (activeFlags.includes('FISCAL_DOOMSDAY') || activeFlags.includes('ENVIRONMENTAL_DEBT')) {
      return {
        type: 'FALLEN',
        title: 'Idealis yang Tumbang',
        narrative: 'Niat Anda mungkin baik, namun realitas sistemik menghancurkan visi Anda. Anda turun takhta di tengah bayang-bayang kegagalan ekonomi dan lingkungan.',
        legacy_score: 20
      };
    }

    // 5. THE SILENT PRESERVER (Default: Balanced)
    return {
      type: 'PRESERVER',
      title: 'Sang Penjaga Status Quo',
      narrative: 'Anda menjaga kapal tetap mengapung tanpa guncangan besar. Tidak ada warisan raksasa, namun tidak ada pula luka mendalam bagi bangsa.',
      legacy_score: 60
    };
  }
}
