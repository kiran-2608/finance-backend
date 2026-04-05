import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate, canView, canAnalyze } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { TrendQuerySchema } from '../models/schemas';

const router = Router();

router.use(authenticate);

// GET /api/dashboard/summary          — all roles (viewer, analyst, admin)
router.get('/summary', canView, dashboardController.getSummary);

// GET /api/dashboard/recent           — all roles
router.get('/recent', canView, dashboardController.getRecentActivity);

// GET /api/dashboard/categories       — analyst + admin
router.get('/categories', canAnalyze, dashboardController.getCategoryTotals);

// GET /api/dashboard/trends?months=6  — analyst + admin
router.get(
  '/trends',
  canAnalyze,
  validate(TrendQuerySchema, 'query'),
  dashboardController.getMonthlyTrends,
);

export default router;
