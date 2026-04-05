/**
 * Seed script — run with: npm run seed
 * Creates 3 demo users (one per role) and sample financial records.
 *
 * Demo credentials:
 *   admin@demo.com   / admin123
 *   analyst@demo.com / analyst123
 *   viewer@demo.com  / viewer123
 */

import bcrypt from 'bcryptjs';
import db from './database';

function seed() {
  console.log('🌱 Seeding database...');

  // ── Users ────────────────────────────────────────────────────────────────

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, status)
    VALUES (@name, @email, @password_hash, @role, @status)
  `);

  const users = [
    { name: 'Alice Admin',   email: 'admin@demo.com',   password: 'admin123',   role: 'admin'   },
    { name: 'Alan Analyst',  email: 'analyst@demo.com', password: 'analyst123', role: 'analyst' },
    { name: 'Victor Viewer', email: 'viewer@demo.com',  password: 'viewer123',  role: 'viewer'  },
  ];

  for (const u of users) {
    const password_hash = bcrypt.hashSync(u.password, 10);
    insertUser.run({ name: u.name, email: u.email, password_hash, role: u.role, status: 'active' });
    console.log(`  ✔ User: ${u.email} (${u.role})`);
  }

  // ── Financial Records ─────────────────────────────────────────────────────

  const adminRow = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@demo.com') as { id: number };
  const adminId = adminRow.id;

  const insertRecord = db.prepare(`
    INSERT INTO financial_records (amount, type, category, date, notes, created_by)
    VALUES (@amount, @type, @category, @date, @notes, @created_by)
  `);

  const records = [
    // Income
    { amount: 5000,  type: 'income',  category: 'Salary',       date: '2024-01-01', notes: 'Monthly salary' },
    { amount: 1200,  type: 'income',  category: 'Freelance',    date: '2024-01-15', notes: 'Contract work' },
    { amount: 5000,  type: 'income',  category: 'Salary',       date: '2024-02-01', notes: 'Monthly salary' },
    { amount: 800,   type: 'income',  category: 'Investments',  date: '2024-02-10', notes: 'Dividend payout' },
    { amount: 5000,  type: 'income',  category: 'Salary',       date: '2024-03-01', notes: 'Monthly salary' },
    { amount: 300,   type: 'income',  category: 'Freelance',    date: '2024-03-20', notes: 'Small gig' },
    // Expenses
    { amount: 1500,  type: 'expense', category: 'Rent',         date: '2024-01-05', notes: 'Monthly rent' },
    { amount: 250,   type: 'expense', category: 'Groceries',    date: '2024-01-10', notes: null },
    { amount: 80,    type: 'expense', category: 'Utilities',    date: '2024-01-18', notes: 'Electric bill' },
    { amount: 1500,  type: 'expense', category: 'Rent',         date: '2024-02-05', notes: 'Monthly rent' },
    { amount: 320,   type: 'expense', category: 'Groceries',    date: '2024-02-12', notes: null },
    { amount: 600,   type: 'expense', category: 'Travel',       date: '2024-02-20', notes: 'Business trip' },
    { amount: 1500,  type: 'expense', category: 'Rent',         date: '2024-03-05', notes: 'Monthly rent' },
    { amount: 200,   type: 'expense', category: 'Groceries',    date: '2024-03-08', notes: null },
    { amount: 150,   type: 'expense', category: 'Subscriptions',date: '2024-03-15', notes: 'SaaS tools' },
  ];

  // Clear existing records to avoid duplicates on re-seed
  db.prepare('DELETE FROM financial_records').run();

  for (const r of records) {
    insertRecord.run({ ...r, created_by: adminId });
  }
  console.log(`  ✔ Inserted ${records.length} financial records`);

  console.log('\n✅ Seed complete!\n');
  console.log('Demo credentials:');
  console.log('  admin@demo.com   / admin123');
  console.log('  analyst@demo.com / analyst123');
  console.log('  viewer@demo.com  / viewer123');
}

export { seed };

if (require.main === module) {
  seed();
}
