# 07.02.01 — Where should this code run? Next.js Server vs Client Components

*Next.js App Router 16 · 40 minutes editorial estimate · Intermediate · Sample authored lesson (requires later verified starter repo)*

## The problem we're solving

Imagine a dashboard that fetches private data, renders a beautiful page, and lets a user click **Refresh**. Putting everything in a Client Component is tempting—but it may push unnecessary JavaScript to the browser or accidentally expose server-only dependencies. Putting everything in a Server Component isn't enough either; you still need interactivity. The trick is to decide **where each responsibility belongs**.

## What you'll learn

1. Distinguish Server Components from Client Components.
2. Move interactive state into a small Client Component boundary.
3. Keep secrets and database connections on the server.
4. Explain serialization and why arbitrary server objects cannot become Client Component props.

## The mental model

```text
Browser request
    ↓
Next.js server: Server Components fetch/render data
    ↓ serialized UI payload + HTML
Browser: Client Components hydrate interactive islands
    ↓ user action
New navigation, server action or API request
```

**Important:** In the App Router, components are Server Components by default. `'use client'` marks the module boundary for client interactivity; it does **not** simply mean “never rendered by a server.”

## Step 1 — Create a server page

In a Next.js App Router project, create `app/projects/page.tsx`:

```tsx
import { Counter } from './counter';

async function getProjects() {
  // Demo only. Later this comes from the authenticated NestJS API.
  return ['Orbit', 'Atlas', 'Nova'];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <h1>My projects</h1>
      <ul>
        {projects.map((name) => <li key={name}>{name}</li>)}
      </ul>
      <Counter />
    </main>
  );
}
```

**Expected:** Visiting `/projects` shows the heading, list, and a counter. There is no browser state in `page.tsx`.

## Step 2 — Add a small interactive island

Create `app/projects/counter.tsx`:

```tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((n) => n + 1)}>
      Clicked {count} times
    </button>
  );
}
```

**Predict before running:** Which file needs `'use client'`? `counter.tsx` does because it uses `useState` and an event handler.

## Step 3 — Break the boundary deliberately

Try adding `useState` directly to the async Server Component page without `'use client'`. Read the error. Restore the original. Then try moving database credentials into a Client Component and explain why you must never do that.

**Security check:** Public environment variables prefixed for the client are visible in bundled browser code. API secrets belong server-side. For private per-user requests, use authenticated fetching and avoid shared caching.

## Step 4 — Debug serialization

Not every server-side value can cross the server/client prop boundary. Pass serializable data rather than a database client, closure, or arbitrary class instance.

```tsx
// Good: serializable prop
<Counter />

// Bad design: passing a server DB instance into browser UI
// <Counter database={prisma} />
```

## Knowledge check

**Which statement is correct?**

A. Every App Router page needs `'use client'`.  
B. Server Components are the default; keep interaction in dedicated Client Components.  
C. Database credentials are safe to send to Client Components if the file has TypeScript types.  
D. Server Components cannot render Client Components.

**Correct: B.** A and D misunderstand composition; C confuses compile-time typing with data secrecy.

## Guided lab

Build a `/projects` page that fetches static demonstration project data on the server and renders a client-side filter input. The filter operates on serializable project items passed as props. Prove the filter works without moving secrets into the browser.

**Success:** Server page renders; filter changes visible projects; Next.js build succeeds; no secret is embedded in browser assets.

**Hint ladder:** (1) Add a `ProjectList` Client Component. (2) Pass `{ id, title }[]` from the page. (3) Use local `useState` for the search string.

## Bug Hunt Arena

A developer imports a server-only database module into a `'use client'` component. Build fails or sensitive server utilities are bundled incorrectly. **Fix:** isolate data access in server-only modules, fetch data in a Server Component or approved BFF, and pass safe serializable props.

## Reflect

Does a search box truly require the entire page to become a Client Component? Why might a small interactive boundary improve maintainability and bundle size?

## Completion gate

- [ ] I can identify which component requires `'use client'`.
- [ ] The interactive filter works.
- [ ] I can explain why secrets must stay server-side.
- [ ] The Next.js build/test checks pass when the starter repo exists.

**Reference:** [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security).
