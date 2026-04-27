# VETO: Hukum & Moral (President Simulator)

**President Simulator** adalah sebuah permainan simulasi berbasis web (PWA) yang dirancang khusus untuk siswa SMP dan SMA. Dalam game ini, pemain berperan sebagai Presiden yang baru dilantik dan harus membuat keputusan-keputusan krusial di bidang hukum dan moral untuk menjaga stabilitas negara.

## 🌟 Visi Proyek
Mengubah pembelajaran hukum yang kaku menjadi pengalaman interaktif yang menantang. Pemain tidak hanya menghafal pasal, tetapi merasakan dampak nyata dari penegakan atau pelanggaran hukum terhadap masyarakat, ekonomi, dan konstitusi.

## 🎮 Mekanisme Permainan
* **Roleplay Kepresidenan:** Dimulai dari hari pertama menjabat dengan berbagai krisis warisan.
* **Sistem Pilihan Ganda (2x2):** Setiap kartu skenario memiliki 4 opsi kebijakan:
    * **Legalistik:** Berdasarkan UUD dan aturan formal.
    * **Humanis:** Berdasarkan empati dan kesejahteraan rakyat.
    * **Politis:** Mencari kompromi dan harmoni sosial.
    * **Praktis:** Solusi cepat dan tegas namun berisiko.
* **Manajemen Waktu:** Skor tertinggi ditentukan oleh berapa lama (hari/bulan) pemain bisa bertahan menjabat sebelum terjadi pemakzulan atau krisis nasional.

## 📊 Indikator Utama (Dashboard)
Pemain harus menyeimbangkan 4 pilar utama agar tidak *Game Over*:
1.  **⚖️ Konstitusi (Law):** Kepatuhan terhadap aturan negara.
2.  **👥 Rakyat (Humanity):** Tingkat kebahagiaan dan kepercayaan publik.
3.  **🛡️ Stabilitas (Order):** Keamanan nasional dan ketertiban.
4.  **📉 Ekonomi (Budget):** Kesehatan kas negara.

## 📚 Dampak Edukasi
* Meningkatkan literasi hukum siswa melalui simulasi kasus nyata (Bullying, Korupsi, Hak Cipta, dll).
* Melatih kemampuan berpikir kritis dan pengambilan keputusan di area abu-abu (moralitas).
* Membangun kesadaran akan tanggung jawab kolektif dalam sebuah negara hukum.

## 🚀 Cara Bermain (Development)
1. Buka aplikasi via browser.
2. Baca laporan dari menteri atau ajudan.
3. Pilih satu dari empat kebijakan yang tersedia.
4. Perhatikan perubahan indikator dan pelajari dasar hukum dari pilihanmu.
5. Bertahanlah selama mungkin!

## 🌐 Arsitektur Web 4.0 (P2P & Local Intelligence)
Berbeda dengan aplikasi tradisional, platform ini beroperasi sepenuhnya di sisi klien (Client-Side):

### 1. Desentralisasi Data (GunDB)
Aplikasi menggunakan **GunDB** untuk penyimpanan data yang terdesentralisasi:
* **P2P Synchronization:** Progres permainan dan *High Score* disinkronkan langsung antar browser pengguna menggunakan protokol *peer-to-peer*.
* **No Central Server:** Tidak menggunakan Firebase atau MySQL. Data hidup dalam jaringan terdistribusi.
* **Local-First:** Data disimpan di penyimpanan lokal browser (IndexedDB) dan akan menyinkron saat terhubung ke jaringan.

### 2. Kecerdasan Lokal (WebLLM)
* **On-Device AI:** Analisis profil kepribadian dan narasi dinamis diproses menggunakan model bahasa (SLM) yang berjalan langsung di browser via WebGPU.
* **Offline Capability:** Setelah pemuatan awal, seluruh sistem kecerdasan dapat berjalan tanpa koneksi internet.

### 3. Distributed Deployment
* Aplikasi didistribusikan melalui **IPFS (InterPlanetary File System)** untuk mencegah sensor dan menjamin ketersediaan konten secara permanen.

## 🛠️ Tech Stack
* **Core:** React.js / Vite
* **P2P Database:** GunDB (Graph-based, Decentralized)
* **In-Browser AI:** WebLLM / Transformers.js
* **Styling & UI:** Tailwind CSS & Framer Motion
* **Identity:** Decentralized Identifiers (DIDs) untuk profil anonim siswa.
