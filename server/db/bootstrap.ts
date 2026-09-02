import { getSqlConnection, isNeonActive, setNeonInactive, entityToRow, MAPPINGS } from '../config/database';
import { hashPasswordSync } from '../config/passwordHasher';
import { TABLES } from './tables';
import logger from '../utils/logger';
import {
  initialLearners, initialParentProfile, initialProgressReports,
  initialPaymentHistory, initialChatHistory, initialWeeklyThemes,
  initialSchoolEvents, initialJournalPosts, initialEnrolments,
  initialParentProfiles,
} from '../../src/data/mockData';

/** Bootstrap seed users — passwords are hashed synchronously at seed time. */
const initialUsers = [
  { id: 'parent@kiddiestown.co.za', email: 'parent@kiddiestown.co.za', password: 'parent', role: 'parent', name: 'Sarah Mbeki' },
  { id: 'teacher@kiddiestown.co.za', email: 'teacher@kiddiestown.co.za', password: 'teacher', role: 'teacher', name: 'Teacher Anne' },
  { id: 'admin@kiddiestown.co.za', email: 'admin@kiddiestown.co.za', password: 'admin', role: 'admin', name: 'Shineon M.' },
];

export { initialUsers };

/**
 * PostgreSQL enum types mirroring server/db/schema.ts (Drizzle definitions).
 * Kept in one place so DDL here can never drift from the ORM model again.
 */
const PG_ENUMS: Record<string, string[]> = {
  role: ['parent', 'teacher', 'admin'],
  gender: ['Male', 'Female'],
  class_type: ['Roses', 'Giraffes', 'Tigers'],
  attendance_status: ['Present', 'Absent', 'Excused', 'Pending'],
  payment_status: ['Paid', 'Unpaid', 'In Arrears', 'Pending Verification'],
  sender: ['Teacher', 'Parent', 'Admin'],
  event_category: ['Event', 'Extra-mural', 'Holiday', 'Incursion'],
  enrolment_status: ['In Review', 'Pending Approval', 'Approved', 'Rejected'],
};

/**
 * Columnar DDL — MUST mirror server/db/schema.ts. The legacy (id, data JSONB)
 * blob layout was incompatible with every entityToRow/rowToEntity read/write
 * helper and has been removed.
 */
const TABLE_DDL: Array<{ table: string; ddl: string; indexes?: string[] }> = [
  {
    table: TABLES.users,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.users} (
      id VARCHAR(120) PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      password_hash TEXT,
      role role,
      name VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
  },
  {
    table: TABLES.learners,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.learners} (
      id VARCHAR(120) PRIMARY KEY,
      surname VARCHAR(120),
      first_names VARCHAR(120),
      preferred_name VARCHAR(120),
      dob VARCHAR(40),
      id_number VARCHAR(40),
      gender gender,
      home_language VARCHAR(80),
      religion VARCHAR(120),
      grade_this_year VARCHAR(40),
      school_attending VARCHAR(200),
      previous_school VARCHAR(200),
      class_type class_type,
      attendance_status attendance_status DEFAULT 'Pending',
      arrived_time VARCHAR(40),
      parent_email VARCHAR(255),
      enrolment_approved BOOLEAN,
      transport_needed BOOLEAN,
      transport_route_id VARCHAR(120),
      transport_route_name VARCHAR(160)
    )`,
    indexes: [
      `CREATE INDEX IF NOT EXISTS idx_learners_parent_email ON ${TABLES.learners} (parent_email)`,
      `CREATE INDEX IF NOT EXISTS idx_learners_class_type ON ${TABLES.learners} (class_type)`,
    ],
  },
  {
    table: TABLES.parentProfile,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.parentProfile} (
      id VARCHAR(120) PRIMARY KEY,
      email VARCHAR(255),
      name VARCHAR(255),
      phone VARCHAR(60),
      address TEXT,
      marital_status VARCHAR(60),
      child_lives_with VARCHAR(120),
      mother JSONB,
      father JSONB
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_parent_profile_email ON ${TABLES.parentProfile} (email)`],
  },
  {
    table: TABLES.reports,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.reports} (
      id VARCHAR(120) PRIMARY KEY,
      learner_id VARCHAR(120),
      academic_year INTEGER,
      term INTEGER,
      released BOOLEAN,
      released_date VARCHAR(40),
      recorded_days_absent INTEGER,
      indicators JSONB,
      short_summary VARCHAR(10),
      teacher_comments TEXT,
      teacher_name VARCHAR(160),
      principal_name VARCHAR(160)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_progress_reports_learner_id ON ${TABLES.reports} (learner_id)`],
  },
  {
    table: TABLES.payments,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.payments} (
      id VARCHAR(120) PRIMARY KEY,
      description TEXT,
      date VARCHAR(40),
      amount INTEGER,
      status payment_status,
      receipt_no VARCHAR(80),
      parent_email VARCHAR(255),
      learner_id VARCHAR(120)
    )`,
    indexes: [
      `CREATE INDEX IF NOT EXISTS idx_payments_parent_email ON ${TABLES.payments} (parent_email)`,
      `CREATE INDEX IF NOT EXISTS idx_payments_learner_id ON ${TABLES.payments} (learner_id)`,
      `CREATE INDEX IF NOT EXISTS idx_payments_status ON ${TABLES.payments} (status)`,
    ],
  },
  {
    table: TABLES.chats,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.chats} (
      id VARCHAR(120) PRIMARY KEY,
      sender sender,
      sender_name VARCHAR(160),
      text TEXT,
      timestamp VARCHAR(40),
      parent_email VARCHAR(255)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_chats_parent_email ON ${TABLES.chats} (parent_email)`],
  },
  {
    table: TABLES.themes,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.themes} (
      week_no INTEGER PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      activities JSONB
    )`,
  },
  {
    table: TABLES.events,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.events} (
      id VARCHAR(120) PRIMARY KEY,
      title VARCHAR(255),
      date VARCHAR(40),
      time VARCHAR(40),
      category event_category,
      description TEXT,
      rsvps JSONB
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_school_events_date ON ${TABLES.events} (date)`],
  },
  {
    table: TABLES.journal,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.journal} (
      id VARCHAR(120) PRIMARY KEY,
      date VARCHAR(40),
      title VARCHAR(255),
      description TEXT,
      image_url TEXT,
      posted_by VARCHAR(160)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_journal_posts_date ON ${TABLES.journal} (date)`],
  },
  {
    table: TABLES.enrolments,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.enrolments} (
      id VARCHAR(120) PRIMARY KEY,
      child_particulars JSONB,
      parent_particulars JSONB,
      medical_profile JSONB,
      transport_details JSONB,
      consents JSONB,
      uploaded_files JSONB,
      step INTEGER,
      status enrolment_status,
      date_applied VARCHAR(40)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_enrolments_status ON ${TABLES.enrolments} (status)`],
  },
  {
    table: TABLES.auditLogs,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.auditLogs} (
      id VARCHAR(120) PRIMARY KEY,
      user_email VARCHAR(255),
      action VARCHAR(120),
      payload JSONB,
      timestamp VARCHAR(64)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_email ON ${TABLES.auditLogs} (user_email)`],
  },
];

