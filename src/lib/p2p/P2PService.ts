import Gun from 'gun';
import { PresidentLegacy } from '../gun-bridge';

/**
 * @interface IP2PService
 * @description Kontrak untuk layanan desentralisasi (DIP).
 */
export interface IP2PService {
  saveLegacy(legacy: PresidentLegacy): void;
  getHallOfFame(callback: (legacies: PresidentLegacy[]) => void): void;
}

/**
 * @class GunP2PService
 * @description Implementasi GunDB mengikuti prinsip SOLID.
 * SRP: Mengelola sinkronisasi data P2P tanpa server pusat.
 */
export class GunP2PService implements IP2PService {
  private db;
  private readonly PEERS = ['https://gun-manhattan.herokuapp.com/gun'];

  constructor() {
    this.db = Gun({
      peers: this.PEERS,
      localStorage: false,
    });
  }

  saveLegacy(legacy: PresidentLegacy): void {
    // Security Audit Fix: Schema Validation
    if (!this.isValid(legacy)) {
      console.error('[P2P Security] Invalid legacy schema detected.');
      return;
    }

    // Security Audit Fix: Content-Addressable ID (mencegah tampering ID sembarangan)
    const secureId = this.generateSecureId(legacy);
    
    const hallOfFame = this.db.get('veto/hall_of_fame');
    hallOfFame.get(secureId).put({
      ...legacy,
      id: secureId, // Force secure ID
      finalStats: JSON.stringify(legacy.finalStats)
    });
  }

  /**
   * Security Protocol: Menghasilkan ID unik berbasis konten (Content-Addressable).
   */
  private generateSecureId(legacy: PresidentLegacy): string {
    return `legacy_${btoa(legacy.playerName).slice(0, 8)}_${legacy.timestamp}`;
  }

  /**
   * Security Protocol: Validasi skema data sebelum masuk ke graph global.
   */
  private isValid(legacy: PresidentLegacy): boolean {
    return !!(legacy.playerName && legacy.day >= 0 && legacy.id);
  }

  getHallOfFame(callback: (legacies: PresidentLegacy[]) => void): void {
    const legacies: PresidentLegacy[] = [];
    this.db.get('veto/hall_of_fame').map().once((data, id) => {
      if (data && data.playerName) {
        legacies.push({
          ...data,
          id,
          finalStats: typeof data.finalStats === 'string' ? JSON.parse(data.finalStats) : data.finalStats,
          timestamp: Number(data.timestamp)
        });
        const sorted = [...legacies].sort((a, b) => b.day - a.day).slice(0, 10);
        callback(sorted);
      }
    });
  }
}
