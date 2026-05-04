/**
 * @class CalendarService
 * @description Fase 14: Time Visualization.
 * SRP: Mengonversi jumlah hari simulasi (1-720) menjadi format kalender kepresidenan (Year, Month, Day).
 * Membantu imersivitas pemain dalam merasakan perjalanan 10 tahun jabatan.
 */
export class CalendarService {
  private static DAYS_IN_MONTH = 30;
  private static MONTHS_IN_YEAR = 12;

  /**
   * Mengonversi hari menjadi objek kalender.
   * Day 1-360 = Year 1, Month 1-12
   * Day 361-720 = Year 2, Month 1-12 (Dalam game: Periode 1 & Periode 2)
   */
  static format(day: number): { period: number, year: number, month: number, dayOfMonth: number } {
    const period = day <= 360 ? 1 : 2;
    const adjustedDay = day <= 360 ? day : day - 360;
    
    const year = Math.ceil(adjustedDay / (this.DAYS_IN_MONTH * this.MONTHS_IN_YEAR));
    const month = Math.ceil((adjustedDay % (this.DAYS_IN_MONTH * this.MONTHS_IN_YEAR) || (this.DAYS_IN_MONTH * this.MONTHS_IN_YEAR)) / this.DAYS_IN_MONTH);
    const dayOfMonth = adjustedDay % this.DAYS_IN_MONTH || this.DAYS_IN_MONTH;

    return { period, year, month, dayOfMonth };
  }

  /**
   * Menghasilkan string label untuk UI.
   * Contoh: "Periode 1 • Tahun 2 • Bulan 4"
   */
  static getLabel(day: number): string {
    const { period, year, month } = this.format(day);
    return `Periode ${period} • Tahun ${year} • Bulan ${month}`;
  }
}
