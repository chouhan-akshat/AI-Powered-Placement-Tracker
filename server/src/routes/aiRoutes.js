import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { mentor, mockInterview, resumeAnalyze } from '../controllers/aiController.js';

const router = Router();
router.use(authenticate);

router.post('/mentor', mentor);
router.post('/mock-interview', mockInterview);
router.post('/resume', resumeAnalyze);

export default router;
