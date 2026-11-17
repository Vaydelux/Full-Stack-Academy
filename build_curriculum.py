from pathlib import Path
import json, csv, textwrap, collections, re
P=Path(__file__).resolve().parent
# Format: TRACK_NAME :: level :: outcome :: official docs base
# Module :: course of study separated by ;, each entry is an individually planned lesson.
tracks = [
('00','Orientation & Computing Foundations','Beginner','Understand the internet, execution environments, tooling and learning workflow','https://developer.mozilla.org/en-US/docs/Learn_web_development', '''
Computing & Internet Mental Models | What runs in a browser vs on a server; Client server lifecycle; DNS domains and IP addresses; TCP TLS and HTTPS; HTTP requests and responses; APIs and JSON; Cookies sessions and storage; Exercise trace a request using DevTools
Developer Toolchain | VS Code workspace and extensions; Terminal PowerShell Bash and WSL2; Node.js runtime vs browser engine; npm pnpm and lockfiles; Project scripts and reproducible installs; Environment variables and dotenv; Git setup and SSH; Lab build a reproducible workstation
Learning & Debugging Process | Read error messages from bottom up; Reproduce minimize and isolate bugs; Debugger breakpoints and watches; Console network and performance panels; Asking good technical questions; Reading changelogs and docs; Experiment logs and architecture notes; Bug Hunt environment mismatch
'''),
('01','HTML & Web Platform','Beginner','Write semantic, accessible and browser-correct applications','https://developer.mozilla.org/en-US/docs/Web/HTML', '''
Document Structure | HTML document anatomy; Head and metadata; Semantic landmarks; Heading hierarchy; Text lists and quotations; Links and navigation; Images and responsive media; Lab accessible content page
Forms & Native Browser Features | Labels controls and fieldsets; Input types and validation; Buttons and form submissions; Progressive enhancement; File inputs; Dialog popover and details; Native events and default behavior; Bug Hunt inaccessible form
Accessibility Foundations | Keyboard-first navigation; Focus management; Screen reader semantics; WCAG principles; Color contrast; Accessible names and descriptions; Images and alternative text; Reduced motion; Lab keyboard audit
Web APIs & Security | DOM and rendering tree; Fetch API and JSON; URL and URLSearchParams; Web Storage and cookies; Permissions and clipboard; Same-origin policy and CORS; CSP and browser isolation; Lab DevTools request investigation
'''),
('02','CSS Mastery & Responsive Design','Beginner','Build precise, resilient and high-performance interfaces','https://developer.mozilla.org/en-US/docs/Web/CSS', '''
CSS Fundamentals | Selectors and combinators; Cascade specificity and inheritance; Cascade layers; Box model and sizing; Units and typography; Logical properties; Pseudo classes and states; Lab responsive content card
Layout Engineering | Flexbox mental model; CSS Grid tracks and areas; Intrinsic sizing min max clamp; Positioning and stacking contexts; Overflow and scroll containers; Container queries; Responsive breakpoints; Bug Hunt broken sticky sidebar
Modern CSS & Design Systems | Custom properties and theme tokens; Color spaces and contrast; Dark mode and color schemes; Transitions and keyframes; CSS nesting; Modern selectors including has; Component-scoped CSS; Lab themed component kit
Performance & Accessibility | Layout paint and composition; Avoiding expensive selectors; GPU-friendly transitions; Font loading and CLS; Scroll animations and motion preferences; CSS audit with DevTools; Visual regression basics; Lab 100 point UI QA
'''),
('03','JavaScript Deep Foundations','Beginner','Understand core JavaScript before adding frameworks','https://developer.mozilla.org/en-US/docs/Web/JavaScript', '''
Language Essentials | let const and scope; Primitive types and coercion; Equality and truthiness; Control flow; Functions and closures; Arrays and objects; Destructuring and spread; Lab data transformer
Intermediate JavaScript | Iterators and generators; Map Set WeakMap WeakSet; Prototypes and classes; this binding; Modules and exports; Error handling; Immutability and object copying; Bug Hunt shared mutable state
Asynchrony & Runtime | Call stack and event loop; Microtasks and macrotasks; Promises and async await; Promise.all and allSettled; AbortController and cancellation; Fetch timeouts and retries; Race conditions; Lab resilient fetch client
Browser Interaction | DOM selection and events; Event delegation; Forms and validation; URL state and History API; LocalStorage and IndexedDB; Browser performance profiling; Security of innerHTML; Lab accessible interactive widget
'''),
('04','TypeScript & Type-System Design','Beginner','Model domains and build strict, maintainable TypeScript','https://www.typescriptlang.org/docs/', '''
Language Foundations | Setup and strict tsconfig; Type inference and annotations; Union intersection and literal types; Interfaces vs type aliases; Optional nullable and undefined; Narrowing and type guards; Functions and overloads; Lab typed task model
Advanced Types | Generics and constraints; keyof indexed access and typeof; Mapped types; Conditional types and infer; Discriminated unions; Utility types; Template literal types; Bug Hunt unsafe type assertions
Runtime Boundaries | Compile-time types vs runtime values; Parsing unknown data; Type-safe errors; Branded IDs; Serialization boundaries; DTOs vs domain types; Type testing with tsd; Lab schema-first API data
Maintainable TS Projects | tsconfig references and module resolution; ESM and CommonJS; Import organization; Public package API design; TypeScript project references; ESLint rules; Declaration generation; Lab typed package release
'''),
('05','Git, Collaboration & Monorepos','Beginner','Manage source changes and reproducible development','https://git-scm.com/docs', '''
Everyday Git | init clone status add commit; Branches merge and rebase; Reset restore and revert; Remote repositories and push; Pull requests and code review; Resolve merge conflicts; Gitignore and secrets; Lab tracked feature change
Team Engineering | Trunk-based development; Commit message conventions; Code ownership; Review comments and rationale; CI status checks; Semantic versioning; Changelogs and releases; Bug Hunt accidental secret commit
pnpm & Turborepo | pnpm workspace layout; Package boundaries and exports; Shared TS config; Task orchestration; Build graph and cache; Lockfile discipline; Dependency upgrades; Lab web API shared contracts monorepo
'''),
('06','React Fundamentals & Mental Models','Beginner','Use React 19 without fragile component patterns','https://react.dev/learn', '''
Elements & Components | JSX and automatic transform; Components and props; Composition and children; Conditional rendering; Lists keys and identity; Rendering vs DOM commits; Event handlers; Lab profile dashboard card
State & Lifecycle | useState state snapshots; Batching and functional updates; Derived state vs duplicated state; Updating arrays and objects; Component state preservation; Lifting state up; Reducers and state machines; Bug Hunt stale closure
Effects & Refs | Render purity; useEffect external synchronization; Effect cleanup; Dependency management; useRef mutable values; DOM refs and focus; Avoiding unnecessary Effects; Lab reliable timer and keyboard shortcut
Advanced React 19 | Context and providers; Custom hooks; useTransition and responsive UX; useDeferredValue; useOptimistic; useActionState; Error boundaries and Suspense; Lab optimistic comments
Testing & Performance | React Testing Library; Accessible queries; Test user journeys; React DevTools profiler; React.memo when warranted; useMemo and useCallback tradeoffs; Concurrent rendering mental model; Bug Hunt unstable keys
'''),
('07','Next.js App Router & SEO','Intermediate','Build server-rendered, secure and fast React applications','https://nextjs.org/docs/app', '''
App Router Fundamentals | Project structure and route segments; Layouts pages and templates; Dynamic route params; Loading and error boundaries; Not-found and redirects; Navigation and prefetch; Metadata and favicons; Lab public site
Server & Client Architecture | Server vs Client Components; RSC request lifecycle; Serialization boundaries; Server Actions and mutations; Route handlers and BFF; Suspense streaming; Secret handling and server-only; Bug Hunt accidental client import
Data & Caching | Fetch behavior in Next.js 16; Explicit cache boundaries; use cache and cache tags; Revalidation and invalidation; Private data and cache risks; ISR vs SSR vs static; Cache debugging; Lab publish and revalidate
SEO & Web Performance | Semantic metadata; Canonical and Open Graph; Sitemap and robots; JSON-LD and structured data; Images fonts and LCP; Core Web Vitals; Content architecture for discoverability; Lab SEO audit
Deployment & Hardening | Environment separation; Reverse proxy and headers; Image and asset optimization; Edge vs Node runtime; Error tracking; Build and runtime diagnostics; Upgrade and migration checks; Bug Hunt auth cache leak
'''),
('08','UI Systems, Accessibility & UX','Intermediate','Build consistent production-quality design systems','https://www.w3.org/WAI/standards-guidelines/wcag/', '''
Tailwind & shadcn/ui | Tailwind v4 configuration; CSS-first tokens; Radix primitives; shadcn composition; Variant patterns and class merging; Theme providers and contrast; Responsive navigation; Lab component gallery
Advanced Interaction | Motion animation primitives; Accessible modal dialog; Combobox and listbox; Keyboard focus traps; Toasts and announcements; Drag and drop; Responsive charts; Bug Hunt inaccessible dropdown
Professional Data Interfaces | TanStack Table columns; Controlled sorting filtering pagination; Virtualized lists; Dense tables and mobile alternatives; Loading empty and error states; Optimistic table interactions; Export and print UX; Lab operational console
Design QA | Visual hierarchy and spacing; Color and typography systems; Form accessibility; Usability heuristics; Reduced motion testing; Cross-browser testing; CLS and layout stability; Lab annotated UX review
'''),
('09','Forms, Zod & UI State','Intermediate','Safely collect data and coordinate frontend state','https://zod.dev/', '''
Zod Schema Design | Objects primitives enums and literals; safeParse and error paths; Optional nullable defaults; refine and superRefine; transform and coercion; Discriminated unions; Schema composition and inference; Lab validated profile form
React Hook Form | Controlled vs uncontrolled inputs; Register and Controller; Zod resolvers; Dynamic field arrays; Async submissions; Reset and dirty state; Server errors and focus; Bug Hunt mismatched form state
TanStack Query | Query keys and caching; Stale time and garbage collection; Mutations and invalidation; Optimistic updates and rollback; Infinite queries; Suspense and SSR hydration; Retries and cancellation; Lab remote task list
Zustand & State Boundaries | Local vs URL vs server state; Zustand selectors and slices; Persistence risks; Derived state and store subscriptions; Multi-tab state coordination; URLSearchParams as state; Avoiding duplicated caches; Lab filters and preferences
'''),
('10','Node.js, HTTP & API Design','Intermediate','Understand servers and design consistent public contracts','https://nodejs.org/learn', '''
Node Runtime | Event loop I O and worker threads; process env and signals; Node streams and buffers; Fetch and AbortSignal; File system safety; Memory and CPU profiling; Process lifecycle; Lab streaming upload
HTTP API Fundamentals | Verbs and status codes; Headers and content negotiation; JSON serialization; Idempotency and retries; Filtering sorting pagination; Error envelopes and RFC 9457; ETags and caching; Lab REST contract
Security Boundaries | TLS and reverse proxies; CORS vs CSRF; Cookies vs bearer tokens; Rate limiting and abuse controls; Request body and file limits; Server side request forgery; Sensitive data redaction; Bug Hunt insecure endpoint
OpenAPI & SDKs | OpenAPI 3.1 structure; Request response contracts; Security schemes; Examples and operation IDs; Client code generation; Contract compatibility; API version strategy; Lab generated client
'''),
('11','NestJS & Fastify Backend','Intermediate','Build reliable modular business applications','https://docs.nestjs.com/', '''
Nest Architecture | Bootstrap and module graph; Controllers and routing; Injectable providers; Dependency injection scopes; Config and env validation; Fastify adapter; Lifecycle hooks; Lab hello API
Request Pipeline | Middleware execution; Pipes and Zod validation; Guards and authorization; Interceptors and tracing; Exception filters; Structured responses; Request context; Bug Hunt guard order
Domain Modules | Service responsibilities; Repository pattern; Domain entities vs DTOs; Dependency inversion; Cross-module boundaries; Application transactions; Domain events; Lab reusable project module
Advanced Nest | Custom providers and tokens; Async module configuration; WebSocket gateways; Lifecycle graceful shutdown; Testing modules and overrides; Caching and interceptors; Health endpoints; Lab production service skeleton
'''),
('12','PostgreSQL & Data Engineering Basics','Intermediate','Model data, transactions and query performance','https://www.postgresql.org/docs/', '''
SQL Essentials | Tables rows columns and types; SELECT WHERE ORDER BY; JOINs; GROUP BY and aggregates; Foreign keys and constraints; NULL and three-valued logic; CTEs and subqueries; Lab query workbook
Relational Modeling | Normalization and denormalization; Primary and surrogate keys; Many-to-many relationships; Multi-tenant data models; Soft delete and history; Check and unique constraints; Audit tables; Bug Hunt missing tenant filter
Transactions & Concurrency | ACID and isolation levels; Locking and deadlocks; MVCC; Optimistic concurrency; Idempotency records; Unique race protections; Transaction boundaries; Lab concurrent update simulation
Query Performance | EXPLAIN ANALYZE; B tree and composite indexes; Partial and covering indexes; Keyset pagination; N plus one queries; Pooling and connection limits; Vacuum and maintenance; Lab profile slow query
Operations & Recovery | Backups and PITR concepts; Replication and replicas; Schema migration safety; Environment isolation; Roles and least privilege; Connection pooler configuration; Restore drills; Lab recover sample database
'''),
('13','Prisma ORM 7 & Persistence','Intermediate','Use typed ORM access without hiding SQL correctness','https://www.prisma.io/docs/orm/v7', '''
Prisma Setup | Prisma schema language; Models relations and enums; Prisma Client generation; Prisma 7 driver adapters; Environment configuration; Migrate development vs deploy; Seed strategies; Lab connect to Postgres
Reading & Writing Data | findMany findUnique and filters; select include and relation loading; Create update delete; Transactions and isolation; Pagination and ordering; Error handling and constraint failures; Avoiding N plus one; Lab repository API
Advanced Persistence | Raw SQL escape hatches; Connection pooling; Prisma migration histories; Expand-contract changes; Multi-schema considerations; Query logging and tracing; Typed repository interfaces; Bug Hunt migration drift
Supabase Integration | Project connection methods; Pooled vs direct connection; Supabase schemas and RLS boundaries; Service database roles; Authorization in NestJS; Migration ownership rules; Testing isolation; Lab cross-tenant security check
'''),
('14','Supabase Platform & Storage','Intermediate','Understand Supabase as managed infrastructure rather than magic backend','https://supabase.com/docs', '''
Supabase Architecture | PostgreSQL Auth Storage and Realtime; Project environments; Client vs server keys; SQL editor vs migrations; Exposed schemas; Network and pooling; Free tier vs production operations; Lab local development
Auth & Identity | Sign up sign in and verification; Next.js SSR cookies; OAuth and PKCE; MFA and recovery; Email templates and redirect URLs; JWT claims and JWKS; Secure sign-out and session refresh; Lab safe login flow
RLS & Authorization | RLS policy mechanics; auth.uid and roles; Policy tests; Privileged Prisma access risks; Bucket RLS and signed URLs; Secure service-role operations; Tenant isolation; Bug Hunt cross-tenant read
Storage & Realtime | Buckets public vs private; Signed upload URLs; Content type and size validation; Realtime channel authorization; Postgres change subscriptions; Presence and broadcast; Webhook-triggered processing; Lab safe document upload
'''),
('15','Security & Enterprise Identity','Advanced','Design defensible systems with threat models and tested controls','https://owasp.org/projects/asvs', '''
Applied Security Foundations | Threat modeling STRIDE; Authentication vs authorization; OWASP ASVS control mapping; Trust boundaries and assets; Secure defaults; Secrets management; Data classification; Lab threat model
Identity & Permissions | RBAC and permission matrices; ABAC and policy evaluation; Object-level authorization; Multi-tenant access checks; OIDC claims verification; SSO SAML overview; SCIM provisioning overview; Bug Hunt IDOR exploitation and fix
Application Security | XSS and output encoding; CSRF and cookie strategies; SQL injection defenses; SSRF outbound policy; File upload threats; Rate limit bypass; Supply chain checks; Lab harden API
Security Operations | Audit log and event integrity; Incident response; Key and token rotation; Dependency patch management; Security headers; Backup access control; Pentest scope and evidence; Lab security release gate
'''),
('16','Redis, Caching & BullMQ','Advanced','Introduce efficient shared caching and reliable asynchronous jobs','https://redis.io/docs/latest/', '''
Cache Design | Why caches exist; Redis types and TTL; Cache-aside pattern; Write-through vs invalidation; Cache stampede prevention; Key design and tenant scoping; Measuring cache hit ratio; Lab cache hot reads
Redis Operations | Connection pooling; Memory eviction policies; Persistence basics; Security and network isolation; Redis cluster overview; Rate limiting tradeoffs; Avoiding hot keys; Bug Hunt stale cache
BullMQ Fundamentals | Producers and consumers; Queue names and payloads; Workers and concurrency; Retries and backoff; Delayed and scheduled jobs; Deduplication and idempotency; Failed jobs and visibility; Lab email dispatch
Reliable Async Architecture | Outbox pattern; At least once delivery; Job status models; Poison jobs and DLQ analogs; Graceful shutdown; Worker scaling; Queue outage recovery; Lab recover failed webhook
'''),
('17','Realtime, Notifications & Collaboration','Advanced','Build responsive live experiences without compromising consistency','https://supabase.com/docs/guides/realtime', '''
Realtime Models | Polling vs SSE vs WebSockets; Event ordering; Subscribe and resume; Authorization for channels; Presence state; Reconnect and backoff; Duplicate event handling; Lab live activity feed
Notifications | In-app notification schema; Read unread and preferences; Email and push delivery; Notification templates; Fan out strategies; Quiet hours and consent; Reliable delivery records; Lab notification center
Collaboration Patterns | Optimistic edits; Version conflicts; Collaborative presence; Yjs CRDT overview; Permissions and shared documents; Conflict resolution UX; Offline reconnection; Lab collaborative notes prototype
'''),
('18','Files, Email, Search & Integrations','Advanced','Implement common platform features safely','https://supabase.com/docs/guides/storage', '''
File Processing | Upload validation; MIME sniffing and extensions; Signed upload and download; Private access boundaries; Image resizing; Malware scanning options; Background processing; Lab asset pipeline
Email & Messaging | Transactional vs marketing email; React Email templates; Delivery provider adapters; Webhooks and bounce tracking; SPF DKIM DMARC; Idempotent sending; Rate limits and retries; Lab verified email flow
Search Architecture | Postgres full text search; Trigram search; Ranking and relevance; Search filters and pagination; Index synchronization; Meilisearch vs Typesense tradeoffs; Search analytics; Lab fast app search
Third-party Integrations | API clients and credentials; Webhook signature verification; Retry budgets and circuit breakers; Provider adapters; API key scopes; Version compatibility; Integration test doubles; Lab signed incoming webhook
'''),
('19','Testing, QA & Engineering Quality','Advanced','Ship code with reproducible evidence and regression protection','https://playwright.dev/docs/intro', '''
Testing Pyramid | Unit vs integration vs E2E; Test contracts and behavior; Fixtures and factories; Deterministic time; Mocking boundaries; Property based testing; Coverage interpretation; Lab tests-first feature
Frontend Testing | Vitest and Testing Library; Accessible queries; React component interaction; Mock Service Worker; Form validation tests; Visual regression; Keyboard and a11y checks; Bug Hunt flaky UI test
Backend & Database Tests | Nest test modules; Service unit tests; API integration tests; Test database transactions; Schema migration tests; RLS and tenant boundary tests; Contract and snapshot tests; Lab full request test
Performance & Reliability Tests | k6 scenarios; p95 and tail latency; Database load testing; Worker concurrency tests; Chaos injection basics; Security test automation; CI test sharding; Lab measurable API SLO
'''),
('20','Docker, CI/CD & Delivery','Advanced','Operate predictable, reversible production deployments','https://docs.docker.com/', '''
Docker Fundamentals | Images containers and layers; Dockerfiles multi-stage builds; Compose services and health checks; Bind mounts vs volumes; Network isolation; Non-root containers; Image security; Lab local stack
Continuous Integration | GitHub Actions jobs and matrices; Lint typecheck and test gates; Dependency caching; Secret handling; Supply chain scanning; Build artifacts and provenance; Branch protection; Lab CI pipeline
Continuous Delivery | Environments and approvals; Database expand-contract migrations; Rolling deploys and downtime; Health probes and smoke tests; Rollbacks and release tagging; Feature flags; Incident-ready releases; Lab deploy and rollback
Infrastructure Operations | Linux filesystem and permissions; Caddy or reverse proxy; HTTPS certificate lifecycle; DNS and CDN; VPS hardening; IaC basics OpenTofu; Terraform state and secrets; Lab production topology
'''),
('21','Observability, SRE & Resilience','Advanced','Diagnose and recover complex failures in production','https://opentelemetry.io/docs/', '''
Observability Fundamentals | Structured logs with Pino; Correlation and request IDs; Metrics counters gauges histograms; Traces and spans; OpenTelemetry instrumentation; Sentry error tracking; Sampling and cardinality; Lab trace an API call
Reliability Engineering | SLIs SLOs and error budgets; Alert fatigue; Readiness and liveness; Circuit breakers; Timeouts and retries; Bulkheads and backpressure; Graceful degradation; Lab fault injection
Operations & Incidents | Incident severity and ownership; Runbooks and dashboards; Log retention and privacy; Backups and restore drills; Disaster recovery objectives; Postmortem writing; Capacity planning; Lab simulated incident
'''),
('22','Web & API Performance Engineering','Advanced','Improve real bottlenecks with repeatable measurements','https://web.dev/learn/performance', '''
Frontend Performance | Core Web Vitals LCP INP CLS; Bundle analysis; Server streaming; Font and image optimization; Prefetch and resource hints; Rendering waterfall analysis; Virtualization; Lab performance budget
API & Database Performance | Profiling Node CPU and heap; Fastify vs alternatives measurement; Connection pool sizing; Query plans and N plus one; HTTP caching ETags; Payload compression; Request batching tradeoffs; Lab reduce p95 latency
Caching & Capacity | CDN caching and purge; Multi-tier caching; Cache consistency; Load balancing and stateless APIs; Horizontal scaling; Cost-aware scaling; Baseline and regression tests; Lab capacity forecast
'''),
('23','Software Architecture & DDD','Advanced','Design systems that remain understandable as teams and features grow','https://martinfowler.com/architecture/', '''
Design Principles | Cohesion coupling and SOLID; Dependency inversion; Ports and adapters; Hexagonal architecture; Clean architecture tradeoffs; Domain model vs persistence model; Architecture decision records; Lab diagram boundaries
Modular Monolith | Domain modules and ownership; API contracts between modules; Transactions and invariants; Domain events; Repository interfaces; Feature toggles; Shared kernel discipline; Bug Hunt circular dependencies
Event Driven Systems | Events vs commands; Eventual consistency; Outbox pattern; Idempotent consumers; Sagas and orchestration; Versioned message schemas; Delivery guarantees; Lab reliable event integration
Distributed Systems | CAP tradeoffs and practical consistency; Service discovery; Timeouts and retries; Message brokers NATS Kafka; Data partitioning; Multi-region latency; Microservice extraction criteria; Lab design review
'''),
('24','Mobile, Offline & Desktop Extensions','Specialization','Extend the web platform without weakening mobile and offline correctness','https://capacitorjs.com/docs', '''
Capacitor Fundamentals | Capacitor architecture vs React Native; Vite React mobile entrypoint; Native bridge plugins; Android lifecycle; iOS signing basics; Network and storage permissions; Secure token storage; Lab first APK
Offline First Data | SQLite local schema; Sync queue and operation IDs; Conflict models and merge rules; Partial sync and cursors; Deleted records and tombstones; Secure offline data; Reconnect and retry; Lab offline task edits
Tauri Desktop | Tauri architecture and commands; Rust boundary mental model; Desktop permissions; Window and file APIs; Auto updates and signing; Local SQLite storage; Native packaging; Lab portable desktop app
Mobile Quality | Device UX and touch targets; Push notifications; Background execution constraints; Deep links; Battery memory and app size; Accessibility mobile; Store release requirements; Bug Hunt lost sync
'''),
('25','Advanced Data & Specialized Platforms','Specialization','Know when to introduce search, analytics, AI and geospatial capabilities','https://www.postgresql.org/docs/', '''
Data Analytics | OLTP vs OLAP; Aggregations and materialized views; Event tracking and instrumentation; Warehouse concepts; ClickHouse overview; dbt transformations; Data quality assertions; Lab event dashboard
AI & RAG | AI SDK application primitives; Model selection and budgets; Prompt injection defenses; Embeddings and pgvector; Retrieval and chunking; Evaluation datasets; Model routing and fallbacks; Lab source-cited assistant
Geospatial & Mapping | PostGIS geometry and geography; Spatial indexes; Distance and bounding boxes; Map clients; Data validation; Geofence queries; Geo privacy; Lab map-backed search
Specialized Media & RTC | Object storage and CDN delivery; Adaptive streaming concepts; FFmpeg pipeline isolation; WebRTC and LiveKit; Signed media URLs; Content moderation and abuse controls; Media cost modeling; Lab asynchronous thumbnail worker
'''),
('26','Enterprise Features & Governance','Specialization','Build enterprise-ready capabilities responsibly','https://owasp.org/projects/asvs', '''
Enterprise Identity | SAML SSO architecture; SCIM provisioning; Domain verification; Session and device controls; MFA and step up auth; Organization policy administration; Auditability; Lab enterprise auth threat model
Billing & Commercial Platform | Subscription state machines; Webhook authenticity; Idempotent entitlements; Grace periods and dunning; Usage metering; Provider adapter pattern; Sandbox testing; Lab billing simulator
Privacy & Compliance | Data inventories; GDPR concepts and Philippine Data Privacy Act overview; Consent and retention; Right to export/delete; Encryption key management; Data residency; Evidence and controls; Lab retention policy
Platform Administration | Audit search and exports; Feature flags; System configuration; Tenant administration; Incident support tooling; Abuse management; Migration and import pipelines; Lab safe admin console
'''),
('27','Capstone: Build a Production Platform','Capstone','Integrate knowledge into a complete, deployed, tested system','https://nextjs.org/docs/app', '''
Capstone Phase A Web | Requirements and scope; Architecture decision record; Information architecture; UI component library; Public SEO pages; Authenticated workspace; Accessibility acceptance; Milestone web release
Capstone Phase B API & Data | OpenAPI and Zod contracts; Nest domain boundaries; PostgreSQL schema and migrations; Prisma repositories; Supabase Auth JWT validation; Permissions and tenant isolation; API integration tests; Milestone secured API
Capstone Phase C Features | CRUD with pagination; Secure file upload; Notification queue; Redis cache invalidation; Live updates; Search; Audit trail; Milestone integrated workspace
Capstone Phase D Production | Docker compose and envs; Continuous integration; Deployment and rollback; Observability and alerts; Security verification; Performance testing; Backup restore drill; Production readiness review
Capstone Phase E Defense | Bug bounty style review; Fault injection drill; Architecture tradeoff presentation; Source and API documentation; Operating cost calculation; Portfolio case study; Upgrade plan; Final technical assessment
'''),
]

