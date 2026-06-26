import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
await page.goto("http://localhost:4324/pricing", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
await page.screenshot({ path: "reports/final-pricing-check.png" });
await browser.close();
