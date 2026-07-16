---
name: Public site design system
description: Apple-premium design language for the public-facing Trivinex Partners site — colors, layout structure, animation stack
---

## Design Language
Apple-premium dark hero + white content sections. NOT using Tailwind CSS variables (those apply to admin/employee portals too). Hardcoded Apple color palette directly in JSX.

**Key colors:**
- Hero bg: `#06060A` (near-black)
- Body bg: `#FFFFFF` (white) / `#F5F5F7` (Apple gray)
- Dark section bg: `#1D1D1F` (Apple near-black)
- Body text: `#1D1D1F`
- Muted text: `#6E6E73`
- Border: `#E8E8ED` / `#D2D2D7`
- Accent: Blue `#0066FF` (use `text-blue-600` Tailwind)
- Hero gradient text: `linear-gradient(135deg, #60A5FA, #A78BFA, #F472B6)`

**Animation stack:** framer-motion — `motion.div` with `initial/whileInView` for scroll reveals, `useMotionValue/useSpring/useTransform` for mouse-tracked 3D tilt.

**Why:** Hardcoded values prevent the public redesign from leaking into admin/employee portal styles which use the CSS variable system.

**How to apply:** For any new public page, use the same dark hero + white sections pattern. Import framer-motion directly. Never change CSS custom properties for public-only design changes.

## Page Structure Pattern
1. Dark hero (full-viewport, `#06060A`, gradient text, framer-motion fade-in)
2. Light transition strip or marquee
3. White content section (`#FFFFFF`)
4. Apple-gray alternating section (`#F5F5F7`)
5. Dark stats section (`#1D1D1F`)
6. Dark CTA section (`#06060A`)

## 3D Elements
Hero has a floating dashboard mockup card: `useMotionValue` + `useSpring` + `useTransform` for mouse tracking rotateX/Y. Cards get CSS `perspective(1000px)` + `rotateX/Y` on hover via a reusable `useTilt()` hook.
