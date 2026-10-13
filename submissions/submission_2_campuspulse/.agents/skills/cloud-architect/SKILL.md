---
name: cloud-architect
description: >-
  Use this skill when configuring, deploying, and managing applications on Render PaaS (Render.com)
  and cloud environments. Covers render.yaml Infrastructure-as-Code (Blueprint specs), Node/Next.js
  Web Services, Background Workers, managed PostgreSQL/Redis setup, environment variable management,
  zero-downtime deploys, health checks, and production readiness for hackathon judging.
---

# Cloud Architect: Render PaaS Deployment & Cloud Infrastructure

This skill provides comprehensive instructions for deploying, scaling, and maintaining applications on Render PaaS (Render.com), ensuring dependable uptime and automated CI/CD for hackathon projects.

---

## 1. Render Architecture Blueprint (`render.yaml`)

Render Blueprints allow you to define all services, databases, and environment variables in code with zero manual dashboard drift.

### Production `render.yaml` Specification

```yaml
version: "1"

services:
  # Main Next.js Fullstack Web Service
  - type: web
    name: hackathon-app
    runtime: node
    plan: starter # or free for testing
    region: oregon # or frankfurt, ohio, singapore
    buildCommand: npm ci && npm run build
    startCommand: npm run start
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: DATABASE_URL
        fromDatabase:
          name: hackathon-db
          property: connectionString
      - key: APP_SECRET_KEY
        generateValue: true # Generates secure random string automatically
      # External secrets marked sync: false must be supplied in Render dashboard
      - key: OPENAI_API_KEY
        sync: false

databases:
  # Managed PostgreSQL Instance
  - name: hackathon-db
    plan: starter # or free (free expires after 30 days)
    region: oregon
    databaseName: appdb
    user: dbuser
    ipAllowList: [] # empty array allows all connections within Render VPC
```

---

## 2. Next.js on Render: Configuration & Best Practices

### A. Dynamic Port Binding
Render dynamically assigns a port via the `PORT` environment variable. Ensure the start script binds properly:

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p ${PORT:-3000} -H 0.0.0.0"
  }
}
```

### B. High-Performance Standalone Runner (Optional for Docker or Standalone)
If using `output: 'standalone'` in `next.config.js`:
```bash
# Standalone start command
node server.js
```
*(When using standalone mode, Next.js automatically respects `PORT` and binds to `0.0.0.0`)*

### C. Build Optimization & Memory Protection
On Render free or starter tiers (512MB RAM), Next.js builds can occasionally encounter Out-Of-Memory (OOM) errors during type checking or linting. Prevent this by configuring:

```bash
# Set in render.yaml or Render Environment:
NODE_OPTIONS="--max-old-space-size=1536"
```

In `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Only if linting is verified prior in CI to avoid build timeouts
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
```

---

## 3. Mandatory Health Check Endpoint (`/api/health`)

Render verifies service readiness by pinging `healthCheckPath`. If this fails or times out, the deployment rolls back.

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();

  // Basic database connectivity check if available
  let dbStatus = 'healthy';
  try {
    // e.g. await db.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'degraded';
  }

  return NextResponse.json(
    {
      status: 'ok',
      service: 'hackathon-app',
      uptimeSeconds: Math.floor(uptime),
      database: dbStatus,
      timestamp,
    },
    { status: 200 }
  );
}
```

---

## 4. Render Database & Migration Strategy

When using Prisma or Drizzle ORM on Render:
1. Include migration run in the `buildCommand`:
   ```bash
   buildCommand: npm ci && npx prisma generate && npx prisma migrate deploy && npm run build
   ```
2. Render PostgreSQL connection strings use SSL by default. Ensure database pool connections include `?sslmode=require` or SSL configuration enabled.

---

## 5. Render Deployment Troubleshooting Matrix

| Issue on Render | Root Cause | Solution |
| :--- | :--- | :--- |
| **502 Bad Gateway** | App bound to `127.0.0.1` or wrong port | Ensure server listens on `0.0.0.0` and reads `process.env.PORT`. |
| **Deploy Timed Out** | Health check route missing or blocking | Implement `/api/health` returning 200 immediately without heavy queries. |
| **Build Exceeded Memory** | Node GC limit hit on 512MB container | Add `NODE_OPTIONS="--max-old-space-size=1536"` to build env vars. |
| **Prisma SSL Error** | Missing SSL param in `DATABASE_URL` | Append `?sslmode=require` to PostgreSQL connection URL. |
| **Live Demo Cold Start** | Free tier spins down after 15m inactivity | Upgrade to Starter tier ($7/mo) for the hackathon judging window or use a keep-alive ping. |
