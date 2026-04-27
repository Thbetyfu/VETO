---
description: Alur otomatisasi sinkronisasi berita dari Scraper ke GunDB Master Graph.
---

# 🌐 Workflow: Reality Sync (Live Update)

Alur untuk mengaktifkan "Live Intelligence" dalam game:

1.  **Data Extraction**: Run scraper script pada sumber berita terpercaya.
2.  **AI Sanitization**:
    - Kirim teks berita ke LLM.
    - Minta LLM menghasilkan format JSON sesuai standar `Master_Scenario_Framework`.
3.  **Conflict Check**:
    - Gunakan `gun.get('justice/scenarios').get(id).once()` untuk memastikan skenario belum ada.
4.  **Graph Injection**: 
    - Masukkan data baru ke node `justice/scenarios`.
    - Trigger notifikasi "New Crisis Available" pada aplikasi client.
5.  **Peer Propagation**: Tunggu data menyebar ke relay peers.
