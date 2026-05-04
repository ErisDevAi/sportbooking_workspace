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

### Categories
```
GET    /categories          requires: view_category (public + user's private)
GET    /categories/:id      requires: view_category
POST   /categories          requires: create_category
PUT    /categories/:id      requires: edit_category (owner only)
DELETE /categories/:id      requires: delete_category (owner only, not default)
```

### Wheel Contents — Nội dung vòng quay may mắn

> Upload ảnh qua `multipart/form-data`, field name: `image`

```
GET    /wheel-contents?categoryId=xxx&page=1&limit=10&activeOnly=true
       requires: view_wheel_content
       → Danh sách content phân trang

GET    /wheel-contents/wheel/:categoryId
       requires: view_wheel_content
       → Tất cả content active (dùng để render vòng quay, không phân trang)

GET    /wheel-contents/:id
       requires: view_wheel_content
       → Chi tiết 1 content

POST   /wheel-contents
       requires: create_wheel_content
       Content-Type: multipart/form-data
       Fields: label* (1-200), categoryId*, description, image (file), color (#hex), weight (1-100), isActive
       → Tạo lựa chọn mới (có thể kèm ảnh)

PUT    /wheel-contents/:id
       requires: edit_wheel_content (owner only)
       Content-Type: multipart/form-data
       → Cập nhật (gửi image file mới sẽ thay thế ảnh cũ)

DELETE /wheel-contents/:id
       requires: delete_wheel_content (owner only)
```

**Response mẫu (GET /wheel-contents/wheel/:categoryId):**
```json
{
  "success": true,
  "message": "Wheel contents for spinning",
  "data": [
    {
      "_id": "664a...",
      "label": "Ăn phở",
      "description": "Phở bò tái chín",
      "image": "/uploads/wheel-1717012345-123456789.png",
      "color": "#E74C3C",
      "weight": 1,
      "categoryId": "...",
      "isActive": true
    },
    {
      "_id": "664b...",
      "label": "Ăn bún",
      "image": "",
      "color": "#3498DB",
      "weight": 2
    }
  ]
}
```

> `weight` càng cao thì xác suất được chọn càng lớn. Frontend tính xác suất: `weight / tổng_weight`

---

### Spin History — Lịch sử quay & Streak

```
POST   /spin-history
       requires: create_spin
       Body: { "categoryId": "...", "selectedContentId": "..." }
       → Ghi nhận kết quả quay + tự động tính streak

GET    /spin-history?categoryId=xxx&page=1&limit=10
       requires: view_spin_history
       → Lịch sử quay của user (lọc theo category nếu có)

GET    /spin-history/streak?categoryId=xxx
       requires: view_spin_history
       → Thông tin streak (1 category hoặc tất cả)

GET    /spin-history/stats/:categoryId
       requires: view_spin_history
       → Thống kê mỗi content được chọn bao nhiêu lần
```

**POST /spin-history — Response:**
```json
{
  "success": true,
  "message": "Spin recorded",
  "data": {
    "history": {
      "_id": "...",
      "userId": "...",
      "categoryId": "...",
      "selectedContentId": "...",
      "selectedLabel": "Ăn phở",
      "currentStreak": 3,
      "maxStreak": 5,
      "lastSpinAt": "2026-05-04T10:30:00Z"
    },
    "streak": {
      "currentStreak": 3,
      "maxStreak": 5,
      "lastSpinDate": "2026-05-04",
      "totalSpins": 15
    }
  }
}
```

**Streak Logic:**
| Tình huống | Kết quả |
|-----------|---------|
| Quay lần đầu | `currentStreak = 1` |
| Quay ngày liên tiếp (hôm qua đã quay) | `currentStreak + 1` |
| Quay nhiều lần cùng ngày | Streak giữ nguyên, chỉ thêm history |
| Bỏ lỡ ≥ 1 ngày | `currentStreak` reset về 1, `maxStreak` giữ kỷ lục |

**GET /spin-history/streak — Response (tất cả categories):**
```json
{
  "data": [
    { "categoryId": { "name": "Ăn gì", "icon": "🍜" }, "currentStreak": 3, "maxStreak": 5, "totalSpins": 15 },
    { "categoryId": { "name": "Làm gì", "icon": "🎯" }, "currentStreak": 1, "maxStreak": 2, "totalSpins": 4 }
  ]
}
```

