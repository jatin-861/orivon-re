/**
 * build-pdfs.mjs
 * Reads Excel data (via excel-data.json), generates 3 styled HTML/PDF pricing docs,
 * saves PDFs to public/ for the website pricing cards.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const PUBLIC    = path.join(ROOT, 'public');

// ── Load Excel data ───────────────────────────────────────────────────────────
const RAW = JSON.parse(readFileSync(path.join(__dirname, 'excel-data.json'), 'utf8'));

// Excel columns: [name, industries, complexity, mktPrice, mktDelivery, mktMaint, orvPrice, orvDelivery, orvMaint]
const WEB  = RAW['01 — Website'];
const MOB  = RAW['02 — Mobile Apps'];
const AUTO = RAW['03 — Automation'];
const ALL_SAAS = RAW['04 — SaaS & Custom Software'];

// Re-group SaaS by known group sizes (matches original HTML structure)
const SAAS_GROUPS = [
  ['Sales, CRM & Growth',            8],
  ['Finance, Billing & Compliance',  7],
  ['HR & People Ops',                7],
  ['Operations, Assets & Workflow', 12],
  ['Education',                      6],
  ['Healthcare',                     6],
  ['Logistics, Fleet & Field Ops',   7],
  ['Real Estate, Property & Hospitality', 7],
  ['Retail, Commerce & Marketplaces', 7],
  ['Manufacturing & Production',     3],
  ['Niche & Community Platforms',    9],
  ['Enterprise & Bespoke Builds',    4],
];
let si = 0;
const SAAS = SAAS_GROUPS.map(([name, count]) => {
  const items = ALL_SAAS.slice(si, si + count);
  si += count;
  return [name, items];
});

// [name, price] — prices from Excel 06 — Add-ons sheet
const ADDONS = [
  ['Extra Page / Module',                                  '₹5k – ₹8k'],
  ['WhatsApp Business API Integration',                    '₹30k – ₹1.2L'],
  ['Payment Gateway Integration (Razorpay/Stripe/PayU)',   '₹30k – ₹1.2L'],
  ['SMS Gateway Integration',                              '₹25k – ₹75k'],
  ['ERP / Tally / Accounting Sync',                        '₹30k – ₹2L'],
  ['Multi-language Support Pack',                          '₹10k – ₹20k'],
  ['Advanced Analytics / BI Dashboard',                    '₹2L – ₹4L'],
  ['AI Chatbot Widget Add-on',                             '₹30k – ₹90k'],
  ['Native Mobile App Companion',                          '₹2L – ₹5.5L'],
  ['Extra User Roles & Permission Tier',                   '₹20k – ₹60k'],
  ['Public API Access for Developers',                     '₹30k – ₹1L'],
  ['White-label / Multi-tenant Setup',                     '₹1L – ₹3.5L'],
  ['Extended Post-launch Support (beyond 30 days)',        '₹15k – ₹50k'],
  ['Professional Content Writing & SEO Copy',              '₹10k – ₹35k'],
  ['Domain + Hosting + SSL Setup',                         '₹4k – ₹20k'],
  ['App Store Deployment & ASO Setup',                     '₹20k – ₹55k'],
  ['UI/UX Redesign Only (no new dev)',                     '₹25k – ₹90k'],
  ['Speed & Technical SEO Audit + Fix',                    '₹20k – ₹55k'],
];

// ── Complexity colours ────────────────────────────────────────────────────────
const TIER = {
  Basic:      { bg: '#6B6358', fg: '#fff', label: 'Basic' },
  Medium:     { bg: '#8B5E3C', fg: '#fff', label: 'Medium' },
  High:       { bg: '#C75B3A', fg: '#fff', label: 'High' },
  Enterprise: { bg: '#1A1A1A', fg: '#fff', label: 'Enterprise' },
};

// ── HTML shell ────────────────────────────────────────────────────────────────
function shell(title, bodyContent) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap"/>
<style>
:root{
  --bg:#FAF7F2; --fg:#1A1A1A; --card:#FFFFFF; --border:#E5DDD3;
  --muted:#F0EAE0; --muted-fg:#544E45; --pink:#C75B3A; --teal:#4B6E6A;
  --serif:"Bodoni Moda",Georgia,serif;
  --sans:"Cabinet Grotesk",system-ui,sans-serif;
  --mono:"JetBrains Mono",monospace;
}
*{box-sizing:border-box;margin:0;padding:0;}
@page{size:A4 landscape;margin:0;}
body{font-family:var(--sans);background:var(--bg);color:var(--fg);font-size:10.5px;line-height:1.4;}
.page{width:297mm;min-height:210mm;padding:11mm 13mm;position:relative;break-after:page;background:var(--bg);}
.page:last-child{break-after:auto;}
h1,h2,h3{font-family:var(--sans);font-weight:800;letter-spacing:-0.02em;}
.serif{font-family:var(--serif);}
.mono{font-family:var(--mono);}
.accent{color:var(--pink);}
.muted{color:var(--muted-fg);}
.eyebrow{font-family:var(--mono);font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:var(--pink);display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.eyebrow::before{content:"";width:18px;height:1.5px;background:var(--pink);display:inline-block;}
.rule{height:1px;background:linear-gradient(90deg,var(--pink),transparent 70%);margin:8px 0 14px;}

/* Cover */
.cover{display:flex;flex-direction:column;justify-content:space-between;}
.cover-top .brand{font-family:var(--sans);font-weight:900;font-size:15px;letter-spacing:0.02em;}
.cover-title{font-size:50px;font-weight:800;letter-spacing:-0.03em;line-height:0.98;margin-top:24px;}
.cover-title .serif{font-size:50px;color:var(--pink);display:block;}
.cover-sub{max-width:520px;margin-top:14px;font-size:12px;color:var(--muted-fg);}
.stat-row{display:flex;gap:12px;margin-top:28px;}
.stat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px 18px;min-width:120px;box-shadow:0 8px 24px -8px rgba(26,26,26,.08);}
.stat .num{font-size:24px;font-weight:800;color:var(--pink);}
.stat .lbl{font-size:9px;color:var(--muted-fg);margin-top:4px;text-transform:uppercase;letter-spacing:0.06em;font-family:var(--mono);}
.cover-bottom{display:flex;justify-content:space-between;align-items:flex-end;font-family:var(--mono);font-size:9px;color:var(--muted-fg);border-top:1px solid var(--border);padding-top:10px;}

