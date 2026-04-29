# 🏛️ VETO: Spesifikasi Teknis & Visi Nasional

## 🌟 Visi Utama: "No Student Left Behind"
VETO didesain sebagai infrastruktur pendidikan hukum dan moral yang inklusif untuk seluruh siswa di Indonesia. Prinsip utama kami adalah memastikan bahwa perbedaan kualitas perangkat keras tidak menjadi penghalang bagi siswa untuk mendapatkan kualitas pembelajaran yang sama.

---

## 🏗️ Arsitektur Sistem
VETO menggunakan pendekatan **Decentralized Edge Computing**:
1.  **Local Intelligence**: Menggunakan WebLLM untuk menjalankan model AI (Phi-3) langsung di browser tanpa server pusat.
2.  **P2P Networking**: Menggunakan GunDB untuk sinkronisasi data antar siswa secara terdesentralisasi.
3.  **Client-Side Processing**: Seluruh logika simulasi dijalankan di perangkat pengguna, menjamin privasi data 100%.

---

## 💻 Spesifikasi Perangkat

### 1. Mode Premium (AI-Enhanced)
*Untuk pengalaman penuh dengan generator narasi dinamis.*
- **Browser**: Chrome 113+, Edge 113+, atau browser berbasis Chromium terbaru dengan dukungan **WebGPU**.
- **RAM**: Minimal 8GB (Dekompresi model AI membutuhkan memori yang cukup).
- **GPU**: Kartu grafis terintegrasi (Intel Iris Xe, Radeon Graphics) atau Dedicated GPU.
- **Penyimpanan**: Ruang kosong 2GB untuk caching model AI.

### 2. Mode Lite (Adaptive Engine)
*Untuk perangkat dengan spesifikasi terbatas (Laptop Sekolah/ChromeBook).*
- **Browser**: Browser modern apa pun (mendukung ES6+).
- **RAM**: Minimal 4GB.
- **Hardware**: Spesifikasi standar laptop sekolah.
- **Fitur**: Simulasi tetap berjalan 720 hari menggunakan pustaka skenario statis (tanpa generator AI prosedural).

---

## 🌐 Konektivitas & Aksesibilitas
- **Initial Setup**: Membutuhkan internet hanya untuk mengunduh aset dan model AI di awal (Hybrid-Offline).
- **Daily Usage**: 100% Offline Capability. Siswa bisa bermain di daerah tanpa internet setelah setup awal selesai.
- **Integration**: Tersedia sebagai iFrame embeddable untuk diintegrasikan ke dalam LMS sekolah (seperti Moodle, Google Classroom, atau Website Sekolah).

---

## 🛡️ Komitmen Privasi
Karena VETO tidak memiliki server pusat (Serverless), tidak ada data pribadi siswa yang dikirim ke pihak ketiga. Seluruh profil psikologis dan keputusan moral disimpan secara lokal atau disinkronkan melalui jalur enkripsi P2P.

---
**Antigravity Engine - VETO Project v2.1**
*Kecerdasan untuk Keadilan, Inovasi untuk Pendidikan.*
