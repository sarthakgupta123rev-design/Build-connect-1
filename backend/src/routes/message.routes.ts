import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { sendMessage, getBookingMessages } from '../controllers/message.controller.js';

const router = Router();

router.post('/', requireAuth, sendMessage);
router.get('/booking/:bookingId', requireAuth, getBookingMessages);

export default router;
