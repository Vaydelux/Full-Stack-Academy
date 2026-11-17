# Enterprise Full-Stack Academy — Complete Curriculum Map

**Scope:** 28 tracks · 111 modules · 889 individually named planned lessons · 303 indexed API/reference entries.

**Publishing honesty:** This is the authoritative *curriculum catalog*; a catalog entry does not mean the lesson body, exercises, tests, or audio are written. Only content explicitly tagged `authored` is complete.

**Stack:** TypeScript, React 19, Next.js 16, NestJS, Fastify, PostgreSQL, Supabase, Prisma 7, Zod 4, TanStack Query, Zustand, Redis, BullMQ, Docker, GitHub Actions; optional Capacitor/Tauri/AI/distributed systems.

## Structure and notation

- Track → module → concept lesson → worked example → guided lab → bug hunt → quiz → mastery gate.
- IDs are stable for progress and crosslinks; `NN.MM.LL` denotes track/module/lesson.
- Beginners follow tracks 00–15 before advanced engineering. Experienced developers may test out of prerequisite tracks.
- Tracks 24–26 are elective specializations; track 27 is the cross-stack capstone.
- Durations in JSON are *planning estimates*, not evidence of tested completion time.

## Learning paths

1. **Complete full-stack engineer:** 00–23 → 27; select electives 24–26.
2. **Frontend specialist:** 00–09 → 19, 21, 22 → capstone web work.
3. **Backend specialist:** 00, 03–05, 10–23 → capstone API work.
4. **Platform/SRE:** 00–05, 10–13, 15–16, 19–23 → production gate.
5. **Mobile/desktop:** 00–09, 10–15, 24 → mobile/desktop capstone.

## Complete topic-by-topic index

### Track 00 — Orientation & Computing Foundations

**Level:** Beginner. **Outcome:** Understand the internet, execution environments, tooling and learning workflow. **Official reference:** https://developer.mozilla.org/en-US/docs/Learn_web_development

#### 00.01 — Computing & Internet Mental Models

- **00.01.01** What runs in a browser vs on a server · lesson · 18 min target
- **00.01.02** Client server lifecycle · lesson · 18 min target
- **00.01.03** DNS domains and IP addresses · lesson · 18 min target
- **00.01.04** TCP TLS and HTTPS · lesson · 18 min target
- **00.01.05** HTTP requests and responses · lesson · 18 min target
- **00.01.06** APIs and JSON · lesson · 18 min target
- **00.01.07** Cookies sessions and storage · lesson · 18 min target
- **00.01.08** Exercise trace a request using DevTools · lesson · 18 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 00.02 — Developer Toolchain

- **00.02.01** VS Code workspace and extensions · lesson · 18 min target
- **00.02.02** Terminal PowerShell Bash and WSL2 · lesson · 18 min target
- **00.02.03** Node.js runtime vs browser engine · lesson · 18 min target
- **00.02.04** npm pnpm and lockfiles · lesson · 18 min target
- **00.02.05** Project scripts and reproducible installs · lesson · 18 min target
- **00.02.06** Environment variables and dotenv · lesson · 18 min target
- **00.02.07** Git setup and SSH · lesson · 18 min target
- **00.02.08** Lab build a reproducible workstation · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 00.03 — Learning & Debugging Process

- **00.03.01** Read error messages from bottom up · lesson · 18 min target
- **00.03.02** Reproduce minimize and isolate bugs · lesson · 18 min target
- **00.03.03** Debugger breakpoints and watches · debug · 30 min target
- **00.03.04** Console network and performance panels · lesson · 18 min target
- **00.03.05** Asking good technical questions · lesson · 18 min target
- **00.03.06** Reading changelogs and docs · lesson · 18 min target
- **00.03.07** Experiment logs and architecture notes · lesson · 18 min target
- **00.03.08** Bug Hunt environment mismatch · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 01 — HTML & Web Platform

**Level:** Beginner. **Outcome:** Write semantic, accessible and browser-correct applications. **Official reference:** https://developer.mozilla.org/en-US/docs/Web/HTML

#### 01.01 — Document Structure

- **01.01.01** HTML document anatomy · lesson · 18 min target
- **01.01.02** Head and metadata · lesson · 18 min target
- **01.01.03** Semantic landmarks · lesson · 18 min target
- **01.01.04** Heading hierarchy · lesson · 18 min target
- **01.01.05** Text lists and quotations · lesson · 18 min target
- **01.01.06** Links and navigation · lesson · 18 min target
- **01.01.07** Images and responsive media · lesson · 18 min target
- **01.01.08** Lab accessible content page · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 01.02 — Forms & Native Browser Features

- **01.02.01** Labels controls and fieldsets · lesson · 18 min target
- **01.02.02** Input types and validation · lesson · 18 min target
- **01.02.03** Buttons and form submissions · lesson · 18 min target
- **01.02.04** Progressive enhancement · lesson · 18 min target
- **01.02.05** File inputs · lesson · 18 min target
- **01.02.06** Dialog popover and details · lesson · 18 min target
- **01.02.07** Native events and default behavior · lesson · 18 min target
- **01.02.08** Bug Hunt inaccessible form · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 01.03 — Accessibility Foundations

- **01.03.01** Keyboard-first navigation · lesson · 18 min target
- **01.03.02** Focus management · lesson · 18 min target
- **01.03.03** Screen reader semantics · lesson · 18 min target
- **01.03.04** WCAG principles · lesson · 18 min target
- **01.03.05** Color contrast · lesson · 18 min target
- **01.03.06** Accessible names and descriptions · lesson · 18 min target
- **01.03.07** Images and alternative text · lesson · 18 min target
- **01.03.08** Reduced motion · lesson · 18 min target
- **01.03.09** Lab keyboard audit · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 01.04 — Web APIs & Security

- **01.04.01** DOM and rendering tree · lesson · 18 min target
- **01.04.02** Fetch API and JSON · lesson · 18 min target
- **01.04.03** URL and URLSearchParams · lesson · 18 min target
- **01.04.04** Web Storage and cookies · lesson · 18 min target
- **01.04.05** Permissions and clipboard · lesson · 18 min target
- **01.04.06** Same-origin policy and CORS · lesson · 18 min target
- **01.04.07** CSP and browser isolation · lesson · 18 min target
- **01.04.08** Lab DevTools request investigation · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 02 — CSS Mastery & Responsive Design

**Level:** Beginner. **Outcome:** Build precise, resilient and high-performance interfaces. **Official reference:** https://developer.mozilla.org/en-US/docs/Web/CSS

#### 02.01 — CSS Fundamentals

- **02.01.01** Selectors and combinators · lesson · 18 min target
- **02.01.02** Cascade specificity and inheritance · lesson · 18 min target
- **02.01.03** Cascade layers · lesson · 18 min target
- **02.01.04** Box model and sizing · lesson · 18 min target
- **02.01.05** Units and typography · lesson · 18 min target
- **02.01.06** Logical properties · lesson · 18 min target
- **02.01.07** Pseudo classes and states · lesson · 18 min target
- **02.01.08** Lab responsive content card · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 02.02 — Layout Engineering

- **02.02.01** Flexbox mental model · lesson · 18 min target
- **02.02.02** CSS Grid tracks and areas · lesson · 18 min target
- **02.02.03** Intrinsic sizing min max clamp · lesson · 18 min target
- **02.02.04** Positioning and stacking contexts · lesson · 18 min target
- **02.02.05** Overflow and scroll containers · lesson · 18 min target
- **02.02.06** Container queries · lesson · 18 min target
- **02.02.07** Responsive breakpoints · lesson · 18 min target
- **02.02.08** Bug Hunt broken sticky sidebar · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 02.03 — Modern CSS & Design Systems

- **02.03.01** Custom properties and theme tokens · lesson · 18 min target
- **02.03.02** Color spaces and contrast · lesson · 18 min target
- **02.03.03** Dark mode and color schemes · lesson · 18 min target
- **02.03.04** Transitions and keyframes · lesson · 18 min target
- **02.03.05** CSS nesting · lesson · 18 min target
- **02.03.06** Modern selectors including has · lesson · 18 min target
- **02.03.07** Component-scoped CSS · lesson · 18 min target
- **02.03.08** Lab themed component kit · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 02.04 — Performance & Accessibility

- **02.04.01** Layout paint and composition · lesson · 18 min target
- **02.04.02** Avoiding expensive selectors · lesson · 18 min target
- **02.04.03** GPU-friendly transitions · lesson · 18 min target
- **02.04.04** Font loading and CLS · lesson · 18 min target
- **02.04.05** Scroll animations and motion preferences · lesson · 18 min target
- **02.04.06** CSS audit with DevTools · lesson · 18 min target
- **02.04.07** Visual regression basics · lesson · 18 min target
- **02.04.08** Lab 100 point UI QA · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 03 — JavaScript Deep Foundations

