---
name: Service Sub-Plans feature
description: Implementation details for the Service Plans feature added to Craftloop
---

## What was built
Full Service Sub-Plans feature across DB, API, and frontend.

## DB schema
- Added `planBadgeEnum` (NONE/HOT/NEW/POPULAR/BEST_VALUE) and `pricingTypeEnum` (ONE_TIME/MONTHLY) to `lib/db/src/schema/enums.ts`
- New `service_plans` table in `lib/db/src/schema/servicePlans.ts` — FK to `services.id` (cascade delete)
- Added optional `servicePlanId` (integer, nullable) to `client_inquiries` table
- `lib/db/src/schema/index.ts` exports `servicePlans` after `services`

## API
- `GET /public/services` now returns nested `plans[]` per service (two-query approach: services then plans, then map)
- `GET /public/services/:slug/plans` — returns active plans for a service
- `POST /public/inquiries` — accepts optional `servicePlanId`
- `GET /admin/services` — returns nested `plans[]` per service (same approach)
- `GET /admin/service-plans?serviceId=X` — list plans for a service (admin)
- `POST /admin/service-plans` — create plan
- `PATCH /admin/service-plans/:id` — update plan
- `DELETE /admin/service-plans/:id` — delete plan

## OpenAPI / codegen
- Added `PlanBadge`, `PricingType`, `ServicePlan`, `ServicePlanInput`, `ServicePlanUpdate` schemas
- Added `plans?: ServicePlan[]` to `Service` schema (optional, so existing parse calls work)
- Added `servicePlanId?: integer | null` to `ClientInquiry` (not required in schema)
- Added `servicePlanId?: integer` to `ClientInquiryInput`

**Why:** Making `plans` optional in Service schema means existing routes that don't join plans still pass Zod `.parse()`. The admin and public services routes were both updated to include plans.

## Seed data
22 plans seeded across 6 services (4 per service). Seed script guards with `existingPlans.length === 0` check.
Run: `cd artifacts/api-server && npx tsx src/scripts/seed.ts`

## Frontend
- `Services.tsx` — expandable service cards with "View N Plans" toggle; badge chips per plan
- `Quote.tsx` — plan select appears after service is chosen, derives plans from `useListPublicServices()` data; resets on service change; URL param `?plan=ID` pre-selects a plan
- `Inquiries.tsx` — calls `useListAdminServices()` to build a planId→name map, shows selected plan name in the detail dialog
- `SiteContent.tsx` — "Service Plans" section with per-service collapsible `ServicePlansPanel` component; full CRUD (add/edit/delete plan dialog)

## Key pattern for plan lookup in frontend
```typescript
const { data: services } = useListAdminServices();
const planMap = new Map<number, string>(
  services?.flatMap(s => s.plans?.map(p => [p.id, p.name] as [number, string]) ?? []) ?? []
);
```