records=[]; modules=[]; refs={}
for ti,(idx,title,level,outcome,docs,data) in enumerate(tracks):
    rows=[x.strip() for x in data.strip().splitlines() if x.strip()]
    for mi,line in enumerate(rows):
        parts=[x.strip() for x in line.split('|',1)]
        if len(parts)!=2: raise ValueError(line)
        mod,lessons=parts
        topics=[x.strip() for x in lessons.split(';') if x.strip()]
        mid=f'{idx}.{mi+1:02d}'
        mod_id=f'm{idx}-{mi+1:02d}'
        modules.append({'id':mid,'slug':mod_id,'track':idx,'trackTitle':title,'title':mod,'level':level,'outcome':outcome,'sourceUrl':docs,'lessonCount':len(topics)})
        for li,lt in enumerate(topics):
            lid=f'{mid}.{li+1:02d}'
            lesson_type = 'lab' if lt.lower().startswith(('lab ','guided lab')) else 'debug' if lt.lower().startswith(('bug hunt','debug')) else 'lesson'
            eta=50 if lesson_type=='lab' else 30 if lesson_type=='debug' else 18
            records.append({'id':lid,'slug':f'l{idx}-{mi+1:02d}-{li+1:02d}','trackId':idx,'track':title,'moduleId':mid,'module':mod,'title':lt,'level':level,'type':lesson_type,'estimatedMinutes':eta,'status':'planned','referenceUrl':docs,'prerequisites':[]})
    refs[title]=docs

