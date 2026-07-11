---
name: ApiError shape for error handling
description: The custom fetch ApiError class shape — how to read the response body in onError handlers
---

`ErrorType<T>` is `ApiError<T>` from `lib/api-client-react/src/custom-fetch.ts`. The error response body is at `err.data` (typed `T | null`). The generated error message is `err.message`.

Correct pattern in onError handlers:
```ts
onError: (err) => toast({ description: (err.data as any)?.message || err.message })
```

**Wrong:** `err.error?.error` (property doesn't exist on ApiError)
