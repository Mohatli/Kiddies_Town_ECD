import { pgTable, varchar, text, integer, boolean, timestamp, jsonb, pgEnum, index } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['parent', 'teacher', 'admin']);
export const genderEnum = pgEnum('gender', ['Male', 'Female']);
export const classTypeEnum = pgEnum('class_type', ['Roses', 'Giraffes', 'Tigers']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['Present', 'Absent', 'Excused', 'Pending']);
export const paymentStatusEnum = pgEnum('payment_status', ['Paid', 'Unpaid', 'In Arrears', 'Pending Verification']);
export const senderEnum = pgEnum('sender', ['Teacher', 'Parent', 'Admin']);
export const eventCategoryEnum = pgEnum('event_category', ['Event', 'Extra-mural', 'Holiday', 'Incursion']);
export const enrolmentStatusEnum = pgEnum('enrolment_status', ['In Review', 'Pending Approval', 'Approved', 'Rejected']);

export const ktUsers = pgTable('kt_users', {
  id: varchar('id').primaryKey(),
  email: varchar('email').unique(),
  passwordHash: text('password_hash'),
  role: roleEnum('role'),
  name: varchar('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ktLearners = pgTable('kt_learners', {
  id: varchar('id').primaryKey(),
  surname: varchar('surname'),
  firstNames: varchar('first_names'),
  preferredName: varchar('preferred_name'),
  dob: varchar('dob'),
  idNumber: varchar('id_number'),
  gender: genderEnum('gender'),
  homeLanguage: varchar('home_language'),
  religion: varchar('religion'),
  gradeThisYear: varchar('grade_this_year'),
  schoolAttending: varchar('school_attending'),
  previousSchool: varchar('previous_school'),
  classType: classTypeEnum('class_type'),
  attendanceStatus: attendanceStatusEnum('attendance_status'),
  arrivedTime: varchar('arrived_time'),
  parentEmail: varchar('parent_email'),
  enrolmentApproved: boolean('enrolment_approved'),
  transportNeeded: boolean('transport_needed'),
  transportRouteId: varchar('transport_route_id'),
  transportRouteName: varchar('transport_route_name'),
}, (table) => {
  return {
    parentEmailIdx: index('idx_learners_parent_email').on(table.parentEmail),
    classTypeIdx: index('idx_learners_class_type').on(table.classType)
  };
});

export const ktParentProfile = pgTable('kt_parent_profile', {
  id: varchar('id').primaryKey(),
  email: varchar('email'),
  name: varchar('name'),
  phone: varchar('phone'),
  address: text('address'),
  maritalStatus: varchar('marital_status'),
  childLivesWith: varchar('child_lives_with'),
  mother: jsonb('mother'),
  father: jsonb('father'),
}, (table) => {
  return {
    emailIdx: index('idx_parent_profile_email').on(table.email)
  };
});

export const ktProgressReports = pgTable('kt_progress_reports', {
  id: varchar('id').primaryKey(),
  learnerId: varchar('learner_id'),
  academicYear: integer('academic_year'),
  term: integer('term'),
  released: boolean('released'),
  releasedDate: varchar('released_date'),
  daysAbsent: integer('days_absent'),
  indicators: jsonb('indicators'),
  shortSummary: varchar('short_summary'),
  teacherComments: text('teacher_comments'),
  teacherName: varchar('teacher_name'),
  principalName: varchar('principal_name'),
}, (table) => {
  return {
    learnerIdIdx: index('idx_progress_reports_learner_id').on(table.learnerId)
  };
});

export const ktPayments = pgTable('kt_payments', {
  id: varchar('id').primaryKey(),
  description: text('description'),
  date: varchar('date'),
  amount: integer('amount'),
  status: paymentStatusEnum('status'),
  receiptNo: varchar('receipt_no'),
  parentEmail: varchar('parent_email'),
  learnerId: varchar('learner_id'),
}, (table) => {
  return {
    parentEmailIdx: index('idx_payments_parent_email').on(table.parentEmail),
    learnerIdIdx: index('idx_payments_learner_id').on(table.learnerId),
    statusIdx: index('idx_payments_status').on(table.status)
  };
});

export const ktChats = pgTable('kt_chats', {
  id: varchar('id').primaryKey(),
  sender: senderEnum('sender'),
  senderName: varchar('sender_name'),
  text: text('text'),
  timestamp: varchar('timestamp'),
  parentEmail: varchar('parent_email'),
}, (table) => {
  return {
    parentEmailIdx: index('idx_chats_parent_email').on(table.parentEmail)
  };
});

export const ktWeeklyThemes = pgTable('kt_weekly_themes', {
  weekNo: integer('week_no').primaryKey(),
  title: varchar('title'),
  description: text('description'),
  activities: jsonb('activities'),
});

export const ktSchoolEvents = pgTable('kt_school_events', {
  id: varchar('id').primaryKey(),
  title: varchar('title'),
  date: varchar('date'),
  time: varchar('time'),
  category: eventCategoryEnum('category'),
  description: text('description'),
  rsvps: jsonb('rsvps'),
}, (table) => {
  return {
    dateIdx: index('idx_school_events_date').on(table.date)
  };
});

export const ktJournalPosts = pgTable('kt_journal_posts', {
  id: varchar('id').primaryKey(),
  date: varchar('date'),
  title: varchar('title'),
  description: text('description'),
  imageUrl: text('image_url'),
  postedBy: varchar('posted_by'),
}, (table) => {
  return {
    dateIdx: index('idx_journal_posts_date').on(table.date)
  };
});

export const ktEnrolments = pgTable('kt_enrolments', {
  id: varchar('id').primaryKey(),
  childParticulars: jsonb('child_particulars'),
  parentParticulars: jsonb('parent_particulars'),
  medicalProfile: jsonb('medical_profile'),
  transportDetails: jsonb('transport_details'),
  consents: jsonb('consents'),
  uploadedFiles: jsonb('uploaded_files'),
  step: integer('step'),
  status: enrolmentStatusEnum('status'),
  dateApplied: varchar('date_applied'),
}, (table) => {
  return {
    statusIdx: index('idx_enrolments_status').on(table.status)
  };
});

export const ktAuditLogs = pgTable('kt_audit_logs', {
  id: varchar('id').primaryKey(),
  userEmail: varchar('user_email'),
  action: varchar('action'),
  payload: jsonb('payload'),
  timestamp: varchar('timestamp'),
}, (table) => {
  return {
    userEmailIdx: index('idx_audit_logs_user_email').on(table.userEmail)
  };
});
