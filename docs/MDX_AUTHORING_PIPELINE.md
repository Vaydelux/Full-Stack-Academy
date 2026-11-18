# Phase 2b — Git-reviewed MDX lessons and reproducible labs

## Source of truth and safe execution

- Curriculum and reference catalogs are still `data/*.json`, with **889 planned** lessons and **303 indexed** references.
- One lesson is now authored in **`src/content/lessons/06.01.01.mdx`**, with strict JSON metadata at the adjacent `.meta.json` file.
- Existing `AUTHORED_LESSONS` remains the authoritative source for the four playable interactive workspace samples.
- `src/app/learn/[lessonId]/page.tsx` uses a **static build-time import** for the migrated MDX lesson. The other three still render from `authored-content.ts`.
- Next.js `@next/mdx` compiles trusted, Git-reviewed content into React components. **Never compile student submissions or external/user-supplied MDX.**
- No arbitrary Node, shell, SQL, Docker or other code is executed by the Next.js course server.

## Content contract

1. Assign a stable canonical ID from `data/curriculum.json`.
2. Create `src/content/lessons/<id>.mdx` using `LearningGoals`, at least three `LessonStep` components, `KnowledgeCheck`, `LabGate`, a bug hunt, an official reference section and worked explanations.
3. Create `src/content/lessons/<id>.meta.json` with title, versioned tech stack, level, estimated time, review date, prerequisites, objectives, official reference URLs and lab ID.
4. Create a starter solution and automated acceptance tests in `labs/<lab-slug>`.
5. Add the static MDX import to the route and publish it only after `npm run verify:content && npm run test:labs && npm run build` passes.
6. Follow an editorial review; CI cannot verify the factual accuracy of claims or the correctness of every security practice.

Currently `mdx-components.tsx` provides typography and semantics globally. `src/components/course/LessonBlocks.tsx` supplies reusable objectives/steps/misconception/lab components, while `KnowledgeCheck.tsx` provides client-side accessible quiz interaction.

A lab is not certified as independently auto-graded for learners. The instructor-authored solution's tests are executed in CI. Students still complete the starter on their own machines. Future grading must be opt-in and run in isolated infrastructure.

## Commands

```bash
npm ci
npm run verify:content
npm run test:labs
npm test
npm run typecheck
npm run lint
npm run build
```

Do not import MDX from URL query strings or accept markdown compiled at runtime. Keep the MDX loader scoped to checked-in source files.

## Versions and upgrades

`content/stack-versions.json` records the published major versions used in lessons. Update it only when corresponding examples and acceptance tests have been reviewed.

## Known remaining work

- Move the other 3 authored lessons and 4 reference articles to MDX in small, reviewed batches.
- Add richer instructor guidance, detailed expected output and lab fixtures for additional lessons.
- Add cross-device learner progress only after authenticated data ownership and privacy controls are designed.
- Run real-browser smoke tests of MDX rendering, React code sandbox, screen-reader navigation and mobile scrolling.
- Maintain Vercel and Node deployment preview checks for SEO and the production sandbox's CORS behavior.