**GET /spin-history/stats/:categoryId — Response:**
```json
{
  "data": [
    { "_id": "content_id_1", "label": "Ăn phở", "count": 8 },
    { "_id": "content_id_2", "label": "Ăn bún", "count": 5 },
    { "_id": "content_id_3", "label": "Ăn cơm", "count": 2 }
  ]
}
```

---

### Luồng sử dụng (Flow)

```
1. POST /categories        → Tạo category ("Hôm nay ăn gì?")
2. POST /wheel-contents    → Tạo các lựa chọn: "Phở", "Bún", "Pizza" (kèm ảnh)
3. GET  /wheel-contents/wheel/:categoryId → Frontend nhận list → render vòng quay
4. [User quay] → Frontend tính kết quả theo weight
5. POST /spin-history      → Ghi nhận {categoryId, selectedContentId}
                           ← Trả về kết quả + streak info
6. GET  /spin-history      → Xem lịch sử
7. GET  /spin-history/streak → Xem streak hiện tại
8. GET  /spin-history/stats/:id → Xem thống kê
```

---

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
| admin | all permissions (bypass check) |
| editor | view_user, edit_user, view_dashboard |
| viewer | view_user, view_dashboard |

### Wheel & Spin Permissions

| Slug | Mô tả |
|------|--------|
| `view_wheel_content` | Xem nội dung vòng quay |
| `create_wheel_content` | Tạo lựa chọn mới |
| `edit_wheel_content` | Sửa lựa chọn (owner only) |
| `delete_wheel_content` | Xóa lựa chọn (owner only) |
| `create_spin` | Quay & ghi nhận kết quả |
| `view_spin_history` | Xem lịch sử & streak |

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
│   ├── auth/           (controller, service, route, validation)
│   ├── users/          (controller, service, model, route, validation)
│   ├── roles/          (controller, service, model, route)
│   ├── permissions/    (controller, service, model, route)
│   ├── categories/     (controller, service, model, route, validation)
│   ├── wheel-contents/ (controller, service, model, route, validation, upload middleware)
│   ├── spin-history/   (controller, service, model, route, validation)
│   └── dashboard/      (controller, service, route)
├── uploads/                        ← Ảnh wheel content được lưu tại đây
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

---

## Test cURL / Postman

> Thay `{{TOKEN}}` bằng JWT token lấy từ login.
> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWY3ZWY3MjY4ODI0MjJlYWU4OGEyNjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsiY3JlYXRlX3VzZXIiLCJlZGl0X3VzZXIiLCJkZWxldGVfdXNlciIsInZpZXdfdXNlciIsIm1hbmFnZV9yb2xlcyIsIm1hbmFnZV9wZXJtaXNzaW9ucyIsInZpZXdfZGFzaGJvYXJkIiwiY3JlYXRlX2NhdGVnb3J5IiwiZWRpdF9jYXRlZ29yeSIsImRlbGV0ZV9jYXRlZ29yeSIsInZpZXdfY2F0ZWdvcnkiLCJjcmVhdGVfd2hlZWxfY29udGVudCIsImVkaXRfd2hlZWxfY29udGVudCIsImRlbGV0ZV93aGVlbF9jb250ZW50Iiwidmlld193aGVlbF9jb250ZW50IiwiY3JlYXRlX3NwaW4iLCJ2aWV3X3NwaW5faGlzdG9yeSJdLCJpYXQiOjE3Nzc4NTY3MjgsImV4cCI6MTc3ODQ2MTUyOH0.q_ZvJtiyNtS3cXACtwa6q-dmABb6hlP_7uu7LTkDDmg
> Thay `{{BASE}}` = `http://localhost:3000`

### 1. Đăng nhập lấy token

