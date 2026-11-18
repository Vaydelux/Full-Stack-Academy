# Full-Stack Academy — Next TODO

**Updated:** 2026-11-18 · **Verified production:** `main@ae22113` · **Next P0 module:** `01.04` Web APIs & Security.  
Only **53 of 889** curriculum topics have been genuinely authored. Do not confuse 889 mapped topics with 889 available tutorials.

## P0 — Module 01.04: Web APIs & Security
- [ ] `01.04.01` DOM and rendering tree — DOM tree vs rendered layout, safe mutation methods, avoiding innerHTML with untrusted strings; local deterministic exercise.
- [ ] `01.04.02` Fetch API and JSON — response.ok vs transport failures, status classes, AbortController, safe parsing and error handling; local stub not live third-party request.
- [ ] `01.04.03` URL and URLSearchParams — percent encoding, base URLs, repeated keys, validation and avoiding unsafe redirects.
- [ ] `01.04.04` Web Storage and cookies — scope, lifetime, SameSite/HttpOnly/Secure distinctions, XSS risk; never store credentials in localStorage for teaching.
- [ ] `01.04.05` Permissions and clipboard — secure contexts, explicit user gesture, permission denial handling and graceful fallbacks.
- [ ] `01.04.06` Same-origin policy and CORS — origins, preflight, credentials, response headers; teach defense, never recommend disabling browser security.
- [ ] `01.04.07` CSP and browser isolation — nonce/hash/source policies, opaque sandbox origin, message origin validation, avoiding unsafe-eval; keep demo safe.
- [ ] `01.04.08` Lab DevTools request investigation — reproduce a local request, inspect Network/Console, isolate HTTP vs transport failure, document redacted evidence.
- [ ] For each topic write a reviewed MDX lesson, strict metadata, >=3 guided steps, official HTTPS sources, prediction, quiz, bug hunt, local starter+solution, executable tests and an honest completion rubric.
- [ ] Register publication metadata and MDX route; keep planned 01.05 content noindex and preserve accurate sitemap and next-link behavior.
- [ ] Update `docs/checkpoint.json` via `npm run checkpoint:write`, human checkpoint and this TODO. Verify counts in CI.
- [ ] Audit dependency and security state; require npm ci, lint, typecheck, repository tests, catalog/content/checkpoint, all labs, Next build, Chromium and Vercel preview on exact head.
- [ ] Merge only on green; verify production deployment READY at merged SHA and reconcile release checkpoint.

## P1 — Operational security, inclusive testing and editorial quality
- [ ] **By 2026-12-02 UTC:** resolve or deliberately re-evaluate the **14 high dev-only findings** from Picomatch `GHSA-fc5q-39xc-vjpf`; the scoped exception expires that date. Do not blindly force incompatible Next.js/ESLint changes.
- [ ] Perform manual keyboard and assistive-technology reviews on real devices; tests cannot certify WCAG 2.2.
- [ ] Expand the reference encyclopedia from 4 drafted articles toward 303 indexed subjects, with tested syntax/behavior examples.
- [ ] Consolidate the older v1.1 README narrative while preserving the calm reading-first navigation.

## P2 — Later stages
- [ ] Continue remaining HTML/Web Platform topics, CSS, JavaScript, TypeScript, React/Next.js, backend APIs, PostgreSQL/Prisma/Supabase, security, deployment and CollabSpace capstone.
- [ ] Consider authenticated progress sync and remote grading only after privacy, identity, sandbox compute limits and free-tier cost design.

## Definition of done
Every canonical module topic has a genuinely authored lesson and working starter/solution fixture; content and publication metadata are valid, route is indexable, planned topics remain noindex, CI/browser/audit pass, exact-head preview is verified, and the merged production deployment SHA matches main. Never claim a manual screen-reader run if none occurred.

## Recently released
- [x] `00.01`, `00.02`, `00.03`: 24 Orientation & Foundations lessons.
- [x] `01.01`: eight document structure lessons.
- [x] `01.02`: eight forms and validation lessons.
- [x] `01.03`: nine Accessibility Foundations lessons with keyboard-audit capstone, correct contrast calculation and reduced-motion tests.
- [x] PR #10 merged; 18 repository tests, 131 lab tests, 50 MDX validations, Chromium and dependency audit passed.
- [x] Live production `/learn/01.03.09` confirmed HTTP 200, Vercel READY at `main@ae22113`.
- [x] Machine-checked `docs/checkpoint.json` and durable handoff files maintained for continuation.
