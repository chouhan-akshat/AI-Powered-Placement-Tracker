import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('branch').optional().isString(),
    body('semester').optional().isInt({ min: 1, max: 8 }),
    body('goal').optional().isIn(['service', 'product', 'specific_role', 'general']),
  ],
  signup
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  login
);

router.get('/me', authenticate, getProfile);
router.patch('/me', authenticate, updateProfile);

export default router;
