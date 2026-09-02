import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';
import { hashPasswordSync, isBcryptHash } from './passwordHasher';
import {
  initialLearners, initialParentProfile, initialProgressReports,
  initialPaymentHistory, initialChatHistory, initialWeeklyThemes,
  initialSchoolEvents, initialJournalPosts, initialEnrolments,
  initialParentProfiles,
} from '../../src/data/mockData';

const STORE_FILE = path.join(process.cwd(), 'data_store.json');
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

export interface FallbackStore {
  learners: Array<Record<string, unknown>>;
  parentProfile: Record<string, unknown>;
  parentProfiles: Record<string, Record<string, unknown>>;
  progressReports: Array<Record<string, unknown>>;
  paymentHistory: Array<Record<string, unknown>>;
  chatHistory: Array<Record<string, unknown>>;
  themes: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  journalPosts: Array<Record<string, unknown>>;
  enrolments: Array<Record<string, unknown>>;
  users: Array<Record<string, unknown>>;
  auditLogs: Array<Record<string, unknown>>;
}

let sqlConnection: any | null = null;
let usingNeon = false;
let fallbackStore: FallbackStore;

/** Default seed users (plain-text passwords for local dev; bcrypt is used in Neon) */
const seedUsers = [
  { id: 'parent@kiddiestown.co.za', email: 'parent@kiddiestown.co.za', password: 'parent', role: 'parent', name: 'Sarah Mbeki' },
  { id: 'teacher@kiddiestown.co.za', email: 'teacher@kiddiestown.co.za', password: 'teacher', role: 'teacher', name: 'Teacher Anne' },
  { id: 'admin@kiddiestown.co.za', email: 'admin@kiddiestown.co.za', password: 'admin', role: 'admin', name: 'Shineon M.' },
];

function createSeededStore(): FallbackStore {
  return {
    learners: [...initialLearners] as any[],
    parentProfile: { ...initialParentProfile, email: 'parent@kiddiestown.co.za' } as any,
    parentProfiles: { ...initialParentProfiles } as any,
    progressReports: [...initialProgressReports] as any[],
    paymentHistory: (initialPaymentHistory as any[]).map((p: any) => {
      const matching = initialLearners.find(l => l.id === p.learnerId);
      return { ...p, parentEmail: matching?.parentEmail || 'parent@kiddiestown.co.za' };
    }),
    chatHistory: (initialChatHistory as any[]).map((c: any) => ({
      ...c, parentEmail: 'parent@kiddiestown.co.za',
    })),
    themes: [...initialWeeklyThemes] as any[],
    events: [...initialSchoolEvents] as any[],
    journalPosts: [...initialJournalPosts] as any[],
    enrolments: [...initialEnrolments] as any[],
    users: [...seedUsers] as any[],
    auditLogs: [],
  };
}

function loadFallbackStore(): FallbackStore {
  if (!isServerless && fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, 'utf8');
      return JSON.parse(content) as FallbackStore;
    } catch (e) {
      logger.error({ error: e }, 'Failed to parse data_store.json, creating seeded store');
    }
  }
  // No existing store or running in serverless — seed with mock data
  const store = createSeededStore();
  if (!isServerless) {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
      logger.info('🌱 Created data_store.json with initial seed data');
    } catch { /* non-critical */ }
  }
  return store;
}

/**
 * Migrate any plaintext seed/legacy credentials to bcrypt hashes in place.
 * Runs at startup and after reset-db so a plaintext password never survives
 * to the first login attempt (the login path is bcrypt-only).
 * @returns true when at least one credential was upgraded.
 */
export function normalizeUserPasswords(store: FallbackStore): boolean {
  let changed = false;
  for (const user of store.users ?? []) {
    if (!isBcryptHash(user.password)) {
      user.password = hashPasswordSync(String(user.password ?? ''));
      changed = true;
    }
  }
  return changed;
}

export function initializeDatabase(databaseUrl?: string): void {
  fallbackStore = loadFallbackStore();
  if (normalizeUserPasswords(fallbackStore)) {
    logger.info('🔐 Upgraded stored plaintext credentials to bcrypt hashes');
    saveFallbackStore();
  }

  if (databaseUrl) {
    try {
      sqlConnection = neon(databaseUrl);
      usingNeon = true;
      logger.info('⚡ Neon Database connection initialized');
    } catch (err) {
      logger.error({ error: err }, '❌ Failed to initialize Neon client');
      usingNeon = false;
    }
  } else {
    logger.warn('⚠️ No DATABASE_URL found. Running in local JSON file mode.');
  }
}

