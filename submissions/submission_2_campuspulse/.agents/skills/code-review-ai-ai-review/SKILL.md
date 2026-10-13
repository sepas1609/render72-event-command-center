---
name: code-review-ai-ai-review
description: >-
  Use this skill when performing deep automated code reviews, security vulnerability scans,
  edge-case analysis, and pre-demo stabilization checks. Covers syntax/type safety, unhandled async
  promise rejections, memory/render leaks, UX regressions, and a 10-point Hackathon Live Demo Verification protocol.
---

# Code Review & Pre-Demo Stabilization Protocol

This skill provides an exhaustive code quality, stability, and anti-fragility review process to eliminate bugs, prevent live demo crashes, and secure maximum marks from hackathon evaluators.

---

## 1. Pre-Demo Automated Review Pipeline

Execute these automated gates prior to any deployment or demonstration:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Linter check
npm run lint

# 3. Production build test (Never demo on a dev server if avoidable)
npm run build
```

---

## 2. Hackathon Killer Bugs & Anti-Pattern Checklist

### A. Hydration Mismatches (Next.js / SSR)
* **Symptom**: Red warning in DevTools: *"Text content does not match server-rendered HTML"*.
* **Cause**: Rendering dates (`new Date().toLocaleDateString()`), `window.innerWidth`, or random numbers during initial server render.
* **Fix**: Use `useEffect` to set client-only state after mount, or attach `suppressHydrationWarning` on individual timestamp nodes.

### B. Unhandled Async Rejections & Missing Fallbacks
* **Symptom**: Button spins forever; screen turns white upon clicking "Submit" or "Generate".
* **Cause**: Missing `.catch()` or `try / catch` around `fetch()` or Server Actions.
* **Fix**: Always wrap external async calls in `try/catch`, return structured `{ success: false, error: ... }`, and always reset loading states in a `finally` block:
  ```typescript
  try {
    setIsLoading(true);
    await performAction();
  } catch (err) {
    showToastError('Operation failed. Please try again.');
  } finally {
    setIsLoading(false); // Guarantees UI unlocks
  }
  ```

### C. Double-Submission / Race Conditions
* **Symptom**: User clicks "Submit" twice quickly, creating duplicate entries or charging twice.
* **Fix**: Disable button while `isSubmitting` is true (`disabled={isSubmitting}`), and apply optimistic disabling.

### D. Private Key Exposure in Client Bundles
* **Symptom**: API keys leaked to browser network tab or bundle.
* **Rule**: Secrets MUST NOT have `NEXT_PUBLIC_` prefix. Check all imports in client files (`'use client'`). Only server files (`app/api/` or `'use server'`) may access private env vars.

### E. Text Overflow & Layout Explosions
* **Symptom**: A user enters a 200-character name or long prompt, breaking the grid card layout.
* **Fix**: Use `truncate`, `line-clamp-2`, or `break-words` with `overflow-hidden` on card bodies and metric displays.

---

## 3. 10-Point Pre-Demo "Judge Proofing" Protocol

Execute this protocol 2 hours before the hackathon submission deadline:

| # | Check Item | Pass Criteria | Verification Method |
| :- | :--- | :--- | :--- |
| **1** | **Clean Build** | `npm run build` exits code 0 with zero errors | Terminal execution |
| **2** | **Console Hygiene** | DevTools console has zero red errors during user flow | Browser inspect |
| **3** | **Mobile Responsiveness** | UI looks clean on iPhone (390px) & Desktop (1440px) | Browser DevTools responsive mode |
| **4** | **API Failure Resilience** | If external API drops, app shows friendly error/fallback | Test with simulated network failure |
| **5** | **Instant Reset Seed** | Demo database can be reset to clean state in < 5s | Seed script: `npm run db:seed` |
| **6** | **Render Health Check** | `/api/health` returns `200 OK` | `curl -I https://your-app.onrender.com/api/health` |
| **7** | **Zero Dead Links** | All navigation links, buttons, and footer links work | Manual walkthrough |
| **8** | **Realistic Demo Data** | No "Lorem Ipsum", "asdf", or "test test test" | Curate realistic sample cases |
| **9** | **Fallback Backup Video** | 2-minute screen recording of full flow saved locally | QuickTime / Loom screen recording |
| **10**| **README Polish** | Problem, Architecture, Live URL, Tech Stack clearly documented | Check `README.md` |

---

## 4. Code Review Prompt Template for Pair Programming

When reviewing a newly written component or route handler, evaluate against this scorecard:
1. **Type Safety**: Are all parameters and return types explicitly typed without `any`?
2. **Error Boundary**: Is there a fallback UI if this component errors out?
3. **Security**: Does this handle user input safely (sanitization / Zod validation)?
4. **Performance**: Are there unnecessary re-renders or unbounded array operations?
5. **Accessibility**: Are interactive buttons keyboard-navigable with proper focus rings?
