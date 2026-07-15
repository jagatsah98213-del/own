# Craftloop

A full-stack business management platform for a creative/service agency — handles projects, employees, client inquiries, recruitment, and payments. It has three portals: **Admin** (full control), **Employee** (payouts, assigned projects), and **Public** (home, about, careers, inquiry booking).

## Run & Operate

- `PORT=8080 pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `PORT=22477 BASE_PATH=/ pnpm --filter @workspace/craftloop run dev` — run the frontend (port 22477)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` (Replit-managed, auto-injected), `SESSION_SECRET` (Replit secret)

> **Important:** Both `PORT` and `BASE_PATH` must be set when starting services manually — the managed workflows inject them automatically, but the dev scripts require them.

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- API: Express 5 (`artifacts/api-server`)
- Frontend: React 19 + Vite 7 + Wouter + Tailwind CSS 4 (`artifacts/craftloop`)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Validation: Zod (v4), drizzle-zod
- API contract: OpenAPI spec → Orval codegen → TanStack Query hooks + Zod schemas
- Auth: session-based (`express-session` + `connect-pg-simple`), bcryptjs passwords

## Where things live

```
artifacts/
  api-server/      Express 5 API — routes at src/routes/{auth,admin,employee,public,health}.ts
  craftloop/       React frontend — pages at src/pages/{admin,employee,public}/
  mockup-sandbox/  Isolated UI component sandbox (canvas/design work)
lib/
  db/              Drizzle schema (src/schema/) + pool connection
  api-spec/        openapi.yaml — source of truth for all API contracts
  api-zod/         Generated Zod schemas (from codegen — do not edit)
  api-client-react/ Generated TanStack Query hooks (from codegen — do not edit)
scripts/           post-merge.sh and other workspace utilities
```

## Architecture decisions

- **OpenAPI-first:** `lib/api-spec/openapi.yaml` is the single source of truth. Zod schemas and React Query hooks are generated from it — never edit generated files in `api-zod/` or `api-client-react/`.
- **Session auth over JWT:** Sessions stored in PostgreSQL via `connect-pg-simple`. The `sessions` table must exist before the API starts (managed by `drizzle-kit push`).
- **esbuild CJS bundle for prod:** `artifacts/api-server/build.mjs` bundles to `dist/index.mjs` for fast cold starts in production.
- **Path-based routing:** Craftloop is served at `/`, API at `/api`. The Replit application router handles the split.

## Product

- **Admin portal** (`/admin`): manage projects, employees, client inquiries, interview bookings, payments, services, portfolio, testimonials, and slots.
- **Employee portal** (`/employee`): view assigned projects and payout history.
- **Public portal** (`/`): marketing site with home, about, careers pages plus meeting/inquiry booking.

## Seed data

Default admin credentials (seeded via `artifacts/api-server/src/scripts/seed.ts`):
- Email: `admin@craftloop.app`
- Password: `Craftloop!Admin1` — **change after first login**

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Running dev without `PORT` set crashes immediately (enforced in `src/index.ts`).
- Running craftloop dev without `BASE_PATH` set crashes at Vite config load time.
- The `sessions` table is required at API startup — always run `pnpm --filter @workspace/db run push` before first launch.
- `lib/api-zod` and `lib/api-client-react` are fully generated — run codegen after any `openapi.yaml` change.
- `drizzle-kit push` prompts interactively on column conflicts; drop conflicting tables via SQL first if needed.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
