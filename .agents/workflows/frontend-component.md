---
description: Standar pengembangan komponen UI premium dengan Framer Motion & Tailwind.
---

# 🎨 Workflow: Pengembangan Komponen UI

Gunakan alur ini untuk mencapai standar "Premium UI/UX":

1.  **Atomic Structure**: Pecah UI menjadi bagian terkecil (Card, Indicator, Button).
2.  **Glassmorphism Setup**:
    - Gunakan `backdrop-blur-md`.
    - Gunakan border semi-transparan (`border-white/20`).
    - Gunakan degradasi warna HSL (bukan RGB murni).
3.  **Animation Orchestration**:
    - Gunakan `AnimatePresence` dari Framer Motion.
    - Set `initial`, `animate`, dan `exit` states.
    - Gunakan `spring` physics untuk rasa yang "organik".
4.  **Verification**: 
    - Cek responsivitas di ukuran layar 360px (Mobile) dan 1440px (Desktop).
    - Cek kontras warna untuk aksesibilitas (WCAG Standard).
