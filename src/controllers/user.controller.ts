import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import {
  success, created, noContent, notFound, conflict, badRequest,
} from '../utils/response';
import { z } from 'zod';
import { CreateUserSchema, UpdateUserSchema } from '../models/schemas';

type CreateUserInput = z.infer<typeof CreateUserSchema>;
type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export function listUsers(req: Request, res: Response): void {
  success(res, userService.getAllUsers());
}

// export function getUser(req: Request, res: Response): void {
//   const id = parseInt(req.params.id, 10);
//   const user = userService.getUserById(id);
//   if (!user) { notFound(res, 'User not found'); return; }
//   success(res, user);
// }

export function getUser(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const user = userService.getUserById(id);
  if (!user) { notFound(res, 'User not found'); return; }
  success(res, user, 200);
}

export function createUser(req: Request, res: Response): void {
  const input = req.body as CreateUserInput;

  const existing = userService.getUserByEmail(input.email);
  if (existing) { conflict(res, 'A user with this email already exists'); return; }

  const user = userService.createUser(input);
  created(res, user, 'User created successfully');
}

// export function updateUser(req: Request, res: Response): void {
//   const id    = Number(req.params.id);
//   const input = req.body as UpdateUserInput;

//   const updated = userService.updateUser(id, input);
//   if (!updated) { notFound(res, 'User not found'); return; }

//   success(res, updated, 'User updated successfully');
// }

export function updateUser(req: Request, res: Response): void {
  const id    = Number(req.params.id);
  const input = req.body as UpdateUserInput;
  const updated = userService.updateUser(id, input);
  if (!updated) { notFound(res, 'User not found'); return; }
  success(res, updated, 200, 'User updated successfully');
}

export function deleteUser(req: Request, res: Response): void {
  const id = Number(req.params.id);

  // Prevent self-deletion
  if (req.user?.userId === id) {
    badRequest(res, 'You cannot delete your own account');
    return;
  }

  const deleted = userService.deleteUser(id);
  if (!deleted) { notFound(res, 'User not found'); return; }

  noContent(res);
}
