import type { Request, Response } from 'express';
import { dbQuery, parseJsonbData, getFallbackStore, saveFallbackStore, rowToEntity, MAPPINGS } from '../config/database';
import { createAuditLog } from '../middleware/auditLog';
import { TABLES } from '../db/tables';
import logger from '../utils/logger';
import type { AuthenticatedRequest } from '../types/index';
import { createUpsertHandler } from '../utils/dbHelpers';
import type { ParentProfile, ProgressReport, PaymentItem, ChatMessage, SchoolEvent, WeeklyTheme, JournalPost, EnrolmentApplication } from '../../src/types';

/**
 * POST /parent-profile
 * Re-implements server.ts lines 694-727.
 */
export const saveParentProfile = createUpsertHandler({
  table: TABLES.parentProfile,
  storeKey: 'parentProfiles',
  getId: (data: ParentProfile) => (data.email || 'parent@kiddiestown.co.za').toLowerCase().trim(),
  auditAction: 'UPDATE_PARENT_PROFILE',
  auditPayload: (data: ParentProfile) => ({ email: data.email, name: data.name })
});

/**
 * POST /progress-reports
 * Re-implements server.ts lines 729-768.
 */
export const saveProgressReport = createUpsertHandler({
  table: TABLES.reports,
  storeKey: 'progressReports',
  getId: (data: ProgressReport) => data.id,
  auditAction: 'SAVE_PROGRESS_REPORT',
  auditPayload: (data: ProgressReport) => ({
    id: data.id,
    studentId: data.learnerId,
    term: data.term,
  })
});

/**
 * POST /register
 * Teachers (or admins) submit the daily attendance register. One register per
 * calendar date — resubmitting the same date replaces the previous entries.
 * Powers the attendance statistics on the admin dashboard.
 */
export async function saveRegister(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const incoming = req.body as {
    date: string;
    submittedBy?: string;
    entries: Array<{ learnerId: string; status: 'Present' | 'Absent' | 'Excused' | 'Pending'; arrivedTime?: string }>;
  };

  const register = {
    ...incoming,
    submittedBy: authReq.user?.name || incoming.submittedBy || 'Teacher',
    submittedAt: new Date().toISOString(),
  };

  const { source } = await dbQuery(
    async (sql) => {
      // Self-migrating jsonb table so Neon deployments work without a manual migration step.
      await sql.query(`CREATE TABLE IF NOT EXISTS ${TABLES.registers} (id text PRIMARY KEY, data jsonb NOT NULL)`);
      await sql.query(
        `INSERT INTO ${TABLES.registers} (id, data) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
        [register.date, JSON.stringify(register)]
      );
      return true;
    },
    (store) => {
      if (!Array.isArray((store as any).registers)) {
        (store as any).registers = [];
      }
      const registers = (store as any).registers as any[];
      const index = registers.findIndex((r) => r.date === register.date);
      if (index >= 0) {
        registers[index] = register;
      } else {
        registers.push(register);
      }
      saveFallbackStore();
      return true;
    }
  );

  await createAuditLog(authReq.user.email, 'SUBMIT_DAILY_REGISTER', {
    date: register.date,
    entries: register.entries.length,
    present: register.entries.filter((e) => e.status === 'Present').length,
  });
  res.json({ success: true, usingNeon: source === 'neon' });
}

/**
 * POST /payments/:id/verify
 * Allows administrators to verify pending parent payments and update their status (e.g. 'Paid' or 'In Arrears').
 */
export async function verifyPayment(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const paymentId = req.params.id;
  const { status, receiptNo } = req.body as { status: 'Paid' | 'In Arrears' | 'Pending Verification' | 'Unpaid'; receiptNo?: string };

  const { source, result } = await dbQuery(
    async (sql) => {
      const existing = await sql.query(`SELECT * FROM ${TABLES.payments} WHERE id = $1`, [paymentId]);
      if (!existing || existing.length === 0) return { found: false };
      await sql.query(
        `UPDATE ${TABLES.payments} 
         SET status = $1, receipt_no = COALESCE($2, receipt_no) 
         WHERE id = $3`,
        [status || 'Paid', receiptNo || null, paymentId]
      );
      return { found: true };
    },
    (store) => {
      const idx = store.paymentHistory.findIndex((p: any) => p.id === paymentId);
      if (idx >= 0) {
        const item = store.paymentHistory[idx] as any;
        item.status = status || 'Paid';
        if (receiptNo) item.receiptNo = receiptNo;
        saveFallbackStore();
        return { found: true };
      }
      return { found: false };
    }
  );

  if (!result.found) {
    res.status(404).json({ success: false, error: `Payment record ${paymentId} not found.` });
    return;
  }

  await createAuditLog(authReq.user.email, 'VERIFY_PAYMENT', {
    paymentId,
    status: status || 'Paid',
    receiptNo: receiptNo || undefined,
  });

  res.json({ success: true, usingNeon: source === 'neon' });
}

/**
 * POST /payments
 * Re-implements server.ts lines 770-828.
 */
export async function savePayment(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const payment = req.body as PaymentItem;

  let isUpdate = false;
  let oldPayment: PaymentItem | null = null;

  const { result: existing } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT * FROM ${TABLES.payments} WHERE id = $1`, [payment.id]);
      if (results && results.length > 0) {
        return { found: true, data: rowToEntity<PaymentItem>(results[0], MAPPINGS.payments) };
      }
      return { found: false, data: null };
    },
    (store) => {
      const existingIndex = store.paymentHistory.findIndex((p: any) => p.id === payment.id);
      if (existingIndex >= 0) {
        return { found: true, data: store.paymentHistory[existingIndex] as unknown as PaymentItem };
      }
      return { found: false, data: null };
    }
  );

  isUpdate = existing.found;
  oldPayment = existing.data;

  const actionType = isUpdate || payment.status !== 'Paid' ? 'FEE_ADJUSTMENT' : 'RECORD_PAYMENT';
  const payload = {
    id: payment.id,
    description: payment.description,
    amount: payment.amount,
    status: payment.status,
    studentId: payment.learnerId,
  };

  const { source } = await dbQuery(
    async (sql) => {
        await sql.query(
          `INSERT INTO ${TABLES.payments} (id, description, date, amount, status, receipt_no, parent_email, learner_id) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           ON CONFLICT (id) DO UPDATE SET 
             description = EXCLUDED.description, 
             date = EXCLUDED.date, 
             amount = EXCLUDED.amount, 
             status = EXCLUDED.status, 
             receipt_no = EXCLUDED.receipt_no, 
             parent_email = EXCLUDED.parent_email, 
             learner_id = EXCLUDED.learner_id`,
          [payment.id, payment.description, payment.date, payment.amount, payment.status, payment.receiptNo || null, payment.parentEmail || null, payment.learnerId || null]
        );
      return true;
    },
    (store) => {
      const existingIndex = store.paymentHistory.findIndex((p: any) => p.id === payment.id);
      if (existingIndex >= 0) {
        store.paymentHistory[existingIndex] = payment as unknown as Record<string, unknown>;
      } else {
        store.paymentHistory = [payment as unknown as Record<string, unknown>, ...store.paymentHistory];
      }
      saveFallbackStore();
      return true;
    }
  );

  await createAuditLog(authReq.user.email, actionType, payload);
  res.json({ success: true, usingNeon: source === 'neon' });
}

