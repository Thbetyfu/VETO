---
name: P2P Architecture
description: Penguasaan sistem desentralisasi GunDB untuk sinkronisasi data tanpa server pusat.
---

# 🏗️ P2P Architecture Skill

Skill ini memastikan integritas data dalam jaringan JUSTICE CORE yang tidak tersentralisasi.

## 🎯 Fokus Utama
1.  **Offline-First**: Pastikan aplikasi tetap fungsional 100% meskipun tanpa internet setelah loading awal.
2.  **Conflict Resolution**: Gunakan logika GunDB untuk menangani tabrakan data antar peers.
3.  **Data Privacy**: Implementasikan enkripsi sisi klien jika diperlukan di masa depan, saat ini fokus pada anonimitas.

## 🛠️ Aturan Implementasi
- Gunakan `src/lib/gun-bridge.js` sebagai single source of truth untuk interaksi database.
- Hindari ketergantungan pada server SQL atau REST API tradisional.
- Optimasi penyimpanan di IndexedDB untuk kartu skenario yang besar.
