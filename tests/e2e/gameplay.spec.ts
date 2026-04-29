import { test, expect } from '@playwright/test';

test.describe('VETO Black-Box E2E Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Pastikan server dev jalan di localhost:3000 atau 3001
    await page.goto('http://localhost:3001');
  });

  test('harus bisa masuk ke game dan membuat keputusan', async ({ page }) => {
    // 1. Cek judul
    await expect(page).toHaveTitle(/VETO/);

    // 2. Isi nama presiden
    const nameInput = page.locator('#president-name');
    await nameInput.fill('Presiden Test E2E');

    // 3. Klik Mulai
    await page.click('button:has-text("Mulai Menjabat")');

    // 4. Tunggu transisi ke gameplay
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('text=Presiden Test E2E')).toBeVisible();

    // 5. Membuat pilihan pertama
    const firstOption = page.locator('button').first();
    const optionText = await firstOption.innerText();
    console.log(`Memilih opsi: ${optionText}`);
    await firstOption.click();

    // 6. Cek apakah hari bertambah
    await expect(page.locator('text=Day 2')).toBeVisible();
  });

  test('harus bisa membuka Hall of Fame', async ({ page }) => {
    // Klik icon trophy
    await page.click('button[title="Hall of Fame"]');

    // Cek judul Hall of Fame
    await expect(page.locator('h2')).toHaveText(/Hall of Fame/i);

    // Klik kembali
    await page.click('text=Kembali');
    await expect(page.locator('h2')).not.toBeVisible();
  });
});
