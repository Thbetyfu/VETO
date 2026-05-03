import { Impact } from '../../types/scenario';
import { StateTranslator } from '../engine/StateTranslator';

export interface ScenarioContext {
  stats: Impact;
  profile: string;
  recentEvent?: string; 
  isRoutine?: boolean; 
  routineCategory?: string;
  routineDay?: number;
  toneType?: 'CRISIS' | 'BUREAUCRATIC' | 'NORMAL' | string;
  realityKeyword?: string;
}

const NARRATIVE_SYSTEM_PROMPT = `Anda adalah Narrative Engine untuk game simulasi strategi politik. Tugas Anda adalah merender hasil keputusan pemain menjadi narasi dramatis, mendesak, dan realistis.

Anda wajib memberikan respons HANYA dalam format JSON yang valid. Jangan ada teks tambahan di luar JSON.

Format Output yang Diinginkan:
{
  "analisis_situasi": "[Tulis alasan logis dari dampak keputusan pemain di sini]",
  "narasi_final": "[Tulis 2 paragraf narasi dramatis di sini]"
}

Contoh Input-Output:

Input: [Konteks Negara: Anggaran defisit parah. Keputusan terakhir Presiden: "Menunda proyek strategis"]
Output:
{
  "analisis_situasi": "Karena anggaran negara sedang krisis, penundaan proyek strategis memicu reaksi negatif publik, memotong sumber pendapatan jangka panjang namun menyelamatkan arus kas darurat.",
  "narasi_final": "Kas negara telah mengering. Di jalanan, gema kemarahan publik terdengar jelas menembus dinding ruang kerjamu.\\n\\nKeputusan memotong anggaran proyek strategis kini membuahkan krisis kepercayaan yang mengancam stabilitas posisimu, meskipun para penasihat fiskal bernapas lega untuk sementara waktu."
}

Input: [Konteks Negara: Hukum ditegakkan ketat, ancaman demonstrasi. Keputusan terakhir Presiden: "Menurunkan aparat bersenjata lengkap"]
Output:
{
  "analisis_situasi": "Pengerahan aparat meredam kekacauan secara instan dengan menggunakan ancaman fisik, mengakibatkan ketakutan di tingkat sipil namun mengembalikan ketertiban secara absolut.",
  "narasi_final": "Supremasi hukum berdiri tegak bak benteng besi, namun bayarannya adalah darah di jalanan.\\n\\nPengerahan aparat bersenjata lengkap ke pusat kota berhasil membungkam demonstran, menyisakan keheningan yang mencekam dan kemarahan yang membara di bawah tanah."
}`;

const ROUTINE_SYSTEM_PROMPT = `Anda adalah Generator Skenario Game. Anda HANYA boleh membalas dengan format JSON mentah tanpa markdown, tanpa penjelasan apa pun.`;

const TONAL_MAP: Record<string, string> = {
  'CRISIS': "Gunakan kalimat pendek. Nada panik, mendesak, seperti dikejar waktu.",
  'BUREAUCRATIC': "Gunakan bahasa formal, panjang, dan diplomatis.",
  'NORMAL': "Gunakan nada objektif, realistis, namun tetap memiliki bobot naratif."
};

/**
 * @class PromptBuilder
 * @description Fase 1 & 3: Audit, Ekstraksi Prompt, dan Few-Shot Injection.
 * SRP: Bertanggung jawab hanya untuk merakit prompt agar tidak mencemari service WebLLM.
 */
export class PromptBuilder {
  static build(context: ScenarioContext | string): { system: string, user: string } {
    // Mode kompatibilitas string sederhana
    if (typeof context === 'string') {
      return {
        system: "Anda adalah analis hukum dan moral untuk Presiden.",
        user: context
      };
    }

    const semanticState = StateTranslator.translateImpactToSemantic(context.stats);

    // Mode Routine Generator (JSON Output)
    if (context.isRoutine) {
      const userPrompt = `Buat satu skenario tugas rutin Presiden RI pada hari ke-${context.routineDay}.
Kategori: ${context.routineCategory}.
Arketipe Presiden saat ini: ${context.profile}.

${semanticState}

Format output HARUS JSON mentah:
{
  "title": "Judul Singkat",
  "description": "Deskripsi singkat tugas harian (max 2 kalimat)",
  "option_a": "Pilihan Tindakan A",
  "option_b": "Pilihan Tindakan B"
}`;
      return {
        system: ROUTINE_SYSTEM_PROMPT,
        user: userPrompt.trim()
      };
    }

    // Tonal Injection (Fase 8)
    const toneInstruction = context.toneType && TONAL_MAP[context.toneType] 
      ? `\n\nINSTRUKSI GAYA BAHASA:\n${TONAL_MAP[context.toneType]}` 
      : `\n\nINSTRUKSI GAYA BAHASA:\n${TONAL_MAP['NORMAL']}`;

    // Reality Sync Injection (Fase 9)
    const realityInstruction = context.realityKeyword 
      ? `\n\nINSTRUKSI REALITA:\nKaitkan masalah publik yang terjadi di dalam game dengan isu "${context.realityKeyword}" yang sedang menghantui masyarakat saat ini.`
      : '';

    const systemPromptWithTone = NARRATIVE_SYSTEM_PROMPT + toneInstruction + realityInstruction;

    // Mode Narrative Engine (Dramatic Feedback)
    let userPrompt = `[Konteks Negara:\n${semanticState}\n\nArketipe Presiden: ${context.profile}`;
    if (context.recentEvent) {
      userPrompt += `.\nKeputusan terakhir Presiden: "${context.recentEvent}"]`;
    } else {
      userPrompt += `]`;
    }

    return {
      system: systemPromptWithTone,
      user: userPrompt.trim()
    };
  }
}
