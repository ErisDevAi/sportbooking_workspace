# Maintenance Guide

Rules and conventions for maintaining this project.

---

## Component Reuse Rules

- **One component, one file.** Each component lives in `src/components/` with a descriptive PascalCase name.
- **Props interface first.** Define a `Props` interface at the top of each component file.
- **No business logic in components.** Components receive data via props or hooks. API calls and state mutations belong in stores or the API layer.
- **Shared components go in `src/components/`.** Page-specific components that aren't reused can live next to their page file.

---

## Styling Rules: Ant Design vs TailwindCSS

| Use Ant Design for              | Use TailwindCSS for               |
| ------------------------------- | --------------------------------- |
| Tables, Forms, Modals, Buttons  | Spacing (margin, padding)         |
| Dropdowns, Tags, Select         | Flexbox / Grid layout             |
| Notification, Message           | Responsive breakpoints            |
| Date pickers, Input fields      | Background colors, text styles    |
| Layout (Sider, Header, Content) | Hover/transition effects          |

### Rules

1. **Never override Ant Design styles with Tailwind utility classes on Ant Design components' internal elements.** Use Ant Design's `theme` config (`src/utils/theme.ts`) or `className` on wrapper divs.
2. **Use TailwindCSS for page layout** — container width, flex arrangement, grid, spacing between sections.
3. **Use Ant Design's `Row` / `Col`** for grid systems within content areas that need responsive column layouts.
4. **Tailwind's preflight is disabled** (`corePlugins.preflight: false` in `tailwind.config.ts`) to avoid style conflicts with Ant Design.

---

## Folder Conventions

| Folder         | What goes here                                | Naming              |
| -------------- | --------------------------------------------- | ------------------- |
| `src/app/`     | Route pages and layouts                       | `page.tsx`, `layout.tsx` |
| `src/components/` | Reusable UI components                     | `PascalCase.tsx`    |
| `src/layouts/` | Full-page layout shells                       | `PascalCase.tsx`    |
| `src/api/`     | Axios service modules (one per resource)      | `camelCase.ts`      |
| `src/store/`   | Zustand stores (one per domain)               | `camelCase.ts`      |
| `src/hooks/`   | Custom React hooks                            | `useCamelCase.ts`   |
| `src/types/`   | TypeScript interfaces and types               | `camelCase.ts`      |
| `src/utils/`   | Pure utility functions and configs            | `camelCase.ts`      |

---

## Adding a New Feature Checklist

1. Define the TypeScript type in `src/types/`
2. Create the API service in `src/api/`
3. Create or update the Zustand store in `src/store/` (if state is needed)
4. Build the page in `src/app/(protected)/feature-name/page.tsx`
5. Extract reusable parts into `src/components/`
6. Add the route to the sidebar menu in `src/layouts/DashboardLayout.tsx`

---

## State Management Rules

- **Use Zustand** for global state that persists across pages (auth, UI preferences).
- **Use React `useState`** for local component state (form values, modal open/close).
- **Don't put everything in Zustand.** If state is only used by one component, keep it local.
- **Store actions should call API functions**, not the other way around.