export function getDbState() {
  return { usingNeon, sqlConnection, fallbackStore };
}

export function isNeonActive(): boolean {
  return usingNeon;
}

export function setNeonInactive(): void {
  usingNeon = false;
}

export function getSqlConnection(): any | null {
  return sqlConnection;
}

export function getFallbackStore(): FallbackStore {
  return fallbackStore;
}

export function saveFallbackStore(): void {
  if (isServerless) return;
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (e) {
    logger.error({ error: e }, 'Failed to write to data_store.json');
  }
}

/**
 * Execute a query against Neon DB, falling back to the provided fallback function.
 * This abstracts the dual-mode pattern used throughout the codebase.
 */
export async function dbQuery<T>(
  neonFn: (sql: any) => Promise<T>,
  fallbackFn: (store: FallbackStore) => T
): Promise<{ result: T; source: 'neon' | 'fallback' }> {
  if (usingNeon && sqlConnection) {
    try {
      const result = await neonFn(sqlConnection);
      return { result, source: 'neon' };
    } catch (err) {
      logger.error({ error: err }, 'Neon query failed, falling back to local store');
    }
  }
  const result = fallbackFn(fallbackStore);
  return { result, source: 'fallback' };
}

/**
 * Maps snake_case DB columns to camelCase TypeScript interfaces.
 */
export function rowToEntity<T>(row: Record<string, any>, mappings: Record<string, string>): T {
  const entity: any = {};
  for (const [key, value] of Object.entries(row)) {
    const tsProp = mappings[key] || key;
    entity[tsProp] = value;
  }
  return entity as T;
}

export const MAPPINGS = {
  users: { password_hash: 'password', created_at: 'createdAt' },
  learners: { first_names: 'firstNames', preferred_name: 'preferredName', id_number: 'idNumber', home_language: 'homeLanguage', grade_this_year: 'gradeThisYear', school_attending: 'schoolAttending', previous_school: 'previousSchool', class_type: 'classType', attendance_status: 'attendanceStatus', arrived_time: 'arrivedTime', parent_email: 'parentEmail', enrolment_approved: 'enrolmentApproved', transport_needed: 'transportNeeded', transport_route_id: 'transportRouteId', transport_route_name: 'transportRouteName' },
  parentProfile: { marital_status: 'maritalStatus', child_lives_with: 'childLivesWith' },
  reports: { learner_id: 'learnerId', academic_year: 'academicYear', released_date: 'releasedDate', recorded_days_absent: 'recordedDaysAbsent', short_summary: 'shortSummary', teacher_comments: 'teacherComments', teacher_name: 'teacherName', principal_name: 'principalName' },
  payments: { receipt_no: 'receiptNo', parent_email: 'parentEmail', learner_id: 'learnerId' },
  chats: { sender_name: 'senderName', parent_email: 'parentEmail' },
  themes: { week_no: 'weekNo' },
  events: {},
  journal: { image_url: 'imageUrl', posted_by: 'postedBy' },
  enrolments: { child_particulars: 'childParticulars', parent_particulars: 'parentParticulars', medical_profile: 'medicalProfile', transport_details: 'transportDetails', uploaded_files: 'uploadedFiles', date_applied: 'dateApplied' },
  auditLogs: { user_email: 'userEmail' },
};

/**
 * Maps camelCase TypeScript interfaces to snake_case DB columns.
 */
export function entityToRow(entity: Record<string, any>, mappings: Record<string, string>): Record<string, any> {
  const row: any = {};
  const reverseMappings: Record<string, string> = {};
  for (const [dbCol, tsProp] of Object.entries(mappings)) {
    reverseMappings[tsProp] = dbCol;
  }
  for (const [key, value] of Object.entries(entity)) {
    const dbCol = reverseMappings[key] || key;
    row[dbCol] = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
  }
  return row;
}

/**
 * Parse JSONB data from Neon results, handling both string and object formats.
 * Left for backward compatibility and for nested jsonb columns.
 */
export function parseJsonbData<T>(row: { data?: string | T } | any): T {
  if (row.data !== undefined) {
    if (typeof row.data === 'string') {
      return JSON.parse(row.data) as T;
    }
    return row.data as T;
  }
  return row as T;
}
