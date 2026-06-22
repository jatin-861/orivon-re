const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setViewportSize({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // preloader

  // Scroll down on home to where ScrollStoryHorizontal pinned section lives
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const findSection = async (label) => {
    const info = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('section, div'));
      const marker = Array.from(document.querySelectorAll('span')).find((s) =>
        s.textContent && s.textContent.trim() === 'Selected Work'
      );
      if (!marker) return { found: false };
      const rect = marker.getBoundingClientRect();
      // climb up to the pinned container (the one with overflow-hidden h-[100dvh])
      let el = marker;
      for (let i = 0; i < 6 && el; i++) el = el.parentElement;
      const containerRect = el ? el.getBoundingClientRect() : null;
      return {
        found: true,
        markerTop: rect.top + window.scrollY,
        containerHeight: containerRect ? containerRect.height : null,
        containerHTML_len: el ? el.outerHTML.length : 0,
      };
    });
    console.log(`[${label}]`, JSON.stringify(info));
    return info;
  };

  console.log('--- Initial home load ---');
  const before = await findSection('home-before-nav');
  if (before.found) {
    await page.evaluate((y) => window.scrollTo(0, y - 100), before.markerTop);
    await page.waitForTimeout(800);
    await page.screenshot({ path: '_a_home_scrollstory_before.png' });
  } else {
    await page.screenshot({ path: '_a_home_NOTFOUND_before.png', fullPage: true });
  }

  console.log('--- Navigating to /contact ---');
  await page.click('a[href="/contact"]', { timeout: 5000 }).catch(async () => {
    await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle' });
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '_b_contact.png' });

  console.log('--- Navigating back to / via logo link ---');
  await page.click('a[href="/"]', { timeout: 5000 }).catch(async () => {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  });
  await page.waitForTimeout(1500);

  console.log('--- Home after returning from contact ---');
  const after = await findSection('home-after-nav');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_c_home_top_after_nav.png' });

  if (after.found) {
    await page.evaluate((y) => window.scrollTo(0, y - 100), after.markerTop);
    await page.waitForTimeout(800);
    await page.screenshot({ path: '_d_home_scrollstory_after_nav.png' });

    // try scrolling further to see if horizontal pin/scroll still works
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(600);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(600);
    await page.screenshot({ path: '_e_home_scrollstory_after_wheel.png' });
  } else {
    await page.screenshot({ path: '_d_home_NOTFOUND_after_nav.png', fullPage: true });
  }

  console.log('--- Console/page errors ---');
  console.log(errors.length ? errors.join('\n') : '(none)');

  await browser.close();
})();
