import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { listWorkers, getWorker, createWorkerProfile, updateWorkerProfile, updateMyWorkerProfile } from '../controllers/worker.controller.js';
import { getWorkerReviews } from '../controllers/review.controller.js';
import { recommendWorkers } from '../controllers/ai.controller.js';
import { getWorkerJobs } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/', listWorkers);
router.post('/recommend', recommendWorkers);
router.get('/me/jobs', requireAuth, getWorkerJobs);
router.patch('/me', requireAuth, updateMyWorkerProfile);
router.get('/:id', getWorker);
router.get('/:id/reviews', getWorkerReviews);
router.post('/', requireAuth, createWorkerProfile);
router.patch('/:id', requireAuth, updateWorkerProfile);

export default router;
