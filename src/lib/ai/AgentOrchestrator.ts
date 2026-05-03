import { IAIService } from './WebLLMService';
import { ScenarioContext, PromptBuilder } from './PromptBuilder';
import { StateTranslator } from '../engine/StateTranslator';
import { NarrativeResponse } from './WebLLMService';

/**
 * @class AgentOrchestrator
 * @description Fase 7: Pemisahan Multi-Agen (Drafter vs. Editor).
 * SRP: Mengelola orkestrasi pemanggilan beberapa agen AI secara berurutan.
 */
export class AgentOrchestrator {
  private aiService: IAIService;

  constructor(aiService: IAIService) {
    this.aiService = aiService;
  }

  async generateMultiAgentNarrative(context: ScenarioContext, onStream?: (partial: string) => void): Promise<NarrativeResponse> {
    const semanticState = StateTranslator.translateImpactToSemantic(context.stats);

    // ==========================================
    // AGEN A: Drafter (Tactical Operations)
    // Fokus pada kausalitas logis
    // ==========================================
    const drafterSystem = "Kamu adalah mesin kausalitas logis. Input: State & Keputusan. Output: 3 poin dampak singkat (max 10 kata per poin). Jawab HANYA poin-poinnya.";
    const drafterUser = `STATE: ${semanticState}\nKEPUTUSAN SAAT INI: ${context.recentEvent || 'Tidak ada'}\nREKAM JEJAK (FLAGS): ${context.activeFlags?.join(', ') || 'Belum ada'}`;

    const drafterMessages = [
      { role: "system", content: drafterSystem },
      { role: "user", content: drafterUser }
    ];

    const drafterOutput = await this.aiService.chatRaw(drafterMessages, {
      temperature: 0.1, // Maksimalkan determinisme untuk kecepatan & logika
      max_tokens: 100,  // Batasi agar tidak melantur
    });

    console.log("[Drafter Output]", drafterOutput);

    // ==========================================
    // AGEN B: Editor (Narrative Engine)
    // Fokus pada prosa, emosi, dan UI (Tonal Map diaktifkan)
    // ==========================================
    const { system: editorSystemBase } = PromptBuilder.build(context);
    // Kita timpa sistem prompt utama agar fokus menulis berdasarkan draf
    const editorSystem = `Kamu adalah penulis skenario kelas dunia. Tugas: Ubah poin dampak menjadi narasi sinematik emosional.
Wajib respons JSON: {"analisis_situasi": "string", "narasi_final": "2 paragraf narasi"}.
Jangan ada teks di luar JSON.
${editorSystemBase.split('INSTRUKSI GAYA BAHASA:')[1] ? 'GAYA BAHASA:' + editorSystemBase.split('INSTRUKSI GAYA BAHASA:')[1] : ''}`;
    
    const editorUser = `POIN DAMPAK:\n${drafterOutput}`;

    const editorMessages = [
      { role: "system", content: editorSystem },
      { role: "user", content: editorUser }
    ];

    const editorOutputRaw = await this.aiService.chatStream(
      editorMessages,
      (token, fullText) => {
        if (onStream) {
          const partial = this.extractPartialNarrative(fullText);
          if (partial) onStream(partial);
        }
      },
      {
        temperature: 0.7,
        max_tokens: 500,
      }
    );

    try {
      const jsonStr = editorOutputRaw.replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);
      if (data.narasi_final) {
        return data as NarrativeResponse;
      }
      return { analisis_situasi: drafterOutput, narasi_final: editorOutputRaw };
    } catch (e) {
      console.warn("[AgentOrchestrator] Failed to parse JSON from Editor, returning fallback", e);
      return { analisis_situasi: drafterOutput, narasi_final: editorOutputRaw };
    }
  }

  /**
   * extractPartialNarrative (Fase 11): 
   * Mengekstrak konten dari field "narasi_final" di tengah proses streaming JSON.
   */
  private extractPartialNarrative(text: string): string {
    const key = '"narasi_final": "';
    const index = text.indexOf(key);
    if (index === -1) return "";
    
    let partial = text.substring(index + key.length);
    
    // Bersihkan karakter escape jika ada
    partial = partial.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    
    // Jika sudah ada tanda kutip penutup (berarti stream selesai), potong di sana
    const closingQuoteIndex = partial.indexOf('"');
    if (closingQuoteIndex !== -1) {
      partial = partial.substring(0, closingQuoteIndex);
    }
    
    return partial;
  }
}
