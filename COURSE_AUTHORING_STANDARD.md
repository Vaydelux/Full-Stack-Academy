# Full-Stack Academy — Enterprise Course Authoring Standard (v1.1)

**Purpose:** A course whose exercises teach engineering judgment, not copy/paste. This specification applies to each of the catalog's 889 planned lessons and to every reference entry. The catalog is intentionally broader than the initially authored content.

## 1. Two distinct educational products

**Guided curriculum:** prerequisite-aware lessons in a narrative sequence. Each lesson teaches one mental model and validates one concrete outcome. Lessons may reference several APIs but must not become an alphabetical API encyclopedia.

**Reference encyclopedia:** directly addressable, version-aware pages for a symbol, API, CLI command, concept, error, or integration pattern. Each must link to the appropriate guided lessons. A developer should be able to answer a question in under a minute, then expand for deeper coverage.

**Engineering playbooks:** end-to-end recipes that cross frameworks (e.g. add an authenticated NestJS route consumed by Next.js). These explicitly document dependency versions, file paths, end state, security requirements, rollback strategy, and acceptance tests.

## 2. Lesson content contract

Every **published** lesson must include all of:

1. ID / name / subtitle / track / module / estimated time / level / verified stack version / last reviewed date.
2. The problem we are solving (one concrete situation and why naïve approaches fail).
3. The mental model, using a simple causal explanation and sometimes a sequence diagram.
4. Prerequisite skills and a fast preflight check, with alternative instructions for Windows PowerShell and Bash when needed.
5. 3–5 measurable learning outcomes written with action verbs, not vague promises like "understand everything".
6. Explain the 'why' before the code and state which application and folder the code belongs to.
7. Worked example with complete imports, complete files or precise patch, expected output, and security/edge-case notes.
8. A guided walkthrough broken into 3–8 numbered **runnable** steps; each has code/command → prediction prompt → expected result → why → verification.
9. One self-check question with explanation for every choice; minimum one misconception and its correction.
10. One practice lab with starter state, instructions, clear pass/fail criteria and tests; include a hint ladder and model solution.
11. One realistic debugging exercise with symptoms, a reproducer, the defect, diagnostic reasoning, and verification of the fix.
12. Optional deeper dive: internals, alternatives, performance, accessibility and security—not every easy lesson needs all of them.
13. Reflection question: 'What changed? Why is it better? Under what conditions would you not use it?'
14. Exact source references and maintenance date, plus links to related lessons and reference entries.
15. Completion gate: knowledge question + passing executable test when applicable; self-report only when inherently unverifiable.

**Voice:** friendly, clear and technically exact. Use phrases like *"The problem we're solving"*, *"Predict before you run"*, *"What actually happened"*, *"Common misconception"*, *"Try breaking it"*, and *"Proof it works"*. Avoid motivational filler or fake accuracy claims.

**Not acceptable:** unexplained code dumps; broken imports; false claims of tests performed; local secrets in example snippets; testing only happy paths; outdated API claims; invented benchmark numbers; auto-completing lessons after a timer; assuming a self-checked rubric equals an automated grade.

## 3. Hierarchy and route model

`Path / Track / Module / Section / Lesson / Activity`

- **Path:** a view combining tracks, e.g., Full Stack, Frontend, Backend, Platform, Mobile.
- **Track:** a substantial subject area, e.g., TypeScript, React, NestJS.
- **Module:** one bounded competency, e.g., NestJS Guards and Pipes.
- **Section:** concept progression within a module (optional; for a module with more than 12 lessons).
- **Lesson:** one testable learning objective; ID remains stable when reordered.
- **Activity:** code lab, bug hunt, quiz, prediction, reflection, capstone exercise.

Modules must explicitly encode: prerequisites, essential concepts, lab, debugging drill, mastery gate, references, and a suggested project checkpoint. **Unlocking may be suggested, but users can opt out or test out; no forced lockouts for experienced learners.**

## 4. Lesson types

- **Concept** (10–18 min): explain a mental model; code/prediction; quick check.
- **Worked example** (12–25 min): an annotated, runnable implementation with precise steps.
- **Guided lab** (30–90 min): starter repo, patch-level steps, tests, hints, expected behavior.
- **Bug Hunt** (15–45 min): failing repo state with reproducible symptom and acceptance test.
- **Reference** (2–8 min lookup): API semantics, signatures, parameters, snippets, gotchas; not progress-gated.
- **Design review** (30–90 min): compare alternatives with constraints, threat/scale/cost implications.
- **Capstone** (multi-session): an end-to-end milestone with reviewer-level rubric.

Estimated times are **editorial estimates**, measured and updated based on voluntary anonymized learner feedback, not asserted as guarantees.

## 5. Activity scoring and progress

Separate `read`, `attempted`, `practiced`, `validated`, and `mastered` states. A lesson can be viewed but not mastered. Completion at `validated` requires passing knowledge check AND an appropriate practical check. Reflections and self-assessed steps are marked as such.

- Quiz: answer + why correct + why others wrong. Retry allowed.
- Lab: exact tests and assertions; test output is a machine-verifiable signal, not an uploaded screenshot alone.
- Debug: learner diagnoses cause, applies fix, and gets regression tests green.
- Spaced review: configurable schedule; recommended initial review after ~1, 3, 7, 14, 30 days, but do not claim evidence-backed exact optimality for all users.
- Progress import/export: JSON with schema version, collision-safe merge strategy and explicit consent.
- Notes: private to learner, exportable, never embedded in public page HTML.

