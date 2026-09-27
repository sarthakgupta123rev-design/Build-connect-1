import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getMe, createMyProfile, updateMyProfile, getMyRole } from '../controllers/user.controller.js';

const router = Router();

router.get('/', requireAuth, getMe);
router.post('/profile', requireAuth, createMyProfile);
router.patch('/profile', requireAuth, updateMyProfile);
router.get('/role', requireAuth, getMyRole);

export default router;
