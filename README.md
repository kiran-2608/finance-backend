# Finance Dashboard Backend

A production-ready REST API for a finance dashboard system with role-based access control (RBAC), financial record management, and aggregated analytics.

---

## Tech Stack

| Layer        | Choice                        | Reason                                    |
|--------------|-------------------------------|-------------------------------------------|
| Runtime      | Node.js + TypeScript          | Type safety, maintainability              |
| Framework    | Express                       | Minimal, well-understood, flexible        |
| Database     | SQLite (via better-sqlite3)   | Zero-config, file-based, easy to demo     |
| Auth         | JWT (jsonwebtoken + bcryptjs) | Stateless, standard                       |
| Validation   | Zod                           | Schema-first, composable, TypeScript-native |

> **Assumption:** SQLite is used for simplicity. In a production environment, swap the `db/database.ts` adapter for PostgreSQL or MySQL with minimal changes to the service layer.

---

## Project Structure

```
src/
├── index.ts                  # App entry point, middleware, server
├── types/
│   └── index.ts              # Shared TypeScript interfaces & types
├── db/
│   ├── database.ts           # SQLite connection + schema creation
│   └── seed.ts               # Demo data seeder
├── models/
│   └── schemas.ts            # Zod validation schemas
├── middleware/
│   ├── auth.ts               # JWT authentication + role guards
│   └── validate.ts           # Zod validation middleware factory
├── services/
│   ├── auth.service.ts       # Login logic
│   ├── user.service.ts       # User CRUD
│   ├── record.service.ts     # Financial record CRUD + filtering
│   └── dashboard.service.ts  # Aggregated analytics queries
├── controllers/
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── record.controller.ts
│   └── dashboard.controller.ts
└── routes/
    ├── auth.routes.ts
    ├── user.routes.ts
    ├── record.routes.ts
    └── dashboard.routes.ts
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set JWT_SECRET to a strong random value
```

### 3. Seed the database

```bash
npm run seed
```

This creates 3 demo users:

| Email               | Password    | Role    |
|---------------------|-------------|---------|
| admin@demo.com      | admin123    | admin   |
| analyst@demo.com    | analyst123  | analyst |
| viewer@demo.com     | viewer123   | viewer  |

### 4. Start the server

```bash
# Development (ts-node, no build step)
npm run dev

# Production
npm run build && npm start
```

Server runs at `http://localhost:3000` (or `$PORT`).

---

## Role Permissions

| Action                          | Viewer | Analyst | Admin |
|---------------------------------|--------|---------|-------|
| Login                           | ✅     | ✅      | ✅    |
| View dashboard summary          | ✅     | ✅      | ✅    |
| View recent activity            | ✅     | ✅      | ✅    |
| View category totals            | ❌     | ✅      | ✅    |
| View monthly trends             | ❌     | ✅      | ✅    |
| List / read financial records   | ❌     | ✅      | ✅    |
| Create / update / delete records| ❌     | ❌      | ✅    |
| Manage users                    | ❌     | ❌      | ✅    |

---

## API Reference

All protected endpoints require:
```
Authorization: Bearer <token>
```

### Auth

#### `POST /api/auth/login`
```json
{ "email": "admin@demo.com", "password": "admin123" }
```
**Response:**
```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": 1, "name": "Alice Admin", "role": "admin", ... }
  }
}
```

#### `GET /api/auth/me` 🔒
Returns the authenticated user's JWT payload.

---

### Users _(admin only)_

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| GET    | /api/users       | List all users      |
| GET    | /api/users/:id   | Get user by ID      |
| POST   | /api/users       | Create a new user   |
| PATCH  | /api/users/:id   | Update user         |
| DELETE | /api/users/:id   | Delete user         |

