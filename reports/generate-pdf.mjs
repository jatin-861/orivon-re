import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "pricing-report.html");
const outPath = path.join(__dirname, "Orvion-Pricing-Intelligence-Report-1.pdf");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
await page.waitForSelector('body[data-render-done="true"]');
await page.evaluateHandle("document.fonts.ready");

await page.pdf({
  path: outPath,
  format: "A4",
  landscape: true,
  printBackground: true,
  margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
});

await browser.close();
console.log("PDF written to", outPath);
