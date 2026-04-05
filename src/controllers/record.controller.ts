import { Request, Response } from 'express';
import * as recordService from '../services/record.service';
import { success, created, noContent, notFound } from '../utils/response';
import { z } from 'zod';
import {
  CreateRecordSchema,
  UpdateRecordSchema,
  RecordFilterSchema,
} from '../models/schemas';

type CreateRecordInput = z.infer<typeof CreateRecordSchema>;
type UpdateRecordInput = z.infer<typeof UpdateRecordSchema>;
type RecordFilter     = z.infer<typeof RecordFilterSchema>;

export function listRecords(req: Request, res: Response): void {
  const filter = req.query as unknown as RecordFilter;
  const result = recordService.getRecords(filter);
  success(res, result, 200);
}

export function getRecord(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const record = recordService.getRecordById(id);
  if (!record) { notFound(res, 'Record not found'); return; }
  success(res, record, 200);
}

export function createRecord(req: Request, res: Response): void {
  const input  = req.body as CreateRecordInput;
  const userId = req.user!.userId;
  const record = recordService.createRecord(input, userId);
  created(res, record, 'Record created successfully');
}

export function updateRecord(req: Request, res: Response): void {
  const id      = Number(req.params.id);
  const input   = req.body as UpdateRecordInput;
  const updated = recordService.updateRecord(id, input);
  if (!updated) { notFound(res, 'Record not found'); return; }
  success(res, updated, 200, 'Record updated successfully');
}

export function deleteRecord(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const deleted = recordService.deleteRecord(id);
  if (!deleted) { notFound(res, 'Record not found'); return; }
  noContent(res);
}