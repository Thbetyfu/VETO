---
name: Narrative Engine
description: Pedoman penulisan skenario hukum dan moral yang inklusif, akurat, dan berdampak bagi siswa.
---

# 📖 Narrative Engine Skill

Skill ini memberikan panduan kepada Antigravity untuk menciptakan konten instruksional yang menarik dalam simulasi ini.

## 🎯 Fokus Utama
1.  **Akurasi Hukum**: Setiap skenario wajib memiliki landasan hukum yang valid (UU, Pasal, atau Prinsip Hukum).
2.  **Dilema Abu-Abu**: Hindari pilihan yang jelas benar atau salah. Gunakan trade-off antara 4 pilar (⚖️ Law, 👥 Humanity, 🛡️ Order, 📉 Budget).
3.  **Tone & Diksi**: Gunakan bahasa yang "Presidential" namun tetap bisa dimengerti oleh siswa SMP/SMA.

## 🛠️ Aturan Implementasi
- Gunakan format JSON sesuai `docs/Master_Scenario_Framework.md`.
- Setiap narasi harus memicu rasa tanggung jawab pemain (Sense of Agency).
- Selalu sisipkan "Legal Basis" sebagai elemen edukasi yang tidak menggurui.

## 🤖 Definisi AI Agent: Editor (Fase 7)
Agen Editor beroperasi di bawah prinsip *Narrative Engine*.
- **Role**: Penulis Skenario / Editor Sastra.
- **Tugas**: Mengubah 3 poin dampak logis (dari Drafter) menjadi 2 paragraf narasi sinematik yang emosional.
- **Keunggulan**: Kualitas tulisan premium, fokus penuh pada merangkai kata dan emosi tanpa terbebani tugas komputasi logika (sudah ditangani Drafter).
- **Prompt Dasar**: "Kamu adalah penulis skenario. Ubah 3 poin dampak ini menjadi 2 paragraf narasi sinematik yang emosional." (Akan digabungkan dengan *Tonal Map* dari UI).
