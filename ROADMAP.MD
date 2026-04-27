# 🚀 Roadmap Pengembangan: President Simulator (Web 4.0)

Dokumen ini merangkum langkah strategis pengembangan **VETO: President Simulator**, sebuah platform pembelajaran hukum berbasis desentralisasi dan AI lokal.

---

## 🏛️ Milestone 1: Fondasi & Konten (Foundation)

### ~~Fase 1: Riset Konten & Master Scenario~~ ✅
*Menentukan kedalaman narasi dan validitas hukum.*
- [x] 5 skenario hukum awal ditulis (Batch 1: Korupsi, Siber, Pinjol, HAM, SDA).
- [x] Penyusunan pilihan ganda (2x2) dengan 4 pilar indikator.
- [x] Pemetaan referensi pasal hukum asli untuk setiap opsi.
- **Output**: 📄 ~~*Master Scenario Document*~~ → `scenarios/initial_batch.json` **DONE**

### ~~Fase 2: Perancangan Arsitektur Data (P2P Graph)~~ ✅
*Membangun sistem syaraf aplikasi menggunakan GunDB.*
- [x] Desain skema Graph untuk *Narrative Chain* (`veto/scenarios`, `veto/users`, `veto/global_stats`).
- [x] Implementasi bridge sinkronisasi (`src/lib/gun-bridge.js`).
- [x] Strategi penyimpanan *Local-First* di IndexedDB terdefinisi.
- **Output**: 🏗️ ~~*Decentralized Data Schema*~~ → `src/lib/gun-bridge.js` **DONE**

---

## ⚙️ Milestone 2: Core Engine & Experience (MVP)

### ~~Fase 3: Prototipe UI/UX (High-Fidelity)~~ ✅
*Membangun antarmuka yang membangkitkan wibawa kepresidenan.*
- [x] Stack: Vite + React + TypeScript + Tailwind v4 terkonfigurasi.
- [x] Glassmorphism card, ambient glow, Presidential dark palette diterapkan.
- [x] Framer Motion spring animations pada transisi kartu & stat bar.
- **Output**: 📱 ~~*Interactive Web App Prototipe*~~ → `localhost:3000` **LIVE**

### ~~Fase 4: Logic Engine (Phase 1 AI: Heuristics)~~ ✅
*Memastikan mekanik dasar berjalan tanpa beban komputasi besar.*
- [x] `useGameEngine` hook memuat skenario dari JSON secara dinamis.
- [x] Kalkulasi dampak 4 pilar (Law, Humanity, Order, Budget) dengan clamp.
- [x] Deteksi *Game Over* per pilar + layar akhir + mekanisme *Restart*.
- **Output**: 🎮 ~~*Alpha Playable Version*~~ → VETO **PLAYABLE** ✅

---

## 🧠 Milestone 3: Intelligent Distribution (Advanced)

### Fase 5: Integrasi WebLLM (Phase 2 AI: On-Device)
*Efek "Intelligence Upgrade" langsung di perangkat siswa.*
- [ ] Implementasi WebGPU adapter untuk model SLM (Phi-3-mini).
- [ ] Pengembangan *Adaptive Personality Analysis* di akhir sesi.
- [ ] Sinkronisasi *History Node* sebagai konteks memori AI.
- **Output**: 🤖 *AI-Powered Intelligence Layer*.

### Fase 6: "Instant Play" Protocol (UX Polish)
*Menghapus hambatan waktu tunggu (Latency Zero).*
- [ ] Pengembangan narasi *Prologue* sebagai pengalih background loading.
- [ ] Sistem *Hot-Swap Logic* dari Heuristic ke WebLLM.
- **Output**: ✨ *Seamless User Experience*.

### Fase 7: Deployment Desentralisasi (IPFS)
*Menjamin aplikasi tidak bisa dimatikan (Censorship-Resistant).*
- [ ] Upload aset ke IPFS Cluster.
- [ ] Konfigurasi Gateway dan IPNS untuk pembaruan konten.
- **Output**: 🌐 *Global CID (Content ID) Link*.

---

## 📈 Milestone 4: Scale & Impact (Launch)

### Fase 8: Beta Testing & Balancing
*Mencari keseimbangan antara tantangan dan edukasi.*
- [ ] Uji coba terbatas pada segmen siswa.
- [ ] Penyeimbangan tingkat kesulitan indikator (Balancing).
- **Output**: 💎 *Stable Release Candidate*.

### Fase 9: Collective Impact & Global Stats
*Kekuatan statistik komunitas secara P2P.*
- [ ] Fitur statistik agregat via GunDB (Comparison Stats).
- [ ] Dashboard "Indeks Kesadaran Hukum" nasional.
- **Output**: 📊 *National Legal Dashboard*.

### Fase 10: Peluncuran & Ekosistem P5
*Integrasi ke kurikulum nasional.*
- [ ] Inisiasi kemitraan sekolah untuk modul P5 (Kurikulum Merdeka).
- [ ] Pembaruan skenario berkala via Live Global Graph.
- **Output**: 🚀 *Nationwide Educational Impact*.

---

> [!TIP]
> **Prinsip Professor**: "Jangan membangun sekadar kode, bangunlah sebuah sistem yang bernafas dan mendidik."