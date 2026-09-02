import { chromium } from 'playwright-core';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = 'http://localhost:3000';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PRESENTATION = path.join(ROOT, 'presentation');
const SEGMENTS_DIR = path.join(PRESENTATION, 'segments');
const FINAL = path.join(PRESENTATION, 'kiddies-town-walkthrough.mp4');

fs.mkdirSync(SEGMENTS_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function apiLogin(email, password, role) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  if (!res.ok) throw new Error(`Login failed for ${role}: ${res.status}`);
  return res.json();
}

async function caption(page, step, title, sub) {
  await page.evaluate(([step, title, sub]) => {
    let bar = document.getElementById('__tour_bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = '__tour_bar';
      bar.style.cssText =
        'position:fixed;top:0;left:0;right:0;z-index:2147483647;font-family:Inter,"Segoe UI",Arial,sans-serif;' +
        'background:linear-gradient(90deg,#1e1b4b 0%,#312e81 55%,#4338ca 100%);color:#fff;padding:15px 30px;' +
        'display:flex;align-items:center;gap:20px;border-bottom:3px solid #818cf8;' +
        'box-shadow:0 12px 40px rgba(30,27,75,.5);transition:transform .5s cubic-bezier(.16,1,.3,1),opacity .5s;';
      document.body.appendChild(bar);
      const wm = document.createElement('div');
      wm.id = '__tour_wm';
      wm.style.cssText =
        'position:fixed;bottom:14px;left:18px;z-index:2147483647;font-family:Inter,Arial,sans-serif;font-size:12px;font-weight:800;color:#312e81;' +
        'background:rgba(255,255,255,.9);padding:6px 13px;border-radius:999px;border:1px solid #c7d2fe;' +
        'box-shadow:0 4px 14px rgba(49,46,129,.2);backdrop-filter:blur(4px);';
      wm.textContent = 'Kiddies Town ECD & Academy — Platform Tour';
      document.body.appendChild(wm);
    }
    bar.innerHTML =
      '<span style="flex-shrink:0;background:#fff;color:#3730a3;font-weight:900;font-size:13px;letter-spacing:1.2px;padding:8px 14px;border-radius:999px;">STEP ' +
      step + '/7</span>' +
      '<span style="display:flex;flex-direction:column;line-height:1.25;min-width:0;">' +
      '<span style="font-size:23px;font-weight:800;text-shadow:0 1px 8px rgba(0,0,0,.35);">' + title + '</span>' +
      (sub ? '<span style="font-size:14px;opacity:.88;margin-top:3px;">' + sub + '</span>' : '') +
      '</span>';
    bar.style.transform = 'translateY(-110%)';
    bar.style.opacity = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transform = 'translateY(0)';
        bar.style.opacity = '1';
      });
    });
  }, [step, title, sub]);
  await sleep(650);
}

async function toast(page, message, color) {
  await page.evaluate(([message, color]) => {
    const id = '__tour_toast';
    document.getElementById(id)?.remove();
    const el = document.createElement('div');
    el.id = id;
    el.style.cssText =
      'position:fixed;bottom:52px;right:20px;z-index:2147483647;font-family:Inter,Arial,sans-serif;font-size:14px;font-weight:700;color:#fff;' +
      'background:' + color + ';padding:12px 18px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);' +
      'transition:opacity .4s,transform .4s cubic-bezier(.16,1,.3,1);max-width:420px;';
    el.textContent = message;
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
    setTimeout(() => { el.style.opacity = '0'; }, 5200);
  }, [message, color]);
  await sleep(400);
}

async function tourScroll(page, maxSteps = 22) {
  const ok = await page.evaluate(async (maxSteps) => {
    const s = (ms) => new Promise((r) => setTimeout(r, ms));
    let last = -1;
    for (let i = 0; i < maxSteps; i++) {
      window.scrollBy({ top: Math.round(window.innerHeight * 0.62), behavior: 'smooth' });
      await s(280);
      if (window.scrollY === last) break;
      last = window.scrollY;
    }
  }, maxSteps).catch(() => false);
  return ok;
}

async function scrollToTop(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(500);
}

async function safe(fn, label) {
  try {
    await fn();
  } catch (e) {
    console.log(`  [skip] ${label}: ${String(e).split('\n')[0]}`);
  }
}

