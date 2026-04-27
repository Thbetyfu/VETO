# 📄 Master Scenario Framework (Fase 1)

Dokumen ini mendefinisikan struktur data untuk setiap kartu skenario dalam **VETO**. Setiap kartu harus memiliki keseimbangan antara narasi emosional dan konsekuensi teknis.

---

## 1. Struktur Data Kartu (JSON Schema)
Setiap skenario direpresentasikan sebagai node dalam graf dengan struktur berikut:

```json
{
  "id": "SCN-001",
  "title": "Krisis Limbah di Sungai Citarum",
  "narrative": "Laporan intelijen menunjukkan sebuah pabrik besar membuang limbah kimia langsung ke sungai. Rakyat mulai protes, namun pabrik tersebut adalah penyumbang ekonomi terbesar di daerah tersebut.",
  "context_tags": ["Environment", "Economy", "Law Enforcement"],
  "options": [
    {
      "label": "Tutup Pabrik Seketika (Legalistik)",
      "impact": { "law": +15, "humanity": +10, "order": -5, "budget": -20 },
      "legal_basis": "UU No. 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup.",
      "next_node": "SCN-001-A"
    },
    {
      "label": "Berikan Denda & Rehabilitasi (Politis)",
      "impact": { "law": +5, "humanity": +5, "order": +5, "budget": +10 },
      "legal_basis": "Prinsip Restorative Justice & Sanksi Administratif.",
      "next_node": "SCN-001-B"
    },
    {
      "label": "Abaikan demi Ekonomi (Praktis)",
      "impact": { "law": -20, "humanity": -15, "order": +10, "budget": +25 },
      "legal_basis": "Risiko Pelanggaran Konstitusi Pasal 28H ayat 1.",
      "next_node": "SCN-001-C"
    },
    {
      "label": "Relokasi Penduduk Hilir (Humanis)",
      "impact": { "law": -5, "humanity": +20, "order": +5, "budget": -30 },
      "legal_basis": "Kewajiban Negara dalam Perlindungan Warga Negara.",
      "next_node": "SCN-001-D"
    }
  ]
}
```

---

## 2. Metodologi Penulisan Skenario
1.  **Dilema Moral**: Pilihan tidak boleh benar/salah secara absolut. Harus ada *trade-off* (pengorbanan).
2.  **Bahasa Adaptif**: Gunakan diksi yang dimengerti siswa SMP/SMA (menghindari jargon hukum yang terlalu kering).
3.  **Visual Cue**: Gunakan emoji untuk mengidentifikasi pilar yang terpengaruh (⚖️, 👥, 🛡️, 📉).

---

## 3. Checklist Target Skenario (Batch 1)
- [ ] 10 Kasus Korupsi & Integritas.
- [ ] 10 Kasus Hak Asasi Manusia & Lingkungan.
- [ ] 10 Kasus Keamanan Digital & ITE.
- [ ] 10 Kasus Keadilan Sosial & Ekonomi.
- [ ] 10 Kasus Kebebasan Berpendapat.
