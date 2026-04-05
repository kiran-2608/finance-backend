import { z } from 'zod';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Users ───────────────────────────────────────────────────────────────────

export const CreateUserSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role:     z.enum(['viewer', 'analyst', 'admin']),
});

export const UpdateUserSchema = z.object({
  name:   z.string().min(2).optional(),
  role:   z.enum(['viewer', 'analyst', 'admin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

// ─── Financial Records ───────────────────────────────────────────────────────

export const CreateRecordSchema = z.object({
  amount:   z.number().positive('Amount must be a positive number'),
  type:     z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required').max(100),
  date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  notes:    z.string().max(500).optional().nullable(),
});

export const UpdateRecordSchema = z.object({
  amount:   z.number().positive().optional(),
  type:     z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).max(100).optional(),
  date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes:    z.string().max(500).optional().nullable(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const RecordFilterSchema = z.object({
  type:       z.enum(['income', 'expense']).optional(),
  category:   z.string().optional(),
  date_from:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page:       z.coerce.number().int().positive().default(1),
  limit:      z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const TrendQuerySchema = z.object({
  months: z.coerce.number().int().min(1).max(24).default(6),
});
