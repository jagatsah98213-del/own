---
name: Zod v3 email format codegen
description: Using format:email in openapi.yaml breaks codegen for zod v3
---

The installed zod version is **v3.25.76**. The OpenAPI codegen (orval) generates `z.email()` when it sees `format: email` in the spec. `z.email()` only exists in zod v4+. Strip `format: email` from the spec (use plain `type: string`) to avoid TypeScript errors.

**Why:** Discovered during initial codegen run — `pnpm -w run typecheck:libs` failed with "z.email is not a function".

**How to apply:** Before running codegen, grep for `format: email` in openapi.yaml and remove those lines.
