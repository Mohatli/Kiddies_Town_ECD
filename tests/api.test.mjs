/**
 * Kiddies Town Portal — API QA Suite (@SecurityAgent + @ResilienceAgent artifacts)
 * Runner: node --test tests/   (Node >= 18, no extra deps)
 * Requires a running server on BASE (default http://localhost:3000).
 * NOTE: consumes ~7 of the 10 auth rate-limit slots per run.
 */
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.BASE || 'http://localhost:3000';
const DEMO = { parent: ['parent@kiddiestown.co.za', 'parent'], teacher: ['teacher@kiddiestown.co.za', 'teacher'] };
let parentToken, parentRefresh, teacherToken, qaUser = {};

const api = async (path, opts = {}) => {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  let body = null;
  try { body = await res.json(); } catch { /* non-JSON */ }
  return { status: res.status, body };
};
const login = async ([email, password], role) =>
  api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) });

describe('Kiddies Town API QA Orchestrator', () => {
  let parentToken, teacherToken;

  before(async () => {
    const health = await api('/api/health');
    assert.equal(health.status, 200, 'Server must be up before suite runs');
  });

  // ---------- @FrontendAgent contract: guest bootstrap payload ----------
  describe('@SecurityAgent · Guest data isolation', () => {
    test('unauthenticated /api/data exposes NO learner PII', async () => {
      const { status, body } = await api('/api/data');
      assert.equal(status, 200);
      assert.deepEqual(body.learners, [], 'guest must receive zero learner records');
      assert.equal(body.parentProfile, null);
      assert.deepEqual(body.paymentHistory, []);
      assert.deepEqual(body.enrolments, []);
      assert.deepEqual(body.parentProfiles, []);
      assert.ok(Array.isArray(body.themes) && Array.isArray(body.events), 'public feeds still served');
    });

    test('guest payload leaks no credential material', async () => {
      const { body } = await api('/api/data');
      const raw = JSON.stringify(body);
      assert.ok(!raw.includes('password'), 'raw body must not contain "password"');
      assert.ok(!raw.includes('id_number') && !raw.includes('idNumber'), 'no ID-number fields for guests');
    });

    test('garbage bearer token rejected, never downgraded to guest', async () => {
      const { status } = await api('/api/data', { headers: { Authorization: 'Bearer not.a.jwt' } });
      assert.equal(status, 401);
    });
  });

  // ---------- @SecurityAgent · Authentication ----------
  describe('@SecurityAgent · AuthN', () => {
    test('role mismatch refused even with correct credentials', async () => {
      const r = await login(DEMO.parent, 'admin');
      assert.equal(r.status, 401);
    });
    test('wrong password refused with generic message', async () => {
      const r = await login(['parent@kiddiestown.co.za', 'definitely-wrong'], 'parent');
      assert.equal(r.status, 401);
      assert.match(r.body.error, /credentials/i);
    });
    test('SQLi probe cannot authenticate (Zod gate, parameterised store)', async () => {
      const r = await login(["' OR 1=1--@evil.co", "' OR '1'='1"], 'parent');
      assert.ok([400, 401].includes(r.status), `expected 400/401, got ${r.status}`);
    });
    test('valid demo parent logs in and receives dual tokens', async () => {
      const r = await login(DEMO.parent, 'parent');
      assert.equal(r.status, 200);
      assert.equal(r.body.user.role, 'parent');
      assert.match(r.body.accessToken, /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, 'JWT shape');
      assert.ok(r.body.refreshToken);
      parentToken = r.body.accessToken;
      parentRefresh = r.body.refreshToken;
    });
    test('parent feed contains NO other households (POPIA regression guard)', async () => {
      const { status, body } = await api('/api/data', { headers: { Authorization: `Bearer ${parentToken}` } });
      assert.equal(status, 200);
      const others = (body.parentProfiles || []).filter((p) => p.email !== DEMO.parent[0]);
      assert.deepEqual(others, [], 'parent must never receive the global parent directory');
    });
    test('refresh token mints a fresh access token (no second login needed)', async () => {
      const r = await api('/api/auth/refresh-token', { method: 'POST', body: JSON.stringify({ refreshToken: parentRefresh }) });
      assert.equal(r.status, 200);
      assert.ok(r.body.accessToken);
    });
  });

  // ---------- @SecurityAgent · Authorisation ----------
  describe('@SecurityAgent · RBAC', () => {
    test("parent blocked from admin audit logs (403)", async () => {
      const r = await api('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${parentToken}` } });
      assert.equal(r.status, 403);
    });
    test('missing token on protected write is 401, not silent guest write', async () => {
      const r = await api('/api/chats', { method: 'POST', body: JSON.stringify({ id: 'qa-x', sender: 'Parent', senderName: 'QA', text: 'hi', timestamp: new Date().toISOString() }) });
      assert.equal(r.status, 401);
    });
  });

  // ---------- @SecurityAgent · Injection & stored-payload handling ----------
  describe('@SecurityAgent · Hostile payloads', () => {
    test('XSS payload accepted as inert data, never crashes (5xx)', async () => {
      const payload = { id: `qa-xss-${Date.now()}`, sender: 'Parent', senderName: '<img src=x onerror=alert(1)>', text: '<script>alert("xss")</script>', timestamp: new Date().toISOString(), parentEmail: 'parent@kiddiestown.co.za' };
      const r = await api('/api/chats', { method: 'POST', headers: { Authorization: `Bearer ${parentToken}` }, body: JSON.stringify(payload) });
      assert.ok(r.status < 500, `must not 5xx, got ${r.status}`);
      if (r.status < 400) assert.equal(r.body.saved?.text ?? payload.text, payload.text, 'stored verbatim; React escapes at render');
    });

    test('SQLi string stored literally via parameterised query (teacher themes)', async () => {
      const t = await login(DEMO.teacher, 'teacher');
      teacherToken = t.body.accessToken;
      assert.equal(t.status, 200);
      const weekNo = 9000 + Math.floor(Math.random() * 999);
      const title = "'); DROP TABLE kt_users;--";
      const post = await api('/api/themes', { method: 'POST', headers: { Authorization: `Bearer ${teacherToken}` }, body: JSON.stringify({ weekNo, title, description: 'qa-sqli-canary', activities: [] }) });
      assert.ok(post.status < 500 && post.status < 400, `theme write should succeed cleanly, got ${post.status}`);
      const data = await api('/api/data', { headers: { Authorization: `Bearer ${teacherToken}` } });
      const stored = data.body.themes.find((th) => th.weekNo === weekNo);
      assert.ok(stored, 'canary row exists — table survived the DROP attempt');
      assert.equal(stored.title, title, 'stored literally = parameterised binding proven');
    });
  });

  // ---------- @SecurityAgent · Signup surface ----------
  describe('@SecurityAgent · Registration', () => {
    test('weak passwords rejected by policy (min 8 + upper + lower + digit)', async () => {
      const r = await api('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email: `qa+${Date.now()}@kiddiestown.co.za`, password: 'weak', role: 'parent', name: 'QA Probe' }) });
      assert.equal(r.status, 400);
    });
    test('duplicate account refused', async () => {
      const r = await api('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email: 'parent@kiddiestown.co.za', password: 'QaTest2026', role: 'parent', name: 'Dup Probe' }) });
      assert.equal(r.status, 400);
    });
    test('valid signup provisions tokens immediately', async () => {
      const email = `qa-runner-${Date.now()}@kiddiestown.co.za`;
      const r = await api('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password: 'QaTest2026', role: 'parent', name: 'QA Runner' }) });
      assert.equal(r.status, 200);
      assert.ok(r.body.accessToken);
      qaUser = { email, token: r.body.accessToken };
    });
  });

  // ---------- @SecurityAgent · Password self-service ----------
  describe('@SecurityAgent · Password self-service', () => {
    test('change-password requires an authenticated session', async () => {
      const r = await api('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword: 'x', newPassword: 'Whatever1' }) });
      assert.equal(r.status, 401);
    });

    test('wrong current password refused with clear error', async () => {
      const r = await api('/api/auth/change-password', {
        method: 'POST',
        headers: { Authorization: `Bearer ${qaUser.token}` },
        body: JSON.stringify({ currentPassword: 'totally-wrong', newPassword: 'QaNew2026x' }),
      });
      assert.equal(r.status, 401);
      assert.match(r.body.error || '', /incorrect|current/i);
    });

    test('valid self-service change succeeds', async () => {
      const r = await api('/api/auth/change-password', {
        method: 'POST',
        headers: { Authorization: `Bearer ${qaUser.token}` },
        body: JSON.stringify({ currentPassword: 'QaTest2026', newPassword: 'QaNew2026x' }),
      });
      assert.equal(r.status, 200);
      assert.equal(r.body.success, true);
    });

    test('new password authenticates (persistence proof)', async () => {
      const r = await login([qaUser.email, 'QaNew2026x'], 'parent');
      assert.equal(r.status, 200);
      assert.ok(r.body.accessToken);
    });
  });

  // ---------- @ResilienceAgent ----------
  describe('@ResilienceAgent · Edge resilience', () => {
    test('oversized chat message rejected by validation, not crashed', async () => {
      const r = await api('/api/chats', { method: 'POST', headers: { Authorization: `Bearer ${parentToken}` }, body: JSON.stringify({ id: `qa-big-${Date.now()}`, sender: 'Parent', senderName: 'QA', text: 'A'.repeat(3000), timestamp: new Date().toISOString() }) });
      assert.ok([400, 413].includes(r.status), `expected 400/413, got ${r.status}`);
    });
    test('malformed JSON handled gracefully', async () => {
      const res = await fetch(BASE + '/api/chats', { method: 'POST', headers: { Authorization: `Bearer ${parentToken}`, 'Content-Type': 'application/json' }, body: '{broken' });
      assert.ok(res.status < 500, `central error handler must contain it, got ${res.status}`);
    });
    test('health endpoint stays responsive after hostile traffic', async () => {
      const r = await api('/api/health');
      assert.equal(r.status, 200);
    });
  });
});
