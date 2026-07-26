# Trivinex Partners — Agency Platform

A full-stack digital services agency platform. Clients browse services, submit inquiries, book meetings and interviews, and view the portfolio. Admins manage everything through a password-protected portal.

## Architecture

| Layer | Package | Tech |
|---|---|---|
| Frontend | `@workspace/craftloop` (`artifacts/craftloop/`) | React 19, Vite, Tailwind, shadcn/ui, Framer Motion |
| API Server | `@workspace/api-server` (`artifacts/api-server/`) | Express 5, Zod, pino |
| Database | `@workspace/db` (`lib/db/`) | Drizzle ORM → Neon PostgreSQL |
| API types/hooks | `@workspace/api-zod`, `@workspace/api-client-react` | Generated from `lib/api-spec/openapi.yaml` |

## Running the App

Both workflows start automatically:
- **Frontend**: `artifacts/craftloop: web` → http://localhost:5173
- **API Server**: `artifacts/api-server: API Server` → http://localhost:8080

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL pooled connection string |
| `SESSION_SECRET` | Express session signing key |
| `ADMIN_ACCESS_KEY` | Required in admin login URL as `?key=VALUE` |
| `VITE_ADMIN_KEY` | Same value as `ADMIN_ACCESS_KEY`, exposed to frontend |
| `SMTP_HOST/PORT/USER/PASS/FROM` | Optional — email sending via nodemailer |
| `ADMIN_EMAIL` | Destination for contact form submissions |

## Admin Access

- URL: `/admin/login?key=<ADMIN_ACCESS_KEY>`
- Default credentials: `admin@trivinexpartners.com` / `Trivinex!Admin1`
- **Change the password after first login.**

## Database

```bash
# Push schema changes
pnpm --filter @workspace/db run push

# Seed initial data (services, testimonials, portfolio, admin user)
pnpm --filter @workspace/api-server exec tsx src/scripts/seed.ts
```

## Key Features

### Public Site
- **Home** — hero, services overview, stats, testimonials, CTA
- **Services** — service cards with sub-plans and pricing
- **Portfolio** — filterable project gallery
- **Quote / Contact** — inquiry form that emails the admin
- **Careers** — job listings and application form
- **Interview booking** — slot-based scheduling for applicants

### Admin Portal (`/admin`)
- Dashboard with stats (inquiries, projects, employees)
- Full CRUD for: Services, Service Plans, Portfolio, Testimonials, Employees
- Manage client inquiries → convert to projects → track status
- Manage employee assignments and payouts
- Meeting and interview slot management
- Audit log viewer
- Site content / settings editor (editable stats, contact info, etc.)

## API Spec

`lib/api-spec/openapi.yaml` is the source of truth. Do **not** edit generated files in `lib/api-zod/` or `lib/api-client-react/` directly. To regenerate:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## User Preferences

- Branding: "Trivinex Partners" (not "Craftloop")
- Admin email: `admin@trivinexpartners.com`
- SMTP to be configured later