/* Section */
.section-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:8px;}
.section-head h2{font-size:26px;font-weight:800;}
.section-num{font-family:var(--mono);font-size:10px;color:var(--muted-fg);}
.section-blurb{max-width:680px;font-size:10px;color:var(--muted-fg);margin-bottom:12px;}
.group-title{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#fff;background:var(--pink);margin:14px 0 4px;padding:5px 8px;border-radius:4px;}
.group-title:first-of-type{margin-top:2px;}

/* Table */
table{width:100%;border-collapse:collapse;font-size:9.5px;}
thead{display:table-header-group;}
tr{break-inside:avoid;}

/* Market headers — dark charcoal */
th{text-align:left;font-family:var(--mono);font-size:8px;text-transform:uppercase;letter-spacing:0.05em;background:#1A1A1A;color:#E8DDD0;padding:6px 7px;border-bottom:2px solid var(--pink);border-right:1px solid #333;}

/* Orvion column headers — terracotta/green accents on dark */
th.th-orv-price{background:#1A1A1A;color:#FF8A6A;border-bottom:2px solid #C75B3A;}
th.th-orv-del{background:#1A1A1A;color:#6BDDAA;border-bottom:2px solid #1B7A4A;}
th.th-orv-maint{background:#1A1A1A;color:#7DCFCC;border-bottom:2px solid #2D6E6A;}

td{padding:5px 7px;border-bottom:1px solid var(--border);border-right:1px solid var(--border);vertical-align:middle;}
tbody tr:nth-child(even){background:rgba(240,234,224,0.45);}
tbody tr:nth-child(odd){background:#fff;}
.cat-name{font-weight:700;color:#1A1A1A;}
.ind{color:var(--muted-fg);font-size:8.5px;}
.badge{display:inline-block;padding:2px 7px;border-radius:20px;font-family:var(--mono);font-size:7.5px;text-transform:uppercase;letter-spacing:0.04em;color:#fff;white-space:nowrap;}
.mkt-price{font-family:var(--mono);font-weight:700;color:#1A1A1A;}
.mkt-del{font-family:var(--mono);color:#544E45;}
.mkt-maint{font-family:var(--mono);font-size:8.5px;color:#544E45;}

/* ── ORVION VALUE CELLS — solid vibrant fills, high-contrast white text ── */
td.orv-price{
  background:#C75B3A;
  color:#FFFFFF;
  font-family:var(--mono);
  font-weight:700;
  font-size:9.5px;
  text-align:center;
  letter-spacing:0.01em;
  border-right:2px solid #fff;
}
td.orv-del{
  background:#1B7A4A;
  color:#FFFFFF;
  font-family:var(--mono);
  font-weight:700;
  font-size:9px;
  text-align:center;
  border-right:2px solid #fff;
}
td.orv-maint{
  background:#2D6E6A;
  color:#FFFFFF;
  font-family:var(--mono);
  font-size:9px;
  text-align:center;
}
/* Addons */
.addon-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;}
.addon{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:8px 11px;display:flex;justify-content:space-between;align-items:center;}
.addon .name{font-size:9.5px;font-weight:600;}
.addon .price{background:#C75B3A;color:#fff;font-family:var(--mono);font-size:8.5px;font-weight:700;padding:2px 8px;border-radius:20px;}
/* Footer */
.foot{position:absolute;bottom:7mm;left:13mm;right:13mm;display:flex;justify-content:space-between;font-family:var(--mono);font-size:7.5px;color:var(--muted-fg);border-top:1px solid var(--border);padding-top:5px;}
</style>
</head>
<body>
<div id="app">${bodyContent}</div>
<script>document.body.setAttribute('data-render-done','true');</script>
</body>
</html>`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function badge(complexity) {
  const t = TIER[complexity] || TIER.Basic;
  return `<span class="badge" style="background:${t.bg}">${t.label}</span>`;
}

function tableHTML(rows) {
  let h = `<table><thead><tr>
    <th style="width:22%">Category / Service</th>
    <th style="width:12%">Industries</th>
    <th style="width:9%">Complexity</th>
    <th style="width:10%">Market Price</th>
    <th style="width:8%">Market Delivery</th>
    <th style="width:10%">Market Maint/yr</th>
    <th class="th-orv-price" style="width:11%">ORVION Price</th>
    <th class="th-orv-del"   style="width:9%">ORVION Delivery</th>
    <th class="th-orv-maint" style="width:9%">ORVION Maint/yr</th>
  </tr></thead><tbody>`;
  rows.forEach(r => {
    // r = [name, industries, complexity, mktPrice, mktDelivery, mktMaint, orvPrice, orvDelivery, orvMaint]
    h += `<tr>
      <td class="cat-name">${r[0]}</td>
      <td class="ind">${r[1]}</td>
      <td>${badge(r[2])}</td>
      <td class="mkt-price">${r[3]}</td>
      <td class="mkt-del">${r[4]}</td>
      <td class="mkt-maint">${r[5]}</td>
      <td class="orv-price">${r[6] || '—'}</td>
      <td class="orv-del">${r[7] || '—'}</td>
      <td class="orv-maint">${r[8] || '—'}</td>
    </tr>`;
  });
  return h + '</tbody></table>';
}

function footer(label) {
  return `<div class="foot"><span>ORVION — Pricing Intelligence Report</span><span>${label}</span><span>Confidential — Client Use Only</span></div>`;
}

function coverPage(sectionTitle, subtitle, stats, eyebrow) {
  const statsHtml = stats.map(s => `<div class="stat"><div class="num">${s[0]}</div><div class="lbl">${s[1]}</div></div>`).join('');
  return `<div class="page cover">
    <div style="display:flex;justify-content:space-between;">
      <span class="brand" style="font-family:var(--sans);font-weight:900;font-size:15px;">ORVION</span>
      <span style="font-family:var(--mono);font-size:9px;color:var(--muted-fg);">CUSTOM SOFTWARE DEVELOPMENT STUDIO</span>
    </div>
    <div>
      <span class="eyebrow">${eyebrow}</span>
      <div class="cover-title">${sectionTitle}<span class="serif">${subtitle}</span></div>
      <p class="cover-sub">India market benchmark vs. Orvion's fixed fee — side by side, every category scoped before it's quoted.</p>
      <div class="stat-row">${statsHtml}</div>
    </div>
    <div class="cover-bottom">
      <span>ORVION STUDIO — AHMEDABAD, INDIA</span>
      <span>JUNE 2026 — INDIA MARKET EDITION</span>
    </div>
  </div>`;
}

function legendPage() {
  const legend = [
    ['Basic', '#6B6358'], ['Medium', '#8B5E3C'], ['High', '#C75B3A'], ['Enterprise', '#1A1A1A']
  ].map(([l, c]) => `<span style="display:inline-flex;align-items:center;gap:5px;margin-right:16px;font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.05em;"><span style="width:9px;height:9px;border-radius:50%;background:${c};display:inline-block;"></span>${l}</span>`).join('');

  const colLegend = [
    ['#C75B3A', 'ORVION Price', 'Your fixed-fee build price'],
    ['#1B7A4A', 'ORVION Delivery', 'Orvion delivery window'],
    ['#2D6E6A', 'ORVION Maint/yr', 'Annual maintenance retainer'],
  ].map(([bg, label, desc]) => `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
    <div style="width:80px;height:24px;background:${bg};border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:8px;color:#fff;font-weight:700;">${label.split(' ')[1]}</div>
    <div><div style="font-weight:700;font-size:10px;">${label}</div><div style="font-size:9px;color:var(--muted-fg);">${desc}</div></div>
  </div>`).join('');

  return `<div class="page">
    <span class="eyebrow">HOW TO READ THIS REPORT</span>
    <h2 style="font-size:26px;">Reading the Pricing Matrix</h2>
    <div class="rule"></div>
    <p style="font-size:10px;color:var(--muted-fg);max-width:680px;margin-bottom:20px;">Every category below is benchmarked against current India-market rates for an equivalent custom build. The three coloured columns on the right are Orvion's fixed-fee position — always below market, always scoped before quoted.</p>
    <div style="display:flex;gap:32px;">
      <div style="flex:1;">
        <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--pink);margin-bottom:10px;">ORVION COLUMNS</div>
        ${colLegend}
      </div>
      <div style="flex:1;">
        <div style="font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--pink);margin-bottom:10px;">COMPLEXITY LEVELS</div>
        ${legend}
        <div style="margin-top:16px;font-size:9.5px;color:var(--muted-fg);line-height:1.6;">
          <b>Market Price</b> — What an established India agency typically charges for this scope.<br>
          <b>Market Delivery</b> — Typical agency timeline from kickoff to launch.<br>
          <b>Market Maint/yr</b> — Industry standard annual support retainer (15–25% of build cost).<br>
          <b>ORVION Price</b> — Fixed fee, not hourly. Scoped before quoted.<br>
          <b>ORVION Maint/yr</b> — Orvion's retainer — consistently below market.
        </div>
      </div>
    </div>
    ${footer('How to Read')}
  </div>`;
}

// ── Shared Add-ons page (used in all PDFs) ───────────────────────────────────
function addonsPage(sectionNum = '05') {
  const grid = ADDONS.map(([name, price]) => `
    <div class="addon">
      <span class="name">${name}</span>
      <span class="price">${price}</span>
    </div>`).join('');

  return `<div class="page">
    <span class="eyebrow">ADD-ONS — ON TOP OF ANY BASE PACKAGE</span>
    <div class="section-head">
      <h2>${sectionNum} — Add-ons Menu</h2>
      <span class="section-num mono">${ADDONS.length} ITEMS · FIXED FEE</span>
    </div>
    <div class="rule"></div>
    <p class="section-blurb">Any add-on below can be bolted onto any base build. Price is fixed — no surprises after scoping.</p>
    <div class="addon-grid">${grid}</div>
    ${footer(`Section ${sectionNum} — Add-ons`)}
  </div>`;
}

// ── Build PDF 1: Website ──────────────────────────────────────────────────────
function buildWebsiteHTML() {
  const cover = coverPage(
    'Website Development',
    '<br>Pricing — 2026',
    [['18', 'Categories'], ['Fixed', 'Fee Model'], ['< Market', 'Always']],
    'WEBSITE DEVELOPMENT'
  );
  const dataPage = `<div class="page">
    <div class="section-head">
      <h2>01 — Website Development</h2>
      <span class="section-num mono">${WEB.length} CATEGORIES</span>
    </div>
    <p class="section-blurb">From a single static landing page to fully custom headless commerce — every website type benchmarked against current India-market rates.</p>
    ${tableHTML(WEB)}
    ${footer('Section 01 — Website Development')}
  </div>`;
  return shell('Orvion — Website Development Pricing 2026', cover + legendPage() + dataPage + addonsPage('02'));
}

// ── Build PDF 2: Mobile ───────────────────────────────────────────────────────
function buildMobileHTML() {
  const cover = coverPage(
    'Mobile App Development',
    '<br>Pricing — 2026',
    [['8', 'Categories'], ['Fixed', 'Fee Model'], ['< Market', 'Always']],
    'MOBILE APP DEVELOPMENT'
  );
  const dataPage = `<div class="page">
    <div class="section-head">
      <h2>02 — Mobile App Development</h2>
      <span class="section-num mono">${MOB.length} CATEGORIES</span>
    </div>
    <p class="section-blurb">Native Android/iOS, cross-platform Flutter/React Native builds, and full-stack mobile-plus-backend systems — priced by platform and complexity.</p>
    ${tableHTML(MOB)}
    ${footer('Section 02 — Mobile Apps')}
  </div>`;
  return shell('Orvion — Mobile App Pricing 2026', cover + legendPage() + dataPage + addonsPage('03'));
}

// ── Build PDF 3: Automation + SaaS ───────────────────────────────────────────
function buildSaaSHTML() {
  const totalSaaS = ALL_SAAS.length;
  const cover = coverPage(
    'Automation, SaaS &',
    '<br>Custom Software — 2026',
    [['22', 'Automation'], [String(totalSaaS), 'SaaS Categories'], ['12', 'Verticals']],
    'SAAS & CUSTOM SOFTWARE'
  );
  const autoPage = `<div class="page">
    <div class="section-head">
      <h2>03 — Automation</h2>
      <span class="section-num mono">${AUTO.length} CATEGORIES</span>
    </div>
    <p class="section-blurb">WhatsApp bots, AI chatbots, RPA, agentic workflows, document automation and marketing/data pipelines.</p>
    ${tableHTML(AUTO)}
    ${footer('Section 03 — Automation')}
  </div>`;
  const saasGroupPages = SAAS.map(([groupName, items]) =>
    `<div class="group-title">${groupName}</div>${tableHTML(items)}`
  ).join('');
  const saasPage = `<div class="page">
    <div class="section-head">
      <h2>04 — SaaS & Custom Business Software</h2>
      <span class="section-num mono">${totalSaaS} CATEGORIES · 12 VERTICALS</span>
    </div>
    <p class="section-blurb">Every business-software vertical grouped by function — Sales, Finance, HR, Operations, Education, Healthcare, Logistics, Real Estate, Retail, Manufacturing, Niche, and Enterprise.</p>
    ${saasGroupPages}
    ${footer('Section 04 — SaaS & Custom Software')}
  </div>`;
  return shell('Orvion — SaaS & Custom Software Pricing 2026',
    cover + legendPage() + autoPage + saasPage + addonsPage('05'));
}

// ── Build Combined PDF (all sections) ────────────────────────────────────────
function buildCombinedHTML() {
  const totalAll = WEB.length + MOB.length + AUTO.length + ALL_SAAS.length;
  const cover = coverPage(
    'Pricing Intelligence',
    '<br>Report — 2026',
    [[String(totalAll) + '+', 'Priced Categories'], ['4', 'Service Lines'], ['12', 'SaaS Verticals'], ['Fixed', 'Fee Model']],
    'PRICING INTELLIGENCE'
  );
  const webPage = `<div class="page">
    <div class="section-head"><h2>01 — Website Development</h2><span class="section-num mono">${WEB.length} CATEGORIES</span></div>
    <p class="section-blurb">From a single landing page to fully custom headless commerce.</p>
    ${tableHTML(WEB)}
    ${footer('Section 01 — Website Development')}
  </div>`;
  const mobPage = `<div class="page">
    <div class="section-head"><h2>02 — Mobile App Development</h2><span class="section-num mono">${MOB.length} CATEGORIES</span></div>
    <p class="section-blurb">Native Android/iOS, cross-platform builds, and full-stack mobile-plus-backend systems.</p>
    ${tableHTML(MOB)}
    ${footer('Section 02 — Mobile Apps')}
  </div>`;
  const autoPage = `<div class="page">
    <div class="section-head"><h2>03 — Automation</h2><span class="section-num mono">${AUTO.length} CATEGORIES</span></div>
    <p class="section-blurb">WhatsApp bots, AI chatbots, RPA, agentic workflows, document automation and marketing/data pipelines.</p>
    ${tableHTML(AUTO)}
    ${footer('Section 03 — Automation')}
  </div>`;
  const saasGroupPages = SAAS.map(([groupName, items]) =>
    `<div class="group-title">${groupName}</div>${tableHTML(items)}`
  ).join('');
  const saasPage = `<div class="page">
    <div class="section-head"><h2>04 — SaaS & Custom Business Software</h2><span class="section-num mono">${ALL_SAAS.length} CATEGORIES · 12 VERTICALS</span></div>
    <p class="section-blurb">Every business-software vertical — Sales, Finance, HR, Operations, Education, Healthcare, Logistics, Real Estate, Retail, Manufacturing, Niche, and Enterprise.</p>
    ${saasGroupPages}
    ${footer('Section 04 — SaaS & Custom Software')}
  </div>`;
  return shell('Orvion — Full Pricing Intelligence Report 2026',
    cover + legendPage() + webPage + mobPage + autoPage + saasPage + addonsPage('05'));
}

// ── Write HTML & generate PDFs ────────────────────────────────────────────────
const htmlFiles = [
  { file: 'pricing-website.html',  html: buildWebsiteHTML(),  pdf: 'Orvion-Pricing-Website-Development.pdf' },
  { file: 'pricing-mobile.html',   html: buildMobileHTML(),   pdf: 'Orvion-Pricing-Mobile-App-Development.pdf' },
  { file: 'pricing-saas.html',     html: buildSaaSHTML(),     pdf: 'Orvion-Pricing-SaaS-Custom-Software.pdf' },
  { file: 'pricing-combined.html', html: buildCombinedHTML(), pdf: 'Orvion-Pricing-Intelligence-Report.pdf' },
];

for (const { file, html } of htmlFiles) {
  writeFileSync(path.join(__dirname, file), html, 'utf8');
  console.log('✓ HTML written:', file);
}

console.log('\nLaunching browser...');
const browser = await chromium.launch();

for (const { file, pdf } of htmlFiles) {
  const htmlPath = path.join(__dirname, file).replace(/\\/g, '/');
  const pdfPath  = path.join(PUBLIC, pdf);
  const page = await browser.newPage();
  await page.goto(`file:///${htmlPath}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('body[data-render-done="true"]');
  await page.evaluateHandle('document.fonts.ready');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
  });
  await page.close();
  console.log('✓ PDF saved:', pdf);
}

await browser.close();
console.log('\n✅ All 4 PDFs written to public/');
