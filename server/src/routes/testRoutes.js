import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { listTests, getTest, submitTest } from '../controllers/testController.js';

const router = Router();

router.get('/', listTests);
router.get('/:id', getTest);
router.post('/:id/submit', authenticate, submitTest);

export default router;