```bash
curl -X POST {{BASE}}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

> Response trả về `data.token` — copy để dùng cho các request bên dưới.

---

### 2. Tạo Category

```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWY3ZWY3MjY4ODI0MjJlYWU4OGEyNjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsiY3JlYXRlX3VzZXIiLCJlZGl0X3VzZXIiLCJkZWxldGVfdXNlciIsInZpZXdfdXNlciIsIm1hbmFnZV9yb2xlcyIsIm1hbmFnZV9wZXJtaXNzaW9ucyIsInZpZXdfZGFzaGJvYXJkIiwiY3JlYXRlX2NhdGVnb3J5IiwiZWRpdF9jYXRlZ29yeSIsImRlbGV0ZV9jYXRlZ29yeSIsInZpZXdfY2F0ZWdvcnkiLCJjcmVhdGVfd2hlZWxfY29udGVudCIsImVkaXRfd2hlZWxfY29udGVudCIsImRlbGV0ZV93aGVlbF9jb250ZW50Iiwidmlld193aGVlbF9jb250ZW50IiwiY3JlYXRlX3NwaW4iLCJ2aWV3X3NwaW5faGlzdG9yeSJdLCJpYXQiOjE3Nzc4NTY3MjgsImV4cCI6MTc3ODQ2MTUyOH0.q_ZvJtiyNtS3cXACtwa6q-dmABb6hlP_7uu7LTkDDmg" \
  -d '{
    "name": "Hôm nay làm gì?",
    "icon": "🧪",
    "color": "#E74C3C",
    "description": "Random công việc hàng ngày",
    "isPublic": false
  }'
```

> Lưu lại `data._id` → dùng làm `CATEGORY_ID`

---

### 3. Tạo Wheel Content (không có ảnh)

```bash
curl -X POST http://localhost:3000/wheel-contents \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWY3ZWY3MjY4ODI0MjJlYWU4OGEyNjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsiY3JlYXRlX3VzZXIiLCJlZGl0X3VzZXIiLCJkZWxldGVfdXNlciIsInZpZXdfdXNlciIsIm1hbmFnZV9yb2xlcyIsIm1hbmFnZV9wZXJtaXNzaW9ucyIsInZpZXdfZGFzaGJvYXJkIiwiY3JlYXRlX2NhdGVnb3J5IiwiZWRpdF9jYXRlZ29yeSIsImRlbGV0ZV9jYXRlZ29yeSIsInZpZXdfY2F0ZWdvcnkiLCJjcmVhdGVfd2hlZWxfY29udGVudCIsImVkaXRfd2hlZWxfY29udGVudCIsImRlbGV0ZV93aGVlbF9jb250ZW50Iiwidmlld193aGVlbF9jb250ZW50IiwiY3JlYXRlX3NwaW4iLCJ2aWV3X3NwaW5faGlzdG9yeSJdLCJpYXQiOjE3Nzc4NTY3MjgsImV4cCI6MTc3ODQ2MTUyOH0.q_ZvJtiyNtS3cXACtwa6q-dmABb6hlP_7uu7LTkDDmg" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Viết dự án decision maker",
    "description": "Làm backend module spin-histories và wheel-contents",
    "categoryId": "69f7f0fccb493ff6b6819e6c",
    "color": "#E74C3C",
    "weight": 1
  }'
```

### 4. Tạo Wheel Content (có ảnh)

```bash
curl -X POST {{BASE}}/wheel-contents \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "label=Ăn bún chả" \
  -F "description=Bún chả Hàng Mành" \
  -F "categoryId={{CATEGORY_ID}}" \
  -F "color=#27AE60" \
  -F "weight=1" \
  -F "image=@/path/to/bun-cha.jpg"
```

> **Lưu ý:** Khi upload ảnh dùng `-F` (form-data), KHÔNG dùng `-H "Content-Type: application/json"`

### 5. Tạo thêm nhiều content

```bash
# Content 3
curl -X POST http://localhost:3000/wheel-contents \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"label": "Ăn pizza", "categoryId": "{{CATEGORY_ID}}", "color": "#F39C12", "weight": 1}'

