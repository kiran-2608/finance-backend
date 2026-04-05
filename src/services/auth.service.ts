import bcrypt from 'bcryptjs';
import db from '../db/database';
import { signToken } from '../utils/jwt';
import { User } from '../types';

interface LoginResult {
  token: string;
  user: Omit<User, 'password_hash'>;
}

export function login(email: string, password: string): LoginResult | null {
  const user = db
    .prepare('SELECT * FROM users WHERE email = ? AND status = ?')
    .get(email, 'active') as User | undefined;

  if (!user) return null;

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return null;

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  const { password_hash: _, ...userPublic } = user;
  return { token, user: userPublic };
}
