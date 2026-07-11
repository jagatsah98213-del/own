---
name: DB push non-interactive fix
description: drizzle-kit push prompts for column rename confirmation in non-TTY shells
---

`drizzle-kit push` and `drizzle-kit push --force` both fail with "Interactive prompts require a TTY terminal" when column shapes changed since last push (it detects rename ambiguity). The fix: drop all affected tables via raw SQL first (`DROP TABLE IF EXISTS ... CASCADE`), then run push — clean tables have no rename ambiguity so no prompt is triggered.

**Why:** Discovered when rewriting schema to match OpenAPI spec after an initial push with wrong field names.

**How to apply:** Use `executeSql({ sqlQuery: "DROP TABLE IF EXISTS t1, t2, ... CASCADE;" })` via CodeExecution, then `pnpm --filter @workspace/db run push`.