/**
 * POST /chats
 * Re-implements server.ts lines 830-852.
 */
export const saveChat = createUpsertHandler({
  table: TABLES.chats,
  storeKey: 'chatHistory',
  getId: (data: ChatMessage) => data.id,
  auditAction: '',
});

/**
 * POST /events
 * Re-implements server.ts lines 854-893.
 */
export const saveEvent = createUpsertHandler({
  table: TABLES.events,
  storeKey: 'events',
  getId: (data: SchoolEvent) => data.id,
  auditAction: 'CREATE_EVENT',
  auditPayload: (data: SchoolEvent) => ({
    id: data.id,
    title: data.title,
    date: data.date,
  })
});

/**
 * POST /themes
 * Re-implements server.ts lines 895-929.
 */
export const saveTheme = createUpsertHandler({
  table: TABLES.themes,
  storeKey: 'themes',
  getId: (data: WeeklyTheme) => data.weekNo.toString(),
  auditAction: 'UPDATE_WEEKLY_THEME',
  auditPayload: (data: WeeklyTheme) => ({
    weekNo: data.weekNo,
    theme: data.title, // Map correctly to log
  })
});

/**
 * POST /journal
 * Re-implements server.ts lines 931-965.
 */
export const saveJournalPost = createUpsertHandler({
  table: TABLES.journal,
  storeKey: 'journalPosts',
  getId: (data: JournalPost) => data.id,
  auditAction: 'POST_JOURNAL',
  auditPayload: (data: JournalPost) => ({
    id: data.id,
    title: data.title,
  })
});

/**
 * POST /enrolments
 * Re-implements server.ts lines 967-1006.
 */
export const saveEnrolment = createUpsertHandler({
  table: TABLES.enrolments,
  storeKey: 'enrolments',
  getId: (data: EnrolmentApplication) => data.id,
  auditAction: 'SUBMIT_ENROLMENT',
  auditPayload: (data: EnrolmentApplication) => ({
    id: data.id,
    childName: data.childParticulars?.firstNames,
    status: data.status,
  })
});
