---
name: OpenAPI spec frozen after codegen
description: Treat the openapi.yaml as frozen once design subagent and codegen have run
---

Once `pnpm --filter @workspace/api-spec run codegen` has run and a design subagent is building against the generated hooks/types, the spec is frozen. Any mismatch between DB schema and spec must be resolved by reshaping the Drizzle schema to match the spec — not by editing openapi.yaml (which would invalidate generated hooks the frontend already uses).

**Why:** Editing the spec post-codegen breaks the generated `lib/api-zod` and `lib/api-client-react` packages, requiring a full re-codegen and design re-sync.

**How to apply:** Read the generated `lib/api-zod/src/generated/api.ts` end-to-end to extract field names/types as the authoritative contract, then write DB schema to match.
