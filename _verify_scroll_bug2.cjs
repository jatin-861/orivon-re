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
      const marker = Array.from(document.querySelectorAll('span')).find(
        (s) => s.textContent && s.textContent.trim() === 'Selected Work'
      );
      const body = document.body;
      const html = document.documentElement;
      let pinSpacer = null;
      if (marker) {
        let el = marker;
        for (let i = 0; i < 10 && el; i++) {
          if (el.classList && Array.from(el.classList).some((c) => c.includes('pin-spacer'))) {
            pinSpacer = el;
            break;
          }
          el = el.parentElement;
        }
      }
      return {
        scrollY: window.scrollY,
        docScrollHeight: html.scrollHeight,
        bodyScrollHeight: body.scrollHeight,
        bodyTransform: getComputedStyle(body).transform,
        bodyPosition: getComputedStyle(body).position,
        markerFound: !!marker,
        markerRect: marker ? marker.getBoundingClientRect().toJSON() : null,
        pinSpacerFound: !!pinSpacer,
        pinSpacerStyle: pinSpacer
          ? { height: pinSpacer.style.height, position: getComputedStyle(pinSpacer).position }
          : null,
        scrollTriggerCount: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 'n/a (not global)',
      };
    });
    console.log(`[${label}]`, JSON.stringify(info, null, 0));
  };

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await dump('home-initial');

  await page.click('a[href="/contact"]');
  await page.waitForTimeout(1200);
  await dump('contact');

  await page.click('a[href="/"]');
  await page.waitForTimeout(1500);
  await dump('home-after-nav-top');

  // Real wheel scroll in increments, dumping each time
  for (let i = 0; i < 6; i++) {
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(400);
    await dump(`home-after-nav-wheel-${i}`);
  }

  await page.screenshot({ path: '_f_diag_final.png' });
  console.log('--- errors ---');
  console.log(errors.length ? errors.join('\n') : '(none)');

  await browser.close();
})();