## 6. Reference-page contract (W3Schools-style discoverability, MDN-level rigor)

Reference pages should be easy to scan but must preserve technical accuracy:

```yaml
id: ref.zod.safeParse
kind: api-reference
symbol: safeParse
product: Zod
majorVersion: 4
status: authored
lastVerified: 2026-11-18
canonical: https://zod.dev/basics
relatedLessons:
  - 09.01.02
```

Page structure: **Syntax → At a glance → Parameters → Returns/errors → Minimal example → Real-world example → Common mistakes → Security and performance considerations → Try it → Related lessons → Official documentation**.

Provide reference indexes for Framework / Hook / API / CLI / Syntax / Concepts / Error Codes / Patterns. Support keyboard search, filters by product and major version, quick-copy syntax, printable view, bookmark, feedback 'this is outdated', last-verified date, and permanent anchor fragments. Use version warning when an API is superseded.

**Source policy:** quote or link official references; write original teaching prose and code; do not scrape and republish somebody else's lesson content.

## 7. Hands-on lab repository discipline

Separate **student starter** and **verified solution** Git tags. Every lab specification should have:

```yaml
labId: lab.nest.11.02.guards
starterRef: lab/nest-guards/starter
solutionRef: lab/nest-guards/solution
runtime: node-24-lts
packageManager: pinned-in-package-json
instructions: ./content/labs/guard-lab.mdx
verify:
  - pnpm typecheck
  - pnpm test -- guards
  - pnpm test:e2e -- authorization
```

The tags and commands above are **proposed naming examples**, not existing Git refs. When implemented, CI must verify each starter can be completed by following instructions and all solution checks pass on the pinned toolchain.

Per lab, include baseline files (no missing imports), `.env.example`, data fixtures (no live credentials), expected output, Windows/Bash command variants, controlled intentional failures, and a test suite.

## 8. Code execution and security

- Browser-safe HTML/CSS/JS examples can run in sandboxed iframe with no same-origin privilege; React JSX needs a compiler, cannot be executed by naïvely passing JSX to `eval`.
- Docker, Node.js, shell, NestJS and Prisma code should run **locally** or in dedicated, strictly isolated ephemeral runner infrastructure; never on the public Next.js process.
- Never run user code via `eval` or unrestricted `new Function` in the main course origin.
- Lab runner requires separate authentication, resource/time limits, isolated network, filesystem boundaries, quota/abuse controls, cleanup, and audit logs before public exposure.
- Do not accept arbitrary MDX from students into the course compiler. Content is trusted, reviewable Git material.

## 9. Quality assurance and accessibility

- Run CI for: frontmatter schema, stable IDs, unique slugs, prerequisite cycle detection, link validation, build, TypeScript, code block lint where possible, compile/test solution repos, Playwright reader smoke tests, axe accessibility checks and SEO metadata.
- Lesson QA: factual editorial review, instructor walkthrough from a fresh machine, beginner clarity test, accessibility pass and security review for sensitive topics.
- WCAG 2.2 AA target; keyboard navigation, screen-reader annotations, focus indicators, reduced motion, responsive code blocks and captioned audio.
- Audio reader is optional and respects semantic reading order. Captions/transcripts accompany generated speech. Voice playback cannot be treated as equivalent to a screen reader.
- Show `planned`, `draft`, `reviewed`, `verified`, or `deprecated` status. Do not show estimated lesson duration as actual learner time.

## 10. Versioning and maintenance

Pin the published course's major versions and checked install commands, with a machine-readable version manifest. Patch updates require smoke tests. Major upgrades create migration labs, changelog and clearly separated older versions. Every technical page includes `lastVerified` plus canonical docs URL. Review high-change pages (Next.js, Prisma, Supabase, NestJS) frequently; schedule quarterly release health reviews.

## 11. Learning project — CollabSpace (generic, not ERP)

Build an end-to-end collaborative workspace through milestones: public pages; auth; teams; project boards; CRUD; role policies; comments; file upload; search; notifications; Redis cache; BullMQ background jobs; realtime; OpenAPI SDK; tests; Docker deployment; observability; incident response; optional offline/mobile and desktop.

**Definition of enterprise-ready capstone:** Requirements and ADR documented; WCAG tested; cross-tenant access negative tests; no secrets client-side; migrations and rollback considered; contract tests pass; E2E covers core journeys; API load test reports p95 under stated workload; logs and traces correlate; automated backups plus successful restore drill; deploy and rollback validated; operational runbook authored. These are verifiable outcomes, not 'enterprise' labels.

## 12. Delivery slices

- **Slice 1:** functioning docs reader, 1 complete track authored, local progress, search, quizzes, notes, reference pages and 2 lab repos.
- **Slice 2:** React/Next/Zod/Nest/Postgres/Prisma courses authored; auth + remote progress; cross-referenced API encyclopedia.
- **Slice 3:** Redis/BullMQ, testing, security, Docker, performance and production capstone.
- **Slice 4:** elective desktop/mobile/AI/distributed systems; enterprise instructor features and advanced assessments.

In the shipped catalog, **only lessons with authored and independently verified content should appear as completable**. The user can browse planned lessons, but the reader must label them accordingly.