**Level:** Beginner. **Outcome:** Understand core JavaScript before adding frameworks. **Official reference:** https://developer.mozilla.org/en-US/docs/Web/JavaScript

#### 03.01 — Language Essentials

- **03.01.01** let const and scope · lesson · 18 min target
- **03.01.02** Primitive types and coercion · lesson · 18 min target
- **03.01.03** Equality and truthiness · lesson · 18 min target
- **03.01.04** Control flow · lesson · 18 min target
- **03.01.05** Functions and closures · lesson · 18 min target
- **03.01.06** Arrays and objects · lesson · 18 min target
- **03.01.07** Destructuring and spread · lesson · 18 min target
- **03.01.08** Lab data transformer · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 03.02 — Intermediate JavaScript

- **03.02.01** Iterators and generators · lesson · 18 min target
- **03.02.02** Map Set WeakMap WeakSet · lesson · 18 min target
- **03.02.03** Prototypes and classes · lesson · 18 min target
- **03.02.04** this binding · lesson · 18 min target
- **03.02.05** Modules and exports · lesson · 18 min target
- **03.02.06** Error handling · lesson · 18 min target
- **03.02.07** Immutability and object copying · lesson · 18 min target
- **03.02.08** Bug Hunt shared mutable state · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 03.03 — Asynchrony & Runtime

- **03.03.01** Call stack and event loop · lesson · 18 min target
- **03.03.02** Microtasks and macrotasks · lesson · 18 min target
- **03.03.03** Promises and async await · lesson · 18 min target
- **03.03.04** Promise.all and allSettled · lesson · 18 min target
- **03.03.05** AbortController and cancellation · lesson · 18 min target
- **03.03.06** Fetch timeouts and retries · lesson · 18 min target
- **03.03.07** Race conditions · lesson · 18 min target
- **03.03.08** Lab resilient fetch client · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 03.04 — Browser Interaction

- **03.04.01** DOM selection and events · lesson · 18 min target
- **03.04.02** Event delegation · lesson · 18 min target
- **03.04.03** Forms and validation · lesson · 18 min target
- **03.04.04** URL state and History API · lesson · 18 min target
- **03.04.05** LocalStorage and IndexedDB · lesson · 18 min target
- **03.04.06** Browser performance profiling · lesson · 18 min target
- **03.04.07** Security of innerHTML · lesson · 18 min target
- **03.04.08** Lab accessible interactive widget · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 04 — TypeScript & Type-System Design

**Level:** Beginner. **Outcome:** Model domains and build strict, maintainable TypeScript. **Official reference:** https://www.typescriptlang.org/docs/

#### 04.01 — Language Foundations

- **04.01.01** Setup and strict tsconfig · lesson · 18 min target
- **04.01.02** Type inference and annotations · lesson · 18 min target
- **04.01.03** Union intersection and literal types · lesson · 18 min target
- **04.01.04** Interfaces vs type aliases · lesson · 18 min target
- **04.01.05** Optional nullable and undefined · lesson · 18 min target
- **04.01.06** Narrowing and type guards · lesson · 18 min target
- **04.01.07** Functions and overloads · lesson · 18 min target
- **04.01.08** Lab typed task model · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 04.02 — Advanced Types

- **04.02.01** Generics and constraints · lesson · 18 min target
- **04.02.02** keyof indexed access and typeof · lesson · 18 min target
- **04.02.03** Mapped types · lesson · 18 min target
- **04.02.04** Conditional types and infer · lesson · 18 min target
- **04.02.05** Discriminated unions · lesson · 18 min target
- **04.02.06** Utility types · lesson · 18 min target
- **04.02.07** Template literal types · lesson · 18 min target
- **04.02.08** Bug Hunt unsafe type assertions · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 04.03 — Runtime Boundaries

- **04.03.01** Compile-time types vs runtime values · lesson · 18 min target
- **04.03.02** Parsing unknown data · lesson · 18 min target
- **04.03.03** Type-safe errors · lesson · 18 min target
- **04.03.04** Branded IDs · lesson · 18 min target
- **04.03.05** Serialization boundaries · lesson · 18 min target
- **04.03.06** DTOs vs domain types · lesson · 18 min target
- **04.03.07** Type testing with tsd · lesson · 18 min target
- **04.03.08** Lab schema-first API data · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 04.04 — Maintainable TS Projects

- **04.04.01** tsconfig references and module resolution · lesson · 18 min target
- **04.04.02** ESM and CommonJS · lesson · 18 min target
- **04.04.03** Import organization · lesson · 18 min target
- **04.04.04** Public package API design · lesson · 18 min target
- **04.04.05** TypeScript project references · lesson · 18 min target
- **04.04.06** ESLint rules · lesson · 18 min target
- **04.04.07** Declaration generation · lesson · 18 min target
- **04.04.08** Lab typed package release · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 05 — Git, Collaboration & Monorepos

**Level:** Beginner. **Outcome:** Manage source changes and reproducible development. **Official reference:** https://git-scm.com/docs

#### 05.01 — Everyday Git

- **05.01.01** init clone status add commit · lesson · 18 min target
- **05.01.02** Branches merge and rebase · lesson · 18 min target
- **05.01.03** Reset restore and revert · lesson · 18 min target
- **05.01.04** Remote repositories and push · lesson · 18 min target
- **05.01.05** Pull requests and code review · lesson · 18 min target
- **05.01.06** Resolve merge conflicts · lesson · 18 min target
- **05.01.07** Gitignore and secrets · lesson · 18 min target
- **05.01.08** Lab tracked feature change · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 05.02 — Team Engineering

- **05.02.01** Trunk-based development · lesson · 18 min target
- **05.02.02** Commit message conventions · lesson · 18 min target
- **05.02.03** Code ownership · lesson · 18 min target
- **05.02.04** Review comments and rationale · lesson · 18 min target
- **05.02.05** CI status checks · lesson · 18 min target
- **05.02.06** Semantic versioning · lesson · 18 min target
- **05.02.07** Changelogs and releases · lesson · 18 min target
- **05.02.08** Bug Hunt accidental secret commit · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 05.03 — pnpm & Turborepo

- **05.03.01** pnpm workspace layout · lesson · 18 min target
- **05.03.02** Package boundaries and exports · lesson · 18 min target
- **05.03.03** Shared TS config · lesson · 18 min target
- **05.03.04** Task orchestration · lesson · 18 min target
- **05.03.05** Build graph and cache · lesson · 18 min target
- **05.03.06** Lockfile discipline · lesson · 18 min target
- **05.03.07** Dependency upgrades · lesson · 18 min target
- **05.03.08** Lab web API shared contracts monorepo · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 06 — React Fundamentals & Mental Models

**Level:** Beginner. **Outcome:** Use React 19 without fragile component patterns. **Official reference:** https://react.dev/learn

#### 06.01 — Elements & Components

- **06.01.01** JSX and automatic transform · lesson · 18 min target
- **06.01.02** Components and props · lesson · 18 min target
- **06.01.03** Composition and children · lesson · 18 min target
- **06.01.04** Conditional rendering · lesson · 18 min target
- **06.01.05** Lists keys and identity · lesson · 18 min target
- **06.01.06** Rendering vs DOM commits · lesson · 18 min target
- **06.01.07** Event handlers · lesson · 18 min target
- **06.01.08** Lab profile dashboard card · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 06.02 — State & Lifecycle

- **06.02.01** useState state snapshots · lesson · 18 min target
- **06.02.02** Batching and functional updates · lesson · 18 min target
- **06.02.03** Derived state vs duplicated state · lesson · 18 min target
- **06.02.04** Updating arrays and objects · lesson · 18 min target
- **06.02.05** Component state preservation · lesson · 18 min target
- **06.02.06** Lifting state up · lesson · 18 min target
- **06.02.07** Reducers and state machines · lesson · 18 min target
- **06.02.08** Bug Hunt stale closure · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 06.03 — Effects & Refs

- **06.03.01** Render purity · lesson · 18 min target
- **06.03.02** useEffect external synchronization · lesson · 18 min target
- **06.03.03** Effect cleanup · lesson · 18 min target
- **06.03.04** Dependency management · lesson · 18 min target
- **06.03.05** useRef mutable values · lesson · 18 min target
- **06.03.06** DOM refs and focus · lesson · 18 min target
- **06.03.07** Avoiding unnecessary Effects · lesson · 18 min target
- **06.03.08** Lab reliable timer and keyboard shortcut · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 06.04 — Advanced React 19

