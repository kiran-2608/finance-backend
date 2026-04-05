// ─── Roles ──────────────────────────────────────────────────────────────────

export type Role = 'viewer' | 'analyst' | 'admin';

// ─── Users ──────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface UserPublic {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  created_at: string;
}

// ─── Financial Records ───────────────────────────────────────────────────────

export type RecordType = 'income' | 'expense';

export interface FinancialRecord {
  id: number;
  amount: number;
  type: RecordType;
  category: string;
  date: string;       // ISO date string YYYY-MM-DD
  notes: string | null;
  created_by: number; // user id
  created_at: string;
  updated_at: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardSummary {
  total_income: number;
  total_expenses: number;
  net_balance: number;
  record_count: number;
}

export interface CategoryTotal {
  category: string;
  type: RecordType;
  total: number;
  count: number;
}

export interface MonthlyTrend {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
  net: number;
}

export interface RecentActivity {
  id: number;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes: string | null;
  created_at: string;
}
