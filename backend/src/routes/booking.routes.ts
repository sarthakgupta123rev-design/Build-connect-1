import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createBooking, listBookings, getBooking, updateStatus } from '../controllers/booking.controller.js';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/', requireAuth, listBookings);
router.get('/:id', requireAuth, getBooking);
router.patch('/:id/status', requireAuth, updateStatus);

export default router;
