---
name: api-design-principles
description: >-
  Use this skill when designing, implementing, and securing RESTful APIs, Route Handlers, external webhooks,
  and third-party integrations. Covers schema validation with Zod, unified error handling responses,
  HTTP status semantics, idempotent mutations, rate limiting, and safe environment variable handling.
---

# API Design Principles & Integration Standards

This skill provides comprehensive guidelines for architecting clean, secure, and resilient APIs that ensure dependable integrations and flawless hackathon live demonstrations.

---

## 1. Unified Response Envelope Standard

All API endpoints must return a predictable JSON payload envelope. Frontend consumers should never guess whether an error is returned as `{ message: "..." }` or `{ error: "..." }`.

### Success Response Envelope
```json
{
  "success": true,
  "data": {
    "id": "proj_12345",
    "title": "Hackathon Demo Engine",
    "status": "active"
  },
  "meta": {
    "timestamp": "2026-10-13T18:50:00.000Z",
    "version": "v1"
  }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload provided.",
    "details": [
      { "field": "email", "issue": "Must be a valid email address" }
    ]
  },
  "meta": {
    "timestamp": "2026-10-13T18:50:00.000Z"
  }
}
```

---

## 2. Standard HTTP Status Code Semantics

| HTTP Code | Name | Usage in App |
| :--- | :--- | :--- |
| **200 OK** | Success | Standard successful read or synchronous update. |
| **201 Created** | Created | Resource successfully created (POST). Include location or ID. |
| **204 No Content** | Deleted / Ack | Successful action with no return payload (e.g. DELETE). |
| **400 Bad Request** | Malformed | Request syntax error, unparseable JSON. |
| **401 Unauthorized**| Unauthenticated | Missing or invalid auth credentials/token. |
| **403 Forbidden** | Unauthorized | Authenticated, but lacks required permissions. |
| **404 Not Found** | Missing | Requested resource does not exist. |
| **409 Conflict** | State Conflict | Duplicate unique key, concurrent edit conflict. |
| **422 Unprocessable**| Validation Fail | Syntactically valid JSON, but violates schema constraints. |
| **429 Too Many Req**| Rate Limit | Rate limit threshold exceeded. Include `Retry-After`. |
| **500 Server Error**| Internal Fault | Unhandled exception. Log stack trace internally, return sanitized message to client. |

---

## 3. Schema Validation with Zod

Never consume `req.json()` or query params without schema validation:

```typescript
// lib/validators/user.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  role: z.enum(['user', 'admin']).default('user'),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

In Route Handler:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { CreateUserSchema } from '@/lib/validators/user';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
        { status: 400 }
      );
    }

    const parseResult = CreateUserSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Input validation failed',
            details: parseResult.error.errors.map(e => ({
              field: e.path.join('.'),
              issue: e.message,
            })),
          },
        },
        { status: 422 }
      );
    }

    const validData = parseResult.data;
    // Process business logic...
    return NextResponse.json({ success: true, data: validData }, { status: 201 });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
```

---

## 4. Third-Party Integration Resiliency (Hackathon Demo Safety)

External APIs (LLMs, payment gateways, weather APIs) can experience network latency or rate limits during live hackathon judging. Always implement fallback patterns:

### Safe Fetch Wrapper with Timeout & Fallback Mock
```typescript
// lib/api-client.ts
export async function resilientFetch<T>(
  url: string,
  options: RequestInit = {},
  fallbackData: T,
  timeoutMs: number = 5000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`Upstream API failed with status ${res.status}. Using fallback data.`);
      return fallbackData;
    }

    const data = await res.json();
    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`Upstream API request failed (${err.name}). Using fallback mock data to preserve demo integrity.`);
    return fallbackData;
  }
}
```

---

## 5. API Security & Environment Variables

1. **Strict Variable Validation**: Never access `process.env.MY_SECRET` directly in component logic. Centralize in `lib/env.ts` with Zod parsing.
2. **Never Expose Private Keys**: Keep third-party API keys (OpenAI, Stripe secret key, DB passwords) strictly on server-side route handlers or Server Actions.
3. **CORS Headers**: Set explicit `Access-Control-Allow-Origin` if exposing endpoints to external clients; use standard internal Next.js routing when serving the frontend.