- **06.04.01** Context and providers · lesson · 18 min target
- **06.04.02** Custom hooks · lesson · 18 min target
- **06.04.03** useTransition and responsive UX · lesson · 18 min target
- **06.04.04** useDeferredValue · lesson · 18 min target
- **06.04.05** useOptimistic · lesson · 18 min target
- **06.04.06** useActionState · lesson · 18 min target
- **06.04.07** Error boundaries and Suspense · lesson · 18 min target
- **06.04.08** Lab optimistic comments · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 06.05 — Testing & Performance

- **06.05.01** React Testing Library · lesson · 18 min target
- **06.05.02** Accessible queries · lesson · 18 min target
- **06.05.03** Test user journeys · lesson · 18 min target
- **06.05.04** React DevTools profiler · lesson · 18 min target
- **06.05.05** React.memo when warranted · lesson · 18 min target
- **06.05.06** useMemo and useCallback tradeoffs · lesson · 18 min target
- **06.05.07** Concurrent rendering mental model · lesson · 18 min target
- **06.05.08** Bug Hunt unstable keys · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 07 — Next.js App Router & SEO

**Level:** Intermediate. **Outcome:** Build server-rendered, secure and fast React applications. **Official reference:** https://nextjs.org/docs/app

#### 07.01 — App Router Fundamentals

- **07.01.01** Project structure and route segments · lesson · 18 min target
- **07.01.02** Layouts pages and templates · lesson · 18 min target
- **07.01.03** Dynamic route params · lesson · 18 min target
- **07.01.04** Loading and error boundaries · lesson · 18 min target
- **07.01.05** Not-found and redirects · lesson · 18 min target
- **07.01.06** Navigation and prefetch · lesson · 18 min target
- **07.01.07** Metadata and favicons · lesson · 18 min target
- **07.01.08** Lab public site · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 07.02 — Server & Client Architecture

- **07.02.01** Server vs Client Components · lesson · 18 min target
- **07.02.02** RSC request lifecycle · lesson · 18 min target
- **07.02.03** Serialization boundaries · lesson · 18 min target
- **07.02.04** Server Actions and mutations · lesson · 18 min target
- **07.02.05** Route handlers and BFF · lesson · 18 min target
- **07.02.06** Suspense streaming · lesson · 18 min target
- **07.02.07** Secret handling and server-only · lesson · 18 min target
- **07.02.08** Bug Hunt accidental client import · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 07.03 — Data & Caching

- **07.03.01** Fetch behavior in Next.js 16 · lesson · 18 min target
- **07.03.02** Explicit cache boundaries · lesson · 18 min target
- **07.03.03** use cache and cache tags · lesson · 18 min target
- **07.03.04** Revalidation and invalidation · lesson · 18 min target
- **07.03.05** Private data and cache risks · lesson · 18 min target
- **07.03.06** ISR vs SSR vs static · lesson · 18 min target
- **07.03.07** Cache debugging · lesson · 18 min target
- **07.03.08** Lab publish and revalidate · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 07.04 — SEO & Web Performance

- **07.04.01** Semantic metadata · lesson · 18 min target
- **07.04.02** Canonical and Open Graph · lesson · 18 min target
- **07.04.03** Sitemap and robots · lesson · 18 min target
- **07.04.04** JSON-LD and structured data · lesson · 18 min target
- **07.04.05** Images fonts and LCP · lesson · 18 min target
- **07.04.06** Core Web Vitals · lesson · 18 min target
- **07.04.07** Content architecture for discoverability · lesson · 18 min target
- **07.04.08** Lab SEO audit · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 07.05 — Deployment & Hardening

- **07.05.01** Environment separation · lesson · 18 min target
- **07.05.02** Reverse proxy and headers · lesson · 18 min target
- **07.05.03** Image and asset optimization · lesson · 18 min target
- **07.05.04** Edge vs Node runtime · lesson · 18 min target
- **07.05.05** Error tracking · lesson · 18 min target
- **07.05.06** Build and runtime diagnostics · lesson · 18 min target
- **07.05.07** Upgrade and migration checks · lesson · 18 min target
- **07.05.08** Bug Hunt auth cache leak · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 08 — UI Systems, Accessibility & UX

**Level:** Intermediate. **Outcome:** Build consistent production-quality design systems. **Official reference:** https://www.w3.org/WAI/standards-guidelines/wcag/

#### 08.01 — Tailwind & shadcn/ui

- **08.01.01** Tailwind v4 configuration · lesson · 18 min target
- **08.01.02** CSS-first tokens · lesson · 18 min target
- **08.01.03** Radix primitives · lesson · 18 min target
- **08.01.04** shadcn composition · lesson · 18 min target
- **08.01.05** Variant patterns and class merging · lesson · 18 min target
- **08.01.06** Theme providers and contrast · lesson · 18 min target
- **08.01.07** Responsive navigation · lesson · 18 min target
- **08.01.08** Lab component gallery · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 08.02 — Advanced Interaction

- **08.02.01** Motion animation primitives · lesson · 18 min target
- **08.02.02** Accessible modal dialog · lesson · 18 min target
- **08.02.03** Combobox and listbox · lesson · 18 min target
- **08.02.04** Keyboard focus traps · lesson · 18 min target
- **08.02.05** Toasts and announcements · lesson · 18 min target
- **08.02.06** Drag and drop · lesson · 18 min target
- **08.02.07** Responsive charts · lesson · 18 min target
- **08.02.08** Bug Hunt inaccessible dropdown · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 08.03 — Professional Data Interfaces

- **08.03.01** TanStack Table columns · lesson · 18 min target
- **08.03.02** Controlled sorting filtering pagination · lesson · 18 min target
- **08.03.03** Virtualized lists · lesson · 18 min target
- **08.03.04** Dense tables and mobile alternatives · lesson · 18 min target
- **08.03.05** Loading empty and error states · lesson · 18 min target
- **08.03.06** Optimistic table interactions · lesson · 18 min target
- **08.03.07** Export and print UX · lesson · 18 min target
- **08.03.08** Lab operational console · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 08.04 — Design QA

- **08.04.01** Visual hierarchy and spacing · lesson · 18 min target
- **08.04.02** Color and typography systems · lesson · 18 min target
- **08.04.03** Form accessibility · lesson · 18 min target
- **08.04.04** Usability heuristics · lesson · 18 min target
- **08.04.05** Reduced motion testing · lesson · 18 min target
- **08.04.06** Cross-browser testing · lesson · 18 min target
- **08.04.07** CLS and layout stability · lesson · 18 min target
- **08.04.08** Lab annotated UX review · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 09 — Forms, Zod & UI State

**Level:** Intermediate. **Outcome:** Safely collect data and coordinate frontend state. **Official reference:** https://zod.dev/

#### 09.01 — Zod Schema Design

- **09.01.01** Objects primitives enums and literals · lesson · 18 min target
- **09.01.02** safeParse and error paths · lesson · 18 min target
- **09.01.03** Optional nullable defaults · lesson · 18 min target
- **09.01.04** refine and superRefine · lesson · 18 min target
- **09.01.05** transform and coercion · lesson · 18 min target
- **09.01.06** Discriminated unions · lesson · 18 min target
- **09.01.07** Schema composition and inference · lesson · 18 min target
- **09.01.08** Lab validated profile form · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 09.02 — React Hook Form

- **09.02.01** Controlled vs uncontrolled inputs · lesson · 18 min target
- **09.02.02** Register and Controller · lesson · 18 min target
- **09.02.03** Zod resolvers · lesson · 18 min target
- **09.02.04** Dynamic field arrays · lesson · 18 min target
- **09.02.05** Async submissions · lesson · 18 min target
- **09.02.06** Reset and dirty state · lesson · 18 min target
- **09.02.07** Server errors and focus · lesson · 18 min target
- **09.02.08** Bug Hunt mismatched form state · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 09.03 — TanStack Query

- **09.03.01** Query keys and caching · lesson · 18 min target
- **09.03.02** Stale time and garbage collection · lesson · 18 min target
- **09.03.03** Mutations and invalidation · lesson · 18 min target
- **09.03.04** Optimistic updates and rollback · lesson · 18 min target
- **09.03.05** Infinite queries · lesson · 18 min target
- **09.03.06** Suspense and SSR hydration · lesson · 18 min target
- **09.03.07** Retries and cancellation · lesson · 18 min target
- **09.03.08** Lab remote task list · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 09.04 — Zustand & State Boundaries

