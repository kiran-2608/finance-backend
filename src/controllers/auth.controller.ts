import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { success, unauthorized } from '../utils/response';

export function login(req: Request, res: Response): void {
  const { email, password } = req.body as { email: string; password: string };

  const result = authService.login(email, password);

  if (!result) {
    unauthorized(res, 'Invalid email or password');
    return;
  }

  success(res, result, 200, 'Login successful');
}

export function me(req: Request, res: Response): void {
  success(res, req.user);
}
