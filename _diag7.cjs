const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const dumpAncestors = async (label) => {
    const info = await page.evaluate(() => {
      const panel = document.querySelector('[data-panel]');
      if (!panel) return { error: 'no panel found' };
      const chain = [];
      let el = panel;
      let depth = 0;
      while (el && el !== document.body && depth < 15) {
        const cs = getComputedStyle(el);
        chain.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 60),
          opacity: cs.opacity,
          visibility: cs.visibility,
          display: cs.display,
          transform: cs.transform,
          inlineStyle: el.getAttribute('style'),
        });
        el = el.parentElement;
        depth++;
      }
      return { chain };
    });
    console.log(`\n=== [${label}] ===`);
    console.log(JSON.stringify(info, null, 1));
  };

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);
  await page.evaluate(() => window.scrollTo(0, 2700)); // land inside the pinned section, mid-progress
  await page.waitForTimeout(500);
  await dumpAncestors('before-nav-mid-pin');
  await page.screenshot({ path: '_diag7_before.png' });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  console.log('\n--- navigating to /contact and back ---');
  await page.click('a[href="/contact"]');
  await page.waitForTimeout(1500);
  await page.click('a[href="/"]');
  await page.waitForTimeout(2000);

  // Real wheel-scroll down into the section, matching the repro that worked
  for (let i = 0; i < 4; i++) {
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(300);
  }
  await dumpAncestors('after-nav-mid-pin');
  await page.screenshot({ path: '_diag7_after.png' });

  await browser.close();
})();
