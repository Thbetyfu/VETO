/**
 * @module LocalP2PTransport
 * @description Transport layer P2P berbasis BroadcastChannel + localStorage.
 * Bekerja sempurna untuk multiplayer multi-tab di device yang sama,
 * tanpa membutuhkan relay server eksternal (solusi untuk relay GunDB yang mati).
 *
 * Arsitektur: Publisher/Subscriber pattern dengan shared state di localStorage.
 */

const ROOMS_KEY = 'veto_rooms';
const CHANNEL_NAME = 'veto_p2p';

type RoomUpdateCallback = (roomData: any) => void;

let channel: BroadcastChannel | null = null;
const subscribers = new Map<string, RoomUpdateCallback>();

/** Inisialisasi BroadcastChannel sekali saja (Singleton). */
function getChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      const { roomId, roomData } = event.data;
      const cb = subscribers.get(roomId);
      if (cb) cb(roomData);
    };
  }
  return channel;
}

/** Membaca semua room dari localStorage. */
function getRooms(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(ROOMS_KEY) || '{}');
  } catch {
    return {};
  }
}

/** Menyimpan semua room ke localStorage dan broadcast ke tab lain. */
function saveAndBroadcast(roomId: string, roomData: any) {
  const rooms = getRooms();
  rooms[roomId] = roomData;
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));

  // Broadcast ke tab lain
  getChannel().postMessage({ roomId, roomData });

  // Juga panggil subscriber lokal (tab yang sama)
  const cb = subscribers.get(roomId);
  if (cb) cb(roomData);
}

// ===== Public API =====

export function createRoom(hostName: string, callback: (roomId: string) => void): void {
  const roomId = Math.random().toString(36).slice(2, 7).toUpperCase();
  const roomData = {
    status: 'waiting',
    currentScenarioId: 'SCN-15-01',
    createdAt: Date.now(),
    players: {
      [hostName]: { joinedAt: Date.now() }
    },
    responses: {}
  };
  saveAndBroadcast(roomId, roomData);

  // Host juga perlu listen ke update (misalnya saat player lain bergabung)
  getChannel();

  callback(roomId);
}

export function joinRoom(roomId: string, playerName: string, onUpdate: RoomUpdateCallback): void {
  // Registrasi subscriber untuk room ini — baik Host maupun Client
  subscribers.set(roomId, onUpdate);

  // Inisialisasi listener untuk perubahan dari tab lain
  getChannel();

  // Tambahkan pemain ke room (hanya jika belum ada)
  const rooms = getRooms();
  const room = rooms[roomId];
  if (room) {
    room.players = room.players || {};
    if (!room.players[playerName]) {
      // Pemain baru bergabung
      room.players[playerName] = { joinedAt: Date.now() };
      saveAndBroadcast(roomId, room);
    } else {
      // Host atau reconnect — hanya kirim state saat ini tanpa mengubah data
      onUpdate(room);
    }
  } else {
    console.warn(`[LocalP2P] Room ${roomId} tidak ditemukan.`);
  }
}

export function submitRoomChoice(roomId: string, playerName: string, scenarioId: string, choiceId: string): void {
  const rooms = getRooms();
  const room = rooms[roomId];
  if (room) {
    room.responses = room.responses || {};
    room.responses[playerName] = { scenarioId, choiceId, timestamp: Date.now() };
    saveAndBroadcast(roomId, room);
  }
}

export function advanceRoom(roomId: string, nextScenarioId: string): void {
  const rooms = getRooms();
  const room = rooms[roomId];
  if (room) {
    room.currentScenarioId = nextScenarioId;
    room.status = 'playing';
    room.responses = {};
    saveAndBroadcast(roomId, room);
  }
}

export function startGame(roomId: string): void {
  const rooms = getRooms();
  const room = rooms[roomId];
  if (room) {
    room.status = 'playing';
    room.startedAt = Date.now();
    saveAndBroadcast(roomId, room);
  }
}

export function getRoom(roomId: string): any | null {
  const rooms = getRooms();
  return rooms[roomId] || null;
}
