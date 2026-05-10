# Launch Checklist

Pre-launch preparation guide for production deployment.

---

## UI Consistency Checklist

- [ ] All pages use the same layout structure (sidebar + header + content)
- [ ] Buttons follow a consistent style: primary for main actions, default for secondary
- [ ] Color usage matches the theme config (`src/utils/theme.ts`)
- [ ] Typography is consistent — headings use the same sizes across pages
- [ ] Tables have consistent column widths, alignment, and pagination
- [ ] Modals use the same pattern: title, form, OK/Cancel buttons
- [ ] Loading states are shown during async operations
- [ ] Empty states are handled (empty tables, no data cards)
- [ ] Error messages use Ant Design `message` or `notification` consistently
- [ ] Icons come from `@ant-design/icons` — no mixing icon libraries

---

## Responsive Checklist

- [ ] Dashboard stats cards stack properly on mobile (xs: 24, sm: 12, lg: 6)
- [ ] Sidebar collapses on smaller screens
- [ ] Tables are scrollable horizontally on mobile (`scroll={{ x: true }}`)
- [ ] Login form is centered and readable on all screen sizes
- [ ] Modals don't overflow on small screens
- [ ] Font sizes remain readable at all breakpoints
- [ ] Touch targets are at least 44x44px on mobile

---

## Performance Optimization

- [ ] Replace mock auth with real API calls
- [ ] Add loading skeletons for data-heavy pages
- [ ] Lazy load heavy components with `next/dynamic`
- [ ] Optimize images with `next/image`
- [ ] Implement pagination on all list pages (server-side if dataset is large)
- [ ] Use `React.memo` on expensive list items if needed
- [ ] Check bundle size with `npm run build` — keep First Load JS under 200KB per route

---

## Build Optimization

- [ ] Run `npm run build` and verify no errors
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Run linter: `npm run lint`
- [ ] Verify environment variables are set in production
- [ ] Configure CORS on the backend for the production domain
- [ ] Set up proper `Content-Security-Policy` headers
- [ ] Enable gzip/brotli compression on the server
- [ ] Configure caching headers for static assets

---

## Security Checklist

- [ ] Tokens stored in localStorage are cleared on logout
- [ ] API interceptor handles 401 and redirects to login
- [ ] No sensitive data in client-side code or environment variables without `NEXT_PUBLIC_` prefix
- [ ] Form inputs are validated on both client and server
- [ ] XSS prevention: no `dangerouslySetInnerHTML` without sanitization

---

## Deployment Options

| Platform      | Command                    | Notes                        |
| ------------- | -------------------------- | ---------------------------- |
| Vercel        | `vercel deploy`            | Zero-config for Next.js      |
| Docker        | Build with Dockerfile      | Add a multi-stage Dockerfile |
| Node server   | `npm run build && npm start` | Runs on port 3000          |
| Static export | `next build` with `output: 'export'` | No SSR features    |
