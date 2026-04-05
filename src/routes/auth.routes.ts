import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { LoginSchema } from '../models/schemas';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(LoginSchema), authController.login);

// GET /api/auth/me  — returns the current user's JWT payload
router.get('/me', authenticate, authController.me);

export default router;
