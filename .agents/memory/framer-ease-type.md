---
name: Framer-motion ease type
description: TypeScript strict mode requires cubic bezier arrays to be typed as tuples
---

Framer-motion `transition.ease` rejects plain `number[]` in strict TS.

**Fix:** Cast as `[number, number, number, number]` or annotate the object `as const satisfies Parameters<typeof motion.p>[0]`.

**Why:** `Easing` type expects named strings or `EasingFunction`, not `number[]`. The 4-tuple satisfies the cubic bezier overload.
