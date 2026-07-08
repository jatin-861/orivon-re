import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(path.join(__dirname, "Orvion-Pricing-Matrix.xlsx"));

for (const ws of wb.worksheets) {
  console.log(`\n=== SHEET: ${ws.name} ===`);
  ws.eachRow((row, rowNum) => {
    const vals = [];
    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      vals.push(`[${colNum}]=${JSON.stringify(cell.value)}`);
    });
    console.log(`Row ${rowNum}: ${vals.join(" | ")}`);
  });
}
