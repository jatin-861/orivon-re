const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });

  const dumpVisual = async (label, shot) => {
    const info = await page.evaluate(() => {
      const panels = document.querySelectorAll('[data-panel]');
      const scrollSection = panels[0] ? panels[0].parentElement : null;
      const cs = scrollSection ? getComputedStyle(scrollSection) : null;
      const contentRoot = document.querySelector('main > div'); // PageTransition's contentRef wrapper
      const contentCs = contentRoot ? getComputedStyle(contentRoot) : null;
      return {
        panelCount: panels.length,
        scrollWidth: scrollSection ? scrollSection.scrollWidth : null,
        transform: cs ? cs.transform : null,
        contentRootTransform: contentCs ? contentCs.transform : null,
        contentRootOpacity: contentCs ? contentCs.opacity : null,
        windowScrollY: window.scrollY,
        docScrollHeight: document.documentElement.scrollHeight,
      };
    });
    console.log(`[${label}]`, JSON.stringify(info));
    if (shot) await page.screenshot({ path: shot });
  };

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500); // let preloader fully finish this time
  await dumpVisual('initial');

  // Rapid-fire navigation: home -> contact -> work -> home, short waits (simulate impatient user)
  for (const cycle of [1, 2, 3]) {
    console.log(`\n--- cycle ${cycle}: -> /contact ---`);
    await page.click('a[href="/contact"]');
    await page.waitForTimeout(350); // intentionally shorter than the ~650ms curtain-down animation
    await dumpVisual(`cycle${cycle}-contact-mid`);

    console.log(`--- cycle ${cycle}: -> /work ---`);
    await page.click('a[href="/work"]');
    await page.waitForTimeout(350);
    await dumpVisual(`cycle${cycle}-work-mid`);

    console.log(`--- cycle ${cycle}: -> / ---`);
    await page.click('a[href="/"]');
    await page.waitForTimeout(2000); // this time let it fully settle
    await dumpVisual(`cycle${cycle}-home-settled`);

    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(600);
    await dumpVisual(`cycle${cycle}-home-scrolled-into-section`, `_diag4_cycle${cycle}_scrolled.png`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
  }

  console.log('\n--- errors ---');
  console.log(errors.length ? errors.join('\n') : '(none)');

  await browser.close();
})();
