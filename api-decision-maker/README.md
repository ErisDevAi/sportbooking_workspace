# node-backend-with-cms-integration

Production-ready **Node.js + TypeScript + Express + MongoDB** backend designed for CMS dashboard integration.

Every API response uses the same standardised envelope. JWT carries the user's permissions so role/permission checks work without a DB query on every request.

---

## Overview

| Feature | Detail |
|---------|--------|
| Runtime | Node.js 20+ |
| Language | TypeScript (strict) |
| Framework | Express 4 |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT with embedded permissions |
| Access Control | `checkRole()` + `checkPermission()` middleware |
| Response format | `{ success, message, data, meta? }` |
| Pagination | `?page=1&limit=10` → `meta: { page, limit, total, totalPages }` |

---

## Quick Start

```bash
git clone <repo-url>
cd node-backend-with-cms-integration
npm install

cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET

npm run seed   # creates permissions, roles, and 3 test users
npm run dev    # starts on http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Token signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime |
| `BCRYPT_ROUNDS` | No | `12` | Password hashing cost |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Comma-separated allowed origins |

---

## API Response Format

Every endpoint returns this envelope:

```json
// Success
{
  "success": true,
  "message": "Users fetched",
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}

// Error
{
  "success": false,
  "message": "Access denied. Required permission: create_user",
  "data": null
}

// Validation error
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [{ "msg": "Password min 6 chars", "path": "password" }]
}
```

---

## Endpoints

### Health
```
GET /health
```

### Auth
```
POST /auth/register   { name, email, password }
POST /auth/login      { email, password }  → { token, user }
GET  /auth/me         Authorization: Bearer <token>
```

### Users
```
GET    /users?page=1&limit=10    requires: view_user
GET    /users/:id                requires: view_user
POST   /users                    requires: admin role + create_user
PUT    /users/:id                requires: edit_user
DELETE /users/:id                requires: admin role + delete_user
```

### Roles
```
GET    /roles          requires: authenticated
GET    /roles/:id
POST   /roles          requires: admin + manage_roles
PUT    /roles/:id      requires: admin + manage_roles
DELETE /roles/:id      requires: admin + manage_roles
```

### Permissions
```
GET    /permissions    requires: authenticated
POST   /permissions    requires: admin + manage_permissions
DELETE /permissions/:id
```

### Dashboard
```
GET /dashboard/stats   requires: view_dashboard
```

Response:
```json
{
  "data": {
    "totals": { "users": 42, "activeUsers": 38, "roles": 3, "permissions": 7 },
    "usersByRole": [{ "role": "admin", "count": 1 }],
    "activity": [{ "date": "2024-03-15", "newUsers": 3, "logins": 27, "apiCalls": 183 }],
    "system": { "status": "healthy", "version": "1.0.0", "uptime": 3600 }
  }
}
```

---

## Role & Permission System

### How it works

1. JWT payload includes `role` + `permissions[]`
2. `checkRole('admin')` — checks `req.user.role`
3. `checkPermission('create_user')` — checks `req.user.permissions`
4. Permissions are resolved from the Role document at login time

### Default roles after seed

| Role | Permissions |
|------|-------------|
| admin | all 7 permissions |
| editor | view_user, edit_user, view_dashboard |
| viewer | view_user, view_dashboard |

### Adding a new module with permissions

1. Define a new permission slug in `types/index.ts` (`PermissionSlug`)
2. Add it to `scripts/seed.ts`
3. Assign it to roles in the seed
4. Protect your route: `router.get("/", authenticate, checkPermission("your_slug"), handler)`

---

## Project Structure

```
src/
├── app.ts                          ← Entry point
├── configs/
│   ├── env.ts                      ← All env vars in one place
│   └── db.ts                       ← MongoDB connection
├── common/
│   ├── response.ts                 ← respond.ok / respond.created / respond.fail
│   └── pagination.ts               ← parsePagination() + PaginationMeta
├── modules/
│   ├── auth/      (controller, service, route, validation)
│   ├── users/     (controller, service, model, route, validation)
│   ├── roles/     (controller, service, model, route)
│   ├── permissions/ (controller, service, model, route)
│   └── dashboard/ (controller, service, route)
├── middlewares/
│   ├── auth.middleware.ts          ← authenticate()
│   ├── role.middleware.ts          ← checkRole() + checkPermission()
│   ├── error.middleware.ts         ← AppError + centralised handler
│   └── validate.middleware.ts      ← express-validator runner
├── utils/
│   ├── logger.ts / jwt.ts / hash.ts
├── types/
│   ├── express.d.ts               ← req.user type
│   └── index.ts                   ← UserRole + PermissionSlug
└── scripts/
    └── seed.ts
```

---

## Connecting the CMS (project-115)

In `project-115-react-antd-admin-cms/.env`:
```
VITE_API_URL=http://localhost:3000
```

The CMS expects these exact endpoints — all implemented here.

---

## Seed Credentials

```
admin@example.com   / password123  (role: admin — all permissions)
editor@example.com  / password123  (role: editor)
viewer@example.com  / password123  (role: viewer)
```
