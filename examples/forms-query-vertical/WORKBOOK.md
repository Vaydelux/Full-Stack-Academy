# Forms / Query Workbook — canonical 09.02 and 09.03 preparation

**Source draft, not published lessons.** The complete lesson authoring contract still requires 16 individual MDX articles, metadata, instructor/learner fixtures and executable React/browser tests. This workbook captures one consistent progression against the real loopback Task API without inflating publication counts.

## Track 09.02 — React Hook Form (8 canonical topics)

### 09.02.01 — Controlled vs uncontrolled inputs
**Goal:** Choose where the authoritative input value lives. Compare a native uncontrolled input, a controlled React value and an RHF-registered input. **Exercise:** Build a title field in each style and count rerenders while typing, blur, and reset. **Bug hunt:** A controlled input without onChange becomes read-only. **Evidence:** Typing and reset work with keyboard, screen reader label and 100-character limit. **Reference:** https://react-hook-form.com/get-started

### 09.02.02 — Register and Controller
**Goal:** Know when register is sufficient and when Controller is necessary for a third-party controlled component. **Exercise:** register the native task title and priority select; then wrap a simulated controlled date picker in Controller. **Bug hunt:** Duplicating a field's value in Zustand produces stale state. **Evidence:** reset updates both fields and no uncontrolled/controlled React warnings appear. **Reference:** https://react-hook-form.com/docs/usecontroller/controller

### 09.02.03 — Zod resolvers
**Goal:** Keep a single strict schema for client feedback while recognizing that the server must independently validate. **Exercise:** wire TaskInputSchema to zodResolver, exercise whitespace-only titles, invalid priorities and too-long strings. **Bug hunt:** Calling parse outside handleSubmit throws without an accessible error. **Evidence:** rejected submissions never call POST; valid payloads are trimmed and correctly typed. **Reference:** https://github.com/react-hook-form/resolvers#zod

### 09.02.04 — Dynamic field arrays
**Goal:** Preserve stable field identity when adding/removing repeated inputs. **Exercise:** add an optional checklist field array to a local form-only prototype; enforce maximum length, stable IDs and controlled remove/reorder. Do not send extra fields to Task API until its schema is explicitly extended. **Bug hunt:** React keys based on array index mix up edits. **Evidence:** removing the middle row does not overwrite neighboring values. **Reference:** https://react-hook-form.com/docs/usefieldarray

### 09.02.05 — Async submissions
**Goal:** Prevent duplicate side effects during pending requests and recover from transport failures. **Exercise:** submit the typed form to POST /api/tasks using a stable Idempotency-Key for each logical attempt. Retry a failed attempt using the same key, not a new key. **Bug hunt:** A double click creates two tasks. **Evidence:** 201 success, 422 validation error, 409 conflict and network failure are distinguishable; only one logical create survives a same-key replay. **Reference:** https://react-hook-form.com/docs/useform/handlesubmit

### 09.02.06 — Reset and dirty state
**Goal:** Understand when reset clears edits and when reset should retain entered data. **Exercise:** submit, reset on success, preserve values on 5xx/network errors, and inspect isDirty/dirtyFields after editing. **Bug hunt:** Clearing the form after a failed POST destroys the only copy of input. **Evidence:** a failed request leaves the form recoverable and a successful response resets it. **Reference:** https://react-hook-form.com/docs/useform/reset

### 09.02.07 — Server errors and focus
**Goal:** Give visible and assistive-technology-friendly error feedback. **Exercise:** render field-associated errors and root.server errors; focus the first invalid input; preserve a retry action after transport failure. **Bug hunt:** Error text is visible but not associated with the corresponding input. **Evidence:** role=alert or equivalent announcement, aria-invalid, descriptive associations, logical focus. **Reference:** https://react-hook-form.com/docs/useform/seterror

### 09.02.08 — Bug Hunt mismatched form state
**Goal:** Repair client/server truth mismatches. **Exercise:** deliberately bypass client validation and submit invalid title, unexpected JSON fields and unsupported priority. Compare 422 responses and root errors; explain why the API is authoritative. **Bug hunt:** UI accepts 'urgent' but API allows only low/normal/high. **Evidence:** no false success, no silent retry on validation error, no unknown fields sent. **Reference:** https://react-hook-form.com/docs/useform/formstate

