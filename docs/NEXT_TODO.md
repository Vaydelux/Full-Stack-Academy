# Full-Stack Academy — Current handoff (2026-11-19)

## Versioned source truth

- GitHub `main` commit `651fb296` includes owner-authorized merge PR #19; PR #17 and #18 are also merged. No local dependency-driven tests, Next build or Chromium were executed during those owner-authorized merges.
- Feature branch: `feat/nextjs-16-complete-track-offline`, based on `main` at `651fb296`.
- Proposed (unmerged) source snapshot: **259 lesson IDs, 257 MDX lessons, 257 local lab manifests, 32 complete modules, 12 authored reference drafts of 303 indexed reference subjects**.
- Canonical curriculum: 889 lesson topics; 630 remain planned if this candidate is accepted. **07.02.01 was already published as an interactive model**; this branch adds its MDX/lab but not another distinct published ID. Next unimplemented canonical ID: `08.01.01` (Tailwind v4 configuration).
- **The source counts are NOT deployment/build/test claims.** No Vercel or GitHub Actions inspection performed.

## This large Next.js 16 milestone

- [x] `07.02.01–07.02.08` — Server/Client boundaries, RSC lifecycle, serialized DTOs, Server Actions authorization, BFF/route handlers, streaming, server-only secrets, accidental client imports
- [x] `07.03.01–07.03.08` — Explicit Cache Components (cacheComponents=true), use cache, cacheLife, cacheTag, revalidateTag('max'), updateTag, tenant privacy, render strategies, publish/revalidate capstone
- [x] `07.04.01–07.04.08` — Metadata, canonical URLs, OG, sitemap/robots, safe JSON-LD, image/LCP, Core Web Vitals, content architecture and SEO audit
- [x] `07.05.01–07.05.08` — Environment secrecy, Next 16 proxy.ts, image assets, Node/Edge, sanitized telemetry, diagnostics, upgrade migration and auth cache-leak capstone
- [x] 32 new MDX lessons with learning goals, three worked steps, bug hunt, misconception, question, offline LabGate, official references, self-assessment rubric
- [x] 32 deliberately defective starters, 32 separate instructor solutions, local Node acceptance tests and lab manifest files
- [x] Publication registry, lab script lists, local source integrity check, red-starter gate, browser route/sitemap/mobile smoke contract and checkpoint
- [x] Hardening fix: reject untrusted canonical origins; encode JSON-LD safely even for malicious closing-script sequences

## P0 — Required before release

- [ ] On a full local checkout with Node.js 24: `npm ci && npm run verify:offline` (includes lint, typecheck, repository tests, content schema, checkpoint check, all instructor labs, red starter tests, Next build)
- [ ] Run `npm run test:red-next-full` to show each bad starter fails an assertion, not import failure
- [ ] Run isolated local Next + Chromium browser smoke `scripts/browser-smoke.mjs`; cover 320px layout, keyboard, focus, reduced-motion, screen readers, zoom and zero unexpected console errors
- [ ] Add genuine Next 16 integration tests for real Server Actions, Route Handlers, cache invalidation, SSRF controls, no cache leaks across tenants and HTTP authorization
- [ ] Build/sample real project for App Router public-site capstone; currently only the source tree is checked in
- [ ] Re-check the previously accepted dev-only Picomatch advisory exception and expiry (2026-12-02 UTC)
- [ ] Review exact PR diff and any failing checks. Do not label the branch production-ready while executable qualification is outstanding
- [ ] No Vercel or GitHub Actions checks, per owner constraint

## Next large-scope continuation

- [ ] Track 08: Tailwind v4, design tokens, Radix/shadcn and accessible component systems, beginning at `08.01.01`
- [ ] Expand 12 authored API reference drafts toward W3Schools-style versioned quick references; 291 indexed subjects have no authored draft
- [ ] Add local mounted React Testing Library / user-event tests only after compatible DOM runner and package lock are installed and verifiable
- [ ] Keep the reading-first UI uncluttered; preserve distinct guided lessons, practice, and reference modes
- [ ] Source status handoff: `docs/NEXTJS_16_FULL_TRACK_ACCEPTANCE.md`, `docs/checkpoint.json`, `AGENTS.md` and `docs/PROJECT_CHECKPOINT.md`

**Next concrete action:** qualify exact branch with `npm ci && npm run verify:offline`; then run local browser and security integration gates before merging.
