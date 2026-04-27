import Gun from 'gun';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rql';

/**
 * @file gun-bridge.js
 * @description Inisialisasi GunDB untuk VETO.
 * Mendukung penyimpanan lokal (IndexedDB) dan sinkronisasi P2P.
 */

// Konfigurasi Relay Peers (Bisa ditambahkan lebih banyak untuk redundansi)
const peers = [
  'https://gun-manhattan.herokuapp.com/gun',
  // 'https://your-custom-relay.com/gun'
];

const gun = Gun({
  peers: peers,
  localStorage: false, // Kita gunakan Radisk untuk performa lebih baik
});

export const db = gun;

/**
 * Utility untuk menyimpan progres pemain secara terdesentralisasi
 * @param {string} userId - DID atau ID unik pemain
 * @param {object} stats - { law, humanity, order, budget }
 */
export const syncPlayerStats = (userId, stats) => {
  const playerNode = db.get('veto/users').get(userId);
  playerNode.get('current_stats').put(stats);
  
  // Mencatat timestamp aktivitas terakhir
  playerNode.put({ last_seen: Date.now() });
};

/**
 * Mencatat keputusan global secara anonim untuk statistik nasional
 * @param {string} scenarioId 
 * @param {number} choiceIndex 
 */
export const recordGlobalChoice = (scenarioId, choiceIndex) => {
  const statsNode = db.get('veto/global_stats').get('choices').get(scenarioId);
  
  // Increment counter menggunakan sistem Gun.node()
  statsNode.get(choiceIndex).once((val) => {
    statsNode.get(choiceIndex).put((val || 0) + 1);
  });
};

export default gun;
