import db from '../db/database';
import { FinancialRecord } from '../types';
import { z } from 'zod';
import {
  CreateRecordSchema,
  UpdateRecordSchema,
  RecordFilterSchema,
} from '../models/schemas';

type CreateRecordInput = z.infer<typeof CreateRecordSchema>;
type UpdateRecordInput = z.infer<typeof UpdateRecordSchema>;
type RecordFilter     = z.infer<typeof RecordFilterSchema>;

export interface PaginatedRecords {
  data: FinancialRecord[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export function getRecords(filter: RecordFilter): PaginatedRecords {
  const conditions: string[] = [];
  const params: Record<string, unknown> = {};

  if (filter.type) {
    conditions.push('type = @type');
    params.type = filter.type;
  }
  if (filter.category) {
    conditions.push('category LIKE @category');
    params.category = `%${filter.category}%`;
  }
  if (filter.date_from) {
    conditions.push('date >= @date_from');
    params.date_from = filter.date_from;
  }
  if (filter.date_to) {
    conditions.push('date <= @date_to');
    params.date_to = filter.date_to;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const total = (
    db.prepare(`SELECT COUNT(*) as count FROM financial_records ${where}`).get(params) as { count: number }
  ).count;

  const offset = (filter.page - 1) * filter.limit;
  const data = db.prepare(`
    SELECT * FROM financial_records
    ${where}
    ORDER BY date DESC, created_at DESC
    LIMIT @limit OFFSET @offset
  `).all({ ...params, limit: filter.limit, offset }) as FinancialRecord[];

  return {
    data,
    total,
    page: filter.page,
    limit: filter.limit,
    total_pages: Math.ceil(total / filter.limit),
  };
}

export function getRecordById(id: number): FinancialRecord | null {
  return (
    db.prepare('SELECT * FROM financial_records WHERE id = ?').get(id) as FinancialRecord
  ) ?? null;
}

export function createRecord(input: CreateRecordInput, userId: number): FinancialRecord {
  const result = db.prepare(`
    INSERT INTO financial_records (amount, type, category, date, notes, created_by)
    VALUES (@amount, @type, @category, @date, @notes, @created_by)
  `).run({ ...input, notes: input.notes ?? null, created_by: userId });

  return getRecordById(result.lastInsertRowid as number)!;
}

export function updateRecord(id: number, input: UpdateRecordInput): FinancialRecord | null {
  const existing = getRecordById(id);
  if (!existing) return null;

  const fields = Object.entries(input)
    .filter(([, v]) => v !== undefined)
    .map(([k]) => `${k} = @${k}`)
    .join(', ');

  db.prepare(`
    UPDATE financial_records
    SET ${fields}, updated_at = datetime('now')
    WHERE id = @id
  `).run({ ...input, id });

  return getRecordById(id);
}

export function deleteRecord(id: number): boolean {
  const result = db.prepare('DELETE FROM financial_records WHERE id = ?').run(id);
  return result.changes > 0;
}
