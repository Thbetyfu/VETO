---
name: Tactical Operations
description: Protokol eksekusi perintah terminal dan manajemen workspace yang efisien.
---

# 🖥️ Tactical Operations Skill

Skill ini menjamin stabilitas lingkungan kerja Antigravity sesuai *Stability Protocol*.

## 🎯 Fokus Utama
1.  **Single Responsibility**: Satu terminal untuk satu jenis tugas (Server vs Script).
2.  **Auto-Kill Policy**: Jika proses `npm run dev` hang, segera kill dan restart.
3.  **Workspace Hygiene**: Hapus file temporary di `/tmp/` secara berkala.

## 🛠️ Aturan Implementasi
- Selalu laporkan `CommandId` dan status eksekusi terminal.
- Gunakan `SafeToAutoRun: true` hanya pada skrip yang sudah teruji.
- Lakukan pembersihan log yang terlalu panjang agar tidak membebani context window AI.
