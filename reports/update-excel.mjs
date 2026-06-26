import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FILE     = path.join(__dirname, 'Orvion-Pricing-Matrix.xlsx');
const OUT_FILE = path.join(__dirname, 'Orvion-Pricing-Matrix-v2.xlsx');
const COMPLEXITY_SET = new Set(['Basic', 'Medium', 'High', 'Enterprise']);

// ── WEEK BUMP BY COMPLEXITY ───────────────────────────────────────────────────
const WK_BUMP = { Basic: 0, Medium: 1, High: 2, Enterprise: 3 };

function parseWeeks(str) {
  if (!str) return null;
  const nums = String(str).match(/\d+/g);
  if (!nums) return null;
  if (nums.length === 1) return { min: +nums[0], max: +nums[0] };
  return { min: +nums[0], max: +nums[nums.length - 1] };
}

function calcOrvionDelivery(marketDelivery, complexity) {
  const parsed = parseWeeks(marketDelivery);
  if (!parsed) return null;
  const bump = WK_BUMP[complexity] ?? 0;
  const min = parsed.min + bump;
  const max = parsed.max + bump;
  return min === max ? `${min} wks` : `${min}–${max} wks`;
}

// ── PRICE PARSING (handles ₹Xk, ₹XL, ₹X.XL formats) ────────────────────────
function parseToLakh(str) {
  if (!str) return 0;
  const s = String(str).replace(/,/g, '');
  // ₹Xk or Xk
  const kMatch = s.match(/([\d.]+)\s*[kK]/);
  if (kMatch) return parseFloat(kMatch[1]) / 100;
  // ₹X.XL or XL (lakh)
  const lMatch = s.match(/([\d.]+)\s*[lL]/);
  if (lMatch) return parseFloat(lMatch[1]);
  return 0;
}

