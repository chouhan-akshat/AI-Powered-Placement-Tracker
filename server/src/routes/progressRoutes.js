import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProgress, setWeeklyGoals } from '../controllers/progressController.js';

const router = Router();
router.use(authenticate);

router.get('/', getProgress);
router.patch('/weekly', setWeeklyGoals);

export default router;
