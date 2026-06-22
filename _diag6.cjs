const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });

  const dump = async (label) => {
    const info = await page.evaluate(() => {
      const panels = document.querySelectorAll('[data-panel]');
      const scrollSection = panels[0] ? panels[0].parentElement : null;
      const cs = scrollSection ? getComputedStyle(scrollSection) : null;
      let translateX = null;
      if (cs && cs.transform && cs.transform !== 'none') {
        const m = cs.transform.match(/matrix\(([^)]+)\)/);
        if (m) translateX = parseFloat(m[1].split(',')[4]);
      }
      return {
        y: window.scrollY,
        scrollWidth: scrollSection ? scrollSection.scrollWidth : null,
        translateX,
      };
    });
    console.log(`[${label}] y=${info.y} scrollWidth=${info.scrollWidth} translateX=${info.translateX}`);
  };

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  console.log('=== BEFORE nav ===');
  for (let i = 0; i < 14; i++) {
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(300);
    await dump(`before-${i}`);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  console.log('\n=== navigating to /contact and back ===');
  await page.click('a[href="/contact"]');
  await page.waitForTimeout(1500);
  await page.click('a[href="/"]');
  await page.waitForTimeout(2000);

  console.log('\n=== AFTER nav ===');
  for (let i = 0; i < 14; i++) {
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(300);
    await dump(`after-${i}`);
    await page.screenshot({ path: `_diag6_after${String(i).padStart(2, '0')}.png` });
  }

  console.log('\n--- errors ---');
  console.log(errors.length ? errors.join('\n') : '(none)');

  await browser.close();
})();
