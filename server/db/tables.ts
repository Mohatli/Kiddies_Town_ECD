/**
 * Database table name constants for Kiddies Town ECD & Academy.
 * Maps logical collection names to Neon PostgreSQL table names.
 */
export const TABLES = {
  learners: 'kt_learners',
  parentProfile: 'kt_parent_profile',
  reports: 'kt_progress_reports',
  payments: 'kt_payments',
  chats: 'kt_chats',
  themes: 'kt_weekly_themes',
  events: 'kt_school_events',
  journal: 'kt_journal_posts',
  enrolments: 'kt_enrolments',
  registers: 'kt_registers',
  users: 'kt_users',
  auditLogs: 'kt_audit_logs',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

export * from './schema';
