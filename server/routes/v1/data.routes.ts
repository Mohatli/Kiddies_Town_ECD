import { Router } from 'express';
import { getAllData, getLearners, getPayments, getThemes, getEvents, getJournalPosts } from '../../controllers/data.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// GET /data — returns all dashboard data, filtered by role
// Allows guest access (unauthenticated users get public data only)
router.get('/', requireAuth(true), getAllData);

// Individual entity endpoints for granular queries
router.get('/learners', requireAuth(true), getLearners);
router.get('/payments', requireAuth(true), getPayments);
router.get('/themes', requireAuth(true), getThemes);
router.get('/events', requireAuth(true), getEvents);
router.get('/journal', requireAuth(true), getJournalPosts);

export default router;
