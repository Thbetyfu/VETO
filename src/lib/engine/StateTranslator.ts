import { Impact } from '../../types/scenario';

/**
 * @class StateTranslator
 * @description Fase 2: Middleware untuk menerjemahkan angka (raw metrics) menjadi semantic context.
 * Membantu model LLM (WebLLM) "merasakan" urgensi kondisi tanpa hanya melihat angka mutlak.
 */
export class StateTranslator {
  static translateLaw(law: number): string {
    if (law < 30) return "Sistem hukum kehilangan wibawa, supremasi hukum dipertanyakan publik, dan tingkat kejahatan meningkat.";
    if (law < 50) return "Hukum berjalan lamban, ada keraguan terhadap ketegasan pemerintah di mata masyarakat.";
    if (law <= 80) return "Supremasi hukum terjaga dengan baik, aturan ditegakkan secara adil.";
    return "Hukum ditegakkan tanpa pandang bulu, wibawa negara sangat kuat bak benteng besi.";
  }

  static translateHumanity(humanity: number): string {
    if (humanity < 30) return "Kesejahteraan rakyat hancur, kemiskinan dan kelaparan memicu keputusasaan di kalangan bawah.";
    if (humanity < 50) return "Fokus pada efisiensi telah menepikan hak-hak sipil, memicu gelombang protes aktivis.";
    if (humanity <= 80) return "Negara hadir melindungi rakyat, program sosial tersalurkan dengan baik.";
    return "Humanisme menjadi panglima tertinggi, negara menempatkan nyawa dan martabat rakyat di atas segalanya.";
  }

  static translateOrder(order: number): string {
    if (order < 30) return "Kekacauan melanda jalanan, demonstrasi anarkis dan separatisme mengancam integrasi bangsa.";
    if (order < 50) return "Ketertiban mulai goyah, riak-riak perlawanan muncul mengganggu stabilitas nasional.";
    if (order <= 80) return "Stabilitas nasional terkendali, aktivitas sosial-ekonomi berjalan dengan aman.";
    return "Keamanan dijaga secara absolut, stabilitas tercapai meski dengan pengawasan ketat terhadap kebebasan.";
  }

  static translateBudget(budget: number): string {
    if (budget < 30) return "Kas negara telah mengering, ancaman kebangkrutan fiskal berada di depan mata.";
    if (budget < 50) return "Anggaran negara defisit, pemerintah terpaksa memotong subsidi dan menunda proyek vital.";
    if (budget <= 80) return "Kondisi fiskal sehat, pendanaan negara cukup untuk menjalankan roda pemerintahan.";
    return "Surplus anggaran yang masif, negara memiliki keleluasaan finansial luar biasa untuk berekspansi.";
  }

  /**
   * Menggabungkan seluruh metrik ke dalam satu string naratif komprehensif.
   */
  static translateImpactToSemantic(stats: Impact): string {
    return `
Kondisi Negara Saat Ini:
- Hukum (${stats.law}%): ${this.translateLaw(stats.law)}
- Kemanusiaan (${stats.humanity}%): ${this.translateHumanity(stats.humanity)}
- Ketertiban (${stats.order}%): ${this.translateOrder(stats.order)}
- Anggaran (${stats.budget}%): ${this.translateBudget(stats.budget)}
    `.trim();
  }
}
