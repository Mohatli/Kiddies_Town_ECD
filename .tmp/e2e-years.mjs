import { chromium } from 'playwright-core';

const BASE = 'http://localhost:3000';
const EXE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const YEAR = new Date().getFullYear();

const results = [];
const check = (name, cond) => {
  results.push({ name, pass: !!cond });
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
};

const browser = await chromium.launch({ executablePath: EXE, headless: true });
try {
  const page = await browser.newPage();
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="text"]', 'parent@kiddiestown.co.za');
  await page.fill('input[type="password"]', 'parent');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/parent', { timeout: 15000 });
  await page.waitForSelector('text=Academic Reports', { timeout: 15000 });

  // ACADEMIC REPORTS TAB
  await page.click('text=Academic Reports');
  await page.waitForTimeout(1000);
  const yearChips = await page.locator('span', { hasText: /^Year:\s*\d{4}$/ }).allTextContents();
  check(`report cards show Year ${YEAR} (${yearChips.join(', ')})`, yearChips.length > 0 && yearChips.every(t => t.includes(String(YEAR))));

  // Open detailed sheet -> header year
  await page.locator('button', { hasText: 'View Detailed Sheet' }).first().click();
  await page.waitForTimeout(800);
  const detailHeader = await page.locator('text=/Quarterly Progress Report - \\d{4}/').first().textContent();
  check(`detailed report header shows ${YEAR} ("${detailHeader?.trim()}")`, detailHeader?.includes(String(YEAR)));
  await page.locator('button', { hasText: 'Back' }).first().click();

  // Scan EVERY tab for any visible "2025"
  for (const tab of ['Notice Board & Highlights', 'School Calendar', 'Classroom Gallery', 'Fees & Payments']) {
    await page.click(`text=${tab}`);
    await page.waitForTimeout(900);
    const body = await page.locator('body').innerText();
    const hits = body.match(/.{30}2025.{20}|^\S*2025\S*/gm) || [];
    check(`no visible 2025 on "${tab}" tab`, !/2025/.test(body) ? true : hits.length === 0);
    if (/2025/.test(body)) console.log(`   -> 2025 found on ${tab}:`, body.match(/.{0,40}2025.{0,25}/g));
  }

  // Finance dates are current-year dynamic
  const financeBody = await page.locator('body').innerText();
  check('finance card shows dynamic due date', new RegExp(`Due 01 \\w+ ${YEAR}`).test(financeBody));
  check('finance card shows dynamic processed date', new RegExp(`Processed on 01 \\w+ ${YEAR}`).test(financeBody));

  // Calendar shows current month + legend
  await page.click('text=School Calendar');
  await page.waitForTimeout(700);
  const calBody = await page.locator('body').innerText();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const now = new Date();
  check(`calendar badge shows current month "${months[now.getMonth()]} ${now.getFullYear()}"`, calBody.includes(`${months[now.getMonth()]} ${now.getFullYear()}`));
  check('calendar legend shows Upcoming/Past swatches', calBody.includes('Upcoming event') && calBody.includes('Past event'));
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
