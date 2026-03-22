import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { listTopics, getTopic, markTopicComplete } from '../controllers/topicController.js';

const router = Router();

router.get('/', listTopics);
router.get('/:slug', getTopic);
router.post('/progress', authenticate, markTopicComplete);

export default router;
