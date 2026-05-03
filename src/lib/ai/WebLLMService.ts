import { CreateWebWorkerMLCEngine, MLCEngine } from "@mlc-ai/web-llm";
import { PromptBuilder, ScenarioContext } from "./PromptBuilder";

/**
 * @interface NarrativeResponse
 * @description Fase 4: Struktur output AI yang diwajibkan melalui CoT.
 */
export interface NarrativeResponse {
  analisis_situasi: string;
  narasi_final: string;
}

/**
 * @interface IAIService
 * @description Abstraksi untuk layanan AI (DIP).
 */
export interface IAIService {
  init(onProgress: (p: number) => void): Promise<void>;
  analyze(input: string | ScenarioContext): Promise<NarrativeResponse | string>;
  generateRollingSummary(pastEvents: string[]): Promise<string>;
  chatRaw(messages: any[], options?: any): Promise<string>;
  chatStream(messages: any[], onToken: (token: string, fullText: string) => void, options?: any): Promise<string>;
}

/**
 * @class WebLLMService
 * @description Implementasi WebLLM mengikuti prinsip SOLID.
 * SRP: Khusus menangani siklus hidup model dan inferensi.
 */
export class WebLLMService implements IAIService {
  private engine: any | null = null;
  private modelId = "SmolLM-135M-Instruct-v0.2-q4f16_1-MLC";

  async init(onProgress: (p: number) => void): Promise<void> {
    console.log("[VETO AI] Starting MLCEngine initialization with model:", this.modelId);
    
    try {
      this.engine = await CreateWebWorkerMLCEngine(
        new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }),
        this.modelId,
        {
          initProgressCallback: (report) => {
            console.log("[VETO AI] Progress:", report.text);
            onProgress(Math.round(report.progress * 100));
          },
        }
      );
      console.log("[VETO AI] MLCEngine ready.");
    } catch (e) {
      console.error("[VETO AI] MLCEngine init failed:", e);
      throw e;
    }
  }

  async analyze(input: string | ScenarioContext): Promise<NarrativeResponse | string> {
    if (!this.engine) throw new Error("AI Engine not initialized");
    
    const { system, user } = PromptBuilder.build(input);

    const messages = [
      { role: "system", content: system },
      { role: "user", content: user }
    ];

    // Fase 5: Tuning Parameter Inferensi
    const reply = await this.engine.chat.completions.create({
      messages: messages as any,
      temperature: 0.8, // Kreativitas lebih tinggi
      frequency_penalty: 1.15, // Mencegah pengulangan kosakata
    });

    const rawText = reply.choices[0].message.content || "";
    
    // Jika input adalah rutinitas, return raw string (JSON) karena PromptBuilder khusus Routine.
    if (typeof input !== 'string' && input.isRoutine) {
      return rawText;
    }

    return this.parseLLMResponse(rawText);
  }

  async generateRollingSummary(pastEvents: string[]): Promise<string> {
    if (!this.engine) throw new Error("AI Engine not initialized");

    const prompt = `Rangkum ${pastEvents.length} kejadian terakhir ini menjadi 1 paragraf singkat yang fokus pada dampak politik dan status pemain:\n\n` + pastEvents.map((e, i) => `${i+1}. ${e}`).join("\n");

    const messages = [
      { 
        role: "system", 
        content: "Anda adalah Sekretaris Kabinet Senior. Rangkum peristiwa dengan bahasa formal, panjang, dan diplomatis (BUREAUCRATIC tone). Fokus pada implikasi kebijakan dan stabilitas negara." 
      },
      { role: "user", content: prompt }
    ];

    const reply = await this.engine.chat.completions.create({
      messages: messages as any,
      temperature: 0.5, // Ringkasan butuh konsistensi, bukan kreativitas
    });

    return reply.choices[0].message.content || "";
  }

  async chatRaw(messages: any[], options: any = {}): Promise<string> {
    if (!this.engine) throw new Error("AI Engine not initialized");
    const reply = await this.engine.chat.completions.create({
      messages: messages,
      temperature: options.temperature ?? 0.7,
      frequency_penalty: options.frequency_penalty ?? 1.0,
      ...options
    });
    return reply.choices[0].message.content || "";
  }

  /**
   * chatStream (Fase 11): Inferensi dengan mode streaming untuk UI responsif.
   */
  async chatStream(messages: any[], onToken: (token: string, fullText: string) => void, options: any = {}): Promise<string> {
    if (!this.engine) throw new Error("AI Engine not initialized");
    
    const chunks = await this.engine.chat.completions.create({
      messages: messages,
      temperature: options.temperature ?? 0.7,
      stream: true, // AKTIFKAN STREAMING
      ...options
    });

    let fullText = "";
    for await (const chunk of chunks) {
      const token = chunk.choices[0]?.delta.content || "";
      fullText += token;
      onToken(token, fullText);
    }

    return fullText;
  }

  private parseLLMResponse(rawText: string): NarrativeResponse | string {
    try {
      const jsonStr = rawText.replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);
      if (data.narasi_final) {
        return data as NarrativeResponse;
      }
      return rawText; // Fallback ke raw text jika JSON tidak valid sesuai format
    } catch (e) {
      console.warn("[WebLLMService] Failed to parse JSON, returning raw text", e);
      return rawText;
    }
  }
}
