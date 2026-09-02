import { z } from 'zod';

export const registerSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  submittedBy: z.string().optional(),
  entries: z.array(z.object({
    learnerId: z.string().min(1),
    status: z.enum(['Present', 'Absent', 'Excused', 'Pending']),
    arrivedTime: z.string().optional(),
  })).min(1, 'Register needs at least one learner entry'),
});

export const learnerSchema = z.object({
  id: z.string().min(1),
  surname: z.string().min(1, 'Surname is required'),
  firstNames: z.string().min(1, 'First name is required'),
  preferredName: z.string().min(1),
  dob: z.string().min(1, 'Date of birth is required'),
  idNumber: z.string().optional().default(''),
  gender: z.enum(['Male', 'Female', 'Other']),
  homeLanguage: z.string().min(1),
  religion: z.string().optional(),
  gradeThisYear: z.string().optional(),
  schoolAttending: z.string().optional(),
  previousSchool: z.string().optional(),
  classType: z.enum(['Roses', 'Giraffes', 'Tigers']),
  attendanceStatus: z.enum(['Present', 'Absent', 'Excused', 'Pending']).default('Pending'),
  arrivedTime: z.string().optional(),
  parentEmail: z.string().email().optional(),
  enrolmentApproved: z.boolean().nullish(),
  transportNeeded: z.boolean().nullish(),
  transportRouteId: z.string().nullish(),
  transportRouteName: z.string().nullish(),
});

export const progressReportSchema = z.object({
  id: z.string().min(1),
  learnerId: z.string().min(1),
  academicYear: z.number().int().min(2020).max(2030),
  term: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  released: z.boolean().default(false),
  releasedDate: z.string().optional(),
  recordedDaysAbsent: z.number().int().min(0).default(0),
  indicators: z.record(z.string(), z.record(z.string(), z.enum(['A', 'D', 'E', 'N/O', 'N/A']))),
  shortSummary: z.enum(['K1', 'K2', 'K3', 'K4', 'K5', 'K6']),
  teacherComments: z.string().default(''),
  teacherName: z.string().min(1),
  principalName: z.string().min(1),
});

export const paymentSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  amount: z.number().positive(),
  status: z.enum(['Paid', 'Unpaid', 'In Arrears', 'Pending Verification']),
  receiptNo: z.string().optional(),
  parentEmail: z.string().email().optional(),
  learnerId: z.string().optional(),
});

export const chatMessageSchema = z.object({
  id: z.string().min(1),
  sender: z.enum(['Teacher', 'Parent', 'Admin']),
  senderName: z.string().min(1),
  text: z.string().min(1, 'Message cannot be empty').max(2000),
  timestamp: z.string().min(1),
  parentEmail: z.string().email().optional(),
});

export const eventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  category: z.enum(['Event', 'Extra-mural', 'Holiday', 'Incursion']),
  description: z.string().default(''),
  rsvps: z.array(z.object({
    parentName: z.string(),
    count: z.number().int().min(0),
    status: z.enum(['Yes', 'No', 'Maybe']),
  })).default([]),
});

export const themeSchema = z.object({
  weekNo: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().default(''),
  activities: z.array(z.string()).default([]),
});

export const journalPostSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(''),
  imageUrl: z.string().default(''),
  postedBy: z.string().min(1),
});

export const enrolmentSchema = z.object({
  id: z.string().min(1),
  childParticulars: z.record(z.string(), z.unknown()).default({}),
  parentParticulars: z.record(z.string(), z.unknown()).default({}),
  medicalProfile: z.record(z.string(), z.unknown()).default({}),
  transportDetails: z.record(z.string(), z.unknown()).default({}),
  consents: z.record(z.string(), z.unknown()).default({}),
  uploadedFiles: z.object({
    birthCertificate: z.boolean().default(false),
    immunisationCard: z.boolean().default(false),
    parentIds: z.boolean().default(false),
    proofOfResidence: z.boolean().default(false),
  }).default({ birthCertificate: false, immunisationCard: false, parentIds: false, proofOfResidence: false }),
  step: z.number().int().min(1).max(6).default(1),
  status: z.enum(['In Review', 'Pending Approval', 'Approved', 'Rejected']).default('In Review'),
  dateApplied: z.string().min(1),
});

export const createParentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required').transform((v) => v.toLowerCase().trim()),
});

export const bulkEmailSchema = z.object({
  studentIds: z.array(z.string()).min(1, 'At least one student must be selected'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required'),
  template: z.string().optional(),
});

export const arrearsNoticeSchema = z.object({
  parentName: z.string().min(1, 'Parent name is required'),
  amount: z.number().min(0).default(0),
});

export type LearnerInput = z.infer<typeof learnerSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type ThemeInput = z.infer<typeof themeSchema>;
export type JournalPostInput = z.infer<typeof journalPostSchema>;
export type EnrolmentInput = z.infer<typeof enrolmentSchema>;
