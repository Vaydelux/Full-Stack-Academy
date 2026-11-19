# React testing/performance + Next.js 16 App Router — acceptance

Updated 2026-11-19. Branch `feat/react-testing-next-router-offline` starts from merged main `b92699d`.

## Scope and artifacts

React 06.05 supplies eight original lessons, offline starter/instructor pairs and model tests for Testing Library concepts, accessible user queries, journey logic, React Profiler, memoization, concurrent rendering and keys. It does not install RTL in the existing lockfile.

Next 07.01 supplies eight original lessons with local route-contract checks for route segments, layouts/templates, Promise params, loading/error, redirect/notFound, safe navigation, metadata and a public-site capstone. The illustrative Next.js `app/` structure is in `labs/next-public-site/solution/app`. This sample tree has not been separately compiled.

All lessons have structured metadata, versioned official references, guided steps, quizzes, bug hunts and learner rubrics. Both MDX and metadata registries are updated. Proposed source counts: 228 lesson IDs, 225 MDX, 225 labs, 28 complete modules, and 12 authored reference drafts out of 303 indexed subjects.

## Qualification commands — not yet executed

```bash
npm ci
npm run verify:offline
npm run test:red-react-performance
npm run test:red-next-router
```

The existing isolated Playwright setup and local Next server must run `scripts/browser-smoke.mjs` to exercise route registration, indexability, noindex boundaries, sitemap, and mobile display.

**Important evidence distinction:** Code-generation/static GitHub file checks are not a Node build, compiler, React Testing Library mount, framework router integration or production browser test. React Testing Library and user-event with a suitable DOM environment must be installed and locked separately before their mounted assertions can be declared passing. The standalone public-site fixture requires its own Next app installation and local HTTP qualification.

Next.js 16 dynamic `params` are asynchronous (Promise); await before accessing values. `error.tsx` must be a Client Component. Error/notFound/redirect helpers have control-flow behavior that requires integration testing. Cache Components rules are reserved for the following `07.03` milestone.

## Branch and release sequencing

PR #17 and PR #18 were merged into main by explicit owner direction with local quality checks outstanding. This new branch must be reviewed separately and should not be labeled production-ready merely because its files are committed. No Vercel or GitHub Actions checks are permitted in this development program unless the owner changes the constraint.

Next 32-topic program: `07.02.01–07.05.08`. Continue in coherent module batches with independent acceptance.
