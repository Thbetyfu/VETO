import { useState, useCallback, useRef } from 'react';
import type { AIStatus, AIFeedbackData, ScenarioOption, Impact } from '../types/scenario';

/**
 * @hook useWebLLM
 * @description Mengelola lifecycle model AI (WebLLM) secara penuh.
 * MENGAPA: Kita isolasi semua logika AI agar useGameEngine tetap bersih
 * dan tidak menanggung beban async model loading. Hot-Swap terjadi di sini.
 *
 * Strategi:
 * 1. Model dimuat di background saat app pertama dibuka (Opportunistic Loading).
 * 2. Jika WebGPU tidak tersedia, kita fallback ke heuristic lokal (No Crash Policy).
 * 3. `generateFeedback` menghasilkan komentar berbasis konteks keputusan & riwayat.
 */

const MODEL_ID = 'Phi-3.5-mini-instruct-q4f16_1-MLC';

export const useWebLLM = () => {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [loadProgress, setLoadProgress] = useState(0);
  const [feedback, setFeedback] = useState<AIFeedbackData | null>(null);
  // Ref untuk engine — tidak perlu re-render saat berubah
  const engineRef = useRef<any>(null);

  /**
   * Memulai pengunduhan model di background.
   * Dipanggil sekali saat App mount — tidak memblokir UI.
   */
  const initModel = useCallback(async () => {
    if (status !== 'idle') return;

    // PRE-FLIGHT CHECK: Jangan muat library berat jika GPU tidak ada (Optimasi Kecepatan)
    if (!navigator.gpu) {
      console.warn('[VETO AI] WebGPU tidak tersedia di browser ini. Fallback Heuristic aktif.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      // Dynamic import agar bundle awal tetap ringan
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm');

      engineRef.current = await CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (progress: { progress: number }) => {
          setLoadProgress(Math.round(progress.progress * 100));
        },
      });

      setStatus('ready');
      setLoadProgress(100);
    } catch (err) {
      console.warn('[VETO AI] Gagal menginisialisasi engine AI.', err);
      setStatus('error');
    }
  }, [status]);

  /**
   * Membangun prompt kontekstual dan menghasilkan analisis moral dari AI.
   * Fallback ke heuristic lokal jika model belum siap (zero crash).
   */
  const generateFeedback = useCallback(async (
    lastChoice: ScenarioOption,
    stats: Impact,
    dayCount: number,
    historyCount: number,
  ): Promise<void> => {
    // Fallback heuristic jika AI belum siap
    if (!engineRef.current || status !== 'ready') {
      setFeedback(buildHeuristicFeedback(stats, lastChoice));
      return;
    }

    setStatus('generating');
    setFeedback(null);

    const prompt = buildPrompt(lastChoice, stats, dayCount, historyCount);

    try {
      const reply = await engineRef.current.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'Kamu adalah Rakyat Indonesia yang kritis namun bijak. Berikan komentar singkat (2-3 kalimat) dalam Bahasa Indonesia atas keputusan Presiden berdasarkan konteks yang diberikan. Akhiri dengan satu kata label kepemimpinan (misal: "Pragmatis", "Humanis", "Otoritarian").',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 120,
        temperature: 0.8,
      });

      const raw = reply.choices[0]?.message?.content ?? '';
      setFeedback(parseFeedback(raw, stats));
    } catch (err) {
      console.error('[VETO AI] Error generation:', err);
      setFeedback(buildHeuristicFeedback(stats, lastChoice));
    } finally {
      setStatus('ready');
    }
  }, [status]);

  return { status, loadProgress, feedback, initModel, generateFeedback, clearFeedback: () => setFeedback(null) };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Membangun prompt yang kaya konteks untuk AI.
 * MENGAPA: Prompt yang spesifik menghasilkan output yang jauh lebih relevan
 * daripada prompt generik — ini adalah kunci kualitas analisis.
 */
const buildPrompt = (
  choice: ScenarioOption,
  stats: Impact,
  day: number,
  total: number,
): string => `
Hari ke-${day}, Presiden telah membuat ${total} keputusan.
Keputusan terakhir: "${choice.label}".
Dasar hukum yang dipilih: ${choice.legal_basis}
Status indikator saat ini — Law: ${stats.law}/100, Rakyat: ${stats.humanity}/100, Stabilitas: ${stats.order}/100, Anggaran: ${stats.budget}/100.
Berikan penilaian singkat kamu sebagai rakyat atas keputusan ini.
`.trim();

/**
 * Fallback heuristic — menghasilkan feedback tanpa model AI.
 * Dipakai saat model belum selesai dimuat atau WebGPU tidak tersedia.
 */
const buildHeuristicFeedback = (stats: Impact, choice: ScenarioOption): AIFeedbackData => {
  const avgStat = (stats.law + stats.humanity + stats.order + stats.budget) / 4;
  if (avgStat >= 70) {
    return { tone: 'praise', message: `Keputusan "${choice.label}" mendapat apresiasi luas. Kepemimpinan Anda terjaga.`, moralProfile: 'Stabilisator' };
  } else if (avgStat >= 45) {
    return { tone: 'neutral', message: `Rakyat masih menimbang keputusan "${choice.label}". Konsistensi diperlukan.`, moralProfile: 'Pragmatik' };
  } else {
    return { tone: 'critique', message: `Keputusan "${choice.label}" menuai kritik keras. Kepercayaan publik menurun drastis.`, moralProfile: 'Kontroversial' };
  }
};

/**
 * Mem-parsing teks mentah dari AI menjadi struktur AIFeedbackData.
 * MENGAPA: Output LLM tidak selalu terstruktur — kita butuh lapisan normalisasi.
 */
const parseFeedback = (raw: string, stats: Impact): AIFeedbackData => {
  const avgStat = (stats.law + stats.humanity + stats.order + stats.budget) / 4;
  const tone: AIFeedbackData['tone'] = avgStat >= 65 ? 'praise' : avgStat >= 40 ? 'neutral' : 'critique';

  // Ambil kata terakhir sebagai label profil moral
  const words = raw.trim().split(/\s+/);
  const moralProfile = words[words.length - 1].replace(/[^a-zA-Z\u00C0-\u024F]/g, '') || 'Pragmatik';

  return { tone, message: raw.trim(), moralProfile };
};
