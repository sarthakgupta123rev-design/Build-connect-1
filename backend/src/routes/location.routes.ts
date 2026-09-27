import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { publishLocation, getWorkerLocation } from '../controllers/location.controller.js';

const router = Router();

router.post('/me/location', requireAuth, publishLocation);
router.get('/:id/location', requireAuth, getWorkerLocation);

export default router;
