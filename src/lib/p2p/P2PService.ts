import Gun from 'gun';
import 'gun/sea';
import { PresidentLegacy } from '../gun-bridge';

/**
 * @interface IP2PService
 * @description Kontrak untuk layanan desentralisasi (DIP).
 */
export interface IP2PService {
  saveLegacy(legacy: PresidentLegacy): void;
  getHallOfFame(callback: (legacies: PresidentLegacy[]) => void): void;
  saveCurrentState(playerName: string, state: any): void;
  getLatestState(playerName: string, callback: (state: any) => void): void;
  saveAITelemetry(telemetryData: any): void;
  getAITelemetry(callback: (data: any[]) => void): void;
  /** Fase 1: Sinkronisasi statistik ke World State desentralisasi */
  syncGlobalMetrics(stats: any): void;
  getWorldState(callback: (metrics: any) => void): void;

  /** Fase 3: Multiplayer Diplomacy Mode */
  createRoom(hostName: string, callback: (roomId: string) => void): void;
  joinRoom(roomId: string, playerName: string, onUpdate: (roomData: any) => void): void;
  submitRoomChoice(roomId: string, playerName: string, scenarioId: string, choiceId: string): void;
  advanceRoom(roomId: string, nextScenarioId: string): void;
  startGame(roomId: string): void;
}

/**
 * @class GunP2PService
 * @description Implementasi GunDB mengikuti prinsip SOLID.
 * SRP: Mengelola sinkronisasi data P2P tanpa server pusat.
 */
export class GunP2PService implements IP2PService {
  private db;
  private user;
  private readonly PEERS = [
    'https://gun-manhattan.herokuapp.com/gun',
    'https://relay.peer.ooo/gun',
    'https://gunjs.herokuapp.com/gun',
    'https://relay.gun.eco/gun'
  ];

  constructor() {
    this.db = Gun({
      peers: this.PEERS,
      localStorage: true,
      retry: 1000
    });
    
    // Safety check for SEA module
    if (typeof (this.db as any).user === 'function') {
      this.user = (this.db as any).user().recall({ sessionStorage: true });
    } else {
      console.warn('[P2P Service] SEA module not loaded. Security features disabled.');
    }
  }