- **09.04.01** Local vs URL vs server state · lesson · 18 min target
- **09.04.02** Zustand selectors and slices · lesson · 18 min target
- **09.04.03** Persistence risks · lesson · 18 min target
- **09.04.04** Derived state and store subscriptions · lesson · 18 min target
- **09.04.05** Multi-tab state coordination · lesson · 18 min target
- **09.04.06** URLSearchParams as state · lesson · 18 min target
- **09.04.07** Avoiding duplicated caches · lesson · 18 min target
- **09.04.08** Lab filters and preferences · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 10 — Node.js, HTTP & API Design

**Level:** Intermediate. **Outcome:** Understand servers and design consistent public contracts. **Official reference:** https://nodejs.org/learn

#### 10.01 — Node Runtime

- **10.01.01** Event loop I O and worker threads · lesson · 18 min target
- **10.01.02** process env and signals · lesson · 18 min target
- **10.01.03** Node streams and buffers · lesson · 18 min target
- **10.01.04** Fetch and AbortSignal · lesson · 18 min target
- **10.01.05** File system safety · lesson · 18 min target
- **10.01.06** Memory and CPU profiling · lesson · 18 min target
- **10.01.07** Process lifecycle · lesson · 18 min target
- **10.01.08** Lab streaming upload · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 10.02 — HTTP API Fundamentals

- **10.02.01** Verbs and status codes · lesson · 18 min target
- **10.02.02** Headers and content negotiation · lesson · 18 min target
- **10.02.03** JSON serialization · lesson · 18 min target
- **10.02.04** Idempotency and retries · lesson · 18 min target
- **10.02.05** Filtering sorting pagination · lesson · 18 min target
- **10.02.06** Error envelopes and RFC 9457 · lesson · 18 min target
- **10.02.07** ETags and caching · lesson · 18 min target
- **10.02.08** Lab REST contract · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 10.03 — Security Boundaries

- **10.03.01** TLS and reverse proxies · lesson · 18 min target
- **10.03.02** CORS vs CSRF · lesson · 18 min target
- **10.03.03** Cookies vs bearer tokens · lesson · 18 min target
- **10.03.04** Rate limiting and abuse controls · lesson · 18 min target
- **10.03.05** Request body and file limits · lesson · 18 min target
- **10.03.06** Server side request forgery · lesson · 18 min target
- **10.03.07** Sensitive data redaction · lesson · 18 min target
- **10.03.08** Bug Hunt insecure endpoint · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 10.04 — OpenAPI & SDKs

- **10.04.01** OpenAPI 3.1 structure · lesson · 18 min target
- **10.04.02** Request response contracts · lesson · 18 min target
- **10.04.03** Security schemes · lesson · 18 min target
- **10.04.04** Examples and operation IDs · lesson · 18 min target
- **10.04.05** Client code generation · lesson · 18 min target
- **10.04.06** Contract compatibility · lesson · 18 min target
- **10.04.07** API version strategy · lesson · 18 min target
- **10.04.08** Lab generated client · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 11 — NestJS & Fastify Backend

**Level:** Intermediate. **Outcome:** Build reliable modular business applications. **Official reference:** https://docs.nestjs.com/

#### 11.01 — Nest Architecture

- **11.01.01** Bootstrap and module graph · lesson · 18 min target
- **11.01.02** Controllers and routing · lesson · 18 min target
- **11.01.03** Injectable providers · lesson · 18 min target
- **11.01.04** Dependency injection scopes · lesson · 18 min target
- **11.01.05** Config and env validation · lesson · 18 min target
- **11.01.06** Fastify adapter · lesson · 18 min target
- **11.01.07** Lifecycle hooks · lesson · 18 min target
- **11.01.08** Lab hello API · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 11.02 — Request Pipeline

- **11.02.01** Middleware execution · lesson · 18 min target
- **11.02.02** Pipes and Zod validation · lesson · 18 min target
- **11.02.03** Guards and authorization · lesson · 18 min target
- **11.02.04** Interceptors and tracing · lesson · 18 min target
- **11.02.05** Exception filters · lesson · 18 min target
- **11.02.06** Structured responses · lesson · 18 min target
- **11.02.07** Request context · lesson · 18 min target
- **11.02.08** Bug Hunt guard order · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 11.03 — Domain Modules

- **11.03.01** Service responsibilities · lesson · 18 min target
- **11.03.02** Repository pattern · lesson · 18 min target
- **11.03.03** Domain entities vs DTOs · lesson · 18 min target
- **11.03.04** Dependency inversion · lesson · 18 min target
- **11.03.05** Cross-module boundaries · lesson · 18 min target
- **11.03.06** Application transactions · lesson · 18 min target
- **11.03.07** Domain events · lesson · 18 min target
- **11.03.08** Lab reusable project module · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 11.04 — Advanced Nest

- **11.04.01** Custom providers and tokens · lesson · 18 min target
- **11.04.02** Async module configuration · lesson · 18 min target
- **11.04.03** WebSocket gateways · lesson · 18 min target
- **11.04.04** Lifecycle graceful shutdown · lesson · 18 min target
- **11.04.05** Testing modules and overrides · lesson · 18 min target
- **11.04.06** Caching and interceptors · lesson · 18 min target
- **11.04.07** Health endpoints · lesson · 18 min target
- **11.04.08** Lab production service skeleton · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 12 — PostgreSQL & Data Engineering Basics

**Level:** Intermediate. **Outcome:** Model data, transactions and query performance. **Official reference:** https://www.postgresql.org/docs/

#### 12.01 — SQL Essentials

- **12.01.01** Tables rows columns and types · lesson · 18 min target
- **12.01.02** SELECT WHERE ORDER BY · lesson · 18 min target
- **12.01.03** JOINs · lesson · 18 min target
- **12.01.04** GROUP BY and aggregates · lesson · 18 min target
- **12.01.05** Foreign keys and constraints · lesson · 18 min target
- **12.01.06** NULL and three-valued logic · lesson · 18 min target
- **12.01.07** CTEs and subqueries · lesson · 18 min target
- **12.01.08** Lab query workbook · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 12.02 — Relational Modeling

- **12.02.01** Normalization and denormalization · lesson · 18 min target
- **12.02.02** Primary and surrogate keys · lesson · 18 min target
- **12.02.03** Many-to-many relationships · lesson · 18 min target
- **12.02.04** Multi-tenant data models · lesson · 18 min target
- **12.02.05** Soft delete and history · lesson · 18 min target
- **12.02.06** Check and unique constraints · lesson · 18 min target
- **12.02.07** Audit tables · lesson · 18 min target
- **12.02.08** Bug Hunt missing tenant filter · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 12.03 — Transactions & Concurrency

- **12.03.01** ACID and isolation levels · lesson · 18 min target
- **12.03.02** Locking and deadlocks · lesson · 18 min target
- **12.03.03** MVCC · lesson · 18 min target
- **12.03.04** Optimistic concurrency · lesson · 18 min target
- **12.03.05** Idempotency records · lesson · 18 min target
- **12.03.06** Unique race protections · lesson · 18 min target
- **12.03.07** Transaction boundaries · lesson · 18 min target
- **12.03.08** Lab concurrent update simulation · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 12.04 — Query Performance

- **12.04.01** EXPLAIN ANALYZE · lesson · 18 min target
- **12.04.02** B tree and composite indexes · lesson · 18 min target
- **12.04.03** Partial and covering indexes · lesson · 18 min target
- **12.04.04** Keyset pagination · lesson · 18 min target
- **12.04.05** N plus one queries · lesson · 18 min target
- **12.04.06** Pooling and connection limits · lesson · 18 min target
- **12.04.07** Vacuum and maintenance · lesson · 18 min target
- **12.04.08** Lab profile slow query · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 12.05 — Operations & Recovery

- **12.05.01** Backups and PITR concepts · lesson · 18 min target
- **12.05.02** Replication and replicas · lesson · 18 min target
- **12.05.03** Schema migration safety · lesson · 18 min target
- **12.05.04** Environment isolation · lesson · 18 min target
- **12.05.05** Roles and least privilege · lesson · 18 min target
- **12.05.06** Connection pooler configuration · lesson · 18 min target
- **12.05.07** Restore drills · lesson · 18 min target
- **12.05.08** Lab recover sample database · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 13 — Prisma ORM 7 & Persistence

**Level:** Intermediate. **Outcome:** Use typed ORM access without hiding SQL correctness. **Official reference:** https://www.prisma.io/docs/orm/v7

#### 13.01 — Prisma Setup

- **13.01.01** Prisma schema language · lesson · 18 min target
- **13.01.02** Models relations and enums · lesson · 18 min target
- **13.01.03** Prisma Client generation · lesson · 18 min target
- **13.01.04** Prisma 7 driver adapters · lesson · 18 min target
- **13.01.05** Environment configuration · lesson · 18 min target
- **13.01.06** Migrate development vs deploy · lesson · 18 min target
- **13.01.07** Seed strategies · lesson · 18 min target
- **13.01.08** Lab connect to Postgres · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 13.02 — Reading & Writing Data

