import { Router } from 'express';
import * as recordController from '../controllers/record.controller';
import { authenticate, canAnalyze, adminOnly } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  CreateRecordSchema,
  UpdateRecordSchema,
  RecordFilterSchema,
} from '../models/schemas';

const router = Router();

// All record routes require authentication
router.use(authenticate);

// GET  /api/records        — analyst + admin
router.get(
  '/',
  canAnalyze,
  validate(RecordFilterSchema, 'query'),
  recordController.listRecords,
);

// GET  /api/records/:id    — analyst + admin
router.get('/:id', canAnalyze, recordController.getRecord);

// POST /api/records        — admin only
router.post(
  '/',
  adminOnly,
  validate(CreateRecordSchema),
  recordController.createRecord,
);

// PATCH /api/records/:id   — admin only
router.patch(
  '/:id',
  adminOnly,
  validate(UpdateRecordSchema),
  recordController.updateRecord,
);

// DELETE /api/records/:id  — admin only
router.delete('/:id', adminOnly, recordController.deleteRecord);

export default router;
