import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createOrder, verifyPayment, getPayment, listPayments } from '../controllers/payment.controller.js';

const router = Router();

router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);
router.get('/', requireAuth, listPayments);
router.get('/:id', requireAuth, getPayment);

export default router;