- **13.02.01** findMany findUnique and filters · lesson · 18 min target
- **13.02.02** select include and relation loading · lesson · 18 min target
- **13.02.03** Create update delete · lesson · 18 min target
- **13.02.04** Transactions and isolation · lesson · 18 min target
- **13.02.05** Pagination and ordering · lesson · 18 min target
- **13.02.06** Error handling and constraint failures · lesson · 18 min target
- **13.02.07** Avoiding N plus one · lesson · 18 min target
- **13.02.08** Lab repository API · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 13.03 — Advanced Persistence

- **13.03.01** Raw SQL escape hatches · lesson · 18 min target
- **13.03.02** Connection pooling · lesson · 18 min target
- **13.03.03** Prisma migration histories · lesson · 18 min target
- **13.03.04** Expand-contract changes · lesson · 18 min target
- **13.03.05** Multi-schema considerations · lesson · 18 min target
- **13.03.06** Query logging and tracing · lesson · 18 min target
- **13.03.07** Typed repository interfaces · lesson · 18 min target
- **13.03.08** Bug Hunt migration drift · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 13.04 — Supabase Integration

- **13.04.01** Project connection methods · lesson · 18 min target
- **13.04.02** Pooled vs direct connection · lesson · 18 min target
- **13.04.03** Supabase schemas and RLS boundaries · lesson · 18 min target
- **13.04.04** Service database roles · lesson · 18 min target
- **13.04.05** Authorization in NestJS · lesson · 18 min target
- **13.04.06** Migration ownership rules · lesson · 18 min target
- **13.04.07** Testing isolation · lesson · 18 min target
- **13.04.08** Lab cross-tenant security check · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 14 — Supabase Platform & Storage

**Level:** Intermediate. **Outcome:** Understand Supabase as managed infrastructure rather than magic backend. **Official reference:** https://supabase.com/docs

#### 14.01 — Supabase Architecture

- **14.01.01** PostgreSQL Auth Storage and Realtime · lesson · 18 min target
- **14.01.02** Project environments · lesson · 18 min target
- **14.01.03** Client vs server keys · lesson · 18 min target
- **14.01.04** SQL editor vs migrations · lesson · 18 min target
- **14.01.05** Exposed schemas · lesson · 18 min target
- **14.01.06** Network and pooling · lesson · 18 min target
- **14.01.07** Free tier vs production operations · lesson · 18 min target
- **14.01.08** Lab local development · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 14.02 — Auth & Identity

- **14.02.01** Sign up sign in and verification · lesson · 18 min target
- **14.02.02** Next.js SSR cookies · lesson · 18 min target
- **14.02.03** OAuth and PKCE · lesson · 18 min target
- **14.02.04** MFA and recovery · lesson · 18 min target
- **14.02.05** Email templates and redirect URLs · lesson · 18 min target
- **14.02.06** JWT claims and JWKS · lesson · 18 min target
- **14.02.07** Secure sign-out and session refresh · lesson · 18 min target
- **14.02.08** Lab safe login flow · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 14.03 — RLS & Authorization

- **14.03.01** RLS policy mechanics · lesson · 18 min target
- **14.03.02** auth.uid and roles · lesson · 18 min target
- **14.03.03** Policy tests · lesson · 18 min target
- **14.03.04** Privileged Prisma access risks · lesson · 18 min target
- **14.03.05** Bucket RLS and signed URLs · lesson · 18 min target
- **14.03.06** Secure service-role operations · lesson · 18 min target
- **14.03.07** Tenant isolation · lesson · 18 min target
- **14.03.08** Bug Hunt cross-tenant read · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 14.04 — Storage & Realtime

- **14.04.01** Buckets public vs private · lesson · 18 min target
- **14.04.02** Signed upload URLs · lesson · 18 min target
- **14.04.03** Content type and size validation · lesson · 18 min target
- **14.04.04** Realtime channel authorization · lesson · 18 min target
- **14.04.05** Postgres change subscriptions · lesson · 18 min target
- **14.04.06** Presence and broadcast · lesson · 18 min target
- **14.04.07** Webhook-triggered processing · lesson · 18 min target
- **14.04.08** Lab safe document upload · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 15 — Security & Enterprise Identity

**Level:** Advanced. **Outcome:** Design defensible systems with threat models and tested controls. **Official reference:** https://owasp.org/projects/asvs

#### 15.01 — Applied Security Foundations

- **15.01.01** Threat modeling STRIDE · lesson · 18 min target
- **15.01.02** Authentication vs authorization · lesson · 18 min target
- **15.01.03** OWASP ASVS control mapping · lesson · 18 min target
- **15.01.04** Trust boundaries and assets · lesson · 18 min target
- **15.01.05** Secure defaults · lesson · 18 min target
- **15.01.06** Secrets management · lesson · 18 min target
- **15.01.07** Data classification · lesson · 18 min target
- **15.01.08** Lab threat model · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 15.02 — Identity & Permissions

- **15.02.01** RBAC and permission matrices · lesson · 18 min target
- **15.02.02** ABAC and policy evaluation · lesson · 18 min target
- **15.02.03** Object-level authorization · lesson · 18 min target
- **15.02.04** Multi-tenant access checks · lesson · 18 min target
- **15.02.05** OIDC claims verification · lesson · 18 min target
- **15.02.06** SSO SAML overview · lesson · 18 min target
- **15.02.07** SCIM provisioning overview · lesson · 18 min target
- **15.02.08** Bug Hunt IDOR exploitation and fix · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 15.03 — Application Security

- **15.03.01** XSS and output encoding · lesson · 18 min target
- **15.03.02** CSRF and cookie strategies · lesson · 18 min target
- **15.03.03** SQL injection defenses · lesson · 18 min target
- **15.03.04** SSRF outbound policy · lesson · 18 min target
- **15.03.05** File upload threats · lesson · 18 min target
- **15.03.06** Rate limit bypass · lesson · 18 min target
- **15.03.07** Supply chain checks · lesson · 18 min target
- **15.03.08** Lab harden API · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 15.04 — Security Operations

- **15.04.01** Audit log and event integrity · lesson · 18 min target
- **15.04.02** Incident response · lesson · 18 min target
- **15.04.03** Key and token rotation · lesson · 18 min target
- **15.04.04** Dependency patch management · lesson · 18 min target
- **15.04.05** Security headers · lesson · 18 min target
- **15.04.06** Backup access control · lesson · 18 min target
- **15.04.07** Pentest scope and evidence · lesson · 18 min target
- **15.04.08** Lab security release gate · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 16 — Redis, Caching & BullMQ

**Level:** Advanced. **Outcome:** Introduce efficient shared caching and reliable asynchronous jobs. **Official reference:** https://redis.io/docs/latest/

#### 16.01 — Cache Design

- **16.01.01** Why caches exist · lesson · 18 min target
- **16.01.02** Redis types and TTL · lesson · 18 min target
- **16.01.03** Cache-aside pattern · lesson · 18 min target
- **16.01.04** Write-through vs invalidation · lesson · 18 min target
- **16.01.05** Cache stampede prevention · lesson · 18 min target
- **16.01.06** Key design and tenant scoping · lesson · 18 min target
- **16.01.07** Measuring cache hit ratio · lesson · 18 min target
- **16.01.08** Lab cache hot reads · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 16.02 — Redis Operations

- **16.02.01** Connection pooling · lesson · 18 min target
- **16.02.02** Memory eviction policies · lesson · 18 min target
- **16.02.03** Persistence basics · lesson · 18 min target
- **16.02.04** Security and network isolation · lesson · 18 min target
- **16.02.05** Redis cluster overview · lesson · 18 min target
- **16.02.06** Rate limiting tradeoffs · lesson · 18 min target
- **16.02.07** Avoiding hot keys · lesson · 18 min target
- **16.02.08** Bug Hunt stale cache · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 16.03 — BullMQ Fundamentals

- **16.03.01** Producers and consumers · lesson · 18 min target
- **16.03.02** Queue names and payloads · lesson · 18 min target
- **16.03.03** Workers and concurrency · lesson · 18 min target
- **16.03.04** Retries and backoff · lesson · 18 min target
- **16.03.05** Delayed and scheduled jobs · lesson · 18 min target
- **16.03.06** Deduplication and idempotency · lesson · 18 min target
- **16.03.07** Failed jobs and visibility · lesson · 18 min target
- **16.03.08** Lab email dispatch · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 16.04 — Reliable Async Architecture

