import { Router } from 'express';
import { createOrUpdateLearner, deleteLearner } from '../../controllers/learners.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { learnerSchema } from '../../schemas/data.schemas';
import { idParamSchema } from '../../schemas/common.schemas';

const router = Router();

router.post('/', requireAuth(), requireRole('admin', 'teacher', 'parent'), validate(learnerSchema), createOrUpdateLearner);
router.delete('/:id', requireAuth(), requireRole('admin'), validate(idParamSchema, 'params'), deleteLearner);

export default router;
