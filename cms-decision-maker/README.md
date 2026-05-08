# Next.js Admin Dashboard

A scalable frontend starter template built with **Next.js App Router**, **TypeScript**, **Ant Design**, **TailwindCSS**, **Zustand**, and **Axios**. Designed for CMS admin panels and SaaS dashboards.

---

## Tech Stack

| Technology  | Purpose                          |
| ----------- | -------------------------------- |
| Next.js 14  | Framework (App Router)           |
| TypeScript  | Type safety                      |
| Ant Design  | UI components (Table, Form, etc) |
| TailwindCSS | Layout, spacing, responsive      |
| Zustand     | State management                 |
| Axios       | HTTP client with interceptors    |

---

## Setup Instructions

### Prerequisites

- Node.js >= 18
- npm or yarn

### Install

```bash
cd project-118-nextjs-antd-tailwind
npm install
```

### Environment Variables

Copy the example env file:

```bash
cp .env.example .env.local
```

| Variable                  | Description           | Default                        |
| ------------------------- | --------------------- | ------------------------------ |
| NEXT_PUBLIC_API_BASE_URL  | Backend API base URL  | http://localhost:8000/api      |

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Login with any email/password (mock auth).

### Build for Production

```bash
npm run build
npm start
```

---

## How to Use This Template

### Create a New Page

1. Create a folder under `src/app/(protected)/your-page/`
2. Add `page.tsx`:

```tsx
export default function YourPage() {
  return <div><h2>Your Page</h2></div>;
}
```

3. Add a menu item in `src/layouts/DashboardLayout.tsx`:

```tsx
{ key: '/your-page', icon: <AppstoreOutlined />, label: 'Your Page' },
```

### Create a New API Service

1. Add a file in `src/api/`:

```tsx
// src/api/products.ts
import apiClient from './client';
import type { Product } from '@/types/product';

export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/products'),
  create: (data: Omit<Product, 'id'>) => apiClient.post<Product>('/products', data),
};
```

2. Add the type in `src/types/product.ts`.

### Create a New Component

1. Add a file in `src/components/`:

```tsx
// src/components/ProductCard.tsx
interface ProductCardProps {
  name: string;
  price: number;
}

export default function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
}
```

### Connect to a Real Backend

1. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
2. Replace the mock login in `src/store/auth.ts` with a real API call:

```tsx
login: async (email, password) => {
  const res = await authApi.login({ email, password });
  set({ token: res.data.token, user: res.data.user });
},
```

3. The Axios interceptor (`src/api/client.ts`) automatically attaches the token and handles 401 responses.

---

## Project Structure Guide

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Ant Design provider, global CSS)
│   ├── page.tsx            # Root redirect (→ dashboard or login)
│   ├── login/              # Public login page
│   │   └── page.tsx
│   └── (protected)/        # Route group — all pages require auth
│       ├── layout.tsx      # Auth guard + dashboard layout wrapper
│       ├── dashboard/
│       │   └── page.tsx    # Stats cards & charts
│       └── users/
│           └── page.tsx    # User CRUD with table & modal
│
├── layouts/                # Page layout shells
│   └── DashboardLayout.tsx # Sidebar + header + content area
│
├── components/             # Reusable UI components
│   ├── StatsCard.tsx       # Metric display card
│   └── SimpleChart.tsx     # Bar chart (pure CSS, no library)
│
├── api/                    # Axios service layer
│   ├── client.ts           # Axios instance with interceptors
│   ├── auth.ts             # Auth endpoints
│   └── users.ts            # User CRUD endpoints
│
├── store/                  # Zustand state stores
│   ├── auth.ts             # Auth state (token, user, login/logout)
│   └── ui.ts               # UI state (sidebar collapsed)
│
├── hooks/                  # Custom React hooks
│   └── useAuth.ts          # Auth convenience hook
│
├── types/                  # TypeScript type definitions
│   └── user.ts             # User interface
│
└── utils/                  # Shared utilities
    └── theme.ts            # Ant Design theme config
```

### Data Flow

```
Backend API  →  Axios (src/api/)  →  Zustand Store (src/store/)  →  React Components (src/app/, src/components/)
```

1. **API layer** (`src/api/`) makes HTTP requests via the configured Axios client
2. **Store** (`src/store/`) holds application state, calls API functions, and exposes actions
3. **Components** subscribe to store state via hooks and render the UI
4. **Layouts** (`src/layouts/`) provide page structure (sidebar, header, content area)
5. **Route protection** is handled by the `(protected)` route group layout

---

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm start`    | Start production server  |
| `npm run lint` | Run ESLint               |
