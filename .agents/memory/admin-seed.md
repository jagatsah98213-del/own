---
name: Admin seed credentials and script
description: How the initial admin user is created and what the default credentials are
---

Default admin credentials seeded by `artifacts/api-server/src/scripts/seed.ts`:
- Email: `admin@craftloop.app`
- Password: `Craftloop!Admin1`
- Role: ADMIN, mustChangePassword not set

Run seed: `cd artifacts/api-server && pnpm exec tsx src/scripts/seed.ts`

The seed script is idempotent — it checks for existing rows before inserting. It also seeds 6 services and 3 testimonials.

**Important:** Change the admin password after first login. No transactional email is wired (v1 scope trim), so credential delivery is manual (out-of-band).
