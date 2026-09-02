import { Router } from 'express';
import {
  saveParentProfile, saveProgressReport, savePayment, verifyPayment,
  saveChat, saveEvent, saveTheme, saveJournalPost, saveEnrolment, saveRegister,
} from '../../controllers/resources.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import {
  progressReportSchema, paymentSchema, chatMessageSchema,
  eventSchema, themeSchema, journalPostSchema, enrolmentSchema, registerSchema,
} from '../../schemas/data.schemas';

const router = Router();

// Parent profile (no strict schema — flexible profile object)
router.post('/parent-profile', requireAuth(), requireRole('parent', 'admin'), saveParentProfile);

// Progress reports
router.post('/progress-reports', requireAuth(), requireRole('admin', 'teacher'), validate(progressReportSchema), saveProgressReport);

// Payments
router.post('/payments', requireAuth(), requireRole('admin', 'parent'), validate(paymentSchema), savePayment);
router.post('/payments/:id/verify', requireAuth(), requireRole('admin'), verifyPayment);

// Chats
router.post('/chats', requireAuth(), requireRole('admin', 'teacher', 'parent'), validate(chatMessageSchema), saveChat);

// Events (allow parent for RSVPs)
router.post('/events', requireAuth(), requireRole('admin', 'teacher', 'parent'), validate(eventSchema), saveEvent);

// Themes
router.post('/themes', requireAuth(), requireRole('admin', 'teacher'), validate(themeSchema), saveTheme);

// Journal
router.post('/journal', requireAuth(), requireRole('admin', 'teacher'), validate(journalPostSchema), saveJournalPost);

// Enrolments (allow public guest prospective parents from /enrol)
router.post('/enrolments', validate(enrolmentSchema), saveEnrolment);

// Daily attendance register (teacher/admin) — feeds admin attendance stats
router.post('/register', requireAuth(), requireRole('admin', 'teacher'), validate(registerSchema), saveRegister);

export default router;
