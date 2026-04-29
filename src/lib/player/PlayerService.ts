/**
 * @interface IPlayerProfile
 * @description Kontrak data untuk profil Presiden (ISP).
 */
export interface IPlayerProfile {
  name: string;
  titles: string[];
}

/**
 * @class PlayerService
 * @description SRP: Mengelola identitas dan metadata pemain.
 */
export class PlayerService {
  private static STORAGE_KEY = 'veto_player_profile';

  static save(profile: IPlayerProfile): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
  }

  static get(): IPlayerProfile {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : { name: 'Presiden Anonim', titles: [] };
  }

  /**
   * Neuron-inspired validation: Sinyal harus kuat (karakter > 3)
   * untuk mengaktifkan state "Valid".
   */
  static isValid(name: string): boolean {
    const activationThreshold = 3;
    const sanitized = this.sanitize(name);
    return sanitized.length >= activationThreshold;
  }

  /**
   * Security Protocol: Membersihkan input dari tag HTML atau karakter berbahaya (XSS Prevention).
   */
  private static sanitize(input: string): string {
    return input
      .replace(/[<>]/g, '') // Basic tag removal
      .trim();
  }
}
