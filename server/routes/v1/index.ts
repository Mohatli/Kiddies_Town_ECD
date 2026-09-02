import { Router } from 'express';
import authRoutes from './auth.routes';
import dataRoutes from './data.routes';
import learnerRoutes from './learners.routes';
import resourceRoutes from './resources.routes';
import adminRoutes from './admin.routes';
import pdfRoutes from './pdf.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/data', dataRoutes);
router.use('/learners', learnerRoutes);
router.use('/', resourceRoutes);
router.use('/admin', adminRoutes);
router.use('/pdf', pdfRoutes);

export default router;