- **16.04.01** Outbox pattern · lesson · 18 min target
- **16.04.02** At least once delivery · lesson · 18 min target
- **16.04.03** Job status models · lesson · 18 min target
- **16.04.04** Poison jobs and DLQ analogs · lesson · 18 min target
- **16.04.05** Graceful shutdown · lesson · 18 min target
- **16.04.06** Worker scaling · lesson · 18 min target
- **16.04.07** Queue outage recovery · lesson · 18 min target
- **16.04.08** Lab recover failed webhook · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 17 — Realtime, Notifications & Collaboration

**Level:** Advanced. **Outcome:** Build responsive live experiences without compromising consistency. **Official reference:** https://supabase.com/docs/guides/realtime

#### 17.01 — Realtime Models

- **17.01.01** Polling vs SSE vs WebSockets · lesson · 18 min target
- **17.01.02** Event ordering · lesson · 18 min target
- **17.01.03** Subscribe and resume · lesson · 18 min target
- **17.01.04** Authorization for channels · lesson · 18 min target
- **17.01.05** Presence state · lesson · 18 min target
- **17.01.06** Reconnect and backoff · lesson · 18 min target
- **17.01.07** Duplicate event handling · lesson · 18 min target
- **17.01.08** Lab live activity feed · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 17.02 — Notifications

- **17.02.01** In-app notification schema · lesson · 18 min target
- **17.02.02** Read unread and preferences · lesson · 18 min target
- **17.02.03** Email and push delivery · lesson · 18 min target
- **17.02.04** Notification templates · lesson · 18 min target
- **17.02.05** Fan out strategies · lesson · 18 min target
- **17.02.06** Quiet hours and consent · lesson · 18 min target
- **17.02.07** Reliable delivery records · lesson · 18 min target
- **17.02.08** Lab notification center · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 17.03 — Collaboration Patterns

- **17.03.01** Optimistic edits · lesson · 18 min target
- **17.03.02** Version conflicts · lesson · 18 min target
- **17.03.03** Collaborative presence · lesson · 18 min target
- **17.03.04** Yjs CRDT overview · lesson · 18 min target
- **17.03.05** Permissions and shared documents · lesson · 18 min target
- **17.03.06** Conflict resolution UX · lesson · 18 min target
- **17.03.07** Offline reconnection · lesson · 18 min target
- **17.03.08** Lab collaborative notes prototype · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 18 — Files, Email, Search & Integrations

**Level:** Advanced. **Outcome:** Implement common platform features safely. **Official reference:** https://supabase.com/docs/guides/storage

#### 18.01 — File Processing

- **18.01.01** Upload validation · lesson · 18 min target
- **18.01.02** MIME sniffing and extensions · lesson · 18 min target
- **18.01.03** Signed upload and download · lesson · 18 min target
- **18.01.04** Private access boundaries · lesson · 18 min target
- **18.01.05** Image resizing · lesson · 18 min target
- **18.01.06** Malware scanning options · lesson · 18 min target
- **18.01.07** Background processing · lesson · 18 min target
- **18.01.08** Lab asset pipeline · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 18.02 — Email & Messaging

- **18.02.01** Transactional vs marketing email · lesson · 18 min target
- **18.02.02** React Email templates · lesson · 18 min target
- **18.02.03** Delivery provider adapters · lesson · 18 min target
- **18.02.04** Webhooks and bounce tracking · lesson · 18 min target
- **18.02.05** SPF DKIM DMARC · lesson · 18 min target
- **18.02.06** Idempotent sending · lesson · 18 min target
- **18.02.07** Rate limits and retries · lesson · 18 min target
- **18.02.08** Lab verified email flow · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 18.03 — Search Architecture

- **18.03.01** Postgres full text search · lesson · 18 min target
- **18.03.02** Trigram search · lesson · 18 min target
- **18.03.03** Ranking and relevance · lesson · 18 min target
- **18.03.04** Search filters and pagination · lesson · 18 min target
- **18.03.05** Index synchronization · lesson · 18 min target
- **18.03.06** Meilisearch vs Typesense tradeoffs · lesson · 18 min target
- **18.03.07** Search analytics · lesson · 18 min target
- **18.03.08** Lab fast app search · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 18.04 — Third-party Integrations

- **18.04.01** API clients and credentials · lesson · 18 min target
- **18.04.02** Webhook signature verification · lesson · 18 min target
- **18.04.03** Retry budgets and circuit breakers · lesson · 18 min target
- **18.04.04** Provider adapters · lesson · 18 min target
- **18.04.05** API key scopes · lesson · 18 min target
- **18.04.06** Version compatibility · lesson · 18 min target
- **18.04.07** Integration test doubles · lesson · 18 min target
- **18.04.08** Lab signed incoming webhook · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 19 — Testing, QA & Engineering Quality

**Level:** Advanced. **Outcome:** Ship code with reproducible evidence and regression protection. **Official reference:** https://playwright.dev/docs/intro

#### 19.01 — Testing Pyramid

- **19.01.01** Unit vs integration vs E2E · lesson · 18 min target
- **19.01.02** Test contracts and behavior · lesson · 18 min target
- **19.01.03** Fixtures and factories · lesson · 18 min target
- **19.01.04** Deterministic time · lesson · 18 min target
- **19.01.05** Mocking boundaries · lesson · 18 min target
- **19.01.06** Property based testing · lesson · 18 min target
- **19.01.07** Coverage interpretation · lesson · 18 min target
- **19.01.08** Lab tests-first feature · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 19.02 — Frontend Testing

- **19.02.01** Vitest and Testing Library · lesson · 18 min target
- **19.02.02** Accessible queries · lesson · 18 min target
- **19.02.03** React component interaction · lesson · 18 min target
- **19.02.04** Mock Service Worker · lesson · 18 min target
- **19.02.05** Form validation tests · lesson · 18 min target
- **19.02.06** Visual regression · lesson · 18 min target
- **19.02.07** Keyboard and a11y checks · lesson · 18 min target
- **19.02.08** Bug Hunt flaky UI test · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 19.03 — Backend & Database Tests

- **19.03.01** Nest test modules · lesson · 18 min target
- **19.03.02** Service unit tests · lesson · 18 min target
- **19.03.03** API integration tests · lesson · 18 min target
- **19.03.04** Test database transactions · lesson · 18 min target
- **19.03.05** Schema migration tests · lesson · 18 min target
- **19.03.06** RLS and tenant boundary tests · lesson · 18 min target
- **19.03.07** Contract and snapshot tests · lesson · 18 min target
- **19.03.08** Lab full request test · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 19.04 — Performance & Reliability Tests

- **19.04.01** k6 scenarios · lesson · 18 min target
- **19.04.02** p95 and tail latency · lesson · 18 min target
- **19.04.03** Database load testing · lesson · 18 min target
- **19.04.04** Worker concurrency tests · lesson · 18 min target
- **19.04.05** Chaos injection basics · lesson · 18 min target
- **19.04.06** Security test automation · lesson · 18 min target
- **19.04.07** CI test sharding · lesson · 18 min target
- **19.04.08** Lab measurable API SLO · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 20 — Docker, CI/CD & Delivery

**Level:** Advanced. **Outcome:** Operate predictable, reversible production deployments. **Official reference:** https://docs.docker.com/

#### 20.01 — Docker Fundamentals

- **20.01.01** Images containers and layers · lesson · 18 min target
- **20.01.02** Dockerfiles multi-stage builds · lesson · 18 min target
- **20.01.03** Compose services and health checks · lesson · 18 min target
- **20.01.04** Bind mounts vs volumes · lesson · 18 min target
- **20.01.05** Network isolation · lesson · 18 min target
- **20.01.06** Non-root containers · lesson · 18 min target
- **20.01.07** Image security · lesson · 18 min target
- **20.01.08** Lab local stack · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 20.02 — Continuous Integration

- **20.02.01** GitHub Actions jobs and matrices · lesson · 18 min target
- **20.02.02** Lint typecheck and test gates · lesson · 18 min target
- **20.02.03** Dependency caching · lesson · 18 min target
- **20.02.04** Secret handling · lesson · 18 min target
- **20.02.05** Supply chain scanning · lesson · 18 min target
- **20.02.06** Build artifacts and provenance · lesson · 18 min target
- **20.02.07** Branch protection · lesson · 18 min target
- **20.02.08** Lab CI pipeline · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 20.03 — Continuous Delivery

- **20.03.01** Environments and approvals · lesson · 18 min target
- **20.03.02** Database expand-contract migrations · lesson · 18 min target
- **20.03.03** Rolling deploys and downtime · lesson · 18 min target
- **20.03.04** Health probes and smoke tests · lesson · 18 min target
- **20.03.05** Rollbacks and release tagging · lesson · 18 min target
- **20.03.06** Feature flags · lesson · 18 min target
- **20.03.07** Incident-ready releases · lesson · 18 min target
- **20.03.08** Lab deploy and rollback · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 20.04 — Infrastructure Operations

