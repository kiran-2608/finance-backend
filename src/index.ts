import express, { Request, Response, NextFunction } from 'express';
import authRoutes      from './routes/auth.routes';
import userRoutes      from './routes/user.routes';
import recordRoutes    from './routes/record.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { seedIfEmpty } from './db/seed';

const app  = express();
const PORT = process.env.PORT ?? 3000;

// ─── Global Middleware ───────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Finance Dashboard API',
    version: '1.0.0',
    docs: 'See README.md for full API reference',
    endpoints: {
      auth:      '/api/auth',
      users:     '/api/users',
      records:   '/api/records',
      dashboard: '/api/dashboard',
    },
  });
});

app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/records',   recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 Finance Backend API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV ?? 'development'}`);

  seedIfEmpty();
});


export default app;
