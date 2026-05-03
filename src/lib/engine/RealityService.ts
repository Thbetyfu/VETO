/**
 * @class RealityService
 * @description Fase 9: Mengambil data realita (berita aktual) untuk diinjeksi ke dalam narasi game,
 * membuat garis batas antara game dan realita menjadi bias.
 */
export class RealityService {
  /**
   * Mengambil kata kunci tren berita. 
   * (Mock implementation untuk saat ini, bisa dihubungkan ke RSS/News API beneran)
   */
  static async fetchTrendingKeywords(): Promise<string[]> {
    try {
      const RSS_URL = encodeURIComponent("https://news.google.com/rss/search?q=Indonesia+hukum+politik&hl=id&gl=ID&ceid=ID:id");
      const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}`;
      
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.status === 'ok' && data.items) {
        // Ambil judul berita dan bersihkan sedikit (ambil 5-7 kata pertama)
        return data.items.map((item: any) => {
          const title = item.title.split(' - ')[0]; // Hilangkan sumber berita
          return title.length > 50 ? title.substring(0, 47) + "..." : title;
        });
      }
      
      throw new Error("API Response not OK");
    } catch (e) {
      console.warn("[RealityService] Menggunakan fallback karena error:", e);
      // Fallback tetap ada jika offline atau API limit
      return ["Kenaikan Harga Pangan", "Reformasi Birokrasi", "Stabilitas Keamanan Nasional"];
    }
  }

  /**
   * Mengambil 1 kata kunci acak dari tren saat ini.
   */
  static async getActiveTrend(): Promise<string> {
    try {
      const trends = await this.fetchTrendingKeywords();
      if (!trends || trends.length === 0) return "";
      
      const randomIndex = Math.floor(Math.random() * trends.length);
      return trends[randomIndex];
    } catch (e) {
      console.warn("[RealityService] Gagal memuat data realita", e);
      return "";
    }
  }
}
