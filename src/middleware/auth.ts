import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { unauthorized, forbidden } from '../utils/response';
import { Role, JwtPayload } from '../types';

// Extend Express Request to carry the authenticated user payload
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * authenticate — verifies the JWT from the Authorization header.
 * Attaches the decoded payload to req.user.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    unauthorized(res, 'Missing or malformed Authorization header');
    return;
  }

  const token = authHeader.slice(7);

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    unauthorized(res, 'Invalid or expired token');
  }
}

/**
 * authorize — role-based guard factory.
 * Usage: router.delete('/...', authenticate, authorize('admin'), handler)
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      unauthorized(res);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      forbidden(res, `This action requires one of the following roles: ${allowedRoles.join(', ')}`);
      return;
    }

    next();
  };
}

/**
 * Role hierarchy helpers — useful for route-level guards.
 *
 *   viewer  → can read dashboard data
 *   analyst → viewer + can read records + detailed insights
 *   admin   → full access
 */
export const canView    = authorize('viewer', 'analyst', 'admin');
export const canAnalyze = authorize('analyst', 'admin');
export const adminOnly  = authorize('admin');
