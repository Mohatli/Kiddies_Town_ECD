import { chromium } from 'playwright-core';

const EXE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath: EXE, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
await page.fill('input[type="text"]', 'parent@kiddiestown.co.za');
await page.fill('input[type="password"]', 'parent');
await page.click('button[type="submit"]');
await page.waitForURL('**/parent', { timeout: 15000 });
await page.click('text=School Calendar');
await page.waitForTimeout(1200);

const text = await page.locator('body').innerText();
console.log('legend uppercase present:', /UPCOMING EVENT/.test(text) && /PAST EVENT/.test(text) && /TODAY/.test(text));
console.log('past/upcoming chips:', (text.match(/(Upcoming|Past) •/gi) || []).join(' | '));

// Screenshot calendar area for visual shade verification
const cal = page.locator('text=School Event Calendar').first();
await page.screenshot({ path: '.tmp/calendar.png', fullPage: false });

// Count shaded event cells in current month view (Aug 2026: past=12th, upcoming none... Sep has upcoming)
const slateCells = await page.locator('button.bg-gradient-to-br.from-slate-200').count();
console.log('past-event cells visible (slate):', slateCells);
await browser.close();
