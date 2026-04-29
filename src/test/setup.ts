import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock GunDB karena kita tidak ingin koneksi P2P asli saat testing
vi.mock('gun', () => {
  return {
    default: vi.fn().mockReturnValue({
      get: vi.fn().mockReturnThis(),
      put: vi.fn().mockReturnThis(),
      map: vi.fn().mockReturnThis(),
      once: vi.fn().mockReturnThis(),
    }),
  };
});
