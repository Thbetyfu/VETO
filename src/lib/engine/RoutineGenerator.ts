import { Scenario, ScenarioOption, Impact } from '../../types/scenario';
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
  async generate(day: number, profile: string, stats: Impact): Promise<Scenario> {
    const categories = ['Administrasi', 'Kunjungan Kerja', 'Rapat Kabinet', 'Diplomasi Ringan', 'Sosialisasi UU'];
    const category = categories[Math.floor(Math.random() * categories.length)];

    try {
      const response = await this.aiService.analyze({
        stats,
        profile,
        isRoutine: true,
        routineCategory: category,
        routineDay: day
      });
      // response dari routine selalu diset kembalikan raw text (string) di WebLLMService
      const jsonStr = (typeof response === 'string' ? response : JSON.stringify(response)).replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);

      return {
        id: `routine-${day}-${Date.now()}`,
        title: data.title,
        narrative: data.description || "Melaksanakan tugas kenegaraan rutin.",
        context_tags: [category, 'Rutin'],
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
      legal_basis: "UUD 1945 Pasal 4",
      is_trap: false,
      next_node: 'root'
    };
  }

  private getFallbackScenario(day: number, category: string): Scenario {
    return {
      id: `fallback-${day}`,
      title: `Tugas Rutin: ${category}`,
      narrative: `Anda memiliki agenda rutin terkait ${category} di Istana Negara.`,
      context_tags: [category, 'Fallback'],
      type: 'normal',
      options: [
        this.createOption("Laksanakan sesuai prosedur standar.", 'pro-stabilitas'),
        this.createOption("Berikan arahan untuk lebih fleksibel demi rakyat.", 'pro-rakyat')
      ]
    };
  }
}