## Track 09.03 — TanStack Query (8 canonical topics)

### 09.03.01 — Query keys and caching
**Goal:** Use stable query keys to identify remote resources rather than copy them into global UI state. **Exercise:** initialize QueryClientProvider, query /api/tasks?limit=10 and inspect the cached response. **Bug hunt:** Reusing one key for different filters yields the wrong page. **Evidence:** filter/limit changes do not display the previous page under an identical cache key. **Reference:** https://tanstack.com/query/latest/docs/framework/react/guides/query-keys

### 09.03.02 — Stale time and garbage collection
**Goal:** Distinguish freshness (staleTime) from eviction of unused cache (gcTime). **Exercise:** compare zero and ten-second staleTime, observe focus refetch and unmount/remount behavior. **Bug hunt:** Treating staleTime as permanent offline storage. **Evidence:** learners can predict when another GET occurs. **Reference:** https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

### 09.03.03 — Mutations and invalidation
**Goal:** Understand mutation side effects versus query reads. **Exercise:** create a task via useMutation; after 201, invalidate the task-list query. Preserve the Idempotency-Key across the same logical retry. **Bug hunt:** Forgetting invalidateQueries makes the list appear unchanged after success. **Evidence:** GET follows mutation and displays the new server item. **Reference:** https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations

### 09.03.04 — Optimistic updates and rollback
**Goal:** Design visible, reversible UI changes. **Exercise:** optimistically remove a task from query cache before DELETE resolves; store previous snapshot; restore on 404/network error; invalidate on settle. **Bug hunt:** Two concurrent optimistic deletes clobber each other's snapshots. **Evidence:** failure restores the list, success reconciles against the server; concurrent behavior must be serialized or explicitly conflict-safe. **Reference:** https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates

### 09.03.05 — Infinite queries
**Goal:** Manage cursor pagination without duplicating or skipping items. **Exercise:** replace the first-page-only demo with useInfiniteQuery using /api/tasks?cursor=...; render Load More, set getNextPageParam to the opaque cursor. **Bug hunt:** A write makes the previous cursor stale and the next page returns 409. **Evidence:** reset pagination on 409, no duplicate React keys, bounded UI rows and no N+1 fetch. **Reference:** https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries

### 09.03.06 — Suspense and SSR hydration
**Goal:** Separate server initial data from client cache freshness. **Exercise:** when moving this lab into a compatible Next.js App Router environment, prefetch and dehydrate a query, then hydrate one client-owned QueryClient. Avoid creating QueryClient on every render. **Bug hunt:** Server and client use different query keys and refetch needlessly. **Evidence:** no hydration mismatch and no secret gets embedded in dehydrated state. Not executable in the current standalone Vite client. **Reference:** https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

### 09.03.07 — Retries and cancellation
**Goal:** Handle AbortSignal and avoid pathological retries. **Exercise:** pass TanStack's queryFn signal to fetch; simulate cancellation and distinguish 4xx from transient 5xx. **Bug hunt:** Retrying 422 validation errors or calling setState after an aborted read. **Evidence:** no uncontrolled retry storm; abort yields no stale cache overwrite; retries bounded and explicit. **Reference:** https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation

### 09.03.08 — Lab remote task list
**Goal:** Integrate input validation, remote cache and reliable mutation outcomes. **Exercise:** use the standalone React app with live loopback API and build the full workflow: form validation → POST → invalidate → list → DELETE with rollback → pagination recovery. **Bug hunt:** A missing onError rollback makes a failed delete look permanent. **Evidence:** actual browser checks at 320px, keyboard, screen reader, empty/error/loading states, idempotency replay and no secrets. **Reference:** https://tanstack.com/query/latest/docs/framework/react/guides/mutations

## Production boundary and qualification

The Node API and browser-native client are runnable and independently tested. The separate RHF/TanStack React client is source-authored but **not installed, typechecked, built or browser-qualified**. Lessons 09.02 and 09.03 must remain marked planned/noindex until actual packages, lockfiles, complete lesson fixtures and controlled React/browser integration tests pass.

This workbook does **not** count as 16 published lessons, 16 complete lab manifests, a production API, or independent learner grading. The repo remains a local-first educational product.