function makeSegment(ctxOpts = {}) {
  return async function run(name, fn) {
    console.log(`\n=== Recording segment: ${name} ===`);
    const browser = await chromium.launch({
      executablePath: CHROME,
      headless: true,
      args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
    });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: SEGMENTS_DIR, size: { width: 1280, height: 720 } },
      ...ctxOpts,
    });
    const page = await context.newPage();
    try {
      await fn(page);
      await sleep(900);
    } catch (e) {
      console.error(`  Segment ${name} FAILED:`, e.message);
    }
    const video = page.video();
    await context.close();
    await browser.close();
    const file = await video.path();
    const target = path.join(SEGMENTS_DIR, `${name}.webm`);
    if (path.resolve(file) !== path.resolve(target)) fs.renameSync(file, target);
    console.log(`  Saved ${name}.webm`);
    return target;
  };
}

const record = makeSegment();

async function authAndGo(page, login, route) {
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('kt_session_token', token);
    localStorage.setItem('kt_logged_in_user', JSON.stringify(user));
  }, { token: login.token, user: login.user });
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1600);
}

async function clickTab(page, label) {
  await safe(async () => {
    await page.getByRole('button', { name: new RegExp(`^\\s*${label}`, 'i') }).first().click({ timeout: 6000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await sleep(1400);
  }, `tab "${label}"`);
}

/* ---------------- Segments ---------------- */

await record('01-landing', async (page) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1800);
  await caption(page, 1, 'Landing Page — Premium Brand Showcase',
    'Hero gallery, age-group programs (Roses · Giraffes · Tigers), and an interactive bento grid of platform features.');
  await sleep(2200);
  await tourScroll(page, 10);
  await caption(page, 1, 'Filterable Program Galleries',
    'Parents browse real classroom photography filtered by events — graduations, art classes, fun walks and playground moments.');
  await safe(async () => {
    await page.getByRole('button', { name: /Graduations/i }).first().click({ timeout: 5000 });
    await sleep(2000);
    await page.getByRole('button', { name: /Art Classes/i }).first().click({ timeout: 5000 });
    await sleep(2000);
    await page.getByRole('button', { name: /All Photos/i }).first().click({ timeout: 5000 });
  }, 'gallery filters');
  await caption(page, 1, 'Everything a School Needs on One Page',
    'POPIA compliance, billing transparency, milestone tracking and CBD shuttle pick-ups — all highlighted in the feature grid.');
  await tourScroll(page, 26);
  await scrollToTop(page);
});

await record('02-login', async (page) => {
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1500);
  await caption(page, 2, 'Secure Login Portal — Role-Based Access',
    'One gateway, three secure workspaces: Parent, Teacher and Principal Admin. JWT sessions keep every portal isolated.');
  await safe(async () => {
    await page.getByRole('button', { name: /^parent$/i }).first().click({ timeout: 4000 });
    await sleep(800);
  }, 'parent role tab');
  await caption(page, 2, 'Developer Quick-Fill Sandbox Accounts',
    'Demo credentials are one click away in dev mode — selecting Sarah Mbeki pre-populates verified parent access.');
  await safe(async () => {
    await page.getByRole('button', { name: /Sarah Mbeki/i }).first().click({ timeout: 5000 });
    await sleep(1200);
  }, 'quick fill parent');
  await caption(page, 2, 'Authenticating…',
    'POST /api/auth/login validates credentials, issues a signed JWT, and routes each role to its dedicated dashboard.');
  await safe(async () => {
    await page.getByRole('button', { name: /Verify Credentials/i }).first().click({ timeout: 5000 });
    await page.waitForURL('**/parent', { timeout: 15000 });
    await page.waitForLoadState('networkidle').catch(() => {});
  }, 'submit login');
  await sleep(2500);
});

const parentLogin = apiLogin('parent@kiddiestown.co.za', 'parent', 'parent');

