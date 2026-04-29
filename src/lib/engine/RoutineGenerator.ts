import { Scenario, ScenarioOption } from '../../types/scenario';
import { IAIService } from '../ai/WebLLMService';

/**
 * @class RoutineGenerator
 * @description Fase 13: Procedural Narrative Generator.
 * SRP: Menghasilkan skenario harian rutin agar tidak terjadi pengulangan (Anti-Repetisi).
 * Menggunakan AI (WebLLM) untuk narasi dan logika prosedural untuk dampak pilar.
 */
export class RoutineGenerator {
  constructor(private aiService: IAIService) {}

  /**
   * Menghasilkan skenario rutin secara prosedural.
   */
  async generate(day: number, profile: string): Promise<Scenario> {
    const categories = ['Administrasi', 'Kunjungan Kerja', 'Rapat Kabinet', 'Diplomasi Ringan', 'Sosialisasi UU'];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const prompt = `
      Buat satu skenario tugas rutin Presiden RI pada hari ke-${day}.
      Kategori: ${category}.
      Arketipe Presiden saat ini: ${profile}.
      Format output HARUS JSON mentah:
      {
        "title": "Judul Singkat",
        "description": "Deskripsi singkat tugas harian (max 2 kalimat)",
        "option_a": "Pilihan Tindakan A",
        "option_b": "Pilihan Tindakan B"
      }
    `;

    try {
      const response = await this.aiService.analyze(prompt);
      // Membersihkan markdown jika ada
      const jsonStr = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);

      return {
        id: `routine-${day}-${Date.now()}`,
        title: data.title,
        description: data.description,
        type: 'normal',
        options: [
          this.createOption(data.option_a, 'pro-stabilitas'),
          this.createOption(data.option_b, 'pro-rakyat')
        ]
      };
    } catch (error) {
      // Fallback jika AI gagal
      return this.getFallbackScenario(day, category);
    }
  }

  private createOption(label: string, alignment: 'pro-stabilitas' | 'pro-rakyat'): ScenarioOption {
    const isProStabilitas = alignment === 'pro-stabilitas';
    return {
      label,
      impact: {
        law: isProStabilitas ? 2 : -1,
        humanity: isProStabilitas ? -1 : 2,
        order: isProStabilitas ? 1 : -1,
        budget: isProStabilitas ? 0 : -2
      },
      moral_analysis: "Tugas rutin negara.",
      legal_basis: "UUD 1945 Pasal 4"
    };
  }

  private getFallbackScenario(day: number, category: string): Scenario {
    return {
      id: `fallback-${day}`,
      title: `Tugas Rutin: ${category}`,
      description: `Anda memiliki agenda rutin terkait ${category} di Istana Negara.`,
      type: 'normal',
      options: [
        this.createOption("Laksanakan sesuai prosedur standar.", 'pro-stabilitas'),
        this.createOption("Berikan arahan untuk lebih fleksibel demi rakyat.", 'pro-rakyat')
      ]
    };
  }
}
