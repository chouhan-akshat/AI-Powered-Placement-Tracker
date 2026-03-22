import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getMyRoadmap, regenerateRoadmap } from '../controllers/roadmapController.js';

const router = Router();
router.use(authenticate);

router.get('/me', getMyRoadmap);
router.post('/regenerate', regenerateRoadmap);

export default router;
