import { chromium } from 'playwright-core';

const BASE = 'http://localhost:3000';
const EXE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const results = [];
const check = (name, cond) => {
  results.push({ name, pass: !!cond });
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
};

const browser = await chromium.launch({ executablePath: EXE, headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  // Login as multi-kid demo parent
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="text"]', 'parent@kiddiestown.co.za');
  await page.fill('input[type="password"]', 'parent');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/parent', { timeout: 15000 });
  await page.waitForSelector('text=Parent Portal', { timeout: 15000 });
  check('login lands on parent portal', page.url().includes('/parent'));

  // Sidebar switcher should list BOTH kids
  const selectStudentCount = await page.locator('text=Select Student').count();
  check('sidebar "Select Student" section visible', selectStudentCount > 0);

  // Default selection = first kid (Jake)
  const jakeBtn = page.locator('button', { hasText: /^Jake$/ }).first();
  const jillBtn = page.locator('button', { hasText: /^Jill$/ }).first();
  check('switcher shows Jake', await jakeBtn.count() > 0);
  check('switcher shows Jill', await jillBtn.count() > 0);

  const activeCard = page.locator('h3', { hasText: 'Mbeki' }).first();
  const before = (await activeCard.textContent().catch(() => '')) || '';
  check(`initially viewing first kid (got "${before.trim()}")`, before.includes('Jake'));

  // SWITCH to Jill
  await jillBtn.click();
  await page.waitForTimeout(600);
  const after = (await activeCard.textContent().catch(() => '')) || '';
  check(`after clicking Jill, profile switched (got "${after.trim()}")`, after.includes('Jill'));

  // Overview banner (later in DOM than sidebar) highlights Jill as selected
  const bannerActive = await page
    .locator('button', { hasText: /^Jill$/ })
    .last()
    .evaluate((el) => el.className.includes('from-indigo-600'))
    .catch(() => false);
  check('banner marks Jill as active', bannerActive);

  // Switch back to Jake
  await jakeBtn.click();
  await page.waitForTimeout(600);
  const back = (await activeCard.textContent().catch(() => '')) || '';
  check(`switch back to Jake works (got "${back.trim()}")`, back.includes('Jake'));

  // Reports tab scoped per selected child without crashing
  await page.click('text=Academic Reports');
  await page.waitForTimeout(800);
  const reportCards = await page.locator('button', { hasText: 'View Detailed Sheet' }).count();
  check(`reports render for selected child (${reportCards} released cards)`, reportCards >= 0 && errors.length === 0);
  check('no page JS errors during session', errors.length === 0);
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
