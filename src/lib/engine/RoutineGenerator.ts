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
    const categories = [
      'Intrik Internal', 
      'Skandal Media', 
      'Lobi Gelap', 
      'Nepotisme', 
      'Bisikan Ajudan',
      'Diplomasi Belakang Layar',
      'Ketegangan Koalisi'
    ];
    const category = categories[Math.floor(Math.random() * categories.length)];

    try {
      const response = await this.aiService.analyze({
        stats,
        profile,
        isRoutine: true,
        routineCategory: category,
        routineDay: day
      });
      
      const jsonStr = (typeof response === 'string' ? response : JSON.stringify(response)).replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);

      // Konversi ke format Scenario
      return {
        id: `ISTANA-${day}-${Math.floor(Math.random() * 1000)}`,
        type: 'normal',
        title: data.title,
        narrative: data.description,
        context_tags: [category, 'Intrik Istana'],
        options: data.options.map((opt: any) => ({
          label: opt.label,
          impact: opt.impact,
          legal_basis: opt.legal_basis || 'Diskresi Presiden',
          is_trap: false,
          next_node: 'DYNAMIC_NEXT'
        }))
      } as Scenario;
    } catch (error) {
      console.error("[RoutineGenerator] AI Generation failed, using fallback", error);
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
      title: `Laporan Intelijen: ${category}`,
      narrative: `Laporan rahasia masuk ke meja Anda mengenai ${category}. Situasi ini memerlukan respons segera dari kepemimpinan Anda.`,
      context_tags: [category, 'Fallback'],
      type: 'normal',
      options: [
        this.createOption("Laksanakan sesuai prosedur standar.", 'pro-stabilitas'),
        this.createOption("Berikan arahan untuk lebih fleksibel demi rakyat.", 'pro-rakyat')
      ]
    };
  }
}
