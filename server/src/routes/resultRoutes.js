import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { myResults, leaderboard } from '../controllers/resultController.js';

const router = Router();

router.get('/me', authenticate, myResults);
router.get('/leaderboard', leaderboard);

export default router;
