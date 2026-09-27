import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createDispute, listDisputes, getDispute, updateDisputeStatus } from '../controllers/dispute.controller.js';

const router = Router();

router.post('/', requireAuth, createDispute);
router.get('/', requireAuth, listDisputes);
router.get('/:id', requireAuth, getDispute);
router.patch('/:id/status', requireAuth, updateDisputeStatus);

export default router;
