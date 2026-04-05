import db from '../db/database';
import {
  DashboardSummary,
  CategoryTotal,
  MonthlyTrend,
  RecentActivity,
} from '../types';

export function getSummary(): DashboardSummary {
  const row = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
      COUNT(*) AS record_count
    FROM financial_records
  `).get() as { total_income: number; total_expenses: number; record_count: number };

  return {
    total_income:   row.total_income,
    total_expenses: row.total_expenses,
    net_balance:    row.total_income - row.total_expenses,
    record_count:   row.record_count,
  };
}

export function getCategoryTotals(): CategoryTotal[] {
  return db.prepare(`
    SELECT
      category,
      type,
      ROUND(SUM(amount), 2) AS total,
      COUNT(*)              AS count
    FROM financial_records
    GROUP BY category, type
    ORDER BY total DESC
  `).all() as CategoryTotal[];
}

export function getMonthlyTrends(months = 6): MonthlyTrend[] {
  const rows = db.prepare(`
    SELECT
      strftime('%Y-%m', date) AS month,
      ROUND(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 2) AS income,
      ROUND(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 2) AS expenses
    FROM financial_records
    WHERE date >= date('now', '-' || @months || ' months')
    GROUP BY month
    ORDER BY month ASC
  `).all({ months }) as Array<{ month: string; income: number; expenses: number }>;

  return rows.map(r => ({
    ...r,
    net: r.income - r.expenses,
  }));
}

export function getRecentActivity(limit = 10): RecentActivity[] {
  return db.prepare(`
    SELECT id, amount, type, category, date, notes, created_at
    FROM financial_records
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit) as RecentActivity[];
}
