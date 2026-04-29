import { CreateWebWorkerMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

/**
 * @interface IAIService
 * @description Abstraksi untuk layanan AI (DIP).
 */
export interface IAIService {
  init(onProgress: (p: number) => void): Promise<void>;
  analyze(prompt: string): Promise<string>;
}

/**
 * @class WebLLMService
 * @description Implementasi WebLLM mengikuti prinsip SOLID.
 * SRP: Khusus menangani siklus hidup model dan inferensi.
 */
export class WebLLMService implements IAIService {
  private engine: MLCEngine | null = null;
  private modelId = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

  async init(onProgress: (p: number) => void): Promise<void> {
    if (this.engine) return;
    
    this.engine = await CreateWebWorkerMLCEngine(
      new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }),
      this.modelId,
      {
        initProgressCallback: (report) => {
          onProgress(Math.round(report.progress * 100));
        },
      }
    );
  }

  async analyze(prompt: string): Promise<string> {
    if (!this.engine) throw new Error("AI Engine not initialized");
    
    const messages = [
      { role: "system", content: "Anda adalah analis hukum dan moral untuk Presiden." },
      { role: "user", content: prompt }
    ];

    const reply = await this.engine.chat.completions.create({
      messages: messages as any,
      temperature: 0.7,
    });

    return reply.choices[0].message.content || "";
  }
}
