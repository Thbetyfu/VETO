---
description: Alur penambahan skenario hukum baru ke dalam sistem JUSTICE CORE.
---

# 📝 Workflow: Penambahan Skenario Baru

Ikuti langkah-langkah ini untuk menjaga konsistensi data dan narasi:

1.  **Identifikasi Isu**: Cari berita atau isu hukum terkini (Gunakan skill `Narrative Engine`).
2.  **Verifikasi Hukum**: Cari landasan hukum/pasal yang sesuai.
3.  **Drafting JSON**:
    - Buka `scenarios/initial_batch.json`.
    - Tambahkan objek baru dengan UUID unik.
    - Tentukan dampak pada 4 pilar (skala -30 s/d +30).
4.  **Uji Logika Graf**:
    - Pastikan `next_node` diarahkan ke ID yang valid atau set ke `DYNAMIC_NEXT`.
5.  **Audit Narasi**: Baca ulang narasi dengan perspektif siswa SMP/SMA. Apakah terlalu sulit? Apakah terlalu menggurui?
6.  **Commit & Sync**: Simpan file dan verifikasi di browser emulator.
