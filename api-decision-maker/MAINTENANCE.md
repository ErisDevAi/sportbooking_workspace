# MAINTENANCE.md

---

## Versioning Strategy

Follow **Semantic Versioning** (semver.org):

| Bump | When |
|------|------|
| `PATCH 1.0.x` | Bug fixes, security patches, no breaking changes |
| `MINOR 1.x.0` | New endpoints or features, backwards-compatible |
| `MAJOR x.0.0` | Breaking changes (response format, auth flow, schema) |

```bash
git tag v1.0.1
git push --tags
```

---

## How to Extend a Module

### Add a new endpoint to an existing module

1. Add the service method in `modules/X/x.service.ts`
2. Add the controller method in `modules/X/x.controller.ts`
3. Add the route in `modules/X/x.route.ts`
4. Add validation in `modules/X/x.validation.ts` if needed

### Add a new module (e.g. `posts`)

```
src/modules/posts/
  post.model.ts       ← Mongoose schema
  post.service.ts     ← DB logic
  post.controller.ts  ← HTTP layer
  post.route.ts       ← Router
  post.validation.ts  ← express-validator chains
```

Register in `app.ts`:
```ts
import postRoutes from "./modules/posts/post.route";
app.use("/posts", postRoutes);
```

### Add a new permission

1. Add slug to `types/index.ts` → `PermissionSlug` union
2. Add to `scripts/seed.ts` permission array
3. Assign to relevant roles in seed
4. Protect the route: `checkPermission('your_slug')`

---

## Dependency Updates

```bash
# Monthly
npm outdated
npm audit

# Upgrade patch/minor safely
npx npm-check-updates -u --target minor
npm install
npm run build

# Security only
npm audit fix
```

**Watch carefully:**
- `jsonwebtoken` — security critical, check CVEs monthly
- `bcryptjs` — never downgrade
- `mongoose` — major versions change query API
- `express` — v5 has breaking changes in router behavior

---

## Security Updates

- [ ] Rotate `JWT_SECRET` every 90 days in production
- [ ] Review `npm audit` weekly
- [ ] Keep `BCRYPT_ROUNDS` at 12+ (increase only if server capacity allows)
- [ ] Check Mongoose security advisories before upgrading major versions
- [ ] Review CORS `corsOrigins` when adding new frontends

---

## Code Conventions

- Services contain **all DB logic** — controllers are HTTP-only
- Always use `respond.ok / respond.created / respond.fail` from `common/response.ts`
- Always use `parsePagination(req.query)` for list endpoints
- Always call `next(err)` — never `res.json()` inside catch
- Use `AppError(message, statusCode)` for known business errors
- TypeScript: `unknown` for caught errors, never `any`

---

## Logging

Current logger is minimal. Upgrade path:

```bash
npm install winston
```

Add transports: Console (dev) + File (prod) + Cloud (Datadog/CloudWatch in infra).
Structured JSON format: `{ level, message, timestamp, requestId }`.