# Reference glossary registry: short titled entries organized by domain.
reference_entries = {
 'Web & HTML': 'HTML document|html|head|meta|link|script|article|section|nav|main|aside|button|form|input|label|fieldset|dialog|details|picture|img|a|aria-label|tabindex|fetch|Request|Response|URL|URLSearchParams|AbortController|localStorage|IndexedDB|Service Worker|CORS|CSP',
 'CSS': 'display|position|z-index|box-sizing|grid-template-columns|flex|gap|clamp()|min()|max()|var()|@media|@container|@layer|:has()|:focus-visible|prefers-reduced-motion|color-scheme|font-display|contain|content-visibility|animation|transition',
 'JavaScript': 'const|let|async|await|Promise|Promise.all|Promise.allSettled|Array.map|Array.filter|Array.reduce|Array.find|Object.entries|Map|Set|JSON.parse|JSON.stringify|try/catch|throw|import|export|EventTarget|addEventListener|queueMicrotask|structuredClone|AbortSignal',
 'TypeScript': 'type|interface|unknown|never|union|intersection|generics|keyof|typeof|infer|satisfies|as const|Partial|Pick|Omit|Record|ReturnType|Awaited|Discriminated unions|Type guards|tsconfig strict|NodeNext',
 'React': 'JSX|Component|props|children|key|useState|useReducer|useEffect|useLayoutEffect|useRef|useContext|useMemo|useCallback|useTransition|useDeferredValue|useOptimistic|useActionState|Suspense|Error boundaries|Context|Custom hooks|React.memo',
 'Next.js': 'page.tsx|layout.tsx|loading.tsx|error.tsx|not-found.tsx|route.ts|route groups|dynamic segments|generateMetadata|generateStaticParams|Server Components|Client Components|Server Actions|use cache|cacheTag|revalidateTag|redirect|notFound|cookies|headers|Image|Link|fetch caching|Next.js Proxy',
 'NestJS': '@Module|@Controller|@Get|@Post|@Injectable|@Inject|@UseGuards|CanActivate|ExecutionContext|PipeTransform|ExceptionFilter|NestInterceptor|Middleware|APP_GUARD|FastifyAdapter|ConfigModule|TestingModule|BullModule|WebSocketGateway|Terminus health',
 'Zod': 'z.string|z.number|z.boolean|z.object|z.array|z.enum|z.literal|z.union|z.discriminatedUnion|z.optional|z.nullable|z.default|z.coerce|z.transform|z.refine|z.superRefine|safeParse|z.infer|z.strictObject',
 'PostgreSQL': 'SELECT|INSERT|UPDATE|DELETE|JOIN|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|WITH|ON CONFLICT|RETURNING|BEGIN|COMMIT|ROLLBACK|EXPLAIN ANALYZE|CREATE INDEX|UNIQUE|FOREIGN KEY|CHECK|jsonb|transaction isolation|MVCC|row level security|pg_trgm|GIN index',
 'Prisma': 'model|@id|@default|@unique|@@index|@relation|enum|findMany|findUnique|create|update|upsert|delete|select|include|where|orderBy|cursor|$transaction|$queryRaw|PrismaClient|Prisma Migrate|driver adapter|prisma.config.ts',
 'Supabase': 'createBrowserClient|createServerClient|signInWithPassword|signInWithOAuth|getClaims|getUser|signOut|onAuthStateChange|RLS policy|auth.uid|Storage bucket|createSignedUrl|createSignedUploadUrl|Realtime channel|Broadcast|Presence|Service role key',
 'Redis & BullMQ': 'GET|SET|SET EX|DEL|EXPIRE|TTL|INCR|MGET|HSET|HGET|SADD|ZADD|SCAN|EVAL|Redis persistence|Eviction|BullMQ Queue|Worker|Job|backoff|attempts|deduplication|Flows|Repeatable jobs|QueueEvents',
 'Testing & Operations': 'Vitest describe|Vitest test|expect|vi.mock|Playwright test|page.getByRole|beforeEach|k6 check|Dockerfile|docker compose|GitHub Actions job|OpenTelemetry Span|Pino logger|Sentry event|SLO|SLI|runbook|ADR|idempotency key|CSP|OWASP ASVS',
}
ref_list=[]
for cat,terms in reference_entries.items():
    for term in terms.split('|'):
        name=term.strip(); slug=re.sub('[^a-z0-9]+','-',name.lower()).strip('-')
        ref_list.append({'id':f'{cat.lower().split()[0]}-{slug}', 'category':cat,'title':name,'slug':slug,'status':'index','lessonCrossReferences':[]})