- **20.04.01** Linux filesystem and permissions · lesson · 18 min target
- **20.04.02** Caddy or reverse proxy · lesson · 18 min target
- **20.04.03** HTTPS certificate lifecycle · lesson · 18 min target
- **20.04.04** DNS and CDN · lesson · 18 min target
- **20.04.05** VPS hardening · lesson · 18 min target
- **20.04.06** IaC basics OpenTofu · lesson · 18 min target
- **20.04.07** Terraform state and secrets · lesson · 18 min target
- **20.04.08** Lab production topology · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 21 — Observability, SRE & Resilience

**Level:** Advanced. **Outcome:** Diagnose and recover complex failures in production. **Official reference:** https://opentelemetry.io/docs/

#### 21.01 — Observability Fundamentals

- **21.01.01** Structured logs with Pino · lesson · 18 min target
- **21.01.02** Correlation and request IDs · lesson · 18 min target
- **21.01.03** Metrics counters gauges histograms · lesson · 18 min target
- **21.01.04** Traces and spans · lesson · 18 min target
- **21.01.05** OpenTelemetry instrumentation · lesson · 18 min target
- **21.01.06** Sentry error tracking · lesson · 18 min target
- **21.01.07** Sampling and cardinality · lesson · 18 min target
- **21.01.08** Lab trace an API call · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 21.02 — Reliability Engineering

- **21.02.01** SLIs SLOs and error budgets · lesson · 18 min target
- **21.02.02** Alert fatigue · lesson · 18 min target
- **21.02.03** Readiness and liveness · lesson · 18 min target
- **21.02.04** Circuit breakers · lesson · 18 min target
- **21.02.05** Timeouts and retries · lesson · 18 min target
- **21.02.06** Bulkheads and backpressure · lesson · 18 min target
- **21.02.07** Graceful degradation · lesson · 18 min target
- **21.02.08** Lab fault injection · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 21.03 — Operations & Incidents

- **21.03.01** Incident severity and ownership · lesson · 18 min target
- **21.03.02** Runbooks and dashboards · lesson · 18 min target
- **21.03.03** Log retention and privacy · lesson · 18 min target
- **21.03.04** Backups and restore drills · lesson · 18 min target
- **21.03.05** Disaster recovery objectives · lesson · 18 min target
- **21.03.06** Postmortem writing · lesson · 18 min target
- **21.03.07** Capacity planning · lesson · 18 min target
- **21.03.08** Lab simulated incident · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 22 — Web & API Performance Engineering

**Level:** Advanced. **Outcome:** Improve real bottlenecks with repeatable measurements. **Official reference:** https://web.dev/learn/performance

#### 22.01 — Frontend Performance

- **22.01.01** Core Web Vitals LCP INP CLS · lesson · 18 min target
- **22.01.02** Bundle analysis · lesson · 18 min target
- **22.01.03** Server streaming · lesson · 18 min target
- **22.01.04** Font and image optimization · lesson · 18 min target
- **22.01.05** Prefetch and resource hints · lesson · 18 min target
- **22.01.06** Rendering waterfall analysis · lesson · 18 min target
- **22.01.07** Virtualization · lesson · 18 min target
- **22.01.08** Lab performance budget · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 22.02 — API & Database Performance

- **22.02.01** Profiling Node CPU and heap · lesson · 18 min target
- **22.02.02** Fastify vs alternatives measurement · lesson · 18 min target
- **22.02.03** Connection pool sizing · lesson · 18 min target
- **22.02.04** Query plans and N plus one · lesson · 18 min target
- **22.02.05** HTTP caching ETags · lesson · 18 min target
- **22.02.06** Payload compression · lesson · 18 min target
- **22.02.07** Request batching tradeoffs · lesson · 18 min target
- **22.02.08** Lab reduce p95 latency · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 22.03 — Caching & Capacity

- **22.03.01** CDN caching and purge · lesson · 18 min target
- **22.03.02** Multi-tier caching · lesson · 18 min target
- **22.03.03** Cache consistency · lesson · 18 min target
- **22.03.04** Load balancing and stateless APIs · lesson · 18 min target
- **22.03.05** Horizontal scaling · lesson · 18 min target
- **22.03.06** Cost-aware scaling · lesson · 18 min target
- **22.03.07** Baseline and regression tests · lesson · 18 min target
- **22.03.08** Lab capacity forecast · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 23 — Software Architecture & DDD

**Level:** Advanced. **Outcome:** Design systems that remain understandable as teams and features grow. **Official reference:** https://martinfowler.com/architecture/

#### 23.01 — Design Principles

- **23.01.01** Cohesion coupling and SOLID · lesson · 18 min target
- **23.01.02** Dependency inversion · lesson · 18 min target
- **23.01.03** Ports and adapters · lesson · 18 min target
- **23.01.04** Hexagonal architecture · lesson · 18 min target
- **23.01.05** Clean architecture tradeoffs · lesson · 18 min target
- **23.01.06** Domain model vs persistence model · lesson · 18 min target
- **23.01.07** Architecture decision records · lesson · 18 min target
- **23.01.08** Lab diagram boundaries · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 23.02 — Modular Monolith

- **23.02.01** Domain modules and ownership · lesson · 18 min target
- **23.02.02** API contracts between modules · lesson · 18 min target
- **23.02.03** Transactions and invariants · lesson · 18 min target
- **23.02.04** Domain events · lesson · 18 min target
- **23.02.05** Repository interfaces · lesson · 18 min target
- **23.02.06** Feature toggles · lesson · 18 min target
- **23.02.07** Shared kernel discipline · lesson · 18 min target
- **23.02.08** Bug Hunt circular dependencies · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 23.03 — Event Driven Systems

- **23.03.01** Events vs commands · lesson · 18 min target
- **23.03.02** Eventual consistency · lesson · 18 min target
- **23.03.03** Outbox pattern · lesson · 18 min target
- **23.03.04** Idempotent consumers · lesson · 18 min target
- **23.03.05** Sagas and orchestration · lesson · 18 min target
- **23.03.06** Versioned message schemas · lesson · 18 min target
- **23.03.07** Delivery guarantees · lesson · 18 min target
- **23.03.08** Lab reliable event integration · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 23.04 — Distributed Systems

- **23.04.01** CAP tradeoffs and practical consistency · lesson · 18 min target
- **23.04.02** Service discovery · lesson · 18 min target
- **23.04.03** Timeouts and retries · lesson · 18 min target
- **23.04.04** Message brokers NATS Kafka · lesson · 18 min target
- **23.04.05** Data partitioning · lesson · 18 min target
- **23.04.06** Multi-region latency · lesson · 18 min target
- **23.04.07** Microservice extraction criteria · lesson · 18 min target
- **23.04.08** Lab design review · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 24 — Mobile, Offline & Desktop Extensions

**Level:** Specialization. **Outcome:** Extend the web platform without weakening mobile and offline correctness. **Official reference:** https://capacitorjs.com/docs

#### 24.01 — Capacitor Fundamentals

- **24.01.01** Capacitor architecture vs React Native · lesson · 18 min target
- **24.01.02** Vite React mobile entrypoint · lesson · 18 min target
- **24.01.03** Native bridge plugins · lesson · 18 min target
- **24.01.04** Android lifecycle · lesson · 18 min target
- **24.01.05** iOS signing basics · lesson · 18 min target
- **24.01.06** Network and storage permissions · lesson · 18 min target
- **24.01.07** Secure token storage · lesson · 18 min target
- **24.01.08** Lab first APK · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 24.02 — Offline First Data

- **24.02.01** SQLite local schema · lesson · 18 min target
- **24.02.02** Sync queue and operation IDs · lesson · 18 min target
- **24.02.03** Conflict models and merge rules · lesson · 18 min target
- **24.02.04** Partial sync and cursors · lesson · 18 min target
- **24.02.05** Deleted records and tombstones · lesson · 18 min target
- **24.02.06** Secure offline data · lesson · 18 min target
- **24.02.07** Reconnect and retry · lesson · 18 min target
- **24.02.08** Lab offline task edits · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 24.03 — Tauri Desktop

- **24.03.01** Tauri architecture and commands · lesson · 18 min target
- **24.03.02** Rust boundary mental model · lesson · 18 min target
- **24.03.03** Desktop permissions · lesson · 18 min target
- **24.03.04** Window and file APIs · lesson · 18 min target
- **24.03.05** Auto updates and signing · lesson · 18 min target
- **24.03.06** Local SQLite storage · lesson · 18 min target
- **24.03.07** Native packaging · lesson · 18 min target
- **24.03.08** Lab portable desktop app · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 24.04 — Mobile Quality

