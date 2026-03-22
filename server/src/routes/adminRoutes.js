import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import {
  createTest,
  updateTest,
  createTopic,
  updateTopic,
  listAllTests,
} from '../controllers/adminController.js';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/tests', listAllTests);
router.post('/tests', createTest);
router.patch('/tests/:id', updateTest);
router.post('/topics', createTopic);
router.patch('/topics/:id', updateTopic);

export default router;
