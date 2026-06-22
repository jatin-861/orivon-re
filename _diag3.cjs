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
      const pinSpacers = document.querySelectorAll('.pin-spacer');
      const scrollSection = panels[0] ? panels[0].parentElement : null;
      const container = scrollSection ? scrollSection.parentElement : null;
      const cs = scrollSection ? getComputedStyle(scrollSection) : null;
      const containerCs = container ? getComputedStyle(container) : null;

      return {
        panelCount: panels.length,
        pinSpacerCount: pinSpacers.length,
        pinSpacers: Array.from(pinSpacers).map((el) => ({
          className: el.className,
          height: el.getBoundingClientRect().height,
          inlineHeight: el.style.height,
        })),
        scrollSection: scrollSection
          ? {
              scrollWidth: scrollSection.scrollWidth,
              clientWidth: scrollSection.clientWidth,
              transform: cs.transform,
              rect: scrollSection.getBoundingClientRect().toJSON(),
            }
          : null,
        container: container
          ? {
              className: container.className,
              rect: container.getBoundingClientRect().toJSON(),
              position: containerCs.position,
              display: containerCs.display,
              visibility: containerCs.visibility,
              opacity: containerCs.opacity,
              height: containerCs.height,
            }
          : null,
        docScrollHeight: document.documentElement.scrollHeight,
        bodyScrollHeight: document.body.scrollHeight,
        windowScrollY: window.scrollY,
        innerWidth: window.innerWidth,
      };
    });
    console.log(`\n=== [${label}] ===`);
    console.log(JSON.stringify(info, null, 2));
  };

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await dump('1-home-initial-load');

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(800);
  await dump('2-home-scrolled-into-section');
  await page.screenshot({ path: '_diag_2_scrolled.png' });

  console.log('\n--- navigating to /contact ---');
  await page.click('a[href="/contact"]');
  await page.waitForTimeout(1500);
  await dump('3-on-contact');

  console.log('\n--- navigating back to / ---');
  await page.click('a[href="/"]');
  await page.waitForTimeout(1500);
  await dump('4-home-after-nav-top');

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(800);
  await dump('5-home-after-nav-scrolled');
  await page.screenshot({ path: '_diag_5_after_nav_scrolled.png' });

  console.log('\n--- errors ---');
  console.log(errors.length ? errors.join('\n') : '(none)');

  await browser.close();
})();
