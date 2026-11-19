> **2026-11-19 draft coverage:** 303 index entries remain; 12 authored reference drafts now exist on the stacked React development branch (4 original + 8 React 19). The reference page uses search, category and authored/index-only filters, with pagination to reduce the overwhelming 303-item initial list. An index entry is not a completed reference. See `docs/REACT_EFFECTS_ADVANCED_ACCEPTANCE.md`.

# Modern Reference Encyclopedia — Index

**Indexed concepts:** 303 across 13 categories. Entries are indexed reference subjects, not full written pages.

Reference pages are **not** lessons. They are fast lookup cards similar to language and API references, with exact behavior, code snippets, gotchas, supported versions and related tutorials.

## Standard reference-page template

1. Signature / syntax; runtime or platform; version and lifecycle status
2. One-sentence purpose and the shortest working example
3. Parameters, defaults, return value, errors and side effects
4. Beginner example; production example; anti-example
5. Accessibility, security and performance notes when relevant
6. Common mistakes / troubleshooting matrix
7. Interactive sandbox if safe to run in browser
8. Related references, lessons, and official source links; last verified date
9. Copy-friendly recipe and test assertions

## Web & HTML

`HTML document`, `html`, `head`, `meta`, `link`, `script`, `article`, `section`, `nav`, `main`, `aside`, `button`, `form`, `input`, `label`, `fieldset`, `dialog`, `details`, `picture`, `img`, `a`, `aria-label`, `tabindex`, `fetch`, `Request`, `Response`, `URL`, `URLSearchParams`, `AbortController`, `localStorage`, `IndexedDB`, `Service Worker`, `CORS`, `CSP`

## CSS

`display`, `position`, `z-index`, `box-sizing`, `grid-template-columns`, `flex`, `gap`, `clamp()`, `min()`, `max()`, `var()`, `@media`, `@container`, `@layer`, `:has()`, `:focus-visible`, `prefers-reduced-motion`, `color-scheme`, `font-display`, `contain`, `content-visibility`, `animation`, `transition`

## JavaScript

`const`, `let`, `async`, `await`, `Promise`, `Promise.all`, `Promise.allSettled`, `Array.map`, `Array.filter`, `Array.reduce`, `Array.find`, `Object.entries`, `Map`, `Set`, `JSON.parse`, `JSON.stringify`, `try/catch`, `throw`, `import`, `export`, `EventTarget`, `addEventListener`, `queueMicrotask`, `structuredClone`, `AbortSignal`

## TypeScript

`type`, `interface`, `unknown`, `never`, `union`, `intersection`, `generics`, `keyof`, `typeof`, `infer`, `satisfies`, `as const`, `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, `Awaited`, `Discriminated unions`, `Type guards`, `tsconfig strict`, `NodeNext`

## React

`JSX`, `Component`, `props`, `children`, `key`, `useState`, `useReducer`, `useEffect`, `useLayoutEffect`, `useRef`, `useContext`, `useMemo`, `useCallback`, `useTransition`, `useDeferredValue`, `useOptimistic`, `useActionState`, `Suspense`, `Error boundaries`, `Context`, `Custom hooks`, `React.memo`

## Next.js

`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `route groups`, `dynamic segments`, `generateMetadata`, `generateStaticParams`, `Server Components`, `Client Components`, `Server Actions`, `use cache`, `cacheTag`, `revalidateTag`, `redirect`, `notFound`, `cookies`, `headers`, `Image`, `Link`, `fetch caching`, `Next.js Proxy`

## NestJS

`@Module`, `@Controller`, `@Get`, `@Post`, `@Injectable`, `@Inject`, `@UseGuards`, `CanActivate`, `ExecutionContext`, `PipeTransform`, `ExceptionFilter`, `NestInterceptor`, `Middleware`, `APP_GUARD`, `FastifyAdapter`, `ConfigModule`, `TestingModule`, `BullModule`, `WebSocketGateway`, `Terminus health`

## Zod

`z.string`, `z.number`, `z.boolean`, `z.object`, `z.array`, `z.enum`, `z.literal`, `z.union`, `z.discriminatedUnion`, `z.optional`, `z.nullable`, `z.default`, `z.coerce`, `z.transform`, `z.refine`, `z.superRefine`, `safeParse`, `z.infer`, `z.strictObject`

## PostgreSQL

`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`, `OFFSET`, `WITH`, `ON CONFLICT`, `RETURNING`, `BEGIN`, `COMMIT`, `ROLLBACK`, `EXPLAIN ANALYZE`, `CREATE INDEX`, `UNIQUE`, `FOREIGN KEY`, `CHECK`, `jsonb`, `transaction isolation`, `MVCC`, `row level security`, `pg_trgm`, `GIN index`

## Prisma

`model`, `@id`, `@default`, `@unique`, `@@index`, `@relation`, `enum`, `findMany`, `findUnique`, `create`, `update`, `upsert`, `delete`, `select`, `include`, `where`, `orderBy`, `cursor`, `$transaction`, `$queryRaw`, `PrismaClient`, `Prisma Migrate`, `driver adapter`, `prisma.config.ts`

## Supabase

`createBrowserClient`, `createServerClient`, `signInWithPassword`, `signInWithOAuth`, `getClaims`, `getUser`, `signOut`, `onAuthStateChange`, `RLS policy`, `auth.uid`, `Storage bucket`, `createSignedUrl`, `createSignedUploadUrl`, `Realtime channel`, `Broadcast`, `Presence`, `Service role key`

## Redis & BullMQ

`GET`, `SET`, `SET EX`, `DEL`, `EXPIRE`, `TTL`, `INCR`, `MGET`, `HSET`, `HGET`, `SADD`, `ZADD`, `SCAN`, `EVAL`, `Redis persistence`, `Eviction`, `BullMQ Queue`, `Worker`, `Job`, `backoff`, `attempts`, `deduplication`, `Flows`, `Repeatable jobs`, `QueueEvents`

## Testing & Operations

`Vitest describe`, `Vitest test`, `expect`, `vi.mock`, `Playwright test`, `page.getByRole`, `beforeEach`, `k6 check`, `Dockerfile`, `docker compose`, `GitHub Actions job`, `OpenTelemetry Span`, `Pino logger`, `Sentry event`, `SLO`, `SLI`, `runbook`, `ADR`, `idempotency key`, `CSP`, `OWASP ASVS`

