---
name: nextjs-app-router-patterns
description: >-
  Use this skill when architecting, structuring, or optimizing Next.js applications using the App Router.
  Covers React Server Components (RSC) vs Client Components boundaries, Route Handlers, Server Actions,
  streaming with Suspense, dynamic routing, metadata for SEO/social cards, and bundle size optimization.
---

# Next.js App Router Architecture & Patterns

This skill provides best practices, architectural templates, and performance patterns for building production-grade full-stack applications with the Next.js App Router.

---

## 1. Directory Structure Standards

```text
src/ (or root /)
├── app/
│   ├── (marketing)/          # Route group for landing & public pages
│   │   ├── page.tsx          # Landing page (Server Component)
│   │   └── layout.tsx
│   ├── (dashboard)/          # Route group for authenticated workspace
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx   # Granular skeleton fallback
│   │   │   └── error.tsx     # Graceful error boundary ('use client')
│   │   └── layout.tsx
│   ├── api/                  # Backend Route Handlers
│   │   ├── health/
│   │   │   └── route.ts      # Cloud readiness probe
│   │   └── [resource]/
│   │       └── route.ts
│   ├── layout.tsx            # Root layout with global providers & fonts
│   ├── not-found.tsx         # Custom 404 page
│   └── globals.css           # Global design system tokens
├── components/
│   ├── ui/                   # Reusable primitive UI components (buttons, cards, dialogs)
│   └── features/             # Domain-specific components
├── lib/
│   ├── db.ts                 # Database client singleton (e.g. Prisma/Drizzle/pg)
│   ├── env.ts                # Validated environment variables (Zod)
│   └── utils.ts              # Class merging (cn) and formatting helpers
├── actions/                  # Server Actions for mutations
└── types/                    # TypeScript interfaces and shared schemas
```

---

## 2. Server vs. Client Component Rules

To keep the client bundle minimal and optimize time-to-interactive (TTI):

| Task / Responsibility | Component Type | Directive |
| :--- | :--- | :--- |
| Database access, API calls with private secrets | Server Component | Default (No directive) |
| Static markup, SEO metadata, layout structure | Server Component | Default (No directive) |
| Streaming heavy content with `<Suspense>` | Server Component | Default (No directive) |
| `useState`, `useEffect`, `useReducer` | Client Component | `'use client'` at top of file |
| DOM Event listeners (`onClick`, `onChange`, `onSubmit`) | Client Component | `'use client'` |
| Browser-only APIs (`window`, `localStorage`, `navigator`) | Client Component | `'use client'` |

> **Rule of Thumb**: Push `'use client'` down to the leaves of the component tree. Keep parents as Server Components that fetch data and pass plain serialized props down to interactive client widgets.

---

## 3. Safe Server Actions Pattern

Never trust client input. Always validate with a schema (e.g., Zod) inside Server Actions:

```typescript
// actions/items.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const CreateItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
});

export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createItemAction(formData: FormData): Promise<ActionResponse<any>> {
  try {
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
    };

    const parsed = CreateItemSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    // Perform database insertion or backend integration
    // const result = await db.item.create({ data: parsed.data });

    revalidatePath('/dashboard');
    return { success: true, data: parsed.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'An unexpected error occurred',
    };
  }
}
```

---

## 4. Route Handler Standard (`app/api/.../route.ts`)

```typescript
// app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent static evaluation if dynamic data needed

export async function GET(request: NextRequest) {
  try {
    // Process query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const items = [
      { id: '1', title: 'Sample Item 1', createdAt: new Date().toISOString() },
    ];

    return NextResponse.json({
      success: true,
      data: items.slice(0, limit),
      meta: { total: items.length },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}
```

---

## 5. Streaming & Suspense Boundaries

Wrap slow async data components in `<Suspense>` so the page shells render immediately:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import AnalyticsSummary from '@/components/features/AnalyticsSummary';
import CardSkeleton from '@/components/ui/CardSkeleton';

export default function DashboardPage() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Project Command Center</h1>
      <Suspense fallback={<CardSkeleton />}>
        <AnalyticsSummary />
      </Suspense>
    </main>
  );
}
```

---

## 6. Next.js Production Config for Render PaaS

Render web services run efficiently when Next.js builds standalone output:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Essential: creates self-contained .next/standalone folder
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: process.env.NODE_ENV === 'production', // Saves CPU on free/starter tiers if needed
  },
};

module.exports = nextConfig;
```
