import { Router } from 'express';
import {
  createParent, sendBulkEmails, sendArrearsNotice,
  getAuditLogs, resetDatabase,
} from '../../controllers/admin.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createParentSchema, bulkEmailSchema, arrearsNoticeSchema } from '../../schemas/data.schemas';

const router = Router();

// All admin routes require admin role
router.use(requireAuth(), requireRole('admin'));

router.post('/create-parent', validate(createParentSchema), createParent);
router.post('/send-bulk-emails', validate(bulkEmailSchema), sendBulkEmails);
router.post('/send-arrears-notice', validate(arrearsNoticeSchema), sendArrearsNotice);
router.get('/audit-logs', getAuditLogs);
router.post('/reset-db', resetDatabase);

export default router;
