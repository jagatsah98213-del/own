---
name: Admin key guard pattern
description: How admin login URL protection works in this project
---

Admin login is protected by a URL key: `/admin/login?key=VALUE`.

- **Frontend:** `VITE_ADMIN_KEY` env var; `AdminKeyGuard` component in `App.tsx` reads `window.location.search`, compares `?key=` against env var, and `<Redirect to="/">` if wrong/missing.
- **Backend:** `ADMIN_ACCESS_KEY` env var; `/api/auth/login` checks `req.query.key` against it for ADMIN-role users.
- Both env vars must match. Current value: `craftloop-admin-2026`.

**Why:** Hides admin login from automated scanners. Real security is bcrypt + session auth.