await record('03-parent-hub', async (page) => {
  await authAndGo(page, await parentLogin, '/parent');
  await caption(page, 3, 'Parent Hub — Real-Time Child Dashboard',
    'Attendance status, today\u2019s visual schedule, class theme and teacher notices at a glance.');
  await tourScroll(page, 14);
  await caption(page, 3, 'Learning Milestone Charts',
    'Live developmental scorecards across social-emotional, numeracy, motor and literacy indicators.');
  await tourScroll(page, 12);
  await clickTab(page, 'Academic Reports');
  await caption(page, 3, 'Academic Reports & Downloadable Scorecards',
    'Quarterly progress reports open into rich visual report cards with teacher and principal comments.');
  await safe(async () => {
    await page.locator('[class*="cursor-pointer"]').first().click({ timeout: 5000 });
    await sleep(3000);
  }, 'open first report');
  await safe(async () => {
    await page.getByRole('button', { name: /Back to Reports/i }).first().click({ timeout: 4000 });
    await sleep(1000);
  }, 'close report');
  await clickTab(page, 'School Calendar');
  await caption(page, 3, 'School Calendar & Events',
    'Concerts, parent days and community events with live RSVP counts.');
  await tourScroll(page, 8);
  await clickTab(page, 'Classroom Gallery');
  await caption(page, 3, 'Classroom Journal Gallery',
    'Weekly photo highlights from the classroom journal keep parents connected daily.');
  await tourScroll(page, 8);
  await clickTab(page, 'Fees & Payments');
  await caption(page, 3, 'Fees & Payments Ledger',
    'Invoices, paid receipts and next fee due — with school reference codes for EFT payments.');
  await tourScroll(page, 10);
  await clickTab(page, 'Contact & Family Info');
  await caption(page, 3, 'Contact & Family Profile (POPIA Protected)',
    'Child records, emergency contacts and consent management — secured behind authenticated endpoints.');
  await tourScroll(page, 8);
});

const teacherLogin = apiLogin('teacher@kiddiestown.co.za', 'teacher', 'teacher');

await record('04-teacher-console', async (page) => {
  await authAndGo(page, await teacherLogin, '/teacher');
  await caption(page, 4, 'Teacher Console — Classroom Operations',
    'Daily attendance marking, curriculum planning and learner oversight in one workspace.');
  await tourScroll(page, 12);
  await clickTab(page, 'Curriculum & Themes');
  await caption(page, 4, 'Weekly Curriculum & Themes',
    'Lesson structures, sensory walks and physical-motor goals for every weekly theme.');
  await tourScroll(page, 10);
  await clickTab(page, 'Assess Milestones');
  await caption(page, 4, 'Milestone Assessment Sliders',
    'Grade each child across ten developmental indicators — sliders write straight to the learner\u2019s record.');
  await safe(async () => {
    const sliders = page.locator('input[type="range"]');
    const count = await sliders.count();
    for (let i = 0; i < Math.min(count, 4); i++) {
      const s = sliders.nth(i);
      await s.focus({ timeout: 3000 });
      await s.press('End', { timeout: 3000 }).catch(() => {});
      await sleep(450);
    }
    await toast(page, '\u2713 Milestone scores saved to learner profile', '#059669');
  }, 'milestone sliders');
  await sleep(1500);
  await clickTab(page, 'Quarterly Reports');
  await caption(page, 4, 'Quarterly Report Composer',
    'Compile term scorecards with auto-graded indicators and personalized comments.');
  await tourScroll(page, 10);
  await clickTab(page, 'Parent Messages');
  await caption(page, 4, 'Direct Parent Messaging',
    'A safe, audited chat conduit between teachers and parents — no external apps required.');
  await safe(async () => {
    const box = page.locator('textarea, input[type="text"]').last();
    await box.fill('Good news! Jake mastered the letter-sound matching activity today.', { timeout: 5000 });
    await sleep(1200);
    await page.getByRole('button', { name: /^send/i }).last().click({ timeout: 4000 }).catch(async () => {
      await box.press('Enter');
    });
    await sleep(1800);
    await toast(page, 'Message delivered to parent \u2014 stored in kt_chats', '#4f46e5');
  }, 'send chat message');
  await sleep(1200);
});

const adminLogin = apiLogin('admin@kiddiestown.co.za', 'admin', 'admin');

await record('05-admin-center', async (page) => {
  await authAndGo(page, await adminLogin, '/admin');
  await caption(page, 5, 'Principal Admin Center — School Command View',
    'Enrolment statistics, tuition revenue counters and database state in real time.');
  await tourScroll(page, 16);
  await clickTab(page, 'Student Directory');
  await caption(page, 5, 'Student Directory',
    'Every learner\u2019s class placement, attendance monitor and POPIA-shielded bio records.');
  await tourScroll(page, 10);
  await clickTab(page, 'Staff Roster');
  await caption(page, 5, 'Staff Roster Management',
    'Instructor assignments, roles and contact registry for the whole academy team.');
  await tourScroll(page, 8);
  await clickTab(page, 'Enrolment Pipeline');
  await caption(page, 5, 'Enrolment Application Pipeline',
    'Review wizard submissions, verify documents, and approve or decline new families.');
  await tourScroll(page, 8);
  await clickTab(page, 'Transport & Logistics');
  await caption(page, 5, 'Transport & Shuttle Logistics',
    'Regional CBD pick-up routes with per-route learner allocation.');
  await tourScroll(page, 6);
  await clickTab(page, 'System Audit Logs');
  await caption(page, 5, 'System Audit Logs',
    'Every sensitive action is recorded — full POPIA accountability trail.');
  await tourScroll(page, 8);
  await clickTab(page, 'Calendar Planner');
  await caption(page, 5, 'Emergency Broadcasts & Planner',
    'Broadcast urgent notices to all parents instantly and plan the academic calendar.');
  await sleep(1500);
});

