import { Router } from 'express';
import { recommendWorkers } from '../controllers/ai.controller.js';

const router = Router();

router.post('/recommend', recommendWorkers);

export default router;
