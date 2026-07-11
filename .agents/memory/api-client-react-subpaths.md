---
name: api-client-react subpath exports
description: Deep imports from @workspace/api-client-react require explicit package.json exports entries
---

The design subagent imports enum types via `"@workspace/api-client-react/api.schemas"`. This subpath must be declared in `lib/api-client-react/package.json` exports:

```json
"exports": {
  ".": "./src/index.ts",
  "./api.schemas": "./src/generated/api.schemas.ts"
}
```

Without it, Vite throws `Missing "./api.schemas" specifier` at build time.

**Why:** Discovered when restarting the craftloop workflow after design subagent work landed.
