import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { success } from '../utils/response';
import { z } from 'zod';
import { TrendQuerySchema } from '../models/schemas';

type TrendQuery = z.infer<typeof TrendQuerySchema>;

export function getSummary(req: Request, res: Response): void {
  success(res, dashboardService.getSummary());
}

export function getCategoryTotals(req: Request, res: Response): void {
  success(res, dashboardService.getCategoryTotals());
}

export function getMonthlyTrends(req: Request, res: Response): void {
  const { months } = req.query as unknown as TrendQuery;
  success(res, dashboardService.getMonthlyTrends(months));
}

export function getRecentActivity(req: Request, res: Response): void {
  success(res, dashboardService.getRecentActivity());
}