function parseMarketBuildPrice(str) {
  if (!str) return { min: 0, max: 0 };
  const s = String(str);
  // Find all price tokens separated by "to", "–", "-"
  const parts = s.split(/\s*(?:to|–|-)\s*/i).filter(p => /\d/.test(p));
  if (parts.length === 0) return { min: 0, max: 0 };
  const vals = parts.map(parseToLakh).filter(v => v > 0);
  if (vals.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

function parseMaintRange(str) {
  if (!str) return null;
  const s = String(str);
  // collect all money tokens — handles both ₹Xk and ₹X.XL inside the string
  const tokens = [...s.matchAll(/([\d.]+)\s*([kKlL])/g)];
  if (tokens.length < 2) return null;
  const vals = tokens.map(m => {
    const n = parseFloat(m[1]);
    return /[kK]/.test(m[2]) ? n / 100 : n;  // k → lakh
  });
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

// Smart formatter: below 1L → show in k, 1L and above → show in L
function fmtMoney(lakh) {
  if (lakh <= 0) return '₹0';
  if (lakh < 1) {
    const k = Math.round(lakh * 100);   // e.g. 0.05 → 5k
    return `₹${k}k`;
  }
  const r = Math.round(lakh * 100) / 100;
  const s = r % 1 === 0 ? r.toString() : r.toFixed(2).replace(/\.?0+$/, '');
  return `₹${s}L`;
}

function calcOrvionMaint(marketBuildPriceStr, marketMaintStr) {
  const build = parseMarketBuildPrice(marketBuildPriceStr);
  const maint = parseMaintRange(marketMaintStr);
  if (!maint) return null;
  // Build price >= 1L → deduct ₹5k (0.05L), else → deduct ₹1k (0.01L)
  const deduct = build.max >= 1 ? 0.05 : 0.01;
  const lo = Math.max(0, maint.min - deduct);
  const hi = Math.max(0, maint.max - deduct);
  return `${fmtMoney(lo)} – ${fmtMoney(hi)} / yr`;
}


// ── COLOUR PALETTE ────────────────────────────────────────────────────────────
const C = {
  // Orvion Price → vibrant terracotta
  ORV_PRICE_BG:   { argb: 'FFC75B3A' },
  ORV_PRICE_FG:   { argb: 'FFFFFFFF' },
  // Orvion Delivery → forest green
  ORV_DEL_BG:     { argb: 'FF1B7A4A' },
  ORV_DEL_FG:     { argb: 'FFFFFFFF' },
  // Orvion Maint → teal
  ORV_MAINT_BG:   { argb: 'FF2D6E6A' },
  ORV_MAINT_FG:   { argb: 'FFFFFFFF' },
  // Market columns → charcoal text on muted ivory
  MKT_BG_EVEN:    { argb: 'FFFFFFFF' },
  MKT_BG_ODD:     { argb: 'FFF0EAE0' },
  MKT_FG:         { argb: 'FF1A1A1A' },
  // Section / group headers
  SECTION_BG:     { argb: 'FF1A1A1A' },
  SECTION_FG:     { argb: 'FFFFFFFF' },
  GROUP_BG:       { argb: 'FFC75B3A' },
  GROUP_FG:       { argb: 'FFFFFFFF' },
  COL_HDR_BG:     { argb: 'FF1A1A1A' },
  COL_HDR_FG:     { argb: 'FFFFFFFF' },
  // Complexity badges
  BASIC_BG:       { argb: 'FFB0BEC5' },
  BASIC_FG:       { argb: 'FF1A1A1A' },
  MEDIUM_BG:      { argb: 'FFD4A564' },
  MEDIUM_FG:      { argb: 'FF1A1A1A' },
  HIGH_BG:        { argb: 'FFC75B3A' },
  HIGH_FG:        { argb: 'FFFFFFFF' },
  ENT_BG:         { argb: 'FF1A1A1A' },
  ENT_FG:         { argb: 'FFFFFFFF' },
  BORDER:         { argb: 'FFE5DDD3' },
};

function solidFill(color) {
  return { type: 'pattern', pattern: 'solid', fgColor: color };
}
function thinBorder() {
  return { bottom: { style: 'thin', color: C.BORDER }, right: { style: 'thin', color: C.BORDER } };
}
function complexityStyle(complexity) {
  switch (complexity) {
    case 'Basic':      return { fill: solidFill(C.BASIC_BG),  font: { bold: true, size: 10, color: C.BASIC_FG } };
    case 'Medium':     return { fill: solidFill(C.MEDIUM_BG), font: { bold: true, size: 10, color: C.MEDIUM_FG } };
    case 'High':       return { fill: solidFill(C.HIGH_BG),   font: { bold: true, size: 10, color: C.HIGH_FG } };
    case 'Enterprise': return { fill: solidFill(C.ENT_BG),    font: { bold: true, size: 10, color: C.ENT_FG } };
    default:           return {};
  }
}

function isBlank(val) {
  if (val == null) return true;
  const s = String(val).trim();
  return s === '' || s.toLowerCase().includes('fill in');
}

// ── APPLY STYLING TO A DATA ROW (main sheets, 9 columns) ─────────────────────
function styleMainDataRow(row, rowIndex) {
  const isOdd = rowIndex % 2 === 1;
  const mktBg = solidFill(isOdd ? C.MKT_BG_ODD : C.MKT_BG_EVEN);

  // Col 1: Category name
  const c1 = row.getCell(1);
  c1.fill = mktBg; c1.font = { bold: true, size: 10, color: C.MKT_FG }; c1.alignment = { vertical: 'middle', wrapText: true }; c1.border = thinBorder();
  // Col 2: Industries
  const c2 = row.getCell(2);
  c2.fill = mktBg; c2.font = { size: 9.5, color: { argb: 'FF544E45' } }; c2.alignment = { vertical: 'middle', wrapText: true }; c2.border = thinBorder();
  // Col 3: Complexity badge
  const c3 = row.getCell(3);
  const cs = complexityStyle(String(row.getCell(3).value || ''));
  c3.fill = cs.fill || mktBg; c3.font = cs.font || { size: 10 }; c3.alignment = { vertical: 'middle', horizontal: 'center' }; c3.border = thinBorder();
  // Col 4: Market Price
  const c4 = row.getCell(4);
  c4.fill = mktBg; c4.font = { bold: true, size: 10, color: C.MKT_FG }; c4.alignment = { vertical: 'middle' }; c4.border = thinBorder();
  // Col 5: Market Delivery
  const c5 = row.getCell(5);
  c5.fill = mktBg; c5.font = { size: 10, color: C.MKT_FG }; c5.alignment = { vertical: 'middle' }; c5.border = thinBorder();
  // Col 6: Market Maint
  const c6 = row.getCell(6);
  c6.fill = mktBg; c6.font = { size: 9.5, color: C.MKT_FG }; c6.alignment = { vertical: 'middle' }; c6.border = thinBorder();
  // Col 7: ORVION Price → terracotta
  const c7 = row.getCell(7);
  c7.fill = solidFill(C.ORV_PRICE_BG); c7.font = { bold: true, size: 11, color: C.ORV_PRICE_FG }; c7.alignment = { vertical: 'middle', horizontal: 'center' }; c7.border = { bottom: { style: 'thin', color: C.BORDER }, right: { style: 'medium', color: { argb: 'FFFFFFFF' } } };
  // Col 8: ORVION Delivery → forest green
  const c8 = row.getCell(8);
  c8.fill = solidFill(C.ORV_DEL_BG); c8.font = { bold: true, size: 10.5, color: C.ORV_DEL_FG }; c8.alignment = { vertical: 'middle', horizontal: 'center' }; c8.border = thinBorder();
  // Col 9: ORVION Maint → teal
  const c9 = row.getCell(9);
  c9.fill = solidFill(C.ORV_MAINT_BG); c9.font = { bold: true, size: 10, color: C.ORV_MAINT_FG }; c9.alignment = { vertical: 'middle', horizontal: 'center' }; c9.border = thinBorder();

  row.height = 20;
}


// ── STYLE SECTION HEADER ─────────────────────────────────────────────────────
function styleSectionRow(row, colCount) {
  row.getCell(1).fill = solidFill(C.SECTION_BG);
  row.getCell(1).font = { bold: true, size: 13, color: C.SECTION_FG };
  row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  row.height = 28;
}

// ── STYLE GROUP HEADER ────────────────────────────────────────────────────────
function styleGroupRow(row) {
  row.getCell(1).fill = solidFill(C.GROUP_BG);
  row.getCell(1).font = { bold: true, size: 10.5, color: C.GROUP_FG };
  row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  row.height = 20;
}

// ── STYLE COLUMN HEADER ROW ──────────────────────────────────────────────────
function styleColHdrRow(row) {
  row.eachCell(cell => {
    cell.fill = solidFill(C.COL_HDR_BG);
    cell.font = { bold: true, size: 9.5, color: C.COL_HDR_FG };
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.border = { bottom: { style: 'medium', color: { argb: 'FFC75B3A' } }, right: { style: 'thin', color: C.BORDER } };
  });
  row.height = 22;
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(FILE);

// ──── PROCESS MAIN SHEETS (01–04) ────────────────────────────────────────────
const MAIN_SHEET_NAMES = ['01 — Website', '02 — Mobile Apps', '03 — Automation', '04 — SaaS & Custom Software'];
const COL_HDRS = ['Category / Service', 'Industries', 'Complexity', 'Market Price', 'Market Delivery', 'Market Maint / yr', 'ORVION Price', 'ORVION Delivery', 'ORVION Maint / yr'];

for (const sheetName of MAIN_SHEET_NAMES) {
  const ws = wb.getWorksheet(sheetName);
  if (!ws) { console.warn(`Sheet not found: ${sheetName}`); continue; }

  let dataRowCount = 0;

  ws.eachRow((row, rowNum) => {
    const v1 = String(row.getCell(1).value || '').trim();
    const v3 = String(row.getCell(3).value || '').trim();

    // Detect row type by checking if col 3 is a complexity value
    const isDataRow = COMPLEXITY_SET.has(v3);
    const isColHdr  = v1 === 'Category / Service';
    const isSectionHdr = !isDataRow && !isColHdr && v1 === v3; // merged = section/group

    if (isDataRow) {
      dataRowCount++;
      const complexity    = v3;
      const marketDel     = String(row.getCell(5).value || '').trim();
      const marketPrice   = String(row.getCell(4).value || '').trim();
      const marketMaint   = String(row.getCell(6).value || '').trim();

      // Auto-fill ORVION Delivery if blank
      if (isBlank(row.getCell(8).value)) {
        const d = calcOrvionDelivery(marketDel, complexity);
        if (d) row.getCell(8).value = d;
      }

      // Auto-fill ORVION Maint if blank
      if (isBlank(row.getCell(9).value)) {
        const m = calcOrvionMaint(marketPrice, marketMaint);
        if (m) row.getCell(9).value = m;
      }

      styleMainDataRow(row, dataRowCount);

    } else if (isColHdr) {
      styleColHdrRow(row);
      dataRowCount = 0; // reset alt-row counter for each group
    } else if (isSectionHdr && v1 !== '') {
      // Determine if section (row 3, spans all) or group (pink)
      // Section header: the first occurrence in a sheet or large sections
      // Group header: repeating groups in SaaS sheet
      // Simple heuristic: if it appears before a col header, it could be either
      // Use: if v1 contains '—' or starts with '0' it's a section, else group
      if (v1.match(/^\d+\s*—/) || v1.startsWith('0')) {
        styleSectionRow(row, 9);
      } else {
        styleGroupRow(row);
      }
    }
  });

  // Re-ensure column widths
  ws.getColumn(1).width = 40;
  ws.getColumn(2).width = 26;
  ws.getColumn(3).width = 12;
  ws.getColumn(4).width = 18;
  ws.getColumn(5).width = 15;
  ws.getColumn(6).width = 18;
  ws.getColumn(7).width = 18;
  ws.getColumn(8).width = 15;
  ws.getColumn(9).width = 18;

  ws.views = [{ state: 'frozen', ySplit: 4, xSplit: 1 }];
  console.log(`✓ Processed: ${sheetName}`);
}

// ──── REMOVE MAINTENANCE SHEET (05) ──────────────────────────────────────────
{
  const ws = wb.getWorksheet('05 — Maintenance');
  if (ws) { wb.removeWorksheet(ws.id); console.log('✓ Removed: 05 — Maintenance'); }
}

// ──── PROCESS ADD-ONS SHEET (06) ─────────────────────────────────────────────
{
  const ws = wb.getWorksheet('06 — Add-ons');
  if (ws) {
    let dataRowCount = 0;
    ws.eachRow((row) => {
      const v1 = String(row.getCell(1).value || '').trim();
      const v2 = String(row.getCell(2).value || '').trim();
      // Detect add-on data row: col 1 has a name, not a header
      const isColHdr = v1 === 'Add-on Name';
      const isMergedHdr = v1 === v2 && v1 !== '' && !isColHdr;

      if (isColHdr) {
        styleColHdrRow(row);
        dataRowCount = 0;
      } else if (isMergedHdr) {
        styleSectionRow(row, 3);
      } else if (v1 !== '' && !isMergedHdr && !isColHdr) {
        dataRowCount++;
        const isOdd = dataRowCount % 2 === 1;
        const mktBg = solidFill(isOdd ? C.MKT_BG_ODD : C.MKT_BG_EVEN);
        const c1 = row.getCell(1); c1.fill = mktBg; c1.font = { bold: true, size: 10, color: C.MKT_FG }; c1.alignment = { vertical: 'middle' }; c1.border = thinBorder();
        const c2 = row.getCell(2);
        c2.fill = solidFill(C.ORV_PRICE_BG); c2.font = { bold: true, size: 11, color: C.ORV_PRICE_FG }; c2.alignment = { vertical: 'middle', horizontal: 'center' }; c2.border = thinBorder();
        const c3 = row.getCell(3); c3.fill = mktBg; c3.font = { size: 10, color: { argb: 'FF544E45' } }; c3.alignment = { vertical: 'middle' }; c3.border = thinBorder();
        row.height = 20;
      }
    });
    ws.getColumn(1).width = 48;
    ws.getColumn(2).width = 24;
    ws.getColumn(3).width = 40;
    console.log('✓ Processed: 06 — Add-ons');
  }
}

// ──── SAVE ────────────────────────────────────────────────────────────────────
await wb.xlsx.writeFile(OUT_FILE);
console.log('\n✅ Saved:', OUT_FILE);