- **24.04.01** Device UX and touch targets · lesson · 18 min target
- **24.04.02** Push notifications · lesson · 18 min target
- **24.04.03** Background execution constraints · lesson · 18 min target
- **24.04.04** Deep links · lesson · 18 min target
- **24.04.05** Battery memory and app size · lesson · 18 min target
- **24.04.06** Accessibility mobile · lesson · 18 min target
- **24.04.07** Store release requirements · lesson · 18 min target
- **24.04.08** Bug Hunt lost sync · debug · 30 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 25 — Advanced Data & Specialized Platforms

**Level:** Specialization. **Outcome:** Know when to introduce search, analytics, AI and geospatial capabilities. **Official reference:** https://www.postgresql.org/docs/

#### 25.01 — Data Analytics

- **25.01.01** OLTP vs OLAP · lesson · 18 min target
- **25.01.02** Aggregations and materialized views · lesson · 18 min target
- **25.01.03** Event tracking and instrumentation · lesson · 18 min target
- **25.01.04** Warehouse concepts · lesson · 18 min target
- **25.01.05** ClickHouse overview · lesson · 18 min target
- **25.01.06** dbt transformations · lesson · 18 min target
- **25.01.07** Data quality assertions · lesson · 18 min target
- **25.01.08** Lab event dashboard · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 25.02 — AI & RAG

- **25.02.01** AI SDK application primitives · lesson · 18 min target
- **25.02.02** Model selection and budgets · lesson · 18 min target
- **25.02.03** Prompt injection defenses · lesson · 18 min target
- **25.02.04** Embeddings and pgvector · lesson · 18 min target
- **25.02.05** Retrieval and chunking · lesson · 18 min target
- **25.02.06** Evaluation datasets · lesson · 18 min target
- **25.02.07** Model routing and fallbacks · lesson · 18 min target
- **25.02.08** Lab source-cited assistant · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 25.03 — Geospatial & Mapping

- **25.03.01** PostGIS geometry and geography · lesson · 18 min target
- **25.03.02** Spatial indexes · lesson · 18 min target
- **25.03.03** Distance and bounding boxes · lesson · 18 min target
- **25.03.04** Map clients · lesson · 18 min target
- **25.03.05** Data validation · lesson · 18 min target
- **25.03.06** Geofence queries · lesson · 18 min target
- **25.03.07** Geo privacy · lesson · 18 min target
- **25.03.08** Lab map-backed search · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 25.04 — Specialized Media & RTC

- **25.04.01** Object storage and CDN delivery · lesson · 18 min target
- **25.04.02** Adaptive streaming concepts · lesson · 18 min target
- **25.04.03** FFmpeg pipeline isolation · lesson · 18 min target
- **25.04.04** WebRTC and LiveKit · lesson · 18 min target
- **25.04.05** Signed media URLs · lesson · 18 min target
- **25.04.06** Content moderation and abuse controls · lesson · 18 min target
- **25.04.07** Media cost modeling · lesson · 18 min target
- **25.04.08** Lab asynchronous thumbnail worker · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 26 — Enterprise Features & Governance

**Level:** Specialization. **Outcome:** Build enterprise-ready capabilities responsibly. **Official reference:** https://owasp.org/projects/asvs

#### 26.01 — Enterprise Identity

- **26.01.01** SAML SSO architecture · lesson · 18 min target
- **26.01.02** SCIM provisioning · lesson · 18 min target
- **26.01.03** Domain verification · lesson · 18 min target
- **26.01.04** Session and device controls · lesson · 18 min target
- **26.01.05** MFA and step up auth · lesson · 18 min target
- **26.01.06** Organization policy administration · lesson · 18 min target
- **26.01.07** Auditability · lesson · 18 min target
- **26.01.08** Lab enterprise auth threat model · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 26.02 — Billing & Commercial Platform

- **26.02.01** Subscription state machines · lesson · 18 min target
- **26.02.02** Webhook authenticity · lesson · 18 min target
- **26.02.03** Idempotent entitlements · lesson · 18 min target
- **26.02.04** Grace periods and dunning · lesson · 18 min target
- **26.02.05** Usage metering · lesson · 18 min target
- **26.02.06** Provider adapter pattern · lesson · 18 min target
- **26.02.07** Sandbox testing · lesson · 18 min target
- **26.02.08** Lab billing simulator · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 26.03 — Privacy & Compliance

- **26.03.01** Data inventories · lesson · 18 min target
- **26.03.02** GDPR concepts and Philippine Data Privacy Act overview · lesson · 18 min target
- **26.03.03** Consent and retention · lesson · 18 min target
- **26.03.04** Right to export/delete · lesson · 18 min target
- **26.03.05** Encryption key management · lesson · 18 min target
- **26.03.06** Data residency · lesson · 18 min target
- **26.03.07** Evidence and controls · lesson · 18 min target
- **26.03.08** Lab retention policy · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 26.04 — Platform Administration

- **26.04.01** Audit search and exports · lesson · 18 min target
- **26.04.02** Feature flags · lesson · 18 min target
- **26.04.03** System configuration · lesson · 18 min target
- **26.04.04** Tenant administration · lesson · 18 min target
- **26.04.05** Incident support tooling · lesson · 18 min target
- **26.04.06** Abuse management · lesson · 18 min target
- **26.04.07** Migration and import pipelines · lesson · 18 min target
- **26.04.08** Lab safe admin console · lab · 50 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

### Track 27 — Capstone: Build a Production Platform

**Level:** Capstone. **Outcome:** Integrate knowledge into a complete, deployed, tested system. **Official reference:** https://nextjs.org/docs/app

#### 27.01 — Capstone Phase A Web

- **27.01.01** Requirements and scope · lesson · 18 min target
- **27.01.02** Architecture decision record · lesson · 18 min target
- **27.01.03** Information architecture · lesson · 18 min target
- **27.01.04** UI component library · lesson · 18 min target
- **27.01.05** Public SEO pages · lesson · 18 min target
- **27.01.06** Authenticated workspace · lesson · 18 min target
- **27.01.07** Accessibility acceptance · lesson · 18 min target
- **27.01.08** Milestone web release · lesson · 18 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 27.02 — Capstone Phase B API & Data

- **27.02.01** OpenAPI and Zod contracts · lesson · 18 min target
- **27.02.02** Nest domain boundaries · lesson · 18 min target
- **27.02.03** PostgreSQL schema and migrations · lesson · 18 min target
- **27.02.04** Prisma repositories · lesson · 18 min target
- **27.02.05** Supabase Auth JWT validation · lesson · 18 min target
- **27.02.06** Permissions and tenant isolation · lesson · 18 min target
- **27.02.07** API integration tests · lesson · 18 min target
- **27.02.08** Milestone secured API · lesson · 18 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 27.03 — Capstone Phase C Features

- **27.03.01** CRUD with pagination · lesson · 18 min target
- **27.03.02** Secure file upload · lesson · 18 min target
- **27.03.03** Notification queue · lesson · 18 min target
- **27.03.04** Redis cache invalidation · lesson · 18 min target
- **27.03.05** Live updates · lesson · 18 min target
- **27.03.06** Search · lesson · 18 min target
- **27.03.07** Audit trail · lesson · 18 min target
- **27.03.08** Milestone integrated workspace · lesson · 18 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 27.04 — Capstone Phase D Production

- **27.04.01** Docker compose and envs · lesson · 18 min target
- **27.04.02** Continuous integration · lesson · 18 min target
- **27.04.03** Deployment and rollback · lesson · 18 min target
- **27.04.04** Observability and alerts · lesson · 18 min target
- **27.04.05** Security verification · lesson · 18 min target
- **27.04.06** Performance testing · lesson · 18 min target
- **27.04.07** Backup restore drill · lesson · 18 min target
- **27.04.08** Production readiness review · lesson · 18 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

#### 27.05 — Capstone Phase E Defense

- **27.05.01** Bug bounty style review · lesson · 18 min target
- **27.05.02** Fault injection drill · lesson · 18 min target
- **27.05.03** Architecture tradeoff presentation · lesson · 18 min target
- **27.05.04** Source and API documentation · lesson · 18 min target
- **27.05.05** Operating cost calculation · lesson · 18 min target
- **27.05.06** Portfolio case study · lesson · 18 min target
- **27.05.07** Upgrade plan · lesson · 18 min target
- **27.05.08** Final technical assessment · lesson · 18 min target

**Module competency check:** Explain the underlying mental model, implement the feature in a clean codebase, reproduce and fix a realistic failure, and demonstrate the relevant automated or manual verification.

