import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SRC = path.join(__dirname, 'handover.html');
const OUT = path.join(ROOT, 'presentation', 'kiddies-town-handover-pack.pdf');

if (!fs.existsSync(CHROME)) {
  console.error('Chrome not found at:', CHROME);
  process.exit(1);
}

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();
await page.goto('file:///' + SRC.replace(/\\/g, '/'), { waitUntil: 'networkidle' });

await page.pdf({
  path: OUT,
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
  displayHeaderFooter: true,
  headerTemplate: `<div style="width:100%;font-size:7.5px;color:#94a3b8;font-family:'Segoe UI',Arial,sans-serif;padding:0 14mm;display:flex;justify-content:space-between;">
    <span>Kiddies Town ECD &amp; Academy — Official Handover Pack v1.0</span>
    <span>Confidential — Client Only</span></div>`,
  footerTemplate: `<div style="width:100%;font-size:7.5px;color:#94a3b8;font-family:'Segoe UI',Arial,sans-serif;padding:0 14mm;display:flex;justify-content:space-between;">
    <span>22 August 2026</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
});

await browser.close();
console.log('PDF written:', OUT, '(' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
