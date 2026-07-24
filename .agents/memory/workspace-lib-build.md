---
name: Workspace lib declarations
description: How to build TypeScript declarations for the monorepo shared libraries before running typecheck
---

Run `npx tsc -b lib/db lib/api-zod lib/api-client-react` from workspace root before any typecheck.

**Why:** These libs use `composite: true` + `emitDeclarationOnly: true` with no build script. The api-server and craftloop typechecks use project references which require pre-built `.d.ts` files in `lib/*/dist/`. Without them, TS errors with TS6305.

**How to apply:** Always run this before typechecking. In CI, add as a pre-step.
