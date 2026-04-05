import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, adminOnly } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreateUserSchema, UpdateUserSchema } from '../models/schemas';

const router = Router();

// All user-management routes require authentication + admin role
router.use(authenticate, adminOnly);

// GET  /api/users
router.get('/', userController.listUsers);

// GET  /api/users/:id
router.get('/:id', userController.getUser);

// POST /api/users
router.post('/', validate(CreateUserSchema), userController.createUser);

// PATCH /api/users/:id
router.patch('/:id', validate(UpdateUserSchema), userController.updateUser);

// DELETE /api/users/:id
router.delete('/:id', userController.deleteUser);

export default router;
