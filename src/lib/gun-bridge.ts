import Gun from 'gun';
import { Impact } from '../types/scenario';

/**
 * @file gun-bridge.ts
 * @description Inisialisasi GunDB untuk VETO (TypeScript Version).
 * Mendukung penyimpanan lokal (Radisk) dan sinkronisasi P2P Global.
 */

// Konfigurasi Relay Peers - Menggunakan Manhattan sebagai default P2P Mesh
const peers = [
  'https://gun-manhattan.herokuapp.com/gun',
];

const gun = Gun({
  peers: peers,
  localStorage: false, 
});

export const db = gun;

/**
 * Interface untuk Warisan (Legacy) Presiden di Hall of Fame
 */
export interface PresidentLegacy {
  id: string;
  playerName: string;
  day: number;
  reason: string;
  finalStats: Impact;
  timestamp: number;
  profile: string; // Misal: "Pragmatik-Humanis"
}

/**
 * Menyimpan warisan Presiden ke dalam Hall of Fame Global (P2P)
 */
export const saveLegacy = (legacy: PresidentLegacy) => {
  const hallOfFame = db.get('veto/hall_of_fame');
  hallOfFame.get(legacy.id).put({
    ...legacy,
    finalStats: JSON.stringify(legacy.finalStats) // GunDB prefer flat objects or stringified for complex ones
  });
};

/**
 * Mengambil 10 Warisan Presiden terbaru dari jaringan P2P
 */
export const getHallOfFame = (callback: (legacies: PresidentLegacy[]) => void) => {
  const legacies: PresidentLegacy[] = [];
  db.get('veto/hall_of_fame').map().once((data, id) => {
    if (data && data.playerName) {
      legacies.push({
        ...data,
        id,
        finalStats: typeof data.finalStats === 'string' ? JSON.parse(data.finalStats) : data.finalStats,
        timestamp: Number(data.timestamp)
      });
      // Sort by day (longest survival) or timestamp
      const sorted = [...legacies].sort((a, b) => b.day - a.day).slice(0, 10);
      callback(sorted);
    }
  });
};

export default gun;
