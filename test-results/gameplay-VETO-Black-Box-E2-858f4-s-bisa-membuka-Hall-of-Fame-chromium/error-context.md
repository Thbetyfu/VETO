# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gameplay.spec.ts >> VETO Black-Box E2E Testing >> harus bisa membuka Hall of Fame
- Location: tests\e2e\gameplay.spec.ts:34:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button[title="Hall of Fame"]')
    - locator resolved to <button title="Hall of Fame" class="p-2 rounded-full hover:bg-white/5 transition-colors text-president-gold">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-president-dark overflow-hidden">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-president-dark overflow-hidden">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    51 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-president-dark overflow-hidden">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e8]
      - generic [ref=e11]:
        - heading "SELAMAT DATANG, PEMIMPIN BANGSA." [level=1] [ref=e12]:
          - text: SELAMAT DATANG,
          - text: PEMIMPIN BANGSA.
        - paragraph [ref=e14]: Negara sedang berada di persimpangan jalan—krisis moral dan ketimpangan hukum menanti sentuhan kepemimpinan Anda. Tentukan arah bangsa hari ini.
      - generic [ref=e15]:
        - generic [ref=e16]:
          - textbox "Masukkan Nama Anda..." [ref=e17]
          - generic [ref=e18]: Identitas Presiden
        - generic [ref=e21]:
          - img [ref=e22]
          - generic [ref=e36]: Mengaktifkan Neural Core (0%)
      - paragraph [ref=e39]: Tuliskan nama Anda untuk melanjutkan
    - generic [ref=e40]:
      - generic [ref=e41]: VETO_PROTOCOL_SECURE_V2
      - generic [ref=e42]: ISTANA_MERDEKA_TERMINAL
  - banner [ref=e43]:
    - generic [ref=e44]:
      - button "Hall of Fame" [ref=e45]:
        - img [ref=e46]
      - generic [ref=e53]:
        - heading "VETO Terminal" [level=1] [ref=e54]
        - paragraph [ref=e55]: Day 1 • Presiden Anonim
    - generic [ref=e56]:
      - generic [ref=e57]:
        - generic [ref=e58]:
          - img [ref=e60]
          - generic [ref=e64]: Law
        - generic [ref=e69]: "75"
      - generic [ref=e70]:
        - generic [ref=e71]:
          - img [ref=e73]
          - generic [ref=e78]: Humanity
        - generic [ref=e83]: "75"
      - generic [ref=e84]:
        - generic [ref=e85]:
          - img [ref=e87]
          - generic [ref=e89]: Order
        - generic [ref=e94]: "75"
      - generic [ref=e95]:
        - generic [ref=e96]:
          - img [ref=e98]
          - generic [ref=e101]: Budget
        - generic [ref=e106]: "75"
  - main [ref=e107]:
    - generic [ref=e108]:
      - generic [ref=e109]:
        - generic [ref=e111]:
          - img [ref=e112]
          - text: HARI KE-1
        - generic [ref=e115]:
          - generic [ref=e116]: "#Economy"
          - generic [ref=e117]: "#Fiscal"
        - generic [ref=e118]:
          - heading "Surplus Pajak Tahunan" [level=2] [ref=e119]
          - paragraph [ref=e121]: "\"Berkat digitalisasi sistem pajak, negara mencatat surplus pendapatan yang tidak terduga. Rakyat berharap ada bantuan langsung, namun menteri keuangan menyarankan tabungan negara.\""
        - generic [ref=e122]:
          - 'button "A Bagi sebagai Bansos Dasar Hukum: Program Perlindungan Sosial." [ref=e123]':
            - generic [ref=e125]: A
            - generic [ref=e126]:
              - paragraph [ref=e127]: Bagi sebagai Bansos
              - generic [ref=e128]:
                - img [ref=e129]
                - text: "Dasar Hukum: Program Perlindungan Sosial."
          - 'button "B Simpan di Dana Abadi Dasar Hukum: Sovereign Wealth Fund." [ref=e135]':
            - generic [ref=e137]: B
            - generic [ref=e138]:
              - paragraph [ref=e139]: Simpan di Dana Abadi
              - generic [ref=e140]:
                - img [ref=e141]
                - text: "Dasar Hukum: Sovereign Wealth Fund."
      - generic [ref=e147]:
        - generic [ref=e148]:
          - img [ref=e149]
          - generic [ref=e157]: Memuat Kecerdasan Lokal... 0%
        - paragraph [ref=e159]: AI dimuat di latar belakang — game tetap bisa dimainkan.
  - contentinfo [ref=e160]:
    - generic [ref=e161]: VETO V0.2
    - generic [ref=e163]: ⏳ AI SYNC 0%
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('VETO Black-Box E2E Testing', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Pastikan server dev jalan di localhost:3000 atau 3001
  6  |     await page.goto('http://localhost:3001');
  7  |   });
  8  | 
  9  |   test('harus bisa masuk ke game dan membuat keputusan', async ({ page }) => {
  10 |     // 1. Cek judul
  11 |     await expect(page).toHaveTitle(/VETO/);
  12 | 
  13 |     // 2. Isi nama presiden
  14 |     const nameInput = page.locator('#president-name');
  15 |     await nameInput.fill('Presiden Test E2E');
  16 | 
  17 |     // 3. Klik Mulai
  18 |     await page.click('button:has-text("Mulai Menjabat")');
  19 | 
  20 |     // 4. Tunggu transisi ke gameplay
  21 |     await expect(page.locator('header')).toBeVisible();
  22 |     await expect(page.locator('text=Presiden Test E2E')).toBeVisible();
  23 | 
  24 |     // 5. Membuat pilihan pertama
  25 |     const firstOption = page.locator('button').first();
  26 |     const optionText = await firstOption.innerText();
  27 |     console.log(`Memilih opsi: ${optionText}`);
  28 |     await firstOption.click();
  29 | 
  30 |     // 6. Cek apakah hari bertambah
  31 |     await expect(page.locator('text=Day 2')).toBeVisible();
  32 |   });
  33 | 
  34 |   test('harus bisa membuka Hall of Fame', async ({ page }) => {
  35 |     // Klik icon trophy
> 36 |     await page.click('button[title="Hall of Fame"]');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  37 | 
  38 |     // Cek judul Hall of Fame
  39 |     await expect(page.locator('h2')).toHaveText(/Hall of Fame/i);
  40 | 
  41 |     // Klik kembali
  42 |     await page.click('text=Kembali');
  43 |     await expect(page.locator('h2')).not.toBeVisible();
  44 |   });
  45 | });
  46 | 
```