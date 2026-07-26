---
name: SEO + Privacy + Review Schema feature
description: What was built for Trivinex Partners SEO, privacy policy, and Google review schema
---

## What was built

- `artifacts/craftloop/src/components/SEOHead.tsx` — dynamic per-page SEO: updates `<title>`, meta description, OG tags, canonical link, and injects/cleans up JSON-LD `<script>` tags on route change.
- `artifacts/craftloop/public/robots.txt` — blocks /admin, references sitemap.
- `artifacts/craftloop/public/sitemap.xml` — all public routes listed with priority/changefreq.
- `artifacts/craftloop/index.html` — global Organization + WebSite JSON-LD schemas injected as static `<script type="application/ld+json">`.
- `artifacts/craftloop/src/pages/public/About.tsx` — complete rewrite: 8 sections (hero, story, 5 services, who we serve, stats, differentiators, our people + payment methods, global reach, CTA).
- `artifacts/craftloop/src/pages/public/PrivacyPolicy.tsx` — new page at `/privacy-policy`, 12 sections covering GDPR rights.
- `artifacts/craftloop/src/pages/public/Testimonials.tsx` — injected `Review` + `AggregateRating` JSON-LD from live API data + dual microdata (`itemScope`/`itemProp`).
- `artifacts/api-server/src/app.ts` — enhanced helmet config: HSTS (prod only), Permissions-Policy, X-Permitted-Cross-Domain-Policies, Referrer-Policy.

**Why:** `isProd` variable used in helmet must come before the helmet call — it was already defined at the top of app.ts, so no ordering issue.

## Review schema pattern
Testimonials page uses `useEffect` to build and inject a `ProfessionalService` JSON-LD with `aggregateRating` + `review[]` after the API data loads, and cleans up on unmount. Also adds HTML microdata (`itemScope`/`itemType`/`itemProp`) to each card for belt-and-suspenders coverage.

## SEOHead cleanup note
`SEOHead` restores `document.title` on unmount and removes injected `<script id="seo-jsonld-N">` tags. The global Organization + WebSite schemas in `index.html` are NOT managed by SEOHead — they are always present.