# Content 4
curl -X POST {{BASE}}/wheel-contents \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"label": "Ăn cơm tấm", "categoryId": "{{CATEGORY_ID}}", "color": "#9B59B6", "weight": 3}'
```

---

### 6. Lấy tất cả content cho vòng quay

```bash
curl -X GET http://localhost:3000/wheel-contents/wheel/69f7f0fccb493ff6b6819e6c \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWY3ZWY3MjY4ODI0MjJlYWU4OGEyNjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsiY3JlYXRlX3VzZXIiLCJlZGl0X3VzZXIiLCJkZWxldGVfdXNlciIsInZpZXdfdXNlciIsIm1hbmFnZV9yb2xlcyIsIm1hbmFnZV9wZXJtaXNzaW9ucyIsInZpZXdfZGFzaGJvYXJkIiwiY3JlYXRlX2NhdGVnb3J5IiwiZWRpdF9jYXRlZ29yeSIsImRlbGV0ZV9jYXRlZ29yeSIsInZpZXdfY2F0ZWdvcnkiLCJjcmVhdGVfd2hlZWxfY29udGVudCIsImVkaXRfd2hlZWxfY29udGVudCIsImRlbGV0ZV93aGVlbF9jb250ZW50Iiwidmlld193aGVlbF9jb250ZW50IiwiY3JlYXRlX3NwaW4iLCJ2aWV3X3NwaW5faGlzdG9yeSJdLCJpYXQiOjE3Nzc4NTY3MjgsImV4cCI6MTc3ODQ2MTUyOH0.q_ZvJtiyNtS3cXACtwa6q-dmABb6hlP_7uu7LTkDDmg"
```

---

### 7. Lấy danh sách content (phân trang)

```bash
curl -X GET "{{BASE}}/wheel-contents?categoryId={{CATEGORY_ID}}&page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

### 8. Cập nhật content (đổi ảnh)

```bash
curl -X PUT {{BASE}}/wheel-contents/{{CONTENT_ID}} \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "label=Ăn phở bò" \
  -F "weight=3" \
  -F "image=@/path/to/pho-new.jpg"
```

---

### 9. Xóa content

```bash
curl -X DELETE {{BASE}}/wheel-contents/{{CONTENT_ID}} \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

### 10. Ghi nhận kết quả quay (Spin)

```bash
curl -X POST {{BASE}}/spin-history \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -d '{
    "categoryId": "{{CATEGORY_ID}}",
    "selectedContentId": "{{CONTENT_ID}}"
  }'
```

> Response trả về streak info: `currentStreak`, `maxStreak`, `totalSpins`

---

### 11. Xem lịch sử quay

```bash
# Tất cả
curl -X GET "{{BASE}}/spin-history?page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"

# Lọc theo category
curl -X GET "{{BASE}}/spin-history?categoryId={{CATEGORY_ID}}&page=1&limit=20" \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

### 12. Xem streak hiện tại

```bash
# Streak tất cả categories
curl -X GET {{BASE}}/spin-history/streak \
  -H "Authorization: Bearer {{TOKEN}}"

# Streak 1 category cụ thể
curl -X GET "{{BASE}}/spin-history/streak?categoryId={{CATEGORY_ID}}" \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

### 13. Xem thống kê content được chọn

```bash
curl -X GET {{BASE}}/spin-history/stats/{{CATEGORY_ID}} \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

### Postman — Setup nhanh

1. **Environment Variables:**
   | Variable | Value |
   |----------|-------|
   | `BASE` | `http://localhost:3000` |
   | `TOKEN` | *(auto-set từ login script)* |
   | `CATEGORY_ID` | *(copy từ response)* |
   | `CONTENT_ID` | *(copy từ response)* |

2. **Auto-set token** — Trong tab **Tests** của request Login, thêm:
   ```javascript
   const res = pm.response.json();
   if (res.success) {
     pm.environment.set("TOKEN", res.data.token);
   }
   ```

3. **Auto-set IDs** — Trong tab Tests của request Create Category:
   ```javascript
   const res = pm.response.json();
   if (res.success) {
     pm.environment.set("CATEGORY_ID", res.data._id);
   }
   ```

4. **Auto-set Content ID** — Trong tab Tests của request Create Wheel Content:
   ```javascript
   const res = pm.response.json();
   if (res.success) {
     pm.environment.set("CONTENT_ID", res.data._id);
   }
   ```

---

### Test Streak — Kịch bản mẫu

```bash
# Ngày 1: Quay lần đầu → currentStreak: 1
curl -X POST {{BASE}}/spin-history \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -d '{"categoryId": "{{CATEGORY_ID}}", "selectedContentId": "{{CONTENT_ID}}"}'

# Ngày 1: Quay thêm lần nữa → currentStreak vẫn: 1 (cùng ngày)
curl -X POST {{BASE}}/spin-history \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -d '{"categoryId": "{{CATEGORY_ID}}", "selectedContentId": "{{CONTENT_ID}}"}'

# Ngày 2: Quay tiếp → currentStreak: 2
# Ngày 3: Quay tiếp → currentStreak: 3
# Bỏ ngày 4, quay ngày 5 → currentStreak: 1, maxStreak vẫn giữ = 3
```
