# Academy course and reference publishing architecture

## Deliverables
- `/learn` lists the complete curriculum's 8 groups / 28 tracks.
- `/learn/track/[trackId]` lists each track's modules and subtopics.
- `/learn/[lessonId]` displays an authored lesson as a real SEO-friendly page, or an explicit unindexed planned-page placeholder.
- `/reference` lists the 303 reference subjects by category.
- `/reference/[referenceId]` renders authored reference pages or unindexed placeholders.
- `/?lesson=06.01.01` deep-links back to the existing interactive workspace.
- `/sitemap.xml` includes index and track pages and **only authored lessons and references** when a public HTTPS origin is configured.

## Current content source

`src/lib/academy/authored-content.ts` holds the four authored interactive lesson models and the four authored reference drafts.
`data/curriculum.json` and `data/reference-index.json` remain the canonical catalogs. The remaining 885 lessons and 299 references are *planned*, not published.

Publishing must never be inferred only from catalog entry existence.
Lesson articles derive directly from the interactive authored model, preserving worked steps, quizzes, hints, solutions, mistakes and official references.

## MDX migration, intentionally staged

Do **not** introduce an MDX compiler for untrusted user text or arbitrary remote MDX. MDX can execute code during rendering and must be author-controlled.
Phase 2b adds `@next/mdx` / Fumadocs after its version compatibility and code components have been tested. Start with a single canonical content schema with validated frontmatter, typed lesson metadata, versioned code fixtures, links and stable IDs. Move one authored lesson end to end, compare HTML and interactive behavior, then gradually migrate the rest without parallel divergent sources.

## Production environment

Set `NEXT_PUBLIC_SITE_URL` to the exact canonical HTTPS origin (no path). On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` provides a fallback. No localhost canonical URLs are emitted without configuration. Do not add planned/empty lesson pages to the sitemap.

## Release gates

- Browser smoke test all four published lesson pages and four published references.
- Check all 28 track pages, unknown IDs (404), and un-authored IDs (`noindex`).
- Confirm direct navigation to `/?lesson=<id>` selects the correct workspace lesson.
- Check semantic heading order, keyboard focus, readability and mobile scrolling.
- Add source-link verification and a content QA publishing gate before authoring at scale.