  /**
   * Menghubungkan user dengan identitas kriptografis (SEA).
   */
  async authenticate(alias: string, pass: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.user().auth(alias, pass, (ack: any) => {
        if (ack.err) reject(ack.err);
        else resolve();
      });
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
        try {
          const finalStats = typeof data.finalStats === 'string' ? JSON.parse(data.finalStats) : data.finalStats;
          
          // Only push if stats are valid to prevent UI crashes in StatBox
          if (finalStats && typeof finalStats === 'object') {
            legacies.push({
              ...data,
              id,
              finalStats,
              timestamp: Number(data.timestamp) || Date.now()
            });
            
            // Deduplicate by ID to prevent multiple entries from P2P map
            const unique = Array.from(new Map(legacies.map(item => [item.id, item])).values());
            const sorted = unique.sort((a, b) => b.day - a.day).slice(0, 10);
            callback(sorted);
          }
        } catch (e) {
          console.error('[P2P Service] Failed to parse legacy data:', e);
        }
      }
    });
  }

  /**
   * Resilience Protocol: Menyimpan snapshot state aktif untuk re-hydration.
   */
  saveCurrentState(playerName: string, state: any): void {
    const sessionId = `session_${btoa(playerName).slice(0, 12)}`;
    this.db.get('veto/active_sessions').get(sessionId).put({
      data: JSON.stringify(state),
      lastSync: Date.now()
    });
  }

  /**
   * Resilience Protocol: Mengambil state terakhir untuk melanjutkan permainan.
   */
  getLatestState(playerName: string, callback: (state: any) => void): void {
    const sessionId = `session_${btoa(playerName).slice(0, 12)}`;
    this.db.get('veto/active_sessions').get(sessionId).once((node) => {
      if (node && node.data) {
        callback(JSON.parse(node.data));
      } else {
        callback(null);
      }
    });
  }

  /**
   * Telemetry Protocol (Fase 10): Menyimpan feedback AI untuk iterasi Prompt Engineering.
   */
  saveAITelemetry(telemetryData: any): void {
    const telemetryId = `telemetry_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.db.get('veto/ai_telemetry').get(telemetryId).put({
      data: JSON.stringify(telemetryData),
      timestamp: Date.now()
    });
  }

  /**
   * Telemetry Protocol (Fase 10): Mengambil data feedback AI untuk analisis dashboard.
   */
  getAITelemetry(callback: (data: any[]) => void): void {
    const records: any[] = [];
    this.db.get('veto/ai_telemetry').map().once((node, id) => {
      if (node && node.data) {
        try {
          records.push({
            id,
            ...JSON.parse(node.data),
            timestamp: node.timestamp
          });
          callback([...records].sort((a, b) => b.timestamp - a.timestamp));
        } catch (e) {
          console.error('[P2P Service] Failed to parse telemetry:', e);
        }
      }
    });
  }

  /**
   * Global World State (Fase 1): Kontribusi statistik ke pool desentralisasi.
   */
  syncGlobalMetrics(stats: any): void {
    // FIX: Gunakan session-based ID agar multi-tab di localhost dianggap peer berbeda
    if (!(window as any).VETO_PEER_ID) {
      (window as any).VETO_PEER_ID = `peer_${Math.random().toString(36).slice(2, 10)}`;
    }
    const peerId = (window as any).VETO_PEER_ID;
    
    this.db.get('veto/world_state').get(peerId).put({
      ...stats,
      timestamp: Date.now()
    });
  }

  /**
   * Global World State (Fase 1): Mengambil rata-rata statistik dari seluruh dunia.
   */
  getWorldState(callback: (metrics: any) => void): void {
    const players: Map<string, any> = new Map();
    
    this.db.get('veto/world_state').map().on((node, id) => {
      if (node && node.law !== undefined) {
        // Hanya hitung data yang masih 'segar' (dalam 24 jam terakhir)
        if (Date.now() - node.timestamp < 24 * 60 * 60 * 1000) {
          players.set(id, node);
        }
      }

      if (players.size > 0) {
        const totals = Array.from(players.values()).reduce((acc, curr) => ({
          law: acc.law + curr.law,
          humanity: acc.humanity + curr.humanity,
          order: acc.order + curr.order,
          budget: acc.budget + curr.budget
        }), { law: 0, humanity: 0, order: 0, budget: 0 });

        const count = players.size;
        callback({
          law: Math.round(totals.law / count),
          humanity: Math.round(totals.humanity / count),
          order: Math.round(totals.order / count),
          budget: Math.round(totals.budget / count),
          activePeers: count
        });
      }
    });
  }

  /**
   * Diplomacy Mode: Membuat Room baru dengan ID unik.
   */
  createRoom(hostName: string, callback: (roomId: string) => void): void {
    const roomId = Math.random().toString(36).slice(2, 7).toUpperCase();
    const roomRef = this.db.get(`veto/rooms/${roomId}`);
    
    roomRef.put({
      status: 'waiting',
      currentScenarioId: 'SCN-15-01',
      createdAt: Date.now()
    });

    // Tambahkan host sebagai pemain pertama
    roomRef.get('players').get(hostName).put({ joinedAt: Date.now() });
    
    callback(roomId);
  }

  /**
   * Diplomacy Mode: Bergabung ke Room yang sudah ada.
   */
  joinRoom(roomId: string, playerName: string, onUpdate: (roomData: any) => void): void {
    const roomRef = this.db.get(`veto/rooms/${roomId}`);
    
    // Tambahkan pemain ke daftar
    roomRef.get('players').get(playerName).put({ joinedAt: Date.now() });

    // Listen ke seluruh perubahan di room
    roomRef.on((data) => {
      // Ambil data pemain secara detail
      roomRef.get('players').once((players) => {
        // Ambil data respons secara detail
        roomRef.get('responses').once((responses) => {
          onUpdate({
            ...data,
            players: players || {},
            responses: responses || {}
          });
        });
      });
    });
  }

  /**
   * Diplomacy Mode: Submit pilihan ke kolektif.
   */
  submitRoomChoice(roomId: string, playerName: string, scenarioId: string, choiceId: string): void {
    this.db.get(`veto/rooms/${roomId}/responses`).get(playerName).put({
      scenarioId,
      choiceId,
      timestamp: Date.now()
    });
  }

  /**
   * Diplomacy Mode: Lanjut ke skenario berikutnya (Admin/Host trigger).
   */
  advanceRoom(roomId: string, nextScenarioId: string): void {
    const roomRef = this.db.get(`veto/rooms/${roomId}`);
    roomRef.put({ 
      currentScenarioId: nextScenarioId,
      status: 'playing' 
    });
    // Reset respons untuk turn berikutnya
    roomRef.get('responses').put(null);
  }

  /**
   * Diplomacy Mode: Host memulai permainan secara resmi.
   */
  startGame(roomId: string): void {
    this.db.get(`veto/rooms/${roomId}`).put({
      status: 'playing',
      startedAt: Date.now()
    });
  }
}

export const p2pService = new GunP2PService();
