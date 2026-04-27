---
name: Local AI Optimization
description: Optimasi model SLM (Phi-3) menggunakan WebLLM agar berjalan mulus di browser.
---

# 🤖 Local AI Optimization Skill

Skill ini menangani segala aspek kecerdasan buatan yang diproses langsung di perangkat pengguna (On-Device).

## 🎯 Fokus Utama
1.  **WebGPU Performance**: Memastikan model AI menggunakan hardware acceleration jika tersedia.
2.  **Resource Management**: Mencegah kebocoran memori (Memory Leak) saat memuat model AI yang besar.
3.  **Hot-Swap Logic**: Mengatur transisi mulus dari logika *heuristic* ke logika AI tanpa disadari pengguna.

## 🛠️ Aturan Implementasi
- Selalu gunakan `Background Loading` untuk mengunduh model.
- Pantau penggunaan VRAM agar tidak mengganggu performa rendering UI.
- Implementasikan fallback jika WebGPU tidak tersedia di perangkat siswa.