/** Insert an entity through the shared camelCase→snake_case row mapper. */
async function seedEntity(sql: any, table: string, mappingKey: keyof typeof MAPPINGS, entity: object): Promise<void> {
  const row = entityToRow(entity as Record<string, unknown>, MAPPINGS[mappingKey]);
  const cols = Object.keys(row);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
  await sql.query(
    `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
    Object.values(row)
  );
}

/**
 * Bootstrap schema: creates all tables/enums/indexes and seeds initial data
 * when the DB is empty. Column definitions mirror server/db/schema.ts.
 */
export async function bootstrapSchema(): Promise<void> {
  if (!isNeonActive()) return;
  const sql = getSqlConnection();
  if (!sql) return;

  const isProduction = process.env.NODE_ENV === 'production';

  try {
    // In production, only create tables/indexes (never drop — preserves data).
    // In development, drop + recreate to pick up schema changes.
    if (!isProduction) {
      for (const def of TABLE_DDL) {
        await sql.query(`DROP TABLE IF EXISTS ${def.table} CASCADE`);
      }
    }

    // 1. Enum types (idempotent)
    for (const [enumName, values] of Object.entries(PG_ENUMS)) {
      const literals = values.map((v) => `'${v}'`).join(', ');
      await sql.query(`DO $$ BEGIN CREATE TYPE ${enumName} AS ENUM (${literals}); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    }

    // 2. Tables + indexes (columnar, Drizzle-aligned)
    for (const def of TABLE_DDL) {
      await sql.query(def.ddl);
      for (const idx of def.indexes ?? []) {
        await sql.query(idx);
      }
    }
    logger.info('✅ Neon DB schema tables verified.');

    // 3. Seed when empty
    const checkLearners = await sql.query(`SELECT count(*) FROM ${TABLES.learners}`);
    if (parseInt(checkLearners[0].count as string) === 0) {
      logger.info('🌱 Database is empty! Seeding initial school records into NeonDB...');

      for (const item of initialLearners) await seedEntity(sql, TABLES.learners, 'learners', item);
      await seedEntity(sql, TABLES.parentProfile, 'parentProfile', { id: 'default', ...initialParentProfile });
      for (const [emailKey, profileData] of Object.entries(initialParentProfiles)) {
        await seedEntity(sql, TABLES.parentProfile, 'parentProfile', { id: emailKey.toLowerCase(), ...profileData });
      }
      for (const item of initialProgressReports) await seedEntity(sql, TABLES.reports, 'reports', item);
      for (const item of initialPaymentHistory) {
        const matching = initialLearners.find((l) => l.id === item.learnerId);
        await seedEntity(sql, TABLES.payments, 'payments', { ...item, parentEmail: matching?.parentEmail || 'parent@kiddiestown.co.za' });
      }
      for (const item of initialChatHistory) {
        await seedEntity(sql, TABLES.chats, 'chats', { ...item, parentEmail: 'parent@kiddiestown.co.za' });
      }
      for (const item of initialWeeklyThemes) await seedEntity(sql, TABLES.themes, 'themes', item);
      for (const item of initialSchoolEvents) await seedEntity(sql, TABLES.events, 'events', item);
      for (const item of initialJournalPosts) await seedEntity(sql, TABLES.journal, 'journal', item);
      for (const item of initialEnrolments) await seedEntity(sql, TABLES.enrolments, 'enrolments', item);

      // Users: hash credentials BEFORE they ever touch storage.
      for (const user of initialUsers) {
        const seeded = { ...user, password: hashPasswordSync(user.password) };
        await seedEntity(sql, TABLES.users, 'users', seeded);
      }

      logger.info('🎉 Seed completion — initial values uploaded to NeonDB.');
    }
  } catch (error: any) {
    logger.error({ error: error?.message || String(error), stack: error?.stack }, '⚠️ Error while bootstrapping database tables or seeding');
    // Graceful reset of flag if bootstrap queries failed
    setNeonInactive();
  }
}