P.joinpath('data/curriculum.json').write_text(json.dumps({'version':'1.1','audience':'beginner-to-enterprise','tracks':[{'id':x[0],'title':x[1],'level':x[2],'outcome':x[3],'officialReference':x[4]} for x in tracks],'modules':modules,'lessons':records},ensure_ascii=False,indent=2),encoding='utf-8')
P.joinpath('data/reference-index.json').write_text(json.dumps({'version':'1.0','entries':ref_list},ensure_ascii=False,indent=2),encoding='utf-8')

# Markdown index with full lesson list and each module separated.
lines=['# Enterprise Full-Stack Academy — Complete Curriculum Map','',f'**Scope:** {len(tracks)} tracks · {len(modules)} modules · {len(records)} individually named planned lessons · {len(ref_list)} indexed API/reference entries.','',
       '**Publishing honesty:** This is the authoritative *curriculum catalog*; a catalog entry does not mean the lesson body, exercises, tests, or audio are written. Only content explicitly tagged `authored` is complete.','',
       '**Stack:** TypeScript, React 19, Next.js 16, NestJS, Fastify, PostgreSQL, Supabase, Prisma 7, Zod 4, TanStack Query, Zustand, Redis, BullMQ, Docker, GitHub Actions; optional Capacitor/Tauri/AI/distributed systems.','',
       '## Structure and notation','',
       '- Track → module → concept lesson → worked example → guided lab → bug hunt → quiz → mastery gate.',
       '- IDs are stable for progress and crosslinks; `NN.MM.LL` denotes track/module/lesson.',
       '- Beginners follow tracks 00–15 before advanced engineering. Experienced developers may test out of prerequisite tracks.',
       '- Tracks 24–26 are elective specializations; track 27 is the cross-stack capstone.',
       '- Durations in JSON are *planning estimates*, not evidence of tested completion time.','',
       '## Learning paths','',
       '1. **Complete full-stack engineer:** 00–23 → 27; select electives 24–26.',
       '2. **Frontend specialist:** 00–09 → 19, 21, 22 → capstone web work.',
       '3. **Backend specialist:** 00, 03–05, 10–23 → capstone API work.',
       '4. **Platform/SRE:** 00–05, 10–13, 15–16, 19–23 → production gate.',
       '5. **Mobile/desktop:** 00–09, 10–15, 24 → mobile/desktop capstone.', '',
       '## Complete topic-by-topic index','']
