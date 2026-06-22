const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  console.log('--- BEFORE nav: scrolling full page with real wheel events ---');
  for (let i = 0; i < 14; i++) {
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(350);
  }
  await page.screenshot({ path: '_diag5_before_bottom.png', fullPage: false });
  const beforeY = await page.evaluate(() => window.scrollY);
  console.log('scrollY after wheeling down (before nav):', beforeY);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  console.log('--- navigating to /contact and back ---');
  await page.click('a[href="/contact"]');
  await page.waitForTimeout(1500);
  await page.click('a[href="/"]');
  await page.waitForTimeout(2000);

  console.log('--- AFTER nav: scrolling full page with real wheel events, screenshotting every step ---');
  for (let i = 0; i < 14; i++) {
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(350);
    const y = await page.evaluate(() => window.scrollY);
    await page.screenshot({ path: `_diag5_after_step${String(i).padStart(2, '0')}_y${y}.png` });
  }

  console.log('\n--- errors ---');
  console.log(errors.length ? errors.join('\n') : '(none)');

  await browser.close();
})();
