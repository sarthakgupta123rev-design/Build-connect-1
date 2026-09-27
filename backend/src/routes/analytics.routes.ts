import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getWorkerEarnings, getWorkerJobs } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/earnings', requireAuth, getWorkerEarnings);

export default router;