for t in tracks:
    idx,name,lev,outcome,docs,_=t
    lines.extend([f'### Track {idx} — {name}', '', f'**Level:** {lev}. **Outcome:** {outcome}. **Official reference:** {docs}', ''])
    for m in [x for x in modules if x['track']==idx]:
        lines.extend([f'#### {m["id"]} — {m["title"]}', ''])
        for l in [x for x in records if x['moduleId']==m['id']]:
            lines.append(f'- **{l["id"]}** {l["title"]} · {l["type"]} · {l["estimatedMinutes"]} min target')
        lines.extend(['',f'**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.', ''])
P.joinpath('CURRICULUM_MASTER.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')

r=['# Modern Reference Encyclopedia — Index', '',f'**Indexed concepts:** {len(ref_list)} across {len(reference_entries)} categories. Entries are indexed reference subjects, not full written pages.','',
 'Reference pages are **not** lessons. They are fast lookup cards similar to language and API references, with exact behavior, code snippets, gotchas, supported versions and related tutorials.','',
 '## Standard reference-page template','',
 '1. Signature / syntax; runtime or platform; version and lifecycle status',
 '2. One-sentence purpose and the shortest working example',
 '3. Parameters, defaults, return value, errors and side effects',
 '4. Beginner example; production example; anti-example',
 '5. Accessibility, security and performance notes when relevant',
 '6. Common mistakes / troubleshooting matrix',
 '7. Interactive sandbox if safe to run in browser',
 '8. Related references, lessons, and official source links; last verified date',
 '9. Copy-friendly recipe and test assertions', '']
for cat in reference_entries:
    r.extend([f'## {cat}', '', ', '.join('`'+x['title']+'`' for x in ref_list if x['category']==cat), ''])
P.joinpath('REFERENCE_ENCYCLOPEDIA.md').write_text('\n'.join(r)+'\n',encoding='utf-8')

manifest={'tracks':len(tracks),'modules':len(modules),'plannedLessons':len(records),'referenceSubjects':len(ref_list),'planningLessonMinutes':sum(x['estimatedMinutes'] for x in records)}
P.joinpath('data/summary.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
if P.joinpath('prototype').exists():
    catalog_payload = {
        'tracks': [{'id':x[0],'title':x[1],'level':x[2],'outcome':x[3],'officialReference':x[4]} for x in tracks],
        'modules': modules,
        'lessons': records,
        'reference': ref_list,
    }
    P.joinpath('prototype/catalog.js').write_text('const CATALOG = ' + json.dumps(catalog_payload, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
print(manifest)
