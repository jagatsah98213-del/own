---
name: Site Settings Feature
description: site_settings table, admin CRUD, public API, email automation — how it all connects
---

## site_settings Table
- Key-value table in `lib/db/src/schema/siteSettings.ts`
- Keys seeded: `stat_1_value/label` through `stat_4_value/label`, `contact_phone`, `contact_email`, `contact_whatsapp`, `hero_revenue`

## APIs
- `GET /public/site-settings` → returns all settings as `Record<string, string>` (no auth)
- `GET /admin/site-settings` → returns full `SiteSetting[]` with labels (ADMIN)
- `PATCH /admin/site-settings/:key` → upserts a setting by key (ADMIN)

## Email (nodemailer)
- Module: `artifacts/api-server/src/lib/email.ts`
- `sendEmail(to, subject, html)` — gracefully no-ops if SMTP env vars missing
- Required env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (optional)
- Templates: `clientInquiryConfirmationEmail(name, serviceNeeded)`, `freelancerApplicationConfirmationEmail(fullName, serviceCategory)`
- Wired into: `POST /public/inquiries` and `POST /public/applicants` (non-blocking `.catch(() => {})`)

## Why:
- Stats are fetched via `useQuery(["public-site-settings"])` in Home.tsx and PublicLayout.tsx — same query key, shared cache
- Admin edits invalidate both `["admin-site-settings"]` and `["public-site-settings"]` so homepage updates immediately

## Admin UI (SiteContent.tsx)
- `SiteStatsPanel` — edits stat_1–4 value/label + hero_revenue; each field has its own Save button
- `ContactInfoPanel` — edits contact_email, contact_phone, contact_whatsapp with per-field Save
- `SmtpInfoPanel` — read-only reference showing which env vars to set for email

## Footer (PublicLayout.tsx)
- Contact column shows email (mailto:), phone (tel:), WhatsApp (wa.me/) — all clickable
- If all three are empty, shows a fallback "Book a free consultation →" link
