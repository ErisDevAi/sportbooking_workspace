# LAUNCH.md

Pre-release checklist before shipping v1.0.0.

---

## 1. Environment

- [ ] `.env` is in `.gitignore` — never committed
- [ ] `JWT_SECRET` is ≥ 32 random characters
- [ ] `BCRYPT_ROUNDS` is 12 in production
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGINS` lists only the real frontend domain(s)
- [ ] `MONGODB_URI` uses a production cluster with auth

---

## 2. Code Quality

```bash
npm run lint
npm run build
```

- [ ] Zero lint errors
- [ ] TypeScript compiles with no errors
- [ ] No `console.log` debug statements in production paths
- [ ] No hardcoded secrets or tokens in source

---

## 3. API Testing Checklist

Test each endpoint manually (curl / Postman / HTTPie) or via automated tests:

### Auth
- [ ] `POST /auth/register` — creates user, returns token + user
- [ ] `POST /auth/register` with duplicate email → 409
- [ ] `POST /auth/login` — valid credentials → token + user with permissions[]
- [ ] `POST /auth/login` — wrong password → 401
- [ ] `GET /auth/me` — with token → user data
- [ ] `GET /auth/me` — no token → 401

### Users
- [ ] `GET /users` — admin token → paginated list with meta
- [ ] `GET /users?page=2&limit=5` — correct skip/limit
- [ ] `GET /users` — viewer token → 403 (no view_user... actually viewer has view_user, so 200)
- [ ] `POST /users` — editor token → 403 (no create_user)
- [ ] `POST /users` — admin token → creates user, 201
- [ ] `PUT /users/:id` — editor token → 200 (has edit_user)
- [ ] `DELETE /users/:id` — editor token → 403 (no delete_user)
- [ ] `DELETE /users/:id` — admin token → 200

### Roles & Permissions
- [ ] `GET /roles` → list of all roles with permissions array
- [ ] `GET /permissions` → list grouped by module
- [ ] `DELETE /roles/:system-role-id` → 403 (system roles protected)

### Dashboard
- [ ] `GET /dashboard/stats` — admin token → totals + activity + system
- [ ] `GET /dashboard/stats` — no token → 401

### Error handling
- [ ] Invalid JWT → 401 `Invalid token`
- [ ] Expired JWT → 401 `Token has expired`
- [ ] Non-existent route → 404 `Route not found`
- [ ] Invalid MongoDB ID → 422

---

## 4. Security Checklist

- [ ] `npm audit` — 0 critical/high vulnerabilities
- [ ] Passwords never appear in API responses (`select: false` on model)
- [ ] JWT secret not logged anywhere
- [ ] Error responses don't leak stack traces in production (`NODE_ENV=production`)
- [ ] Rate limiting added (recommended: `express-rate-limit`)
  ```bash
  npm install express-rate-limit
  ```
- [ ] Helmet headers added:
  ```bash
  npm install helmet
  ```
  ```ts
  import helmet from "helmet";
  app.use(helmet()); // add before routes in app.ts
  ```
- [ ] MongoDB connection string uses credentials (no unauthenticated local URI in prod)

---

## 5. Performance

- [ ] Run with compiled JS in production: `npm run build && npm start`
- [ ] MongoDB indexes in place for frequent queries:
  ```ts
  // user.model.ts — already has unique index on email
  // Add if you filter by role frequently:
  UserSchema.index({ role: 1, isActive: 1 });
  ```
- [ ] Connection pool size adequate for load (`maxPoolSize: 20` for high traffic)
- [ ] Morgan logging uses `combined` format in production (not `dev`)

---

## 6. Deployment

### Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

### Cloud options
| Platform | Notes |
|----------|-------|
| Railway | `railway up` — auto-detects Node, set env vars in dashboard |
| Render | Connect GitHub, set `npm run build` + `npm start` |
| Fly.io | `fly deploy` + set secrets with `fly secrets set` |
| AWS ECS | Push to ECR, deploy as Fargate task |

---

## 7. Publish v1.0.0

```bash
npm run lint
npm run build
git add -A
git commit -m "release: v1.0.0"
git tag v1.0.0
git push origin main --tags
```

---

## Post-Launch

- [ ] Set up uptime monitor on `/health` (UptimeRobot / BetterUptime)
- [ ] Configure error alerting (Sentry)
- [ ] Verify seed script runs cleanly against production DB
- [ ] Test login flow end-to-end with the CMS (project-115)
- [ ] Check MongoDB Atlas slow query logs after first 24 hours
