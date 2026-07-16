---
name: Router middleware scope bug
description: express-session role middleware with no path prefix intercepts ALL requests through the sub-router, blocking cross-role requests
---

## The Rule
Always scope `requireRole` middleware to its own path prefix inside each sub-router:
```ts
router.use("/employee", requireRole("EMPLOYEE")); // NOT router.use(requireRole("EMPLOYEE"))
router.use("/admin",    requireRole("ADMIN"));    // NOT router.use(requireRole("ADMIN"))
```

**Why:** In Express, `router.use(middleware)` with NO path runs for every request that enters the router — even requests that don't match any route inside it. The main router does `mainRouter.use(employeeRouter)` which passes ALL requests through employeeRouter first. If employeeRouter has `router.use(requireRole("EMPLOYEE"))`, it will return 403 for any admin request before the admin router ever sees it.

**How to apply:** Any time a new role-gated sub-router is added, use `router.use("/<prefix>", requireRole(...))` to limit the middleware to matching paths only. The path must match the prefix of all routes in that router (e.g. all employee routes start with `/employee/`, all admin routes with `/admin/`).
