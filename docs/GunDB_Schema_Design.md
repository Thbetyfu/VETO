Dokumen ini menjelaskan arsitektur **P2P Graph** yang digunakan untuk VETO. GunDB dipilih karena sifatnya yang *offline-first* dan tidak memerlukan server pusat (Decentralized).

---

## 1. Global Graph Structure
Data dibagi menjadi beberapa *root nodes* utama:

### A. `veto/scenarios` (Content Library)
Kumpulan kartu skenario yang disinkronkan secara global.
- **Key**: Scenario ID (e.g., `SCN-001`)
- **Value**: Scenario Object (Metadata & Options)

### B. `veto/users` (Player States)
Berisi data anonim pemain yang disinkronkan untuk statistik.
- **Node**: `user_id` (DIDs)
- **Properties**:
    - `current_stats`: { law, humanity, order, budget }
    - `day_count`: Integer
    - `history`: Linked list of [ScenarioID, ChoiceIndex]

### C. `veto/global_stats` (Collective Intelligence)
Node agregasi untuk fitur perbandingan keputusan.
- **Key**: `choice_stats/[ScenarioID]/[ChoiceIndex]`
- **Value**: Counter (Integer) yang bertambah setiap kali pemain memilih opsi tersebut.

---

## 2. Mekanisme Sinkronisasi (P2P Handshake)
1.  **Local Write**: Setiap keputusan ditulis ke `localStorage/IndexedDB` melalui GunDB secara instan (Zero Latency).
2.  **Gossip Protocol**: Saat perangkat terdeteksi *online*, GunDB akan melakukan *push/pull* ke node/relay terdekat.
3.  **Conflict Resolution**: GunDB menggunakan algoritma HAM (Hypothetical Arrival Matrix) untuk menangani konflik data jika ada dua perubahan di waktu yang sama.

---

## 3. Implementasi Kode Dasar (Snippet)

```javascript
import Gun from 'gun';
const gun = Gun(['https://relay-peer.yourdomain.com/gun']);

// Menyimpan keputusan pemain
const saveDecision = (userId, scenarioId, choiceIndex) => {
  const user = gun.get('veto/users').get(userId);
  
  // Update history
  user.get('history').set({
    scenario: scenarioId,
    choice: choiceIndex,
    timestamp: Date.now()
  });

  // Update Global Counter
  gun.get('veto/global_stats')
     .get('choice_stats')
     .get(scenarioId)
     .get(choiceIndex)
     .set(prev => (prev || 0) + 1);
};
```

---

## 4. Keuntungan Arsitektur Ini
*   **Privacy-First**: Data pemain tidak perlu disimpan di server pusat milik perusahaan.
*   **Zero Infrastructure Cost**: Tidak perlu menyewa database SQL/NoSQL mahal saat pengguna membludak.
*   **Resilience**: Game tetap bisa dimainkan di daerah dengan koneksi internet buruk (pelosok sekolah).