**Create user body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass",
  "role": "analyst"
}
```

**Update user body** (all fields optional):
```json
{ "name": "Jane Smith", "role": "admin", "status": "inactive" }
```

---

### Financial Records

| Method | Endpoint           | Role Required   | Description            |
|--------|--------------------|-----------------|------------------------|
| GET    | /api/records       | analyst, admin  | List records (filtered)|
| GET    | /api/records/:id   | analyst, admin  | Get record by ID       |
| POST   | /api/records       | admin           | Create record          |
| PATCH  | /api/records/:id   | admin           | Update record          |
| DELETE | /api/records/:id   | admin           | Delete record          |

**Query parameters for `GET /api/records`:**

| Param      | Type   | Example        | Description                  |
|------------|--------|----------------|------------------------------|
| type       | string | `income`       | Filter by type               |
| category   | string | `Rent`         | Partial match on category    |
| date_from  | string | `2024-01-01`   | ISO date lower bound         |
| date_to    | string | `2024-03-31`   | ISO date upper bound         |
| page       | number | `1`            | Page number (default: 1)     |
| limit      | number | `20`           | Results per page (max: 100)  |

**Create record body:**
```json
{
  "amount": 1500.00,
  "type": "expense",
  "category": "Rent",
  "date": "2024-04-01",
  "notes": "April rent"
}
```

---

### Dashboard

| Method | Endpoint                     | Role Required   | Description                  |
|--------|------------------------------|-----------------|------------------------------|
| GET    | /api/dashboard/summary       | all             | Total income, expenses, net  |
| GET    | /api/dashboard/recent        | all             | 10 most recent records       |
| GET    | /api/dashboard/categories    | analyst, admin  | Totals grouped by category   |
| GET    | /api/dashboard/trends        | analyst, admin  | Monthly income vs expense    |

**`GET /api/dashboard/trends` query:**

| Param  | Type   | Default | Description          |
|--------|--------|---------|----------------------|
| months | number | 6       | Number of past months|

**Example summary response:**
```json
{
  "success": true,
  "data": {
    "total_income": 17300.00,
    "total_expenses": 6100.00,
    "net_balance": 11200.00,
    "record_count": 15
  }
}
```

---

## Error Responses

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Human-readable description",
  "errors": ["field.path: specific validation issue"]
}
```

| Status | Meaning                        |
|--------|--------------------------------|
| 400    | Bad request / validation error |
| 401    | Missing or invalid JWT         |
| 403    | Insufficient role              |
| 404    | Resource not found             |
| 409    | Conflict (e.g. duplicate email)|
| 500    | Internal server error          |

---

## Design Decisions & Assumptions

1. **SQLite as persistence** — chosen for zero-config simplicity. The service layer is database-agnostic; swapping to Postgres requires only changing `db/database.ts` and the query syntax in services.

2. **Synchronous SQLite driver** — `better-sqlite3` is synchronous, which simplifies code significantly for a single-process backend. For high-concurrency production use, switch to an async driver (e.g. `@libsql/client`).

3. **Soft-delete not implemented** — records and users are hard-deleted. Soft delete can be added by introducing a `deleted_at` column and filtering `WHERE deleted_at IS NULL` everywhere.

4. **Pagination on records** — the `GET /api/records` endpoint is paginated (default 20 per page, max 100) to prevent large payload responses.

5. **Analysts cannot write records** — the assignment left this ambiguous; I chose to restrict writes to admin only since "analysts" are described as read + insight oriented.

6. **Self-deletion guard** — admins cannot delete their own account to prevent accidental lockout.

7. **JWT expiry** — tokens expire after 24h by default (configurable via `JWT_EXPIRES_IN` env var). No refresh token mechanism is implemented; this is a reasonable tradeoff for a demo/assessment backend.

---

## Optional Enhancements (not implemented but noted)

- **Refresh tokens** — issue short-lived access tokens + long-lived refresh tokens
- **Rate limiting** — add `express-rate-limit` middleware at the router level
- **Soft deletes** — `deleted_at` column + `WHERE deleted_at IS NULL` filter
- **Search** — full-text search on `notes` and `category` fields
- **Tests** — Jest + Supertest for controller/service integration tests
- **OpenAPI docs** — `swagger-jsdoc` + `swagger-ui-express` for interactive docs
