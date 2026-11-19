# Next.js 16 Full Track — Source Milestone Acceptance

**Date:** 2026-11-19. **Branch:** `feat/nextjs-16-complete-track-offline`. **Base:** merged main `651fb296` after owner-approved PR #19.

## Source implementation completed

- `07.02` Server/Client architecture and trust boundaries: 8 lessons
- `07.03` data fetching and Cache Components: 8 lessons
- `07.04` SEO, metadata, accessibility and Web Vitals: 8 lessons
- `07.05` production diagnostics, runtime, env and security: 8 lessons

Every one of the 32 new canonical topics has an MDX article, strict metadata, three worked implementation steps, an intentionally broken learner starter, correct instructor code, a local test, a lab manifest, self-assessment rubric and official documentation sources. The publication registry and lab script list include them.

**Source candidate counts:** 259 lesson IDs / 257 MDX / 257 labs / 32 complete modules. 889 total topics; 630 planned. 12 authored API reference drafts out of 303 indexed subjects. This is *not* a tested hosted release.

## Correct Next.js 16 policy boundaries

- Server Components by default; use a narrowly scoped `'use client'` boundary and validate/allowlist DTOs crossing it. Never bundle server-only secrets.
- Treat Server Actions and Route Handlers as public HTTP mutation/read boundaries requiring authentication, exact resource authorization, input validation and negative tests.
- Cache Components material assumes **`cacheComponents: true`**. The lessons do not mix it with legacy route-segment cache flags.
- `'use cache'` + `cacheLife` + `cacheTag` for public cacheable data; `revalidateTag(tag, 'max')` for stale-while-revalidate and `updateTag(tag)` inside Server Actions for read-your-writes. Personal and tenant data must not enter shared cache scopes.
- Metadata, canonical/OG and JSON-LD must avoid script injection and search exposure of drafts. Robots rules do not implement access control.
- Next.js 16 `proxy.ts` replaces deprecated `middleware.ts` and runs in Node.js. Proxy alone does not authorize object-level data access.
- Core Web Vitals (LCP, INP, CLS) require real field/representative browser measurement; offline threshold models do not constitute performance results.

Official guides used include https://nextjs.org/docs/app/getting-started/server-and-client-components, https://nextjs.org/docs/app/guides/migrating-to-cache-components, https://nextjs.org/docs/app/getting-started/revalidating, https://nextjs.org/docs/app/guides/data-security, https://nextjs.org/docs/app/getting-started/proxy, https://nextjs.org/docs/app/guides/json-ld and https://web.dev/articles/vitals.

## Quality gate not executed in this environment

```bash
npm ci
npm run verify:offline
npm run test:red-next-full
```

After the scripted checks, run the existing isolated local Next + Chromium acceptance harness including `scripts/next-full-track-smoke.mjs`. Run keyboard-only, screen-reader, zoom, reduced-motion and mobile checks. Add real local integration tests for cache behavior, API status/errors, cross-tenant authorization, and SSRF; SSR/model tests alone cannot establish those.

The connected GitHub tools successfully authored and inspected source files. The current container has no direct GitHub network access, so it did **not** clone the exact repository or install dependencies, compile MDX/Next, run all labs or execute Chromium.

## Release decision

Keep PR in draft while complete tests are unexecuted; previous owner-authorized merges were not evidence of quality checks. No Vercel or GitHub Actions checks were performed. Track 08 begins at `08.01.01` after qualification and merge.