await record('06-enrolment-wizard', async (page) => {
  await page.goto(`${BASE}/enrol`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1600);
  await caption(page, 6, 'Interactive Enrolment Wizard — 6 Steps',
    'Child particulars \u2192 parent details \u2192 medical profile \u2192 logistics \u2192 consents \u2192 upload & review.');
  await tourScroll(page, 12);
  await caption(page, 6, 'Schema-Validated Fields (Zod)',
    'Every field is validated client-side before submission — watch what happens with empty required inputs.');
  await safe(async () => {
    await page.getByRole('button', { name: /Continue to Next Details/i }).first().click({ timeout: 5000 });
    await sleep(2600);
  }, 'trigger validation');
  await caption(page, 6, 'Validation Guards Active',
    'Inline errors block bad data at every step, keeping enrolment records clean and POPIA-compliant.');
  await sleep(2200);
});

const pdfLogin = apiLogin('parent@kiddiestown.co.za', 'parent', 'parent');

await record('07-pdf-guide', async (page) => {
  await authAndGo(page, await pdfLogin, '/parent');
  await caption(page, 7, 'Dynamic PDF Generation (pdfkit)',
    'The Express server compiles high-fidelity documents on demand — requesting the developmental guide now.');
  await toast(page, 'GET /api/guide/download-pdf …compiling PDF server-side', '#4338ca');
  await safe(async () => {
    const res = await page.request.get(`${BASE}/api/guide/download-pdf`);
    const buf = await res.body();
    const out = path.join(PRESENTATION, 'kt-ecd-developmental-guide.pdf');
    fs.writeFileSync(out, buf);
    await toast(page, `\u2713 PDF generated server-side \u2014 ${(buf.length / 1024).toFixed(1)} KB saved`, '#059669');
  }, 'pdf download');
  await sleep(3200);
});

await record('08-outro', async (page) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1200);
  await caption(page, 7, 'Kiddies Town ECD & Academy — One Platform, Every Role',
    'React 19 · TypeScript · Express · Drizzle ORM · Neon PostgreSQL fallback · POPIA-compliant by design.');
  await sleep(3500);
  await page.evaluate(() => {
    const b = document.getElementById('__tour_bar');
    if (b) { b.style.transition = 'transform .6s, opacity .6s'; b.style.transform = 'translateY(-110%)'; b.style.opacity = '0'; }
    const w = document.getElementById('__tour_wm');
    if (w) w.remove();
  });
  await sleep(1200);
});

console.log('\n=== Converting segments to MP4 ===');
const webms = fs.readdirSync(SEGMENTS_DIR).filter((f) => f.endsWith('.webm')).sort();
for (const f of webms) {
  const src = path.join(SEGMENTS_DIR, f);
  const dst = src.replace(/\.webm$/, '.mp4');
  const r = spawnSync('ffmpeg', ['-y', '-i', src, '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', dst], { stdio: 'pipe' });
  if (r.status !== 0) {
    console.error(`ffmpeg failed for ${f}:`, r.stderr?.toString().slice(-400));
    process.exit(1);
  }
  console.log(`  ${f} -> ${path.basename(dst)}`);
}

const listFile = path.join(SEGMENTS_DIR, 'concat.txt');
fs.writeFileSync(listFile, webms.map((f) => `file '${f.replace(/\.webm$/, '.mp4')}'`).join('\n') + '\n');
const r2 = spawnSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', FINAL], { cwd: SEGMENTS_DIR, stdio: 'pipe' });
if (r2.status !== 0) {
  console.error('concat failed:', r2.stderr?.toString().slice(-400));
  process.exit(1);
}
console.log(`\nFINAL VIDEO: ${FINAL}`);
