import bcrypt from 'bcryptjs';
import db from '../db/database';
import { User, UserPublic } from '../types';
import { z } from 'zod';
import { CreateUserSchema, UpdateUserSchema } from '../models/schemas';

type CreateUserInput = z.infer<typeof CreateUserSchema>;
type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

function toPublic(user: User): UserPublic {
  const { password_hash: _, ...pub } = user;
  return pub;
}

export function getAllUsers(): UserPublic[] {
  const rows = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
  return rows.map(toPublic);
}

export function getUserById(id: number): UserPublic | null {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  return row ? toPublic(row) : null;
}

export function getUserByEmail(email: string): User | null {
  return (db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User) ?? null;
}

export function createUser(input: CreateUserInput): UserPublic {
  const password_hash = bcrypt.hashSync(input.password, 10);

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, status)
    VALUES (@name, @email, @password_hash, @role, 'active')
  `).run({ name: input.name, email: input.email, password_hash, role: input.role });

  return getUserById(result.lastInsertRowid as number)!;
}

export function updateUser(id: number, input: UpdateUserInput): UserPublic | null {
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!user) return null;

  const fields = Object.entries(input)
    .filter(([, v]) => v !== undefined)
    .map(([k]) => `${k} = @${k}`)
    .join(', ');

  db.prepare(`UPDATE users SET ${fields} WHERE id = @id`).run({ ...input, id });

  return getUserById(id);
}

export function deleteUser(id: number): boolean {
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return result.changes > 0;
}
