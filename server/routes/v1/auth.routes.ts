import { Router } from 'express';
import { signup, login, refreshToken, changePassword } from '../../controllers/auth.controller';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimiter';
import { requireAuth } from '../../middleware/auth';
import { signupSchema, loginSchema, refreshTokenSchema, changePasswordSchema } from '../../schemas/auth.schemas';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.post('/change-password', requireAuth(), validate(changePasswordSchema), changePassword);

export default router;
