import type {
  AuthoredLesson,
  AuthoredReference,
  LessonChapter,
  LessonStep,
} from './types';

/* ------------------------------------------------------------------ */
/* 06.01.01 — JSX: Describe a UI without manually building the DOM     */
/* ------------------------------------------------------------------ */

const JSX_S1 = `import React from 'react';

// Step 1: Describe the UI as a function returning JSX
export default function TeamCard() {
  return (
    <article className="card">
      <h2>Engineering team</h2>
      <p className="muted">People who build the product together.</p>
    </article>
  );
}`;

const JSX_S2 = `import React from 'react';

// Step 2: Embed JavaScript expressions with curly braces
export default function TeamCard() {
  const teamName = 'Platform Crew';
  const members = 4;

  return (
    <article className="card">
      <h2>{teamName}</h2>
      <p>{members} people contribute.</p>
      <span className="badge">
        {members >= 5 ? 'Large team' : 'Small team'}
      </span>
    </article>
  );
}`;

const JSX_S3 = `import React from 'react';

const people = [
  { id: 'p-1', name: 'Ava', role: 'Frontend' },
  { id: 'p-2', name: 'Noel', role: 'Backend' },
  { id: 'p-3', name: 'Mika', role: 'Platform' },
];

// Step 3: Render lists with stable keys from real data
export default function TeamCard() {
  return (
    <article className="card">
      <h2>Platform Crew</h2>
      <ul className="list">
        {people.map((person) => (
          <li key={person.id}>
            <strong>{person.name}</strong>
            <span className="muted"> · {person.role}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}`;

const JSX_S4 = `import React, { useState } from 'react';

// Step 4: JSX attributes differ from HTML (className, htmlFor, style object)
export default function SampleForm() {
  const [name, setName] = useState('Ava');

  return (
    <div className="card">
      <h2>Profile preview</h2>
      <div className="form-field">
        <label htmlFor="display-name">Display name</label>
        <input
          id="display-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ borderRadius: 8 }}
        />
      </div>
      <p className="muted">Live preview: {name || 'Anonymous'}</p>
    </div>
  );
}`;

const JSX_CHALLENGE_STARTER = `import React from 'react';

type Skill = { id: string; label: string };

const demoSkills: Skill[] = [
  { id: 'sk-ts', label: 'TypeScript strict boundaries' },
  { id: 'sk-react', label: 'React 19 components' },
  { id: 'sk-zod', label: 'Zod runtime schemas' },
];

// Guided challenge: render title, level, and skills with stable keys
export default function SkillCard({
  title = 'Core Frontend Stack',
  level = 'Beginner',
  skills = demoSkills,
}: {
  title?: string;
  level?: string;
  skills?: Skill[];
}) {
  return (
    <article className="card">
      <span className="badge">{level}</span>
      <h2>{title}</h2>
      <ul className="list">
        {/* Render skills here using .map() and key={skill.id} */}
      </ul>
    </article>
  );
}`;

const JSX_SOLUTION = `import React from 'react';

type Skill = { id: string; label: string };

const demoSkills: Skill[] = [
  { id: 'sk-ts', label: 'TypeScript strict boundaries' },
  { id: 'sk-react', label: 'React 19 components' },
  { id: 'sk-zod', label: 'Zod runtime schemas' },
];

export default function SkillCard({
  title = 'Core Frontend Stack',
  level = 'Beginner',
  skills = demoSkills,
}: {
  title?: string;
  level?: string;
  skills?: Skill[];
}) {
  return (
    <article className="card">
      <span className="badge">{level}</span>
      <h2>{title}</h2>
      <ul className="list">
        {skills.map((skill) => (
          <li key={skill.id}>{skill.label}</li>
        ))}
      </ul>
    </article>
  );
}`;

const JSX_BUGGY = `import React, { useState } from 'react';

// Bug Hunt: reordering with key={index} moves input state to the wrong row!
export default function ReorderBugDemo() {
  const [items, setItems] = useState([
    { id: 'a', label: 'First field' },
    { id: 'b', label: 'Second field' },
  ]);

  const reverse = () => setItems((prev) => [...prev].reverse());

  return (
    <div className="card">
      <h2>Type in row 1, then click Reverse</h2>
      <ul className="list">
        {items.map((item, index) => (
          <li key={index} className="form-field">
            <label>{item.label}</label>
            <input placeholder="Type note..." />
          </li>
        ))}
      </ul>
      <button type="button" onClick={reverse}>Reverse list</button>
    </div>
  );
}`;

/* ------------------------------------------------------------------ */
/* 07.02.01 — Server vs Client Components                              */
/* ------------------------------------------------------------------ */

const RSC_S1 = `// app/projects/page.tsx (Server Component by default)
import { Counter } from './counter';

async function getProjects() {
  // Server-only fetch or authenticated API call
  return ['Orbit', 'Atlas', 'Nova'];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <h1>My projects</h1>
      <ul>
        {projects.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <Counter />
    </main>
  );
}`;

const RSC_S2 = `// app/projects/counter.tsx (Small interactive Client Component island)
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((n) => n + 1)}>
      Clicked {count} times
    </button>
  );
}`;

const RSC_S3 = `// Serialization & boundary rule: keep server-only secrets out of client bundles
import { ProjectList } from './project-list';

export default async function ProjectsPage() {
  const rows = await db.project.findMany({
    select: { id: true, title: true },
  });

  // Good: pass serializable plain objects across the boundary
  return <ProjectList projects={rows} />;

  // Bad: never pass DB clients, closures, or secret keys to a Client Component
  // return <ProjectList database={db} apiKey={process.env.SECRET_KEY} />;
}`;

const RSC_BUGGY = `'use client';

// BUG: Importing a server-only Prisma database client into a Client Component!
import { prisma } from '@/lib/server-db';
import { useState } from 'react';

export function ProjectSearch() {
  const [query, setQuery] = useState('');
  // Build fails or attempts to bundle server-only database modules for the browser
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}`;

/* ------------------------------------------------------------------ */
/* 09.01.02 — Zod 4 safeParse runtime boundary                         */
/* ------------------------------------------------------------------ */

const ZOD_S1 = `// Step 1: Start with unknown — TypeScript interfaces disappear at runtime
type User = { name: string; email: string; age: number };

const payload: unknown = {
  name: 'Mika',
  email: 'mika@example.com',
  age: 'twenty', // network payload does not obey compile-time TS types
};

// UNSAFE: const user = payload as User;`;

const ZOD_S2 = `// Step 2: Define one runtime Zod 4 schema and infer the TypeScript type
import * as z from 'zod';

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  age: z.number().int().min(0),
});

type User = z.infer<typeof UserSchema>;`;

const ZOD_S3 = `// Step 3: Validate with safeParse() without throwing on invalid input
import * as z from 'zod';

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  age: z.number().int().min(0),
});

const result = UserSchema.safeParse(payload);

if (!result.success) {
  console.log('Invalid API data');
  console.log(z.treeifyError(result.error));
} else {
  const user = result.data;
  console.log(\`Welcome \${user.name}, age \${user.age}\`);
}`;

const ZOD_S4 = `// Step 4: Guided lab — safe API parser for ProductSchema
import * as z from 'zod';

const ProductSchema = z.object({
  id: z.string().min(1),
  price: z.number().nonnegative(),
  tags: z.array(z.string()),
});

export function parseProduct(input: unknown) {
  return ProductSchema.safeParse(input);
}`;

const ZOD_BUGGY = `import * as z from 'zod';

// BUG: HTML <input type="number"> delivers "12" (a string), not 12!
const QuantitySchema = z.object({
  quantity: z.number().int().positive(),
});

// Fails on form data { quantity: "12" } unless parsed or explicitly coerced
const res = QuantitySchema.safeParse({ quantity: '12' });`;

/* ------------------------------------------------------------------ */
/* 15.02.04 — Object-level authorization (BOLA / IDOR)                 */
/* ------------------------------------------------------------------ */

const AUTHZ_S1 = `// Step 1: INSECURE — JWT verified, but record lookup ignores tenant ownership
export async function getProjectUnsafe(projectId: string) {
  // Any authenticated caller who guesses prj_456 can read another org's project!
  return prisma.project.findUnique({
    where: { id: projectId },
  });
}`;

const AUTHZ_S2 = `// Step 2: Derive authorized organization from verified server membership
export async function getProjectAuthorized(
  principal: VerifiedPrincipal,
  requestedOrgId: string,
  projectId: string,
) {
  const authorizedOrgId = await permissions.requireOrgAccess(
    principal,
    requestedOrgId,
    'project:read',
  );
  return { authorizedOrgId, projectId };
}`;

const AUTHZ_S3 = `// Step 3: Tenant-scoped query + minimized column selection
const project = await prisma.project.findFirst({
  where: {
    id: projectId,
    organizationId: authorizedOrganizationId,
  },
  select: { id: true, title: true },
});

if (!project) {
  throw new NotFoundException('Project not found');
}`;

const AUTHZ_S4 = `// Step 4: Prove negative cases in integration tests
// 1. User A reads Org A project            -> 200 OK
// 2. User A reads Org B project by ID      -> 403 / 404 Denied
// 3. User A writes to Org B project        -> 403 / 404 Denied
// 4. User A spoofs Org B ID in JSON body   -> 403 / 404 Denied

const res = await request(app.getHttpServer())
  .get(\`/v1/projects/\${orgBProject.id}\`)
  .set('Authorization', \`Bearer \${userAToken}\`);

expect([403, 404]).toContain(res.status);`;

/* ------------------------------------------------------------------ */
/* Exported authored sample lessons                                    */
/* ------------------------------------------------------------------ */

export const AUTHORED_LESSONS: Record<string, AuthoredLesson> = {
  '06.01.01': {
    id: '06.01.01',
    headline: 'JSX: Describe a UI without manually building the DOM',
    subtitle: 'Turn data into declarative React elements with expressions, stable keys, and valid attributes',
    stackBadge: 'React 19 · Track 06 · Sample authored draft',
    level: 'Beginner',
    estMinutes: 35,
    duration: 90,
    seed: 20260601,
    fileName: 'src/components/TeamCard.tsx',
    sandboxMode: 'react-live',
    problem:
      'Suppose you are building a list of teammates. You could create every <li> element with document.createElement(), set its textContent, and append it manually. Every state update would require tedious DOM bookkeeping. React lets you describe what the UI should look like directly from data using JSX.',
    objectives: [
      'Explain how JSX transforms into React-compatible JavaScript during build',
      'Return valid JSX markup from a React component function',
      'Embed dynamic JavaScript expressions using single curly braces',
      'Render lists from arrays with stable data keys',
      'Apply className, htmlFor, and style object conventions accurately',
    ],
    predictFirst: {
      prompt: 'What does <p>{2 + 3}</p> display, and why does style={{ borderRadius: 8 }} have double curly braces?',
      answer:
        '{2 + 3} displays 5 because single curly braces enter a JavaScript expression. Double braces {{ borderRadius: 8 }} are NOT special syntax: the outer braces enter JavaScript and the inner braces construct a plain JS object literal.',
    },
    mentalSummary:
      'JSX looks like HTML, but browsers do not run JSX directly. Modern React builds use the automatic JSX runtime to compile JSX into JavaScript element calls, which React reconciles and commits to the browser DOM.',
    mentalFlow: [
      { label: 'Write JSX', caption: 'Component returns declarative JSX markup', accent: 'cyan' },
      { label: 'Compile', caption: 'Build tooling transforms JSX to JS element calls', accent: 'violet' },
      { label: 'Reconcile', caption: 'React compares element trees by type and key', accent: 'violet' },
      { label: 'Commit DOM', caption: 'Browser DOM updates minimally and safely', accent: 'emerald' },
    ],
    showStateFlowVisualizer: true,
    chapters: [
      { t: 0, label: 'Component & JSX', color: '#00F0FF' },
      { t: 22, label: 'JS Expressions', color: '#8A2BE2' },
      { t: 45, label: 'Lists & Stable Keys', color: '#10B981' },
      { t: 68, label: 'Attributes & State', color: '#00F0FF' },
    ],
    steps: [
      {
        id: 'jsx-1',
        at: 0,
        file: 'src/components/TeamCard.tsx',
        title: 'Start with a component returning JSX',
        copy: 'A React component is a function that returns JSX markup describing the UI structure.',
        expected: 'Renders an article card with a heading and description.',
        code: JSX_S1,
        highlightLines: [4, 5, 6, 7, 8, 9],
        checkpoint: true,
      },
      {
        id: 'jsx-2',
        at: 22,
        file: 'src/components/TeamCard.tsx',
        title: 'Embed JavaScript expressions with curly braces',
        copy: 'Single curly braces {} switch from markup back into JavaScript expressions such as variables or ternaries.',
        expected: 'Displays "Platform Crew", "4 people contribute.", and "Small team".',
        code: JSX_S2,
        highlightLines: [5, 6, 10, 11, 12, 13, 14],
        checkpoint: true,
      },
      {
        id: 'jsx-3',
        at: 45,
        file: 'src/components/TeamCard.tsx',
        title: 'Render lists with stable keys',
        copy: 'Map data arrays into <li> elements with a stable ID key from your domain data—never a mutable array index when items can reorder.',
        expected: 'Renders Ava, Noel, and Mika cleanly with unique stable keys.',
        code: JSX_S3,
        highlightLines: [15, 16, 17, 18, 19, 20],
        checkpoint: true,
      },
      {
        id: 'jsx-4',
        at: 68,
        file: 'src/components/SampleForm.tsx',
        title: 'Apply JSX attribute conventions',
        copy: 'Use className instead of class, htmlFor instead of for, and pass a JS object to style. Try typing inside the live preview!',
        expected: 'Interactive controlled input updates the preview text on every keystroke.',
        code: JSX_S4,
        highlightLines: [10, 11, 12, 15, 16],
        checkpoint: true,
      },
    ],
    quiz: {
      question: 'What actually happens to JSX in a typical modern React build?',
      choices: [
        'Browsers execute JSX syntax natively with zero compilation',
        'Build tooling transforms JSX into React-compatible JavaScript calls',
        'JSX is treated as a CSS preprocessor stylesheet',
        'React concatenates raw JSX source files into innerHTML strings',
      ],
      answer: 1,
      explanation:
        'Browsers cannot parse JSX directly. The compiler transforms JSX tags into JavaScript runtime calls that produce React elements.',
      misconception: {
        claim: '“JSX is just an HTML template string under the hood.”',
        correction:
          'JSX compiles to structured JavaScript objects/calls, which lets React escape text safely by default and diff trees incrementally.',
      },
    },
    challenge: {
      title: 'Build a reusable SkillCard component',
      description:
        'Accept title, level, and skills: { id: string; label: string }[] props. Render the title, level badge, and a semantic <ul> list using .map() with key={skill.id}.',
      starterCode: JSX_CHALLENGE_STARTER,
      hint: 'Inside <ul>, map over skills: {skills.map((skill) => <li key={skill.id}>{skill.label}</li>)}.',
      solution: JSX_SOLUTION,
      rubric: [
        'All JSX tags are properly closed and returned from one component',
        'Title, level, and skills are rendered dynamically via expressions',
        'Skill list items use stable skill.id keys rather than array indexes',
        'className is used instead of class and compiles cleanly in the preview',
      ],
    },
    bugHunt: {
      title: 'An input value jumps to the wrong row on reorder',
      symptom:
        'A list renders <input> controls using key={index}. Type text into the first field, click Reverse, and watch the text stay stuck on row 1 instead of following the item.',
      buggyCode: JSX_BUGGY,
      diagnosis:
        'React tracks component identity across renders using the key prop. Because array indexes shift when items reverse, React reuses the first DOM input for a different item. Replace key={index} with key={item.id}.',
      fixNote: 'Load the defective snippet into the editor, change key={index} to key={item.id}, and re-test Reverse.',
    },
    reflection:
      'How is declaring UI structure as a function of data in JSX fundamentally different from manually creating and mutating DOM nodes?',
    sources: [
      { label: 'React: Writing Markup with JSX', url: 'https://react.dev/learn/writing-markup-with-jsx' },
      { label: 'React: JavaScript in JSX with Curly Braces', url: 'https://react.dev/learn/javascript-in-jsx-with-curly-braces' },
      { label: 'React: Rendering Lists', url: 'https://react.dev/learn/rendering-lists' },
    ],
    relatedReferenceIds: ['react-jsx', 'react-key', 'react-component'],
    waveformEnergy: [0.36, 0.58, 0.78, 0.52],
  },

  '07.02.01': {
    id: '07.02.01',
    headline: 'Where should this code run?',
    subtitle: 'Next.js 16 Server Components, Client Components, and the serialization boundary between them',
    stackBadge: 'Next.js 16 App Router · Track 07 · Sample authored draft',
    level: 'Intermediate',
    estMinutes: 40,
    duration: 80,
    seed: 20260702,
    fileName: 'app/projects/page.tsx',
    sandboxMode: 'rsc-sim',
    problem:
      'Imagine a dashboard that fetches private project records and lets the user click Refresh or filter items. Putting the whole page in a Client Component ships extra JavaScript and risks leaking server dependencies. Keeping everything on the server leaves no browser interactivity. You need a deliberate boundary.',
    objectives: [
      'Distinguish Server Components (default) from Client Components in App Router',
      'Isolate stateful interactivity inside small "use client" islands',
      'Keep database clients and server secrets strictly on the server',
      'Explain serialization constraints across the Server → Client prop boundary',
    ],
    predictFirst: {
      prompt: 'If a Server Component renders <Counter />, which file needs "use client"? And does "use client" mean "never SSR-rendered"?',
      answer:
        'Only counter.tsx needs "use client" because it uses useState and onClick. And no—Client Components are still pre-rendered to HTML on initial SSR; "use client" marks the JS bundle/hydration boundary.',
    },
    mentalSummary:
      'App Router components are Server Components by default. Server Components fetch data and read secrets safely, sending serialized props and HTML down to focused Client Component islands that hydrate in the browser.',
    mentalFlow: [
      { label: 'Request', caption: 'Browser requests /projects route', accent: 'cyan' },
      { label: 'Server Tree', caption: 'Async Server Component reads safe data', accent: 'violet' },
      { label: 'Serialize', caption: 'Plain JSON props cross the RSC boundary', accent: 'cyan' },
      { label: 'Client Island', caption: 'Browser hydrates interactive "use client" leaf', accent: 'emerald' },
    ],
    showLifecycleVisualizer: true,
    chapters: [
      { t: 0, label: 'Server Page Default', color: '#00F0FF' },
      { t: 25, label: 'Client Island', color: '#8A2BE2' },
      { t: 55, label: 'Serialization Boundary', color: '#10B981' },
    ],
    steps: [
      {
        id: 'rsc-1',
        at: 0,
        file: 'app/projects/page.tsx',
        title: 'Keep page data loading on the server',
        copy: 'App Router pages are Server Components by default. An async page fetches data before rendering and composes an interactive child.',
        expected: 'Server renders project headings without sending data-fetching code to the browser bundle.',
        code: RSC_S1,
        highlightLines: [2, 9, 10, 19],
        checkpoint: true,
      },
      {
        id: 'rsc-2',
        at: 25,
        file: 'app/projects/counter.tsx',
        title: 'Isolate state in a small Client Component',
        copy: 'Place "use client" at the top of counter.tsx so only interactive event handlers and React state enter the client bundle.',
        expected: 'Button increments locally in the browser while the parent list remains zero-JS server markup.',
        code: RSC_S2,
        highlightLines: [2, 7, 10],
        checkpoint: true,
      },
      {
        id: 'rsc-3',
        at: 55,
        file: 'app/projects/page.tsx',
        title: 'Pass only serializable props across the boundary',
        copy: 'Plain strings, numbers, arrays, and DTO objects cross the RSC boundary safely. Database clients, functions, and class instances do not.',
        expected: 'Type-safe serializable props pass cleanly; secrets stay server-only.',
        code: RSC_S3,
        highlightLines: [10, 13],
        checkpoint: true,
      },
    ],
    quiz: {
      question: 'Which part of a Next.js App Router page requires the "use client" directive?',
      choices: [
        'Every page file, or React cannot render anything',
        'A component that uses browser hooks (useState) or DOM event handlers',
        'Every component that contains JSX tags',
        'Any async component that queries PostgreSQL on the server',
      ],
      answer: 1,
      explanation:
        'Server Components are the App Router default. Only modules introducing client state, effects, or interactive browser handlers need "use client".',
      misconception: {
        claim: '“Putting secrets inside a Client Component with TypeScript types keeps them hidden.”',
        correction:
          'Any module imported into a "use client" boundary is bundled for the browser. Keep secrets and DB clients in server-only modules.',
      },
    },
    challenge: {
      title: 'Server-render projects, client-filter the list',
      description:
        'Fetch static/server project items { id, title }[] in ProjectsPage and pass them to a dedicated "use client" ProjectList component with an interactive filter input.',
      starterCode: RSC_S3,
      hint: 'Create ProjectList with "use client", accept { projects: { id: string; title: string }[] }, and filter using local useState.',
      solution: `// app/projects/project-list.tsx\n'use client';\nimport { useState } from 'react';\n\nexport function ProjectList({ projects }: { projects: { id: string; title: string }[] }) {\n  const [query, setQuery] = useState('');\n  const visible = projects.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));\n  return (\n    <div>\n      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter projects..." />\n      <ul>{visible.map((p) => <li key={p.id}>{p.title}</li>)}</ul>\n    </div>\n  );\n}`,
      rubric: [
        'Data retrieval remains inside the Server Component',
        'Only the interactive filter island uses "use client"',
        'Props passed across the boundary are plain serializable objects',
        'No server-only modules or credentials appear in client code',
      ],
    },
    bugHunt: {
      title: 'A server database module imported into the browser bundle',
      symptom:
        'A developer adds "use client" to a search component that imports prisma from @/lib/server-db. The Next.js build fails or flags server module leakage.',
      buggyCode: RSC_BUGGY,
      diagnosis:
        'Client boundaries pull all transitive imports into browser bundles. Remove the DB import from the Client Component, load safe rows in a Server Component (or authenticated BFF route), and pass serializable DTO props down.',
      fixNote: 'Test the boundary behavior in the interactive Server/Client Boundary Simulator on the right.',
    },
    reflection:
      'Why does adding a single search input not justify converting an entire dashboard page into a Client Component?',
    sources: [
      { label: 'Next.js: Server and Client Components', url: 'https://nextjs.org/docs/app/getting-started/server-and-client-components' },
      { label: 'Next.js: Data Security Guide', url: 'https://nextjs.org/docs/app/guides/data-security' },
    ],
    relatedReferenceIds: ['next.js-server-components', 'next.js-client-components'],
    waveformEnergy: [0.42, 0.66, 0.72],
  },

  '09.01.02': {
    id: '09.01.02',
    headline: 'Why TypeScript cannot validate an API response',
    subtitle: 'Close the trust gap between compile-time types and untrusted runtime JSON with Zod 4 safeParse',
    stackBadge: 'Zod 4 · TypeScript · Track 09 · Sample authored draft',
    level: 'Intermediate',
    estMinutes: 35,
    duration: 85,
    seed: 20260901,
    fileName: 'src/index.ts',
    sandboxMode: 'zod-live',
    problem:
      'Your TypeScript interface says a user has a string name and number age. TypeScript trusts that annotation at compile time—but external JSON over HTTP can deliver "twenty", null, -4, or missing fields. Validating at the trust boundary prevents corrupted state from entering your app.',
    objectives: [
      'Explain why TypeScript interfaces erase at runtime and why "as User" is unsafe',
      'Model untrusted external payloads starting from unknown',
      'Define a Zod 4 schema and infer its TypeScript type via z.infer',
      'Handle valid and invalid payloads cleanly with safeParse()',
    ],
    predictFirst: {
      prompt: 'If a server sends { "age": "twenty" }, can `const user = json as User` reject or convert that string at runtime?',
      answer:
        'No. `as User` is purely a compile-time assertion that disappears after transpilation. Without runtime validation, user.age stays "twenty" and breaks numeric logic silently.',
    },
    mentalSummary:
      'Treat every external boundary (API responses, request bodies, webhooks, env vars) as unknown. Parse through one canonical Zod schema so runtime proof and compile-time types stay synchronized.',
    mentalFlow: [
      { label: 'External JSON', caption: 'Untrusted bytes arrive from network', accent: 'cyan' },
      { label: 'unknown', caption: 'TypeScript forbids field access until narrowed', accent: 'violet' },
      { label: 'safeParse()', caption: 'Zod checks shape, types, and constraints', accent: 'cyan' },
      { label: 'Typed Data / 4xx', caption: 'Either proven User DTO or structured issues', accent: 'emerald' },
    ],
    chapters: [
      { t: 0, label: 'Compile vs Runtime', color: '#00F0FF' },
      { t: 22, label: 'Zod 4 Schema', color: '#8A2BE2' },
      { t: 45, label: 'safeParse Gate', color: '#10B981' },
      { t: 68, label: 'Product Lab', color: '#00F0FF' },
    ],
    steps: [
      {
        id: 'zod-1',
        at: 0,
        file: 'src/index.ts',
        title: 'Start with unknown instead of any or as User',
        copy: 'Declaring payload: unknown forces your code to prove the object shape before reading properties.',
        expected: 'Prevents unchecked property access across external boundaries.',
        code: ZOD_S1,
        highlightLines: [4, 8, 11],
        checkpoint: true,
      },
      {
        id: 'zod-2',
        at: 22,
        file: 'src/index.ts',
        title: 'Define one Zod schema and infer the TS type',
        copy: 'Write constraints once in UserSchema, then derive type User = z.infer<typeof UserSchema> so runtime rules and static types never drift.',
        expected: 'Single source of truth for both validation and TypeScript autocomplete.',
        code: ZOD_S2,
        highlightLines: [4, 5, 6, 7, 10],
        checkpoint: true,
      },
      {
        id: 'zod-3',
        at: 45,
        file: 'src/index.ts',
        title: 'Branch explicitly with safeParse()',
        copy: 'safeParse returns { success: true, data } or { success: false, error } without throwing an unhandled exception.',
        expected: 'Rejects age: "twenty" cleanly and prints structured issue paths.',
        code: ZOD_S3,
        highlightLines: [10, 12, 15],
        checkpoint: true,
      },
      {
        id: 'zod-4',
        at: 68,
        file: 'src/product-parser.ts',
        title: 'Apply the boundary pattern to products',
        copy: 'Enforce nonempty IDs, nonnegative prices, and string tag arrays. Test valid and invalid payloads live in the Zod 4 Runner on the right!',
        expected: 'Accepts valid products; rejects empty id, negative price, or undefined tags.',
        code: ZOD_S4,
        highlightLines: [4, 5, 6, 7, 11],
        checkpoint: true,
      },
    ],
    quiz: {
      question: 'Why is `const user = (await response.json()) as User` unsafe for API data?',
      choices: [
        'fetch() automatically converts mismatched fields at runtime',
        'as User only instructs the TypeScript compiler; it does not inspect runtime values',
        'response.json() never returns objects',
        'Type assertions throw synchronous exceptions on invalid payloads',
      ],
      answer: 1,
      explanation:
        'A TypeScript type assertion performs zero runtime checking. Only a runtime parser like Zod safeParse verifies incoming JSON.',
      misconception: {
        claim: '“We use strict TypeScript everywhere, so invalid JSON cannot reach our UI.”',
        correction:
          'TypeScript checks source code at build time, not live payloads arriving over HTTP or from localStorage.',
      },
    },
    challenge: {
      title: 'Build a safe ProductSchema parser',
      description:
        'Write a ProductSchema requiring id (nonempty string), price (nonnegative number), and tags (string[]). Verify 1 valid fixture and 3 invalid fixtures in the live Zod runner.',
      starterCode: `import * as z from 'zod';\n\n// Define ProductSchema here\nconst ProductSchema = z.object({\n  // id, price, tags\n});\n\nexport function parseProduct(input: unknown) {\n  return ProductSchema.safeParse(input);\n}`,
      hint: 'Use z.string().min(1), z.number().nonnegative(), and z.array(z.string()).',
      solution: ZOD_S4,
      rubric: [
        'I wrote a runtime Zod schema rather than a TypeScript interface alone',
        'Valid product payload produces success: true',
        'Missing id, negative price, and undefined tags all fail with success: false',
        'I can explain why unknown is safer than any at trust boundaries',
      ],
    },
    bugHunt: {
      title: 'The <input type="number"> that still sends a string',
      symptom:
        'A user types 12 into an HTML <input type="number">, yet QuantitySchema (using z.number()) rejects { quantity: "12" }.',
      buggyCode: ZOD_BUGGY,
      diagnosis:
        'HTML input values are DOM strings regardless of input type. Parse explicitly or use z.coerce.number() carefully with empty-string guards—avoid blind coercion at external API endpoints where strings should be rejected.',
      fixNote: 'Try testing { "age": "20" } vs { "age": 20 } inside the Live Zod 4 Trust-Boundary Runner on the right.',
    },
    reflection:
      'When would you intentionally choose parse() (throwing) over safeParse() (returning a discriminated result)?',
    sources: [
      { label: 'Zod 4 Basics', url: 'https://zod.dev/basics' },
      { label: 'Zod API Reference', url: 'https://zod.dev/api' },
    ],
    relatedReferenceIds: ['zod-safeparse'],
    waveformEnergy: [0.35, 0.62, 0.8, 0.55],
  },

  '15.02.04': {
    id: '15.02.04',
    headline: 'The authorization bug that slips past login',
    subtitle: 'Valid authentication proves identity—not permission to access another organization’s record',
    stackBadge: 'NestJS · Prisma 7 · Supabase Auth · Track 15 · Sample authored draft',
    level: 'Advanced',
    estMinutes: 45,
    duration: 85,
    seed: 20261502,
    fileName: 'src/projects/projects.service.ts',
    sandboxMode: 'idor-sim',
    problem:
      'User A signs in with a valid JWT and requests GET /projects/prj_a_101. Now they swap the URL parameter to prj_b_202, which belongs to Organization Beta. A route guard that only verifies the JWT lets the request through. That vulnerability is Broken Object Level Authorization (BOLA/IDOR).',
    objectives: [
      'Separate authentication (who you are) from object-level authorization (what record you may touch)',
      'Recognize why a JWT auth guard alone cannot prevent IDOR vulnerabilities',
      'Scope Prisma queries by verified tenant membership and explicit permission checks',
      'Write negative cross-tenant integration tests for positive proof of isolation',
    ],
    predictFirst: {
      prompt: 'If a client sends organizationId in the JSON request body alongside a valid JWT, can the backend trust that field?',
      answer:
        'Never. Treat requested organizationId as untrusted user input—verify server-side that the authenticated principal holds an active membership and required permission in that organization.',
    },
    mentalSummary:
      'Every protected read or mutation passes two gates: (1) authenticate the principal (401 if invalid), then (2) verify object/tenant policy server-side before querying with an explicit tenant predicate (403/404 if unauthorized).',
    mentalFlow: [
      { label: 'Verify JWT', caption: '401 if missing, expired, or forged signature', accent: 'cyan' },
      { label: 'Check Policy', caption: 'Verify principal membership & role in org', accent: 'violet' },
      { label: 'Scoped Query', caption: 'Prisma findFirst({ id, organizationId })', accent: 'cyan' },
      { label: '403 / 404 or Data', caption: 'Deny cross-tenant reads & minimize fields', accent: 'emerald' },
    ],
    chapters: [
      { t: 0, label: 'Vulnerable Lookup', color: '#00F0FF' },
      { t: 22, label: 'Policy Verification', color: '#8A2BE2' },
      { t: 45, label: 'Tenant-Scoped Query', color: '#10B981' },
      { t: 68, label: 'Negative E2E Tests', color: '#00F0FF' },
    ],
    steps: [
      {
        id: 'authz-1',
        at: 0,
        file: 'src/projects/projects.service.ts',
        title: 'Spot the IDOR lookup by bare ID',
        copy: 'Looking up a record solely by primary key ignores tenant boundaries. Any signed-in user with an ID can leak foreign records.',
        expected: 'Fails negative security check: User A reads Org B project.',
        code: AUTHZ_S1,
        highlightLines: [3, 4, 5],
        checkpoint: true,
      },
      {
        id: 'authz-2',
        at: 22,
        file: 'src/projects/projects.service.ts',
        title: 'Derive authorized tenant scope server-side',
        copy: 'Verify the caller’s membership and permission in the target organization before running the resource query.',
        expected: 'Rejects forged or non-member organization scopes with 403.',
        code: AUTHZ_S2,
        highlightLines: [7, 8, 9, 10],
        checkpoint: true,
      },
      {
        id: 'authz-3',
        at: 45,
        file: 'src/projects/projects.service.ts',
        title: 'Scope the Prisma query and minimize output',
        copy: 'Combine verified organizationId with id in findFirst and select only safe public columns. Remember privileged Prisma DB roles can bypass Postgres RLS!',
        expected: 'Returns 404/403 when projectId belongs to another tenant.',
        code: AUTHZ_S3,
        highlightLines: [2, 3, 4, 5, 7],
        checkpoint: true,
      },
      {
        id: 'authz-4',
        at: 68,
        file: 'test/projects.e2e-spec.ts',
        title: 'Prove isolation with negative tests',
        copy: 'Test User A reading Org A (allowed), reading Org B (denied), mutating Org B (denied), and spoofing Org B ID in the request body (denied).',
        expected: 'All cross-tenant access attempts return 403 or 404.',
        code: AUTHZ_S4,
        highlightLines: [1, 2, 3, 4, 10],
        checkpoint: true,
      },
    ],
    quiz: {
      question: 'An endpoint verifies a valid JWT signature but fetches any project ID passed in the URL. What control is missing?',
      choices: [
        'A faster B-tree index on the project table',
        'Object-level authorization verifying the caller can access that specific resource',
        'A loading spinner on the frontend',
        'More TypeScript interfaces on the controller',
      ],
      answer: 1,
      explanation:
        'Authentication proves who the user is; authorization must verify whether that user has permission to access the specific target record.',
      misconception: {
        claim: '“Using Supabase Auth + Prisma means Postgres RLS automatically secures every backend query.”',
        correction:
          'Server-side Prisma connections often use privileged service roles that bypass RLS. Enforce and test backend object-level authorization explicitly.',
      },
    },
    challenge: {
      title: 'Author positive + negative tenant isolation tests',
      description:
        'Design the authorization check and test matrix for two separate organizations (Alpha & Beta). Verify User A can read Alpha projects but is denied on Beta reads, writes, and spoofed org payloads.',
      starterCode: AUTHZ_S1,
      hint: 'Check membership of the verified principal against the resource’s organizationId, then use findFirst({ where: { id, organizationId } }).',
      solution: `${AUTHZ_S2}\n\n${AUTHZ_S3}`,
      rubric: [
        'Resource permission is verified server-side from trusted membership',
        'User-supplied organizationId is never trusted without membership verification',
        'Cross-tenant reads are denied (403 or 404)',
        'Cross-tenant mutations and attachments are denied and covered by negative tests',
      ],
    },
    bugHunt: {
      title: 'The valid-token BOLA / IDOR leak',
      symptom:
        'An automated security audit signs in as User A (Org Alpha) and requests GET /v1/projects/prj_b_202 (Org Beta). The API unexpectedly returns 200 OK with Org Beta’s private title.',
      buggyCode: AUTHZ_S1,
      diagnosis:
        'The JwtAuthGuard confirmed User A’s identity, but ProjectsService queried findUnique({ where: { id } }) without verifying tenant ownership. Enforce requireOrgAccess + tenant-scoped findFirst and add a negative E2E test.',
      fixNote: 'Test both Vulnerable and Tenant-Scoped modes in the interactive IDOR Simulator on the right.',
    },
    reflection:
      'Where else besides primary REST GET routes can object-level authorization accidentally be skipped (file downloads, exports, WebSockets, background jobs)?',
    sources: [
      { label: 'OWASP API Security Top 10 (API1: BOLA)', url: 'https://owasp.org/API-Security/' },
      { label: 'NestJS Guards Documentation', url: 'https://docs.nestjs.com/guards' },
      { label: 'Supabase Row Level Security', url: 'https://supabase.com/docs/guides/database/postgres/row-level-security' },
    ],
    relatedReferenceIds: ['nestjs-useguards', 'nestjs-canactivate', 'prisma-transaction'],
    waveformEnergy: [0.4, 0.68, 0.85, 0.58],
  },
};

export const AUTHORED_LESSON_IDS = ['06.01.01', '07.02.01', '09.01.02', '15.02.04'] as const;

/* ------------------------------------------------------------------ */
/* 4 Authored Reference Pages (9-part reference encyclopedia format)    */
/* ------------------------------------------------------------------ */

export const AUTHORED_REFERENCES: AuthoredReference[] = [
{
  "id": "prisma-findmany",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "findMany"
  ],
  "heading": "Prisma: findMany",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Query a filtered collection.",
  "syntax": "prisma.task.findMany({ take: 20 })",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "Returns an array of selected records.",
  "minimalExample": "prisma.task.findMany({ take: 20 })",
  "productionExample": "await prisma.task.findMany({ where: { workspaceId: authorizedWorkspaceId }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 20, select: { id: true, title: true } })",
  "commonMistakes": [
    "Never accept an arbitrary workspace ID as proof of access."
  ],
  "securityPerformanceNotes": [
    "Bound result size and use deterministic ordering."
  ],
  "relatedLessonIds": [
    "13.02.01"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference"
},
{
  "id": "prisma-select",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "select"
  ],
  "heading": "Prisma: select",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Choose only required response fields.",
  "syntax": "prisma.user.findMany({ select: { id: true } })",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "Returns a projection of matching records.",
  "minimalExample": "prisma.user.findMany({ select: { id: true } })",
  "productionExample": "await prisma.user.findUnique({ where: { id: verifiedUserId }, select: { id: true, displayName: true } })",
  "commonMistakes": [
    "Do not combine select and include at the same query level."
  ],
  "securityPerformanceNotes": [
    "Omit private fields explicitly; selection is not authorization."
  ],
  "relatedLessonIds": [
    "13.02.02"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/prisma-client/queries/select-fields"
},
{
  "id": "prisma-transaction",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "$transaction"
  ],
  "heading": "Prisma: $transaction",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Execute related changes atomically.",
  "syntax": "await prisma.$transaction([queryA, queryB])",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "Returns the callback result or array of operation results; failure rolls back.",
  "minimalExample": "await prisma.$transaction([queryA, queryB])",
  "productionExample": "await prisma.$transaction(async tx => {\n  const project = await tx.project.findFirstOrThrow({ where: { id: projectId, organizationId: authorizedOrganizationId } });\n  await tx.task.create({ data: { projectId: project.id, title } });\n  await tx.outboxEvent.create({ data: { topic: 'task.created', payload: { projectId: project.id } } });\n});",
  "commonMistakes": [
    "Calling the outer client inside a callback escapes its transaction.",
    "External network calls inside the transaction increase lock duration and cannot be rolled back by PostgreSQL."
  ],
  "securityPerformanceNotes": [
    "Keep the transaction short and avoid external network calls.",
    "Use bounded whole-transaction retries for serialization conflicts, and a transactional outbox for side effects."
  ],
  "relatedLessonIds": [
    "13.02.04",
    "15.02.04",
    "16.04.01"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/prisma-client/queries/transactions"
},
{
  "id": "prisma-queryraw",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "$queryRaw"
  ],
  "heading": "Prisma: $queryRaw",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Execute parameterized raw SQL when ORM queries are insufficient.",
  "syntax": "await prisma.$queryRaw`SELECT 1`",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "Returns query rows; runtime shape still requires validation.",
  "minimalExample": "await prisma.$queryRaw`SELECT 1`",
  "productionExample": "await prisma.$queryRaw`SELECT id, title FROM tasks WHERE workspace_id = ${authorizedWorkspaceId} LIMIT 20`",
  "commonMistakes": [
    "Do not concatenate untrusted text or use placeholders for SQL identifiers."
  ],
  "securityPerformanceNotes": [
    "Enforce authorization and whitelist any dynamic identifiers."
  ],
  "relatedLessonIds": [
    "13.03.01"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference"
},
{
  "id": "supabase-getclaims",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "getClaims"
  ],
  "heading": "Supabase: getClaims",
  "category": "Supabase",
  "majorVersion": "supabase-js 2",
  "status": "Authored reference draft",
  "summary": "Verify the access token and obtain claims.",
  "syntax": "const { data, error } = await supabase.auth.getClaims()",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "Verified claims or an error.",
  "minimalExample": "const { data, error } = await supabase.auth.getClaims()",
  "productionExample": "const result = await supabase.auth.getClaims(); if (result.error || !result.data?.claims.sub) throw new Error('Unauthorized'); const userId = result.data.claims.sub;",
  "commonMistakes": [
    "Do not trust editable user metadata for authorization."
  ],
  "securityPerformanceNotes": [
    "Claims can be stale; check current resource membership for sensitive operations."
  ],
  "relatedLessonIds": [
    "14.02.06"
  ],
  "canonicalUrl": "https://supabase.com/docs/reference/javascript/auth-getclaims"
},
{
  "id": "supabase-rls-policy",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "RLS policy"
  ],
  "heading": "Supabase: RLS policy",
  "category": "Supabase",
  "majorVersion": "Supabase / PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Restrict rows visible to API roles.",
  "syntax": "ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;",
  "lang": "sql",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "Controls which rows a role may read or modify.",
  "minimalExample": "ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;",
  "productionExample": "CREATE POLICY own_tasks ON public.tasks FOR SELECT TO authenticated USING ((SELECT auth.uid()) = owner_id);",
  "commonMistakes": [
    "TO authenticated alone does not enforce ownership."
  ],
  "securityPerformanceNotes": [
    "Grant only required table privileges and test with two distinct identities."
  ],
  "relatedLessonIds": [
    "14.03.01"
  ],
  "canonicalUrl": "https://supabase.com/docs/guides/database/postgres/row-level-security"
},
{
  "id": "supabase-auth-uid",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "auth.uid"
  ],
  "heading": "Supabase: auth.uid",
  "category": "Supabase",
  "majorVersion": "Supabase / PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Resolve the requesting user ID inside SQL policies.",
  "syntax": "SELECT auth.uid();",
  "lang": "sql",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "A user UUID or null when unauthenticated.",
  "minimalExample": "SELECT auth.uid();",
  "productionExample": "CREATE POLICY own_task_update ON public.tasks FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = owner_id) WITH CHECK ((SELECT auth.uid()) = owner_id);",
  "commonMistakes": [
    "An UPDATE also requires an appropriate SELECT policy."
  ],
  "securityPerformanceNotes": [
    "Test ownership changes and cross-user writes, not just successful updates."
  ],
  "relatedLessonIds": [
    "14.03.02"
  ],
  "canonicalUrl": "https://supabase.com/docs/guides/database/postgres/row-level-security"
},
{
  "id": "supabase-service-role-key",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "Service role key"
  ],
  "heading": "Supabase: Service role key",
  "category": "Supabase",
  "majorVersion": "supabase-js 2",
  "status": "Authored reference draft",
  "summary": "Use privileged API credentials only in trusted server code.",
  "syntax": "const secret = process.env.SUPABASE_SECRET_KEY;",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "A privileged credential, not a user identity.",
  "minimalExample": "const secret = process.env.SUPABASE_SECRET_KEY;",
  "productionExample": "if (!process.env.SUPABASE_SECRET_KEY) throw new Error('Missing server credential'); // Create a separate server-only admin client; authorize the caller before every privileged operation.",
  "commonMistakes": [
    "Never put secret or legacy service_role keys in NEXT_PUBLIC variables."
  ],
  "securityPerformanceNotes": [
    "Prefer scoped user clients where possible; redact secrets from logs."
  ],
  "relatedLessonIds": [
    "14.03.06"
  ],
  "canonicalUrl": "https://supabase.com/docs/guides/getting-started/api-keys"
},
{
  "id": "redis-get",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "GET"
  ],
  "heading": "Redis & BullMQ: GET",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis",
  "status": "Authored reference draft",
  "summary": "Read a cached string value.",
  "syntax": "GET task:42",
  "lang": "bash",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "String value or nil for a missing key.",
  "minimalExample": "GET task:42",
  "productionExample": "GET workspace:demo:task:42:v1",
  "commonMistakes": [
    "A cache hit does not prove current user authorization."
  ],
  "securityPerformanceNotes": [
    "Scope cache keys and authorize requests before returning cached data."
  ],
  "relatedLessonIds": [
    "16.01.03"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/get/"
},
{
  "id": "redis-set-ex",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "SET EX"
  ],
  "heading": "Redis & BullMQ: SET EX",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis",
  "status": "Authored reference draft",
  "summary": "Store a string with a bounded lifetime.",
  "syntax": "SET demo value EX 60",
  "lang": "bash",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "OK on successful write.",
  "minimalExample": "SET demo value EX 60",
  "productionExample": "SET workspace:demo:summary:v1 '{\"count\":4}' EX 120",
  "commonMistakes": [
    "TTL is not an invalidation strategy by itself."
  ],
  "securityPerformanceNotes": [
    "Do not store credentials in general-purpose caches; bound lifetime and memory."
  ],
  "relatedLessonIds": [
    "16.01.02"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/set/"
},
{
  "id": "redis-scan",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "SCAN"
  ],
  "heading": "Redis & BullMQ: SCAN",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis",
  "status": "Authored reference draft",
  "summary": "Incrementally iterate keys without using a blocking KEYS scan.",
  "syntax": "SCAN 0",
  "lang": "bash",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "A next cursor and a batch of keys.",
  "minimalExample": "SCAN 0",
  "productionExample": "SCAN 0 MATCH workspace:demo:* COUNT 100",
  "commonMistakes": [
    "A nonzero cursor with an empty batch is not completion."
  ],
  "securityPerformanceNotes": [
    "SCAN may return duplicates; COUNT is a hint and cluster scans need shard awareness."
  ],
  "relatedLessonIds": [
    "16.02.07"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/scan/"
},
{
  "id": "redis-attempts",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "attempts"
  ],
  "heading": "Redis & BullMQ: attempts",
  "category": "Redis & BullMQ",
  "majorVersion": "BullMQ 5",
  "status": "Authored reference draft",
  "summary": "Bound retry attempts for failed jobs.",
  "syntax": "await queue.add('notify', payload, { attempts: 3 })",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "A queued job with configured retry policy.",
  "minimalExample": "await queue.add('notify', payload, { attempts: 3 })",
  "productionExample": "await queue.add('notify', { eventId }, { attempts: 4, backoff: { type: 'exponential', delay: 1000 } })",
  "commonMistakes": [
    "A retried job can repeat a side effect after a worker crash."
  ],
  "securityPerformanceNotes": [
    "Make the handler idempotent; do not retry permanent failures indefinitely."
  ],
  "relatedLessonIds": [
    "16.03.04"
  ],
  "canonicalUrl": "https://docs.bullmq.io/guide/jobs/retrying-job"
},
{
  "id": "testing-vitest-test",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "Vitest test"
  ],
  "heading": "Testing & Operations: Vitest test",
  "category": "Testing & Operations",
  "majorVersion": "Vitest",
  "status": "Authored reference draft",
  "summary": "Describe an observable test case.",
  "syntax": "test('adds', () => expect(1 + 2).toBe(3))",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "A registered test with pass/fail outcome.",
  "minimalExample": "test('adds', () => expect(1 + 2).toBe(3))",
  "productionExample": "test('rejects an overdraft', () => { expect(() => debit(10, 11)).toThrow(); })",
  "commonMistakes": [
    "Do not assert only that an implementation was called."
  ],
  "securityPerformanceNotes": [
    "Test business invariants and negative cases without production credentials."
  ],
  "relatedLessonIds": [
    "19.01.02"
  ],
  "canonicalUrl": "https://vitest.dev/api/"
},
{
  "id": "testing-page-getbyrole",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "page.getByRole"
  ],
  "heading": "Testing & Operations: page.getByRole",
  "category": "Testing & Operations",
  "majorVersion": "Playwright",
  "status": "Authored reference draft",
  "summary": "Locate a control by accessible role and name.",
  "syntax": "page.getByRole('button', { name: 'Save' })",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "A locator that can be awaited or asserted.",
  "minimalExample": "page.getByRole('button', { name: 'Save' })",
  "productionExample": "await page.getByRole('button', { name: 'Save task' }).click(); await expect(page.getByRole('status')).toHaveText('Task saved');",
  "commonMistakes": [
    "Do not rely on arbitrary sleeps or CSS implementation details."
  ],
  "securityPerformanceNotes": [
    "Role selectors improve semantic coverage but do not replace manual accessibility review."
  ],
  "relatedLessonIds": [
    "19.02.02"
  ],
  "canonicalUrl": "https://playwright.dev/docs/locators"
},
{
  "id": "testing-idempotency-key",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "idempotency key"
  ],
  "heading": "Testing & Operations: idempotency key",
  "category": "Testing & Operations",
  "majorVersion": "HTTP application contract",
  "status": "Authored reference draft",
  "summary": "Identify one logical write across retries.",
  "syntax": "Idempotency-Key: operation-uuid",
  "lang": "ts",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "Server-defined replay or conflict response.",
  "minimalExample": "Idempotency-Key: operation-uuid",
  "productionExample": "const key = crypto.randomUUID(); // Persist for this logical action.\nawait fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify(draft) });",
  "commonMistakes": [
    "A new key on each retry can duplicate a completed operation."
  ],
  "securityPerformanceNotes": [
    "Bind the key to authenticated identity and payload; atomically persist outcome."
  ],
  "relatedLessonIds": [
    "10.02.04"
  ],
  "canonicalUrl": "https://docs.stripe.com/api/idempotent_requests"
},
{
  "id": "testing-dockerfile",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "Dockerfile"
  ],
  "heading": "Testing & Operations: Dockerfile",
  "category": "Testing & Operations",
  "majorVersion": "Docker",
  "status": "Authored reference draft",
  "summary": "Define a reproducible image build.",
  "syntax": "FROM node:24-bookworm-slim",
  "lang": "bash",
  "parameters": "See syntax and official reference; production-oriented snippets assume configured clients, schemas and authorized context.",
  "returns": "An image built from instructions.",
  "minimalExample": "FROM node:24-bookworm-slim",
  "productionExample": "FROM node:24-bookworm-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY --chown=node:node . .\nUSER node\nCMD [\"node\", \"server.js\"]",
  "commonMistakes": [
    "Never copy secrets or node_modules into the build context."
  ],
  "securityPerformanceNotes": [
    "Use .dockerignore, verified digest pinning and non-root runtime; example assumes a JS server and real lockfile."
  ],
  "relatedLessonIds": [
    "20.01.01"
  ],
  "canonicalUrl": "https://docs.docker.com/reference/dockerfile/"
},
{
  "id": "nestjs-module",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "@Module"
  ],
  "heading": "NestJS: @Module",
  "category": "NestJS",
  "majorVersion": "NestJS 12 (curriculum target)",
  "status": "Authored reference draft",
  "summary": "Groups providers and controllers; exports expose selected providers to importing modules.",
  "syntax": "@Module({ providers: [TaskService], exports: [TaskService] })",
  "lang": "ts",
  "parameters": "Framework-managed classes and request context; snippets assume relevant imports.",
  "returns": "Groups providers and controllers; exports expose selected providers to importing modules.",
  "minimalExample": "@Module({ providers: [TaskService], exports: [TaskService] })",
  "productionExample": "@Module({ providers: [TaskService], exports: [TaskService] })\nclass TasksModule {}\n@Module({ imports: [TasksModule], controllers: [ReportsController] })\nclass ReportsModule {}",
  "commonMistakes": [
    "Import the module that exports the dependency, not a duplicate provider."
  ],
  "securityPerformanceNotes": [
    "Validate untrusted input and enforce authorization separately."
  ],
  "relatedLessonIds": [
    "11.01.01"
  ],
  "canonicalUrl": "https://docs.nestjs.com/modules"
},
{
  "id": "nestjs-injectable",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "@Injectable"
  ],
  "heading": "NestJS: @Injectable",
  "category": "NestJS",
  "majorVersion": "NestJS 12 (curriculum target)",
  "status": "Authored reference draft",
  "summary": "Marks a class for dependency injection; registration in a module is still required.",
  "syntax": "@Injectable()\nclass TaskService {}",
  "lang": "ts",
  "parameters": "Framework-managed classes and request context; snippets assume relevant imports.",
  "returns": "Marks a class for dependency injection; registration in a module is still required.",
  "minimalExample": "@Injectable()\nclass TaskService {}",
  "productionExample": "@Injectable()\nclass TaskService { constructor(@Inject(TASK_REPOSITORY) private readonly repo: TaskRepository) {} }",
  "commonMistakes": [
    "Do not instantiate injected services manually in controllers."
  ],
  "securityPerformanceNotes": [
    "Validate untrusted input and enforce authorization separately."
  ],
  "relatedLessonIds": [
    "11.01.01"
  ],
  "canonicalUrl": "https://docs.nestjs.com/providers"
},
{
  "id": "nestjs-canactivate",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "CanActivate"
  ],
  "heading": "NestJS: CanActivate",
  "category": "NestJS",
  "majorVersion": "NestJS 12 (curriculum target)",
  "status": "Authored reference draft",
  "summary": "A guard decides whether a route may proceed before pipes run. An authenticated principal still needs object-level authorization.",
  "syntax": "canActivate(context: ExecutionContext): boolean { return false; }",
  "lang": "ts",
  "parameters": "ExecutionContext exposes request and handler metadata. Guards may return boolean, Promise<boolean> or Observable<boolean>.",
  "returns": "True permits execution; false normally produces HTTP 403. An authentication guard may throw HTTP 401.",
  "minimalExample": "canActivate(context: ExecutionContext): boolean { return false; }",
  "productionExample": "@Injectable()\nclass MembershipGuard implements CanActivate {\n constructor(private readonly policy: MembershipPolicy) {}\n async canActivate(ctx: ExecutionContext) { const request = ctx.switchToHttp().getRequest(); if (!request.user) return false; return this.policy.canRead(request.user, request.params.workspaceId); }\n}",
  "commonMistakes": [
    "Deny by default; verify resource ownership in the service too.",
    "Do not authorize using an unverified route ID or assume pipes have already validated it."
  ],
  "securityPerformanceNotes": [
    "Validate untrusted input and enforce authorization separately.",
    "Verify identity before membership checks; repeat object-level authorization in tenant-scoped service queries."
  ],
  "relatedLessonIds": [
    "11.02.03",
    "15.02.04"
  ],
  "canonicalUrl": "https://docs.nestjs.com/guards"
},
{
  "id": "nestjs-pipetransform",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "PipeTransform"
  ],
  "heading": "NestJS: PipeTransform",
  "category": "NestJS",
  "majorVersion": "NestJS 12 (curriculum target)",
  "status": "Authored reference draft",
  "summary": "Transforms or validates an argument before the handler.",
  "syntax": "transform(value: unknown) { return schema.parse(value); }",
  "lang": "ts",
  "parameters": "Framework-managed classes and request context; snippets assume relevant imports.",
  "returns": "Transforms or validates an argument before the handler.",
  "minimalExample": "transform(value: unknown) { return schema.parse(value); }",
  "productionExample": "@Injectable()\nclass TaskPipe implements PipeTransform {\n transform(value: unknown) { const parsed = taskSchema.safeParse(value); if (!parsed.success) throw new BadRequestException('Invalid task'); return parsed.data; }\n}",
  "commonMistakes": [
    "Map validation failures to BadRequestException rather than leaking schema internals."
  ],
  "securityPerformanceNotes": [
    "Validate untrusted input and enforce authorization separately."
  ],
  "relatedLessonIds": [
    "11.02.02"
  ],
  "canonicalUrl": "https://docs.nestjs.com/pipes"
},
{
  "id": "nestjs-nestinterceptor",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "NestInterceptor"
  ],
  "heading": "NestJS: NestInterceptor",
  "category": "NestJS",
  "majorVersion": "NestJS 12 (curriculum target)",
  "status": "Authored reference draft",
  "summary": "Wraps handler execution with an observable.",
  "syntax": "intercept(context: ExecutionContext, next: CallHandler) { return next.handle(); }",
  "lang": "ts",
  "parameters": "Framework-managed classes and request context; snippets assume relevant imports.",
  "returns": "Wraps handler execution with an observable.",
  "minimalExample": "intercept(context: ExecutionContext, next: CallHandler) { return next.handle(); }",
  "productionExample": "intercept(_context: ExecutionContext, next: CallHandler) { const started = performance.now(); return next.handle().pipe(finalize(() => metrics.observe(performance.now() - started))); }",
  "commonMistakes": [
    "Do not subscribe manually or swallow errors."
  ],
  "securityPerformanceNotes": [
    "Validate untrusted input and enforce authorization separately."
  ],
  "relatedLessonIds": [
    "11.02.04"
  ],
  "canonicalUrl": "https://docs.nestjs.com/interceptors"
},
{
  "id": "nestjs-exceptionfilter",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "ExceptionFilter"
  ],
  "heading": "NestJS: ExceptionFilter",
  "category": "NestJS",
  "majorVersion": "NestJS 12 (curriculum target)",
  "status": "Authored reference draft",
  "summary": "Handles matching uncaught exceptions at a transport boundary.",
  "syntax": "@Catch(HttpException)\nclass Filter implements ExceptionFilter { catch(e: HttpException, host: ArgumentsHost) { host.switchToHttp().getResponse().status(e.getStatus()).json({statusCode:e.getStatus()}); } }",
  "lang": "ts",
  "parameters": "Framework-managed classes and request context; snippets assume relevant imports.",
  "returns": "Handles matching uncaught exceptions at a transport boundary.",
  "minimalExample": "@Catch(HttpException)\nclass Filter implements ExceptionFilter { catch(e: HttpException, host: ArgumentsHost) { host.switchToHttp().getResponse().status(e.getStatus()).json({statusCode:e.getStatus()}); } }",
  "productionExample": "@Catch(HttpException)\nclass SafeHttpFilter implements ExceptionFilter { catch(error: HttpException, host: ArgumentsHost) { const status = error.getStatus(); host.switchToHttp().getResponse().status(status).json({ statusCode: status, message: status >= 500 ? 'Internal error' : 'Request rejected' }); } }",
  "commonMistakes": [
    "Never expose stack traces or database error details."
  ],
  "securityPerformanceNotes": [
    "Validate untrusted input and enforce authorization separately."
  ],
  "relatedLessonIds": [
    "11.02.05"
  ],
  "canonicalUrl": "https://docs.nestjs.com/exception-filters"
},
{
  "id": "postgresql-on-conflict",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "ON CONFLICT"
  ],
  "heading": "PostgreSQL: ON CONFLICT",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL 17+",
  "status": "Authored reference draft",
  "summary": "Handles unique constraint conflicts atomically.",
  "syntax": "INSERT INTO requests(id) VALUES ($1) ON CONFLICT (id) DO NOTHING RETURNING id;",
  "lang": "sql",
  "parameters": "SQL identifiers and bound values; examples assume the named tables exist.",
  "returns": "Handles unique constraint conflicts atomically.",
  "minimalExample": "INSERT INTO requests(id) VALUES ($1) ON CONFLICT (id) DO NOTHING RETURNING id;",
  "productionExample": "INSERT INTO requests(tenant_id, request_id, payload_hash) VALUES ($1, $2, $3) ON CONFLICT (tenant_id, request_id) DO NOTHING RETURNING request_id;\n-- If no row returns, compare the persisted payload hash before replay.",
  "commonMistakes": [
    "A duplicate key alone does not establish identical request payloads."
  ],
  "securityPerformanceNotes": [
    "Use parameterized queries and a least-privilege database role."
  ],
  "relatedLessonIds": [
    "12.03.06"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/sql-insert.html"
},
{
  "id": "postgresql-transaction-isolation",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "transaction isolation"
  ],
  "heading": "PostgreSQL: transaction isolation",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL 17+",
  "status": "Authored reference draft",
  "summary": "Controls which concurrent changes a transaction can observe.",
  "syntax": "BEGIN ISOLATION LEVEL SERIALIZABLE;\n-- perform related reads and writes\nCOMMIT;",
  "lang": "sql",
  "parameters": "SQL identifiers and bound values; examples assume the named tables exist.",
  "returns": "Controls which concurrent changes a transaction can observe.",
  "minimalExample": "BEGIN ISOLATION LEVEL SERIALIZABLE;\n-- perform related reads and writes\nCOMMIT;",
  "productionExample": "BEGIN ISOLATION LEVEL SERIALIZABLE;\nUPDATE inventory SET available = available - 1 WHERE id = 1 AND available >= 1 RETURNING available;\n-- Inspect the returned row; retry the whole transaction on 40001.\nCOMMIT;",
  "commonMistakes": [
    "Retry the whole transaction on SQLSTATE 40001, not just the last statement."
  ],
  "securityPerformanceNotes": [
    "Use parameterized queries and a least-privilege database role."
  ],
  "relatedLessonIds": [
    "12.03.01"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/transaction-iso.html"
},
{
  "id": "postgresql-mvcc",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "MVCC"
  ],
  "heading": "PostgreSQL: MVCC",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL 17+",
  "status": "Authored reference draft",
  "summary": "Uses row versions and snapshots to support concurrent access.",
  "syntax": "BEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT * FROM tasks;\nCOMMIT;",
  "lang": "sql",
  "parameters": "SQL identifiers and bound values; examples assume the named tables exist.",
  "returns": "Uses row versions and snapshots to support concurrent access.",
  "minimalExample": "BEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT * FROM tasks;\nCOMMIT;",
  "productionExample": "BEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT count(*) FROM tasks WHERE workspace_id = 1;\n-- Another session commits a new task here.\nSELECT count(*) FROM tasks WHERE workspace_id = 1;\nCOMMIT;",
  "commonMistakes": [
    "Long-lived transactions can delay cleanup of obsolete row versions."
  ],
  "securityPerformanceNotes": [
    "Use parameterized queries and a least-privilege database role."
  ],
  "relatedLessonIds": [
    "12.03.03"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/mvcc.html"
},
{
  "id": "postgresql-unique",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "UNIQUE"
  ],
  "heading": "PostgreSQL: UNIQUE",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL 17+",
  "status": "Authored reference draft",
  "summary": "Enforces uniqueness under concurrent writes.",
  "syntax": "ALTER TABLE requests ADD UNIQUE (tenant_id, request_id);",
  "lang": "sql",
  "parameters": "SQL identifiers and bound values; examples assume the named tables exist.",
  "returns": "Enforces uniqueness under concurrent writes.",
  "minimalExample": "ALTER TABLE requests ADD UNIQUE (tenant_id, request_id);",
  "productionExample": "CREATE TABLE request_keys (tenant_id bigint NOT NULL, request_id uuid NOT NULL, UNIQUE (tenant_id, request_id));",
  "commonMistakes": [
    "A pre-insert SELECT is not a substitute for a unique constraint."
  ],
  "securityPerformanceNotes": [
    "Use parameterized queries and a least-privilege database role."
  ],
  "relatedLessonIds": [
    "12.03.06"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/ddl-constraints.html"
},
{
  "id": "postgresql-check",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "CHECK"
  ],
  "heading": "PostgreSQL: CHECK",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL 17+",
  "status": "Authored reference draft",
  "summary": "Enforces a row-level predicate on inserted or updated values.",
  "syntax": "ALTER TABLE accounts ADD CHECK (balance >= 0);",
  "lang": "sql",
  "parameters": "SQL identifiers and bound values; examples assume the named tables exist.",
  "returns": "Enforces a row-level predicate on inserted or updated values.",
  "minimalExample": "ALTER TABLE accounts ADD CHECK (balance >= 0);",
  "productionExample": "CREATE TABLE inventory (id bigint PRIMARY KEY, available integer NOT NULL CHECK (available >= 0));",
  "commonMistakes": [
    "CHECK permits unknown results; use NOT NULL when absence is invalid."
  ],
  "securityPerformanceNotes": [
    "Use parameterized queries and a least-privilege database role."
  ],
  "relatedLessonIds": [
    "12.03.07"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/ddl-constraints.html"
},
{
  "id": "postgresql-returning",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "RETURNING"
  ],
  "heading": "PostgreSQL: RETURNING",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL 17+",
  "status": "Authored reference draft",
  "summary": "Returns rows affected by a write without a separate read.",
  "syntax": "UPDATE tasks SET revision=revision+1 WHERE id=$1 AND revision=$2 RETURNING revision;",
  "lang": "sql",
  "parameters": "SQL identifiers and bound values; examples assume the named tables exist.",
  "returns": "Returns rows affected by a write without a separate read.",
  "minimalExample": "UPDATE tasks SET revision=revision+1 WHERE id=$1 AND revision=$2 RETURNING revision;",
  "productionExample": "UPDATE tasks SET done = true, revision = revision + 1 WHERE workspace_id = $1 AND id = $2 AND revision = $3 RETURNING id, revision;",
  "commonMistakes": [
    "Zero returned rows may indicate a stale revision or missing resource."
  ],
  "securityPerformanceNotes": [
    "Use parameterized queries and a least-privilege database role."
  ],
  "relatedLessonIds": [
    "12.03.04"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/dml-returning.html"
},
{
  "id": "nestjs-useguards",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "@UseGuards"
  ],
  "heading": "NestJS: @UseGuards",
  "category": "NestJS · Authorization",
  "majorVersion": "NestJS 12 (curriculum target)",
  "status": "Authored reference draft",
  "summary": "Bind guards to a controller or handler. Authentication and resource authorization are separate decisions.",
  "syntax": "@UseGuards(AuthGuard, MembershipGuard)",
  "lang": "ts",
  "parameters": "Guard classes or instances; class-based registration enables dependency injection.",
  "returns": "A decorator that attaches guard metadata.",
  "minimalExample": "@UseGuards(AuthGuard)\n@Get('profile')\nprofile() { return { ok: true }; }",
  "productionExample": "@UseGuards(JwtAuthGuard, OrgMembershipGuard)\n@Get(':id')\nfindProject(@Param('id') id: string, @CurrentPrincipal() principal: VerifiedPrincipal) {\n  return this.projectsService.findAuthorized(principal, id);\n}",
  "commonMistakes": [
    "Assuming a valid JWT authorizes access to every object ID.",
    "Assuming pipes have validated route parameters before a guard runs."
  ],
  "securityPerformanceNotes": [
    "Validate raw identifiers used by guards and enforce tenant scope in database queries."
  ],
  "relatedLessonIds": [
    "11.02.03",
    "15.02.03"
  ],
  "canonicalUrl": "https://docs.nestjs.com/guards"
},
{
  "id": "nestjs-app-guard",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "APP_GUARD"
  ],
  "heading": "NestJS: APP_GUARD",
  "category": "NestJS · Authorization",
  "majorVersion": "NestJS 12 (curriculum target)",
  "status": "Authored reference draft",
  "summary": "Register a global guard through the provider system so dependency injection remains available.",
  "syntax": "{ provide: APP_GUARD, useClass: AuthGuard }",
  "lang": "ts",
  "parameters": "APP_GUARD injection token from @nestjs/core and a registered guard class.",
  "returns": "A provider registration applying the guard globally.",
  "minimalExample": "@Module({ providers: [{ provide: APP_GUARD, useClass: AuthGuard }] })\nclass AppModule {}",
  "productionExample": "@Module({ imports: [IdentityModule], providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }] })\nclass ApiModule {}\n// Explicitly declare public routes and test that protected routes deny unauthenticated requests.",
  "commonMistakes": [
    "Using global authentication as a replacement for object-level authorization.",
    "Allowing routes by default when public-route metadata is absent."
  ],
  "securityPerformanceNotes": [
    "Keep public-route exceptions narrow and verify denied requests in integration tests."
  ],
  "relatedLessonIds": [
    "11.02.03",
    "11.02.08"
  ],
  "canonicalUrl": "https://docs.nestjs.com/guards"
},

  {
    id: 'zod-safeparse',
    matchCategories: ['Zod'],
    matchTitles: ['safeParse'],
    heading: 'Zod 4: schema.safeParse()',
    category: 'Zod · Runtime validation',
    majorVersion: 'Zod 4',
    status: 'Authored reference draft',
    summary:
      'Validate an unknown value without throwing on ordinary validation failures. Returns a discriminated union containing validated typed data or a structured ZodError.',
    syntax: 'const result = schema.safeParse(input);',
    lang: 'ts',
    parameters: 'input: unknown — any untrusted value (request body, API JSON, env, form payload) checked against schema.',
    returns: '{ success: true, data: Output } | { success: false, error: ZodError }',
    minimalExample: `import * as z from 'zod';

const AgeSchema = z.number().int().nonnegative();
const result = AgeSchema.safeParse('25');

console.log(result.success); // false — input is a string`,
    productionExample: `const BodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

const result = BodySchema.safeParse(body);
if (!result.success) {
  return { ok: false as const, errors: z.flattenError(result.error) };
}
return { ok: true as const, value: result.data };`,
    commonMistakes: [
      'Using `as SomeType` in TypeScript instead of validating at runtime.',
      'Assuming `<input type="number">` produces a JS number rather than a string.',
      'Expecting `safeParse` to throw an exception on invalid input (use `parse()` only when throwing is intentional).',
      'Maintaining separate hand-written TS interfaces that drift from the schema instead of using `z.infer`.',
    ],
    securityPerformanceNotes: [
      'Validate every untrusted boundary (HTTP bodies, external APIs, webhooks, stored JSON, environment config).',
      'Map `ZodError` issues to a stable public error envelope; never reflect sensitive raw payloads back in logs or responses.',
    ],
    relatedLessonIds: ['09.01.02'],
    canonicalUrl: 'https://zod.dev/basics',
  },


  {
    id: 'redis-set',
    matchCategories: ['Redis & BullMQ'],
    matchTitles: ['SET'],
    heading: 'Redis: SET with Expiry (EX)',
    category: 'Redis & BullMQ · Cache',
    majorVersion: 'Redis 7+',
    status: 'Authored reference draft',
    summary:
      'Store a string value under a key with an explicit time-to-live (TTL) so cached entries expire automatically.',
    syntax: 'SET cache:user:123 "{\\"name\\":\\"Mika\\"}" EX 60',
    lang: 'redis',
    parameters: 'key (namespaced string), value (serialized bytes/string), EX seconds (or PX ms), optional NX/XX condition.',
    returns: '"OK" if SET succeeded, or nil if an NX/XX precondition was not met.',
    minimalExample: `SET cache:org_1:project:9 "{\\"title\\":\\"Atlas\\"}" EX 60
GET cache:org_1:project:9`,
    productionExample: `// Cache-aside with explicit tenant namespace and bounded TTL
const cacheKey = \`cache:org:\${authorizedOrgId}:project:\${projectId}\`;
await redisCache.set(cacheKey, JSON.stringify(safeDto), 'EX', 60);`,
    commonMistakes: [
      'Omitting tenant/org identifiers from shared cache keys, causing cross-tenant cache leaks.',
      'Treating temporary cache keys as the authoritative system of record.',
      'Sharing one Redis eviction policy between volatile cache and durable BullMQ job queues.',
    ],
    securityPerformanceNotes: [
      'Never share one Redis instance with `allkeys-lru` eviction for both cache and BullMQ queues.',
      'Always define bounded TTLs and explicit invalidation rules on mutations.',
    ],
    relatedLessonIds: ['16.01.02', '16.01.03'],
    canonicalUrl: 'https://redis.io/docs/latest/commands/set/',
  },
{
  "id": "react-usestate",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useState"
  ],
  "heading": "React 19: useState()",
  "category": "React · Component state",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Keep local component state between renders. The returned setter schedules a new render; event handlers observe the state snapshot from their own render.",
  "syntax": "const [value, setValue] = useState(initialValue);",
  "lang": "tsx",
  "parameters": "initialValue: value or lazy initializer function. The initializer runs when React initializes the component state (development Strict Mode may call it twice to check purity).",
  "returns": "[state, setState] — the current render's state and a setter accepting a replacement value or functional updater. Calling the setter does not mutate the current render's snapshot.",
  "minimalExample": "import { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(v => v + 1)}>Count: {count}</button>;\n}",
  "productionExample": "import { useState } from 'react';\n\nexport function QuantityPicker({ initial = 1 }: { initial?: number }) {\n  const [quantity, setQuantity] = useState(initial);\n  return (\n    <label>\n      Quantity\n      <input\n        type=\"number\"\n        min={1}\n        value={quantity}\n        onChange={e => {\n          const next = Number(e.target.value);\n          if (Number.isSafeInteger(next) && next > 0) setQuantity(next);\n        }}\n      />\n    </label>\n  );\n}",
  "commonMistakes": [
    "Calling setState then expecting the existing event handler's local state variable to change synchronously.",
    "Mutating object/array state in place instead of returning a new immutable value.",
    "Copying a derived total into separate state that can become inconsistent."
  ],
  "securityPerformanceNotes": [
    "State lives in the browser; do not store secrets or trust client state as server authorization.",
    "Prefer updater functions when multiple queued changes depend on the previous state.",
    "Never claim React state is durable persistence; refresh/remount behavior depends on component identity and storage architecture."
  ],
  "relatedLessonIds": [
    "06.02.01",
    "06.02.02"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useState"
},
{
  "id": "react-usereducer",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useReducer"
  ],
  "heading": "React 19: useReducer()",
  "category": "React · State transitions",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Move related state transitions into a reducer that accepts the previous state and an explicit action; React handles re-rendering and dispatch.",
  "syntax": "const [state, dispatch] = useReducer(reducer, initialState);",
  "lang": "tsx",
  "parameters": "reducer(state, action) returns the next state; initialState seeds the reducer. Optional init(initialArg) supports lazy initialization.",
  "returns": "[state, dispatch] — current state and a dispatch function. Dispatch queues an action; it does not return the new state.",
  "minimalExample": "import { useReducer } from 'react';\n\nfunction counter(state: number, action: 'add' | 'reset') {\n  return action === 'add' ? state + 1 : 0;\n}\nexport function Counter() {\n  const [count, dispatch] = useReducer(counter, 0);\n  return <button onClick={() => dispatch('add')}>{count}</button>;\n}",
  "productionExample": "type Task = { id: string; text: string; done: boolean };\ntype Action = { type: 'toggle'; id: string } | { type: 'remove'; id: string };\n\nfunction reducer(tasks: readonly Task[], action: Action): Task[] {\n  switch (action.type) {\n    case 'toggle':\n      return tasks.map(t => t.id === action.id ? { ...t, done: !t.done } : t);\n    case 'remove':\n      return tasks.filter(t => t.id !== action.id);\n  }\n}\n// const [tasks, dispatch] = useReducer(reducer, initialTasks);",
  "commonMistakes": [
    "Mutating and returning the same array reference while assuming React can identify the update.",
    "Putting external network requests, timers or DOM mutations into the reducer.",
    "Letting action shapes drift without discriminated union types."
  ],
  "securityPerformanceNotes": [
    "Reducer functions should be deterministic and free of side effects.",
    "Validate untrusted server records before creating reducer actions; TypeScript annotations are not runtime validation.",
    "IDs used in client reducers are not authorization checks; enforce object access on the server."
  ],
  "relatedLessonIds": [
    "06.02.07",
    "06.02.08"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useReducer"
},
{
  "id": "react-useeffect",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useEffect"
  ],
  "heading": "React 19: useEffect()",
  "category": "React · Synchronization",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Synchronize a component with an external browser system after React commits, and dispose of the connection when dependencies change or the component unmounts.",
  "syntax": "useEffect(() => { /* setup */ return () => { /* cleanup */ }; }, [dependency]);",
  "lang": "tsx",
  "parameters": "setup: function that synchronizes an external system and optionally returns cleanup. dependencies: every reactive value read by setup; omit only when the appropriate lifecycle is intentional.",
  "returns": "undefined from useEffect itself. The setup callback may return a cleanup function, which React calls before re-synchronization and on unmount.",
  "minimalExample": "import { useEffect, useState } from 'react';\n\nexport function Width() {\n  const [width, setWidth] = useState(0);\n  useEffect(() => {\n    const onResize = () => setWidth(window.innerWidth);\n    onResize();\n    window.addEventListener('resize', onResize);\n    return () => window.removeEventListener('resize', onResize);\n  }, []);\n  return <output>Width: {width}</output>;\n}",
  "productionExample": "import { useEffect, useState } from 'react';\n\ntype EventBus = { subscribe: (room: string, notify: () => void) => () => void };\nexport function RoomPulse({ roomId, bus }: { roomId: string; bus: EventBus }) {\n  const [pulses, setPulses] = useState(0);\n  useEffect(() => bus.subscribe(roomId, () => setPulses(n => n + 1)), [roomId, bus]);\n  return <p>Room {roomId}: {pulses} updates</p>;\n}",
  "commonMistakes": [
    "Using an Effect to recalculate values derivable during rendering.",
    "Suppressing exhaustive-deps to conceal stale props or closures.",
    "Skipping cleanup for listeners, sockets, timers and async operations, producing duplicate connections."
  ],
  "securityPerformanceNotes": [
    "Effects do not execute during server rendering; browser-only APIs belong in client components.",
    "Async responses may be stale after a dependency change; abort work or ignore obsolete results.",
    "Avoid placing secrets in client-side Effects; client bundles are public."
  ],
  "relatedLessonIds": [
    "06.03.02",
    "06.03.03",
    "06.03.04"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useEffect"
},
{
  "id": "react-useref",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useRef"
  ],
  "heading": "React 19: useRef()",
  "category": "React · Imperative escape hatch",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Preserve a mutable object across renders without causing a render when .current changes. Attach it to a DOM element for permitted imperative operations like focus.",
  "syntax": "const ref = useRef<T>(initialValue);",
  "lang": "tsx",
  "parameters": "initialValue: the first ref.current value; React returns the same ref object on subsequent renders.",
  "returns": "{ current: T } — a stable mutable ref object. Changing current is not a state update and will not re-render a component.",
  "minimalExample": "import { useRef } from 'react';\n\nexport function FocusButton() {\n  const input = useRef<HTMLInputElement>(null);\n  return <>\n    <label htmlFor=\"ref-name\">Name</label>\n    <input id=\"ref-name\" ref={input} />\n    <button onClick={() => input.current?.focus()}>Focus name</button>\n  </>;\n}",
  "productionExample": "import { useRef, useState } from 'react';\n\nexport function Sequence() {\n  const nextId = useRef(0);\n  const [ids, setIds] = useState<number[]>([]);\n  function add() {\n    const id = ++nextId.current;\n    setIds(previous => [...previous, id]);\n  }\n  return <>\n    <button onClick={add}>Create ID</button>\n    <ul>{ids.map(id => <li key={id}>Draft {id}</li>)}</ul>\n  </>;\n}",
  "commonMistakes": [
    "Using a ref for values that must appear reactively in the UI.",
    "Reading or mutating ref.current as part of ordinary render logic.",
    "Assuming ref-generated IDs are globally unique or durable across remounts."
  ],
  "securityPerformanceNotes": [
    "Ref-managed values are in-memory only; do not treat them as durable storage or permission checks.",
    "Focus or measure the DOM in event handlers or appropriate effects, not while rendering.",
    "Guard null DOM refs, including during unmount and conditional rendering."
  ],
  "relatedLessonIds": [
    "06.03.05",
    "06.03.06"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useRef"
},
{
  "id": "react-usecontext",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useContext"
  ],
  "heading": "React 19: useContext()",
  "category": "React · Composition",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Read the nearest provider value for a React Context, avoiding repeated prop threading while keeping provider ownership explicit.",
  "syntax": "const value = useContext(SomeContext);",
  "lang": "tsx",
  "parameters": "SomeContext: context object returned by createContext(defaultValue). Consumers read the closest matching provider above them.",
  "returns": "The current context value. If no provider exists, React returns the default supplied when the Context was created.",
  "minimalExample": "import { createContext, useContext } from 'react';\n\nconst LanguageContext = createContext('en');\nexport function Greeting() {\n  const language = useContext(LanguageContext);\n  return <p>{language === 'en' ? 'Hello' : 'Greetings'}</p>;\n}",
  "productionExample": "import { createContext, useContext, type ReactNode } from 'react';\n\ntype Theme = 'light' | 'dark';\nconst ThemeContext = createContext<Theme | null>(null);\nexport function ThemeProvider({ value, children }: { value: Theme; children: ReactNode }) {\n  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;\n}\nexport function ThemeLabel() {\n  const theme = useContext(ThemeContext);\n  if (theme === null) throw new Error('ThemeProvider is required');\n  return <p>Theme: {theme}</p>;\n}",
  "commonMistakes": [
    "Calling useContext outside a component or custom Hook.",
    "Assuming any nested provider changes are invisible to consumers.",
    "Packing frequently changing, unrelated data in one broad context that causes avoidable re-renders."
  ],
  "securityPerformanceNotes": [
    "Never treat client Context as a trusted authorization boundary or storage for server secrets.",
    "Use an explicit nullable default plus a clear provider error for required services.",
    "Keep provider values stable where relevant; split unrelated contexts."
  ],
  "relatedLessonIds": [
    "06.04.01"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useContext"
},
{
  "id": "react-usetransition",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useTransition"
  ],
  "heading": "React 19: useTransition()",
  "category": "React · Concurrent rendering",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Mark state updates as nonurgent so urgent interactions such as typing can stay responsive while React prepares more expensive work.",
  "syntax": "const [isPending, startTransition] = useTransition();",
  "lang": "tsx",
  "parameters": "startTransition(callback) marks synchronous state updates inside callback as Transitions. React 19 supports async Actions, but updates after an await may need a nested startTransition.",
  "returns": "[isPending, startTransition] — a pending state flag and an Action scheduler. Do not use a Transition to control text-input value.",
  "minimalExample": "import { useState, useTransition } from 'react';\n\nexport function Results() {\n  const [query, setQuery] = useState('');\n  const [resultQuery, setResultQuery] = useState('');\n  const [isPending, startTransition] = useTransition();\n  return <>\n    <label htmlFor=\"trans-query\">Search</label>\n    <input id=\"trans-query\" value={query} onChange={e => {\n      const next = e.target.value;\n      setQuery(next);\n      startTransition(() => setResultQuery(next));\n    }} />\n    {isPending && <p role=\"status\">Updating</p>}\n    <p>Results for: {resultQuery}</p>\n  </>;\n}",
  "productionExample": "import { useState, useTransition } from 'react';\n\nexport function SearchCatalog({ names }: { names: readonly string[] }) {\n  const [text, setText] = useState('');\n  const [resultText, setResultText] = useState('');\n  const [pending, startTransition] = useTransition();\n  const result = names.filter(name => name.toLowerCase().includes(resultText.toLowerCase()));\n  return <section>\n    <label htmlFor=\"catalog-query\">Find a name</label>\n    <input id=\"catalog-query\" value={text} onChange={e => {\n      const q = e.target.value;\n      setText(q);\n      startTransition(() => setResultText(q));\n    }} />\n    {pending && <p role=\"status\">Updating list</p>}\n    <ul>{result.map(name => <li key={name}>{name}</li>)}</ul>\n  </section>;\n}",
  "commonMistakes": [
    "Wrapping a controlled text-input state update in a Transition, which can interfere with typing.",
    "Assuming a Transition makes heavy synchronous JavaScript calculation free or stops long-running work.",
    "Forgetting that post-await React state updates may require an additional startTransition."
  ],
  "securityPerformanceNotes": [
    "Pending state is UX feedback, not a guarantee of server durability.",
    "Budget expensive work and retain accessible loading status; measure responsiveness on devices rather than inventing performance claims.",
    "Avoid stale copies of source collections; derive results from current data and a nonurgent query."
  ],
  "relatedLessonIds": [
    "06.04.03"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useTransition"
},
{
  "id": "react-useoptimistic",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useOptimistic"
  ],
  "heading": "React 19: useOptimistic()",
  "category": "React · Optimistic UI",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Show a temporary optimistic value while an Action is pending, then reconcile it with the authoritative result or a failure.",
  "syntax": "const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);",
  "lang": "tsx",
  "parameters": "state: authoritative base value; updateFn(current, optimisticValue): new optimistic state. Call addOptimistic during an Action such as a Transition or form submission.",
  "returns": "[optimisticState, addOptimistic] — a temporary derived view and dispatch function. The optimistic value does not persist by itself.",
  "minimalExample": "import { startTransition, useOptimistic, useState } from 'react';\n\nexport function Likes() {\n  const [likes, setLikes] = useState(0);\n  const [shown, addOptimistic] = useOptimistic(likes, (n: number, delta: number) => n + delta);\n  return <button onClick={() => startTransition(async () => {\n    addOptimistic(1);\n    await Promise.resolve(); // Local-only demonstration\n    startTransition(() => setLikes(n => n + 1));\n  })}>Likes: {shown}</button>;\n}",
  "productionExample": "type Comment = { id: string; text: string; pending?: boolean };\nfunction append(base: readonly Comment[], item: Comment): Comment[] {\n  return [...base, item];\n}\n// In a client component:\n// const [saved, setSaved] = useState<Comment[]>(initial);\n// const [visible, showPending] = useOptimistic(saved, append);\n// In a form Action: showPending({ id: tempId, text, pending: true });\n// On successful response: setSaved(current => [...current, canonicalServerRecord]);\n// On failure: display an error and let the Action end so temporary state rolls back.",
  "commonMistakes": [
    "Calling the optimistic setter outside an Action and expecting long-lived pending UI.",
    "Using temporary client IDs as durable server IDs or persisting a pending record as confirmed.",
    "Failing to reconcile a rejected mutation, leaving duplicates or false success."
  ],
  "securityPerformanceNotes": [
    "The server must validate and authorize every mutation independently of optimistic UI.",
    "Do not display a temporary optimistic item as confirmed or durable.",
    "Use bounded IDs, escape user text via React and handle duplicate/rejected writes."
  ],
  "relatedLessonIds": [
    "06.04.05",
    "06.04.08"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useOptimistic"
},
{
  "id": "react-useactionstate",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useActionState"
  ],
  "heading": "React 19: useActionState()",
  "category": "React · Forms",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Connect a form Action with the latest result state and a pending flag, centralizing validation results without duplicating submission flags.",
  "syntax": "const [state, formAction, isPending] = useActionState(action, initialState);",
  "lang": "tsx",
  "parameters": "action(previousState, ...args): next state or Promise of state; initialState: value before the first action. Optional permalink supports progressive enhancement in some server-rendered setups.",
  "returns": "[state, formAction, isPending]. The formAction can be assigned to a form action prop; pending reflects in-flight execution.",
  "minimalExample": "import { useActionState } from 'react';\n\nasync function check(_previous: string, formData: FormData) {\n  const name = formData.get('name');\n  return typeof name === 'string' && name.trim() ? 'Saved locally' : 'Name required';\n}\nexport function NameForm() {\n  const [message, submit, pending] = useActionState(check, 'Enter a name');\n  return <form action={submit}>\n    <label htmlFor=\"action-name\">Name</label>\n    <input id=\"action-name\" name=\"name\" />\n    <button disabled={pending}>Submit</button>\n    <p role=\"status\">{message}</p>\n  </form>;\n}",
  "productionExample": "type Result = { ok: boolean; message: string };\nasync function validate(_previous: Result, data: FormData): Promise<Result> {\n  const text = data.get('feedback');\n  if (typeof text !== 'string' || text.trim().length < 3) {\n    return { ok: false, message: 'Use at least 3 characters' };\n  }\n  // This local demo does not persist anything. A real server Action must authorize the user.\n  return { ok: true, message: 'Locally validated' };\n}\n// const [result, submit, pending] = useActionState(validate, { ok: false, message: '' });",
  "commonMistakes": [
    "Treating a client-side form Action as a secure server authorization check.",
    "Forgetting the previous state argument in an Action used with useActionState.",
    "Assuming local async validation implies database persistence."
  ],
  "securityPerformanceNotes": [
    "Server Actions must validate, authenticate and authorize every request before mutating data.",
    "Never trust client-provided IDs, roles or sensitive state.",
    "Announce validation errors and disable or explain repeated submission while pending."
  ],
  "relatedLessonIds": [
    "06.04.06"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useActionState"
},
{
  "id": "css-var",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "var()"
  ],
  "heading": "CSS: var()",
  "category": "CSS · Layout and accessibility",
  "majorVersion": "Modern CSS",
  "status": "Authored reference draft",
  "summary": "Resolve a cascading custom property with an optional fallback. Useful for runtime theme colors and component tokens.",
  "syntax": "color: var(--on-surface, #111827);",
  "lang": "css",
  "parameters": "CSS custom property name (starting with --), plus an optional fallback value.",
  "returns": "Computed CSS value substituted at the use site, subject to that property's syntax.",
  "minimalExample": ":root {--ink:#111827;} p {color:var(--ink);}",
  "productionExample": ":root{--surface:#fff;--foreground:#111827;}[data-theme=dark]{--surface:#111827;--foreground:#fff}.card{background:var(--surface);color:var(--foreground)}",
  "commonMistakes": [
    "Defining a token with no appropriate fallback for consumers.",
    "Assuming custom properties are type-checked when initially assigned."
  ],
  "securityPerformanceNotes": [
    "Custom properties are visible to client users, not secret stores.",
    "Test composited contrast in all supported themes."
  ],
  "relatedLessonIds": [
    "08.01.02",
    "08.01.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/var"
},
{
  "id": "css-media",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "@media"
  ],
  "heading": "CSS: @media",
  "category": "CSS · Layout and accessibility",
  "majorVersion": "Modern CSS",
  "status": "Authored reference draft",
  "summary": "Apply conditional CSS for viewport features and user preferences such as reduced motion or hover capability.",
  "syntax": "@media (width >= 48rem) { /* rules */ }",
  "lang": "css",
  "parameters": "Media type and/or feature expressions combined with logical operators.",
  "returns": "Rules apply only when media conditions are satisfied.",
  "minimalExample": ".layout{display:block}@media (width >= 48rem){.layout{display:grid}}",
  "productionExample": "@media (prefers-reduced-motion:reduce){.card{animation:none}}@media (hover:hover){.link:hover{text-decoration:underline}}",
  "commonMistakes": [
    "Assuming all devices support hover.",
    "Using viewport width as a proxy for keyboard or touch input."
  ],
  "securityPerformanceNotes": [
    "Use the relevant preference media features and keyboard-safe fallbacks.",
    "Test zoom and real devices, not just fixed desktop presets."
  ],
  "relatedLessonIds": [
    "08.01.07",
    "08.04.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media"
},
{
  "id": "css-container",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "@container"
  ],
  "heading": "CSS: @container",
  "category": "CSS · Layout and accessibility",
  "majorVersion": "Modern CSS",
  "status": "Authored reference draft",
  "summary": "Adapt a component to its available parent container rather than solely to the viewport.",
  "syntax": "@container (width >= 30rem) { /* rules */ }",
  "lang": "css",
  "parameters": "A container query, optionally named, with an ancestor establishing container-type.",
  "returns": "Conditional styles based on a matching query container.",
  "minimalExample": ".slot{container-type:inline-size}@container (width >= 30rem){.card{display:grid}}",
  "productionExample": ".catalogue{container:catalogue / inline-size}@container catalogue (width >= 42rem){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}",
  "commonMistakes": [
    "Omitting the query container setup.",
    "Mistaking a container width for the global viewport size."
  ],
  "securityPerformanceNotes": [
    "Inspect nested layouts and intrinsic min-width overflow.",
    "A container query does not by itself provide keyboard or screen-reader semantics."
  ],
  "relatedLessonIds": [
    "08.03.04",
    "08.04.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40container"
},
{
  "id": "css-layer",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "@layer"
  ],
  "heading": "CSS: @layer",
  "category": "CSS · Layout and accessibility",
  "majorVersion": "Modern CSS",
  "status": "Authored reference draft",
  "summary": "Establish predictable cascade precedence for resets, components and utilities.",
  "syntax": "@layer reset, components, overrides;",
  "lang": "css",
  "parameters": "A named or anonymous cascade layer and the declarations assigned to it.",
  "returns": "A distinct cascade ordering stage; normal and !important declarations have different layer precedence.",
  "minimalExample": "@layer reset,components;@layer components{.button{padding:.75rem}}",
  "productionExample": "@layer foundation,components,overrides;@layer foundation{button{font:inherit}}@layer components{.button{border-radius:.75rem}}",
  "commonMistakes": [
    "Adding !important everywhere instead of understanding the cascade.",
    "Assuming layer precedence is the same for !important and normal declarations."
  ],
  "securityPerformanceNotes": [
    "Debug the browser cascade before increasing specificity.",
    "Combine cascade layers with semantic token design."
  ],
  "relatedLessonIds": [
    "08.01.01",
    "08.01.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40layer"
},
{
  "id": "css-focus-visible",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    ":focus-visible"
  ],
  "heading": "CSS: :focus-visible",
  "category": "CSS · Layout and accessibility",
  "majorVersion": "Modern CSS",
  "status": "Authored reference draft",
  "summary": "Style the focused element when the browser judges a visible focus indicator appropriate, particularly keyboard navigation.",
  "syntax": ":focus-visible { outline: 2px solid currentColor; }",
  "lang": "css",
  "parameters": "Matches focused elements based on user-agent focus-visible heuristics.",
  "returns": "A selector state usable for clear focus indicators.",
  "minimalExample": ":focus-visible{outline:2px solid #0891b2;outline-offset:3px}",
  "productionExample": ".button:focus-visible{outline:3px solid var(--focus-ring);outline-offset:2px}",
  "commonMistakes": [
    "Removing focus outlines without a visible replacement.",
    "Treating hover styling as sufficient for keyboard users."
  ],
  "securityPerformanceNotes": [
    "Manually verify keyboard focus appearance in actual browsers.",
    "Ensure the focus ring remains distinguishable against every surface."
  ],
  "relatedLessonIds": [
    "08.02.04",
    "08.04.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/%3Afocus-visible"
},
{
  "id": "css-prefers-reduced-motion",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "prefers-reduced-motion"
  ],
  "heading": "CSS: prefers-reduced-motion",
  "category": "CSS · Layout and accessibility",
  "majorVersion": "Modern CSS",
  "status": "Authored reference draft",
  "summary": "Respond to an OS accessibility preference for less motion while retaining meaningful UI state feedback.",
  "syntax": "@media (prefers-reduced-motion: reduce) { /* rules */ }",
  "lang": "css",
  "parameters": "Media feature values reduce or no-preference.",
  "returns": "Conditional rules to reduce or eliminate distracting movement.",
  "minimalExample": "@media (prefers-reduced-motion:reduce){.panel{animation:none}}",
  "productionExample": ".panel{transition:transform .2s ease}@media (prefers-reduced-motion:reduce){.panel{transition:none;transform:none}}",
  "commonMistakes": [
    "Disabling necessary focus and state feedback together with animation.",
    "Forcing parallax even when reduced motion is requested."
  ],
  "securityPerformanceNotes": [
    "Test changing the operating-system preference at runtime.",
    "Do not claim a CSS source snippet proves all vestibular accessibility concerns."
  ],
  "relatedLessonIds": [
    "08.02.01",
    "08.04.05"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion"
},
{
  "id": "css-color-scheme",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "color-scheme"
  ],
  "heading": "CSS: color-scheme",
  "category": "CSS · Layout and accessibility",
  "majorVersion": "Modern CSS",
  "status": "Authored reference draft",
  "summary": "Inform the browser which light and dark schemes the element supports, aligning native form controls and browser-rendered UI.",
  "syntax": "color-scheme: light dark;",
  "lang": "css",
  "parameters": "Supported color scheme keywords, often light and/or dark.",
  "returns": "A browser hint for native control, scrollbar and UI appearance.",
  "minimalExample": ":root{color-scheme:light dark}",
  "productionExample": ":root{color-scheme:light;--surface:#fff;--ink:#111}[data-theme=dark]{color-scheme:dark;--surface:#111;--ink:#fff}",
  "commonMistakes": [
    "Assuming native color-scheme automatically updates every custom CSS variable.",
    "Not checking native input contrast in dark mode."
  ],
  "securityPerformanceNotes": [
    "Pair native scheme declarations with semantic component theme tokens.",
    "Verify actual form controls, focus rings and errors in light and dark modes."
  ],
  "relatedLessonIds": [
    "08.01.06",
    "08.04.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme"
},
{
  "id": "css-clamp",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "clamp()"
  ],
  "heading": "CSS: clamp()",
  "category": "CSS · Layout and accessibility",
  "majorVersion": "Modern CSS",
  "status": "Authored reference draft",
  "summary": "Constrain a fluid CSS value between chosen minimum and maximum bounds, useful for responsive typography and spacing.",
  "syntax": "font-size: clamp(1.75rem, 3vw, 2.75rem);",
  "lang": "css",
  "parameters": "Three compatible CSS values: minimum, preferred and maximum.",
  "returns": "The preferred value bounded by the minimum and maximum.",
  "minimalExample": "h1{font-size:clamp(1.75rem,3vw,2.75rem)}",
  "productionExample": ".reading{padding-inline:clamp(1rem,3vw,2rem)}.hero{font-size:clamp(2rem,4vw,3.5rem)}",
  "commonMistakes": [
    "Choosing bounds that prevent appropriate text scaling.",
    "Assuming fluid CSS removes the need to test small screens and 200% zoom."
  ],
  "securityPerformanceNotes": [
    "Use rem-based bounds when preserving text-size scalability.",
    "Verify long translations, wrapping and layout at narrow widths."
  ],
  "relatedLessonIds": [
    "08.04.02",
    "08.04.07"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp"
},
{
  "id": "zod-z-string",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.string"
  ],
  "heading": "Zod 4: String validation",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "String schema with length constraints, trimming and formats; z.email()/z.url() are top-level format constructors in Zod 4.",
  "syntax": "const Name=z.string().trim().min(2).max(80);",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Name=z.string().trim().min(2).max(80);",
  "productionExample": "import * as z from 'zod';\nconst Username=z.string().trim().min(3).max(32).regex(/^[a-z0-9_]+$/i);",
  "commonMistakes": [
    "Use z.string() for strings and add explicit min/max/trim constraints; use z.email() for email, not a broad regex.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.01"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-number",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.number"
  ],
  "heading": "Zod 4: Number validation",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Strict number validation does not accept numeric strings; use z.coerce.number() deliberately for browser form strings.",
  "syntax": "const Age=z.number().int().min(18);",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Age=z.number().int().min(18);",
  "productionExample": "import * as z from 'zod';\nconst Price=z.number().finite().nonnegative().max(1000000);",
  "commonMistakes": [
    "Do not rely on JavaScript numeric coercion without bounding finite and integer inputs.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.01",
    "09.01.05"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-boolean",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.boolean"
  ],
  "heading": "Zod 4: Boolean validation",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Boolean schema rejects string 'false'; z.coerce.boolean() uses Boolean(input) and converts nonempty strings to true.",
  "syntax": "const Enabled=z.boolean();",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Enabled=z.boolean();",
  "productionExample": "import * as z from 'zod';\nconst Feature=z.strictObject({enabled:z.boolean()});",
  "commonMistakes": [
    "Do not coerce browser string 'false' with z.coerce.boolean() unless Boolean semantics are explicitly intended.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.01",
    "09.01.03"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-object",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.object"
  ],
  "heading": "Zod 4: Object schema",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Zod 4 z.object strips unknown string keys by default. z.strictObject rejects unknown keys when DTO boundaries require strictness.",
  "syntax": "const User=z.object({id:z.string(),name:z.string()});",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst User=z.object({id:z.string(),name:z.string()});",
  "productionExample": "import * as z from 'zod';\nconst Profile=z.object({name:z.string().trim().min(2)});const r=Profile.safeParse(payload);",
  "commonMistakes": [
    "Choose object unknown-key policy deliberately; stripping unknown fields is not authorization.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.01"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-array",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.array"
  ],
  "heading": "Zod 4: Array validation",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Validate each array member and bound the collection length; unbounded arrays may permit expensive input payloads.",
  "syntax": "const Tags=z.array(z.string().min(1)).max(20);",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Tags=z.array(z.string().min(1)).max(20);",
  "productionExample": "import * as z from 'zod';\nconst Items=z.array(z.strictObject({id:z.string().min(1),qty:z.number().int().positive()})).max(100);",
  "commonMistakes": [
    "Validate element shapes and maximum item count for server request bodies.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.07"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-enum",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.enum"
  ],
  "heading": "Zod 4: Enum validation",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Enumerated runtime values reject unknown options; a TypeScript union alone does not validate incoming JSON.",
  "syntax": "const Role=z.enum(['reader','editor']);",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Role=z.enum(['reader','editor']);",
  "productionExample": "import * as z from 'zod';\nconst Member=z.strictObject({id:z.string(),role:z.enum(['reader','editor'])});",
  "commonMistakes": [
    "Use explicit allowed strings and still authorize a role against the authenticated server identity.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.01",
    "09.01.06"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-literal",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.literal"
  ],
  "heading": "Zod 4: Literal validation",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Literal checks discriminate exact values such as kind or version and are useful in strict DTOs.",
  "syntax": "const Version=z.literal('v1');",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Version=z.literal('v1');",
  "productionExample": "import * as z from 'zod';\nconst Request=z.strictObject({version:z.literal('v1'),payload:z.string()});",
  "commonMistakes": [
    "A literal field is a parser constraint, not proof of request authenticity.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.06"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-union",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.union"
  ],
  "heading": "Zod 4: General union",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "A union succeeds if any member schema matches; prefer z.discriminatedUnion when branches have an explicit discriminant.",
  "syntax": "const ID=z.union([z.string().min(1),z.number().int()]);",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst ID=z.union([z.string().min(1),z.number().int()]);",
  "productionExample": "import * as z from 'zod';\nconst Value=z.union([z.string().min(1),z.number().finite()]);const result=Value.safeParse(input);",
  "commonMistakes": [
    "Avoid overlapping unconstrained unions that make error handling ambiguous.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.06"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-discriminatedunion",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.discriminatedUnion"
  ],
  "heading": "Zod 4: Discriminated union",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Select a branch by an explicit literal discriminator, ensuring branch-specific required fields and safe narrowing.",
  "syntax": "const Event=z.discriminatedUnion('type',[z.object({type:z.literal('a')}),z.object({type:z.literal('b')})]);",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Event=z.discriminatedUnion('type',[z.object({type:z.literal('a')}),z.object({type:z.literal('b')})]);",
  "productionExample": "import * as z from 'zod';\nconst Notification=z.discriminatedUnion('channel',[z.strictObject({channel:z.literal('email'),address:z.email()}),z.strictObject({channel:z.literal('sms'),phone:z.string().min(8)})]);",
  "commonMistakes": [
    "Reject unknown channels and extra sensitive fields; validate at server trust boundaries.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.06"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-optional",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.optional"
  ],
  "heading": "Zod 4: Optional values",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Optional permits undefined or missing input; it does not permit null unless nullable is included.",
  "syntax": "const Bio=z.string().optional();",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Bio=z.string().optional();",
  "productionExample": "import * as z from 'zod';\nconst Draft=z.strictObject({title:z.string().min(1),note:z.string().optional()});",
  "commonMistakes": [
    "Distinguish absence from explicit null when patching partial records.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.03"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-nullable",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.nullable"
  ],
  "heading": "Zod 4: Nullable values",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Nullable permits null in addition to the wrapped type, but does not imply a field can be omitted.",
  "syntax": "const Bio=z.string().nullable();",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Bio=z.string().nullable();",
  "productionExample": "import * as z from 'zod';\nconst Profile=z.strictObject({bio:z.string().nullable().optional()});",
  "commonMistakes": [
    "Use optional and nullable intentionally; avoid collapsing missing and null database semantics.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.03"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-default",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.default"
  ],
  "heading": "Zod 4: Defaults in Zod 4",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "In Zod 4 default returns a typed output when input is undefined, without running transformations; prefault enables preparse default behavior.",
  "syntax": "const Theme=z.enum(['light','dark']).default('light');",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Theme=z.enum(['light','dark']).default('light');",
  "productionExample": "import * as z from 'zod';\nconst Preferences=z.strictObject({newsletter:z.boolean().default(false),theme:z.enum(['light','dark']).default('light')});",
  "commonMistakes": [
    "Remember Zod 4 defaults short-circuit; choose valid output-type values or prefault where parsing is required.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.03"
  ],
  "canonicalUrl": "https://zod.dev/v4/changelog"
},
{
  "id": "zod-z-coerce",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.coerce"
  ],
  "heading": "Zod 4: Coercion",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Coercion uses JavaScript conversion before validation; z.coerce.number() accepts numeric text, but can turn an empty string into zero.",
  "syntax": "const Age=z.coerce.number().int().min(18);",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Age=z.coerce.number().int().min(18);",
  "productionExample": "import * as z from 'zod';\nconst Form=z.strictObject({age:z.coerce.number().int().min(18).max(120)});",
  "commonMistakes": [
    "Use bounds and finite/integer checks; never use z.coerce.boolean() for literal string 'false' semantics.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.05"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-transform",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.transform"
  ],
  "heading": "Zod 4: Transforms",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "A transform changes the validated output, and input/output types may diverge; it does not make an unvalidated input trustworthy.",
  "syntax": "const Normalized=z.string().trim().transform(s=>s.toLowerCase());",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Normalized=z.string().trim().transform(s=>s.toLowerCase());",
  "productionExample": "import * as z from 'zod';\nconst Email=z.email().transform(value=>value.toLowerCase());type In=z.input<typeof Email>;type Out=z.output<typeof Email>;",
  "commonMistakes": [
    "Beware irreversible transforms; validate output format and avoid conflating input with output DTOs.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.05"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-refine",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.refine"
  ],
  "heading": "Zod 4: Refinements",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Refine adds custom invariants that built-in validators cannot express. It produces a custom issue when the predicate fails.",
  "syntax": "const Pass=z.string().refine(s=>s.length>=12,{error:'Too short'});",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Pass=z.string().refine(s=>s.length>=12,{error:'Too short'});",
  "productionExample": "import * as z from 'zod';\nconst Even=z.number().int().refine(value=>value%2===0,{error:'Must be even'});",
  "commonMistakes": [
    "Avoid side effects during validation; use async parsing when the rule is truly asynchronous.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.04"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "zod-z-superrefine",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.superRefine"
  ],
  "heading": "Zod 4: Cross-field issue paths",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "superRefine supports multiple path-specific issues but is deprecated in Zod 4 in favor of the lower-level check API; legacy examples remain functional.",
  "syntax": "const Pair=z.object({a:z.string(),b:z.string()}).superRefine((v,ctx)=>{if(v.a!==v.b)ctx.addIssue({code:'custom',path:['b'],message:'Must match'});});",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Pair=z.object({a:z.string(),b:z.string()}).superRefine((v,ctx)=>{if(v.a!==v.b)ctx.addIssue({code:'custom',path:['b'],message:'Must match'});});",
  "productionExample": "import * as z from 'zod';\nconst Password=z.strictObject({pass:z.string().min(8),confirm:z.string().min(8)}).superRefine((v,ctx)=>{if(v.pass!==v.confirm)ctx.addIssue({code:'custom',path:['confirm'],message:'Mismatch'});});",
  "commonMistakes": [
    "Prefer a simple refine when one predicate suffices; never put network or database writes inside a validator.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.04"
  ],
  "canonicalUrl": "https://zod.dev/v4/changelog"
},
{
  "id": "zod-z-infer",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.infer"
  ],
  "heading": "Zod 4: Type inference",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "z.infer reflects schema output; use z.input and z.output explicitly for transforms/coercions where the types differ.",
  "syntax": "const User=z.strictObject({id:z.string()});type UserData=z.infer<typeof User>;",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst User=z.strictObject({id:z.string()});type UserData=z.infer<typeof User>;",
  "productionExample": "import * as z from 'zod';\nconst Age=z.coerce.number().int();type Input=z.input<typeof Age>;type Output=z.output<typeof Age>;",
  "commonMistakes": [
    "TypeScript inference is a development aid; actual requests must still be parsed at runtime.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.07"
  ],
  "canonicalUrl": "https://zod.dev/basics"
},
{
  "id": "zod-z-strictobject",
  "matchCategories": [
    "Zod"
  ],
  "matchTitles": [
    "z.strictObject"
  ],
  "heading": "Zod 4: Strict objects",
  "category": "Zod · Runtime validation",
  "majorVersion": "Zod 4",
  "status": "Authored reference draft",
  "summary": "Strict objects reject unknown keys, unlike default z.object which strips them; useful for rejecting unexpected request-body fields.",
  "syntax": "const Account=z.strictObject({role:z.enum(['reader','editor'])});",
  "lang": "ts",
  "parameters": "A schema declaration and untrusted runtime input; use parse/safeParse to validate before use.",
  "returns": "A Zod schema with inferred output and a parse/safeParse result, including structured issues on invalid data.",
  "minimalExample": "import * as z from 'zod';\nconst Account=z.strictObject({role:z.enum(['reader','editor'])});",
  "productionExample": "import * as z from 'zod';\nconst PublicDTO=z.strictObject({id:z.string(),title:z.string().min(1)});const result=PublicDTO.safeParse(payload);",
  "commonMistakes": [
    "Strictness is not a security authorization layer—enforce per-object access rules separately.",
    "Assuming TypeScript static types replace runtime validation for unknown API/form input."
  ],
  "securityPerformanceNotes": [
    "Always validate at the server trust boundary; client validation improves usability but cannot authorize writes.",
    "Bound user-supplied arrays/strings and avoid logging raw rejected personal or secret values."
  ],
  "relatedLessonIds": [
    "09.01.01",
    "09.01.08"
  ],
  "canonicalUrl": "https://zod.dev/api"
},
{
  "id": "web-main",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "main"
  ],
  "heading": "HTML: main landmark",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard",
  "status": "Authored reference draft",
  "summary": "Represents the dominant content of a document, allowing assistive technology to locate the primary landmark.",
  "syntax": "<main id=\"content\">…</main>",
  "lang": "html",
  "parameters": "Global HTML attributes; use an id for a skip-link target.",
  "returns": "A semantic element, not an interactive control.",
  "minimalExample": "<main><h1>Dashboard</h1></main>",
  "productionExample": "<a href=\"#content\">Skip to main content</a>\n<header>Application navigation</header>\n<main id=\"content\"><h1>Account overview</h1></main>",
  "commonMistakes": [
    "Using several visible main landmarks or nesting main inside nav, article or aside."
  ],
  "securityPerformanceNotes": [
    "Prefer native landmarks to redundant ARIA; ensure the skip target is keyboard reachable."
  ],
  "relatedLessonIds": [
    "01.01.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main"
},
{
  "id": "web-label",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "label"
  ],
  "heading": "HTML: label",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard",
  "status": "Authored reference draft",
  "summary": "Associates text with a labelable form control so users can identify and activate it.",
  "syntax": "<label for=\"email\">Email</label>",
  "lang": "html",
  "parameters": "for matches the control's unique id; nesting the control is another supported association.",
  "returns": "A label association, not validation or authorization.",
  "minimalExample": "<label for=\"name\">Name</label><input id=\"name\" name=\"name\">",
  "productionExample": "<label for=\"email\">Work email</label>\n<input id=\"email\" name=\"email\" type=\"email\" autocomplete=\"email\" required aria-describedby=\"email-help\">\n<p id=\"email-help\">Use your work address.</p>",
  "commonMistakes": [
    "Replacing a visible label with placeholder text or duplicating IDs."
  ],
  "securityPerformanceNotes": [
    "Server-side validation remains necessary; test keyboard and accessible name behavior."
  ],
  "relatedLessonIds": [
    "01.02.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label"
},
{
  "id": "web-fetch",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "fetch"
  ],
  "heading": "Fetch API: fetch()",
  "category": "Web & HTML",
  "majorVersion": "Web Fetch API",
  "status": "Authored reference draft",
  "summary": "Starts an HTTP request and resolves to a Response even for ordinary HTTP error statuses.",
  "syntax": "fetch(input, init?)",
  "lang": "js",
  "parameters": "input is a URL or Request; init can specify method, headers, body and AbortSignal.",
  "returns": "Promise<Response>; network and abort errors reject the promise.",
  "minimalExample": "const response = await fetch('/api/tasks');\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconst tasks = await response.json();",
  "productionExample": "const response = await fetch('/api/tasks', { signal: AbortSignal.timeout(5000), headers: { Accept: 'application/json' } });\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconst payload = await response.json();\n// Validate payload against the application contract before use.",
  "commonMistakes": [
    "Assuming 404 or 500 rejects fetch, or treating response.json() as schema validation."
  ],
  "securityPerformanceNotes": [
    "Bound request duration and response size at the appropriate boundary; do not retry unsafe mutations blindly."
  ],
  "relatedLessonIds": [
    "01.04.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch"
},
{
  "id": "css-grid-template-columns",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "grid-template-columns"
  ],
  "heading": "CSS: grid-template-columns",
  "category": "CSS",
  "majorVersion": "CSS Grid Layout",
  "status": "Authored reference draft",
  "summary": "Defines the column track sizing of a grid container.",
  "syntax": "grid-template-columns: repeat(3, minmax(0, 1fr));",
  "lang": "css",
  "parameters": "Track sizes, named lines and repeat() expressions; applies to grid containers.",
  "returns": "A CSS computed track list; actual layout depends on available space and intrinsic sizes.",
  "minimalExample": ".grid { display: grid; grid-template-columns: 1fr 1fr; }",
  "productionExample": ".cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); }\n.cards > * { min-width: 0; overflow-wrap: anywhere; }",
  "commonMistakes": [
    "Assuming 1fr alone always prevents overflow from long unbreakable content."
  ],
  "securityPerformanceNotes": [
    "Test narrow viewports and zoom; preserve DOM order instead of using layout to reorder meaning."
  ],
  "relatedLessonIds": [
    "02.02.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns"
},
{
  "id": "javascript-promise-all",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Promise.all"
  ],
  "heading": "JavaScript: Promise.all()",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Combines concurrent work, fulfilling with input-ordered values or rejecting when an input rejects.",
  "syntax": "Promise.all(iterable)",
  "lang": "js",
  "parameters": "An iterable of promises or values.",
  "returns": "A promise that fulfills with an array or rejects with the first observed rejection reason.",
  "minimalExample": "const values = await Promise.all([Promise.resolve(1), Promise.resolve(2)]);",
  "productionExample": "const [profile, settings] = await Promise.all([loadProfile(), loadSettings()]);\n// Both results are required; handle failure at the caller boundary.",
  "commonMistakes": [
    "Assuming rejection cancels other in-flight work, or invoking an unbounded number of requests."
  ],
  "securityPerformanceNotes": [
    "Use bounded concurrency for large collections; propagate cancellation explicitly where supported."
  ],
  "relatedLessonIds": [
    "03.03.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all"
},
{
  "id": "javascript-promise-allsettled",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Promise.allSettled"
  ],
  "heading": "JavaScript: Promise.allSettled()",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Waits for every input to settle and reports each fulfillment or rejection in input order.",
  "syntax": "Promise.allSettled(iterable)",
  "lang": "js",
  "parameters": "An iterable of promises or values.",
  "returns": "A promise fulfilled with status-tagged result objects for each input.",
  "minimalExample": "const results = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error('failed'))]);",
  "productionExample": "const results = await Promise.allSettled([refreshProfile(), refreshPreferences()]);\nfor (const [index, result] of results.entries()) {\n  if (result.status === 'rejected') reportFailure(index);\n  else renderSection(index, result.value);\n}",
  "commonMistakes": [
    "Treating every settled operation as a success or reading value before checking status."
  ],
  "securityPerformanceNotes": [
    "Avoid logging sensitive rejection payloads; bound fan-out and request duration separately."
  ],
  "relatedLessonIds": [
    "03.03.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled"
},
{
  "id": "typescript-generics",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "generics"
  ],
  "heading": "TypeScript: Generics",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Preserve relationships between input and output types without discarding type information.",
  "syntax": "function identity<T>(value: T): T { return value; }",
  "lang": "ts",
  "parameters": "Type parameters may be inferred, explicit or constrained with extends.",
  "returns": "A generic signature; the type parameter is erased at runtime.",
  "minimalExample": "function first<T>(items: readonly T[]): T | undefined { return items[0]; }",
  "productionExample": "function indexById<T extends { id: string }>(items: readonly T[]): Map<string, T> {\n  return new Map(items.map(item => [item.id, item]));\n}",
  "commonMistakes": [
    "Using any instead of a type parameter, or expecting a generic type to validate JSON at runtime."
  ],
  "securityPerformanceNotes": [
    "Validate external data separately; express only necessary constraints."
  ],
  "relatedLessonIds": [
    "04.02.01"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/generics.html"
},
{
  "id": "typescript-discriminated-unions",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "Discriminated unions"
  ],
  "heading": "TypeScript: Discriminated unions",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Model mutually exclusive states with a shared literal discriminant so control-flow analysis narrows the data.",
  "syntax": "type Result = { ok: true; value: string } | { ok: false; error: string };",
  "lang": "ts",
  "parameters": "Each variant carries a literal tag and its own required fields.",
  "returns": "A union type narrowed through equality checks or switch statements.",
  "minimalExample": "function message(r: Result) { return r.ok ? r.value : r.error; }",
  "productionExample": "type State = { kind: 'loading' } | { kind: 'ready'; count: number } | { kind: 'error'; message: string };\nfunction describe(state: State): string {\n  switch (state.kind) {\n    case 'loading': return 'Loading';\n    case 'ready': return String(state.count);\n    case 'error': return state.message;\n    default: { const exhaustive: never = state; return exhaustive; }\n  }\n}",
  "commonMistakes": [
    "Using optional fields on one object and allowing impossible combinations of state."
  ],
  "securityPerformanceNotes": [
    "Treat network responses as unknown until validated; type narrowing is not authorization."
  ],
  "relatedLessonIds": [
    "04.02.05"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions"
},
{
  "id": "web-button",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "button"
  ],
  "heading": "Web & HTML: button",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "A native interactive control with keyboard activation and form participation.",
  "syntax": "<button type=\"button\">Open</button>",
  "lang": "html",
  "parameters": "type, disabled, name and value; default type in a form is submit.",
  "returns": "Dispatches activation and can submit a form; has no return value.",
  "minimalExample": "<button type=\"button\">Show details</button>",
  "productionExample": "<form action=\"/profile\" method=\"post\">\n  <button type=\"submit\">Save profile</button>\n  <button type=\"button\" id=\"cancel\">Cancel</button>\n</form>",
  "commonMistakes": [
    "Omitting type on a non-submit button inside a form."
  ],
  "securityPerformanceNotes": [
    "Use a native button with a meaningful accessible name; server-side authorization still applies."
  ],
  "relatedLessonIds": [
    "01.02.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button"
},
{
  "id": "web-form",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "form"
  ],
  "heading": "Web & HTML: form",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "Groups form-associated controls for submitting user input.",
  "syntax": "<form action=\"/search\" method=\"get\">…</form>",
  "lang": "html",
  "parameters": "action, method, enctype and associated named controls.",
  "returns": "Navigation or submission with successful controls unless an event handler prevents it.",
  "minimalExample": "<form action=\"/search\"><input name=\"q\"><button>Search</button></form>",
  "productionExample": "<form action=\"/feedback\" method=\"post\">\n  <label for=\"message\">Feedback</label>\n  <textarea id=\"message\" name=\"message\" required maxlength=\"1000\"></textarea>\n  <button type=\"submit\">Send</button>\n</form>",
  "commonMistakes": [
    "Assuming browser validation protects the API."
  ],
  "securityPerformanceNotes": [
    "Validate and authorize on the server; use CSRF protection where cookie-authenticated mutations require it."
  ],
  "relatedLessonIds": [
    "01.02.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form"
},
{
  "id": "web-input",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "input"
  ],
  "heading": "Web & HTML: input",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "A form control whose behavior and validation depend on its input type.",
  "syntax": "<input type=\"email\" name=\"email\" required>",
  "lang": "html",
  "parameters": "type, name, value, required, autocomplete and type-specific constraints.",
  "returns": "A form-associated element; submission encodes its successful value.",
  "minimalExample": "<label>Email <input type=\"email\" name=\"email\"></label>",
  "productionExample": "<label for=\"work-email\">Work email</label>\n<input id=\"work-email\" name=\"email\" type=\"email\" autocomplete=\"email\" required maxlength=\"254\">",
  "commonMistakes": [
    "Using numeric input for identifiers that are not quantities, or missing labels."
  ],
  "securityPerformanceNotes": [
    "Client constraints improve feedback but untrusted values still require server validation."
  ],
  "relatedLessonIds": [
    "01.02.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input"
},
{
  "id": "web-fieldset",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "fieldset"
  ],
  "heading": "Web & HTML: fieldset",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "Groups related controls with a shared accessible label supplied by legend.",
  "syntax": "<fieldset><legend>Preferences</legend>…</fieldset>",
  "lang": "html",
  "parameters": "disabled, form and name; legend labels the group.",
  "returns": "A semantic form group; disabled descendants generally do not submit, with the first legend exception.",
  "minimalExample": "<fieldset><legend>Contact</legend><label><input type=\"radio\" name=\"contact\" value=\"email\">Email</label></fieldset>",
  "productionExample": "<fieldset>\n  <legend>Notification frequency</legend>\n  <label><input type=\"radio\" name=\"frequency\" value=\"daily\" required>Daily</label>\n  <label><input type=\"radio\" name=\"frequency\" value=\"weekly\">Weekly</label>\n</fieldset>",
  "commonMistakes": [
    "Using visual headings alone for related radio buttons."
  ],
  "securityPerformanceNotes": [
    "Native grouping improves navigation by assistive technology; never use disabled UI as authorization."
  ],
  "relatedLessonIds": [
    "01.02.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset"
},
{
  "id": "web-dialog",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "dialog"
  ],
  "heading": "Web & HTML: dialog",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "Native dialog element for modal or non-modal interactions.",
  "syntax": "dialog.showModal(); // on an HTMLDialogElement",
  "lang": "html",
  "parameters": "showModal(), show(), close(); open is reflected state.",
  "returns": "Methods open or close the dialog; modal mode enters the top layer.",
  "minimalExample": "<dialog id=\"confirm\"><p>Continue?</p><form method=\"dialog\"><button>Close</button></form></dialog>",
  "productionExample": "<button id=\"open\">Review changes</button>\n<dialog id=\"review\" aria-labelledby=\"review-title\">\n  <h2 id=\"review-title\">Review changes</h2>\n  <form method=\"dialog\"><button autofocus>Close</button></form>\n</dialog>\n<script>document.querySelector('#open').addEventListener('click', () => document.querySelector('#review').showModal());</script>",
  "commonMistakes": [
    "Toggling open directly when a modal with focus handling is intended."
  ],
  "securityPerformanceNotes": [
    "Test Escape, focus return and keyboard navigation; destructive operations need explicit confirmation and server checks."
  ],
  "relatedLessonIds": [
    "01.02.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog"
},
{
  "id": "web-details",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "details"
  ],
  "heading": "Web & HTML: details",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "A native disclosure widget with a summary and expandable content.",
  "syntax": "<details><summary>More information</summary>…</details>",
  "lang": "html",
  "parameters": "open controls initial expanded state; summary provides the disclosure label.",
  "returns": "An element with expanded/collapsed state and toggle events.",
  "minimalExample": "<details><summary>Help</summary><p>Choose a plan.</p></details>",
  "productionExample": "<details>\n  <summary>Technical requirements</summary>\n  <p>Use an HTTPS connection and a supported browser.</p>\n</details>",
  "commonMistakes": [
    "Putting the only required action or critical error message inside a collapsed disclosure."
  ],
  "securityPerformanceNotes": [
    "Keep the summary keyboard-accessible and avoid unnecessarily recreating disclosure behavior with scripts."
  ],
  "relatedLessonIds": [
    "01.02.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details"
},
{
  "id": "web-img",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "img"
  ],
  "heading": "Web & HTML: img",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "Embeds an image with text alternatives and optional responsive source selection.",
  "syntax": "<img src=\"/photo.jpg\" alt=\"Description\" width=\"640\" height=\"480\">",
  "lang": "html",
  "parameters": "src, alt, width, height, loading, srcset and sizes.",
  "returns": "An image element; browser selects and decodes a resource.",
  "minimalExample": "<img src=\"/logo.png\" alt=\"Academy\">",
  "productionExample": "<img src=\"/diagram-640.png\" srcset=\"/diagram-640.png 640w, /diagram-1280.png 1280w\" sizes=\"(max-width: 700px) 100vw, 700px\" width=\"640\" height=\"360\" alt=\"Request flows from browser to server\">",
  "commonMistakes": [
    "Omitting meaningful alt text or making every image lazy-loaded including the LCP image."
  ],
  "securityPerformanceNotes": [
    "Reserve dimensions to reduce layout shifts; use empty alt for purely decorative images."
  ],
  "relatedLessonIds": [
    "01.03.07"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img"
},
{
  "id": "web-a",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "a"
  ],
  "heading": "Web & HTML: a",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "Creates a hyperlink when href is present.",
  "syntax": "<a href=\"/learn\">Curriculum</a>",
  "lang": "html",
  "parameters": "href, target, rel and download; href determines the destination.",
  "returns": "A navigable link, not a button for local actions.",
  "minimalExample": "<a href=\"#content\">Skip to content</a>",
  "productionExample": "<a href=\"https://example.org/docs\" target=\"_blank\" rel=\"noopener noreferrer\">External documentation (opens in a new tab)</a>",
  "commonMistakes": [
    "Using href=\"#\" for buttons or building a URL from untrusted input without validation."
  ],
  "securityPerformanceNotes": [
    "Use descriptive link text; allowlist permitted URL schemes and destinations as appropriate."
  ],
  "relatedLessonIds": [
    "01.01.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a"
},
{
  "id": "web-urlsearchparams",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "URLSearchParams"
  ],
  "heading": "Web & HTML: URLSearchParams",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "Parses and serializes URL query parameters using form-style encoding.",
  "syntax": "new URLSearchParams(init)",
  "lang": "js",
  "parameters": "Query string, iterable pairs, record or another URLSearchParams; get, set, append and delete operate on entries.",
  "returns": "URLSearchParams; get returns a string or null, getAll an array.",
  "minimalExample": "const params = new URLSearchParams('q=css&page=2');\nconsole.log(params.get('q'));",
  "productionExample": "const url = new URL('/search', 'https://example.org');\nurl.searchParams.set('q', searchTerm);\nurl.searchParams.set('page', '1');\n// Pass url to a request; validate the query server-side.",
  "commonMistakes": [
    "Concatenating raw input into a query or assuming set preserves duplicate values."
  ],
  "securityPerformanceNotes": [
    "Never place credentials in query strings; validate pagination and filters on the server."
  ],
  "relatedLessonIds": [
    "01.04.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams"
},
{
  "id": "web-abortcontroller",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "AbortController"
  ],
  "heading": "Web & HTML: AbortController",
  "category": "Web & HTML",
  "majorVersion": "HTML Living Standard / Web APIs",
  "status": "Authored reference draft",
  "summary": "Coordinates cancellation of operations that observe an AbortSignal.",
  "syntax": "const controller = new AbortController();",
  "lang": "js",
  "parameters": "signal is passed to an abort-aware operation; abort(reason?) signals cancellation.",
  "returns": "AbortController with a signal; abort() itself returns undefined.",
  "minimalExample": "const controller = new AbortController();\nconst pending = fetch('/api/tasks', { signal: controller.signal });\ncontroller.abort();\nawait pending.catch(() => {});",
  "productionExample": "const controller = new AbortController();\nconst timer = setTimeout(() => controller.abort(), 5000);\ntry {\n  const response = await fetch('/api/tasks', { signal: controller.signal });\n  if (!response.ok) throw new Error('Request failed');\n  return await response.json();\n} finally { clearTimeout(timer); }",
  "commonMistakes": [
    "Reusing an already-aborted signal or assuming cancellation undoes a server mutation."
  ],
  "securityPerformanceNotes": [
    "Clear timers and distinguish cancellation from genuine failure; retries need independent signals and safe semantics."
  ],
  "relatedLessonIds": [
    "03.03.05"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
},
{
  "id": "css-display",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "display"
  ],
  "heading": "CSS: display",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Controls the outer and inner display behavior of an element.",
  "syntax": "display: grid;",
  "lang": "css",
  "parameters": "Values include block, inline, flex, grid, contents and none.",
  "returns": "A computed CSS display value controlling box generation and layout.",
  "minimalExample": "nav { display: flex; }",
  "productionExample": ".toolbar { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }\n.toolbar > * { min-width: 0; }",
  "commonMistakes": [
    "Using display:none for content that should remain available to assistive technology."
  ],
  "securityPerformanceNotes": [
    "DOM order and visual order should align; test hidden content and keyboard access."
  ],
  "relatedLessonIds": [
    "02.02.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/display"
},
{
  "id": "css-position",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "position"
  ],
  "heading": "CSS: position",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Determines how an element is positioned and whether it participates in normal flow.",
  "syntax": "position: sticky; top: 0;",
  "lang": "css",
  "parameters": "static, relative, absolute, fixed, sticky and inset properties.",
  "returns": "A positioned box whose containing block and scroll ancestor depend on the mode.",
  "minimalExample": "header { position: sticky; top: 0; }",
  "productionExample": ".panel { position: relative; }\n.panel .close { position: absolute; inset-block-start: .5rem; inset-inline-end: .5rem; }\n.panel { padding-inline-end: 3rem; }",
  "commonMistakes": [
    "Expecting sticky to work without an inset or ignoring a scroll ancestor."
  ],
  "securityPerformanceNotes": [
    "Avoid covering focused controls or text at high zoom; test overflow ancestors."
  ],
  "relatedLessonIds": [
    "02.02.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/position"
},
{
  "id": "css-z-index",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "z-index"
  ],
  "heading": "CSS: z-index",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Controls stacking order within a stacking context, not globally across all elements.",
  "syntax": "z-index: 10;",
  "lang": "css",
  "parameters": "auto or integer on positioned elements and flex/grid items.",
  "returns": "A stack level in the relevant stacking context.",
  "minimalExample": "header { position: relative; z-index: 2; }",
  "productionExample": ".layout { isolation: isolate; }\n.sticky-header { position: sticky; top: 0; z-index: 10; }\n.popover { position: absolute; z-index: 20; }",
  "commonMistakes": [
    "Increasing z-index indefinitely when the element is trapped in a lower stacking context."
  ],
  "securityPerformanceNotes": [
    "Document layering tokens; prefer native top-layer dialogs for modal UI."
  ],
  "relatedLessonIds": [
    "02.02.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/z-index"
},
{
  "id": "css-box-sizing",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "box-sizing"
  ],
  "heading": "CSS: box-sizing",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Selects whether declared width and height include padding and border.",
  "syntax": "box-sizing: border-box;",
  "lang": "css",
  "parameters": "content-box or border-box.",
  "returns": "A sizing rule applied to the element's dimensions.",
  "minimalExample": ".card { box-sizing: border-box; width: 200px; padding: 16px; }",
  "productionExample": "*, *::before, *::after { box-sizing: border-box; }\n.card { width: 100%; max-width: 30rem; padding: 1rem; border: 1px solid; }",
  "commonMistakes": [
    "Calculating widths manually while forgetting borders and padding."
  ],
  "securityPerformanceNotes": [
    "Use consistent sizing defaults and verify horizontal overflow at narrow widths."
  ],
  "relatedLessonIds": [
    "02.01.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing"
},
{
  "id": "css-flex",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "flex"
  ],
  "heading": "CSS: flex",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Shorthand controlling flex growth, shrinkage and base size.",
  "syntax": "flex: 1 1 12rem;",
  "lang": "css",
  "parameters": "flex-grow, flex-shrink and flex-basis.",
  "returns": "Computed flex item sizing in its parent's main axis.",
  "minimalExample": ".item { flex: 1 1 0; }",
  "productionExample": ".toolbar { display: flex; flex-wrap: wrap; gap: .5rem; }\n.search { flex: 1 1 14rem; min-width: 0; }\n.actions { flex: 0 0 auto; }",
  "commonMistakes": [
    "Assuming flex:1 always overcomes intrinsic minimum content size."
  ],
  "securityPerformanceNotes": [
    "Use min-width:0 when appropriate and test zoom and long content."
  ],
  "relatedLessonIds": [
    "02.02.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/flex"
},
{
  "id": "css-gap",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "gap"
  ],
  "heading": "CSS: gap",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Defines gutters between grid or flex items and multi-column content.",
  "syntax": "gap: .5rem 1rem;",
  "lang": "css",
  "parameters": "row-gap and column-gap, one or two nonnegative lengths or percentages.",
  "returns": "Spacing between tracks or items, not outside the container.",
  "minimalExample": ".grid { display: grid; gap: 1rem; }",
  "productionExample": ".cards { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%, 16rem),1fr)); gap: clamp(.75rem,2vw,1.5rem); }",
  "commonMistakes": [
    "Using gap to replace all outer padding or assuming percentage gaps resolve identically in every layout."
  ],
  "securityPerformanceNotes": [
    "Use spacing tokens and let containers own outer padding."
  ],
  "relatedLessonIds": [
    "02.02.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/gap"
},
{
  "id": "css-has",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    ":has()"
  ],
  "heading": "CSS: :has()",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Relational pseudo-class that selects an element based on matching relative selectors.",
  "syntax": "article:has(> img) { … }",
  "lang": "css",
  "parameters": "A relative selector list anchored at the candidate element.",
  "returns": "Matches elements satisfying at least one argument.",
  "minimalExample": ".field:has(input:invalid) { border-color: crimson; }",
  "productionExample": ".field:has(input:focus-visible) { outline: 2px solid currentColor; }\n.field:has(> input:user-invalid) .error { display: block; }",
  "commonMistakes": [
    "Using :has() as the only way to communicate an error or applying extremely broad selectors."
  ],
  "securityPerformanceNotes": [
    "Scope selectors to components; include text errors and appropriate accessible associations."
  ],
  "relatedLessonIds": [
    "02.03.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/%3Ahas"
},
{
  "id": "css-transition",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "transition"
  ],
  "heading": "CSS: transition",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Interpolates supported CSS property changes over a duration.",
  "syntax": "transition: opacity 150ms ease;",
  "lang": "css",
  "parameters": "property, duration, timing function, delay and optional behavior.",
  "returns": "Computed transition configuration, with animation when a supported value changes.",
  "minimalExample": "button { transition: background-color 150ms ease; }",
  "productionExample": ".panel { transition: opacity 150ms ease, transform 150ms ease; }\n@media (prefers-reduced-motion: reduce) { .panel { transition: none; } }",
  "commonMistakes": [
    "Using transition:all on layout-heavy components or hiding focus feedback."
  ],
  "securityPerformanceNotes": [
    "Respect reduced-motion settings and profile expensive property changes."
  ],
  "relatedLessonIds": [
    "02.03.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/transition"
},
{
  "id": "javascript-const",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "const"
  ],
  "heading": "JavaScript: const",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Declares a block-scoped binding that cannot be reassigned.",
  "syntax": "const value = expression;",
  "lang": "js",
  "parameters": "An identifier or binding pattern and required initializer.",
  "returns": "A binding, not a guarantee that an object's contents are immutable.",
  "minimalExample": "const count = 1;",
  "productionExample": "const settings = { theme: 'light' };\nconst updated = { ...settings, theme: 'dark' };",
  "commonMistakes": [
    "Confusing immutable bindings with deeply immutable values."
  ],
  "securityPerformanceNotes": [
    "Prefer const by default; avoid accidentally sharing mutable nested state."
  ],
  "relatedLessonIds": [
    "03.01.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const"
},
{
  "id": "javascript-let",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "let"
  ],
  "heading": "JavaScript: let",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Declares a block-scoped binding that may be reassigned.",
  "syntax": "let count = 0;",
  "lang": "js",
  "parameters": "An identifier or binding pattern; optional initializer in normal declarations.",
  "returns": "A mutable lexical binding; access before initialization throws.",
  "minimalExample": "let count = 0;\ncount += 1;",
  "productionExample": "let attempts = 0;\nwhile (attempts < 3) {\n  attempts += 1;\n  if (await attemptOperation()) break;\n}",
  "commonMistakes": [
    "Relying on access before initialization or using mutable global state for requests."
  ],
  "securityPerformanceNotes": [
    "Keep reassignment local and bounded; retries require safe operation semantics."
  ],
  "relatedLessonIds": [
    "03.01.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let"
},
{
  "id": "javascript-async",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "async"
  ],
  "heading": "JavaScript: async",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Declares a function that always returns a promise, enabling await within its body.",
  "syntax": "async function load() { … }",
  "lang": "js",
  "parameters": "Ordinary function parameters; await is allowed in the body.",
  "returns": "Promise resolved from the return value or rejected by a thrown error.",
  "minimalExample": "async function count() { return 3; }",
  "productionExample": "async function getTask(id) {\n  const response = await fetch('/api/tasks/' + encodeURIComponent(id));\n  if (!response.ok) throw new Error('Load failed');\n  return response.json();\n}",
  "commonMistakes": [
    "Forgetting to handle rejected promises or assuming async automatically makes CPU-heavy code nonblocking."
  ],
  "securityPerformanceNotes": [
    "Bound I/O and propagate errors explicitly; validate remote response data."
  ],
  "relatedLessonIds": [
    "03.03.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"
},
{
  "id": "javascript-await",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "await"
  ],
  "heading": "JavaScript: await",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Suspends the enclosing async function until a promise or value is settled.",
  "syntax": "const result = await expression;",
  "lang": "js",
  "parameters": "A value, promise or thenable; permitted in async functions and modules at top level.",
  "returns": "Fulfillment value, or throws the rejection reason.",
  "minimalExample": "const value = await Promise.resolve(42);",
  "productionExample": "const [account, preferences] = await Promise.all([loadAccount(), loadPreferences()]);\n// Independent operations start together; handle rejection at the caller.",
  "commonMistakes": [
    "Serially awaiting independent work or expecting await to block all JavaScript execution."
  ],
  "securityPerformanceNotes": [
    "Limit concurrency for large collections; use a deadline for remote calls."
  ],
  "relatedLessonIds": [
    "03.03.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await"
},
{
  "id": "javascript-array-map",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Array.map"
  ],
  "heading": "JavaScript: Array.map",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Transforms each present element of an array into an element of a new array.",
  "syntax": "items.map((value, index, array) => result)",
  "lang": "js",
  "parameters": "Callback receives value, index and source array; optional thisArg.",
  "returns": "New array of callback results, retaining holes in sparse arrays.",
  "minimalExample": "const doubled = [1, 2].map(n => n * 2);",
  "productionExample": "const publicTasks = tasks.map(({ id, title, done }) => ({ id, title, done }));",
  "commonMistakes": [
    "Using map purely for side effects or forgetting to return from a block callback."
  ],
  "securityPerformanceNotes": [
    "Map does not perform authorization; project only approved fields at a trusted boundary."
  ],
  "relatedLessonIds": [
    "03.01.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map"
},
{
  "id": "javascript-array-filter",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Array.filter"
  ],
  "heading": "JavaScript: Array.filter",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Creates a shallow new array of present elements passing a predicate.",
  "syntax": "items.filter(value => predicate(value))",
  "lang": "js",
  "parameters": "Callback and optional thisArg; truthiness decides inclusion.",
  "returns": "New array containing the selected values.",
  "minimalExample": "const evens = [1, 2, 3].filter(n => n % 2 === 0);",
  "productionExample": "const visibleTasks = tasks.filter(task => !task.archived && task.status === selectedStatus);",
  "commonMistakes": [
    "Expecting filter to modify the source or using client filtering to enforce access control."
  ],
  "securityPerformanceNotes": [
    "Filter private records on the server before delivery; avoid repeated expensive passes when profiling warrants it."
  ],
  "relatedLessonIds": [
    "03.01.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter"
},
{
  "id": "javascript-array-reduce",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Array.reduce"
  ],
  "heading": "JavaScript: Array.reduce",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Accumulates array elements into one result by repeatedly applying a reducer.",
  "syntax": "items.reduce((acc, value) => next, initial)",
  "lang": "js",
  "parameters": "Reducer and optional initial accumulator; supplying an initial value handles empty arrays.",
  "returns": "Final accumulator; throws on an empty array without an initial value.",
  "minimalExample": "const total = [1, 2, 3].reduce((sum, n) => sum + n, 0);",
  "productionExample": "const totals = orders.reduce((acc, order) => {\n  acc[order.status] = (acc[order.status] ?? 0) + 1;\n  return acc;\n}, Object.create(null));",
  "commonMistakes": [
    "Omitting the initial value or using reduce when a simpler loop is clearer."
  ],
  "securityPerformanceNotes": [
    "Use validated grouping keys and avoid repeatedly copying large accumulators."
  ],
  "relatedLessonIds": [
    "03.01.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce"
},
{
  "id": "javascript-array-find",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Array.find"
  ],
  "heading": "JavaScript: Array.find",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Returns the first array element whose predicate is truthy.",
  "syntax": "items.find(value => predicate(value))",
  "lang": "js",
  "parameters": "Callback receives element, index and array; optional thisArg.",
  "returns": "Matching value or undefined if none matches.",
  "minimalExample": "const first = [3, 8, 10].find(n => n > 5);",
  "productionExample": "const task = tasks.find(item => item.id === selectedId);\nif (!task) return showEmptyState();\nrenderTask(task);",
  "commonMistakes": [
    "Treating undefined as proof that an element with value undefined was not present."
  ],
  "securityPerformanceNotes": [
    "Use findIndex when position matters; server authorization is separate from client lookup."
  ],
  "relatedLessonIds": [
    "03.01.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find"
},
{
  "id": "javascript-map",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Map"
  ],
  "heading": "JavaScript: Map",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Key-value collection with arbitrary key types and insertion-order iteration.",
  "syntax": "const map = new Map(entries);",
  "lang": "js",
  "parameters": "Iterable key/value pairs; set, get, has and delete.",
  "returns": "Map instance; get returns value or undefined, set returns the map.",
  "minimalExample": "const counts = new Map([['open', 2]]);",
  "productionExample": "const byId = new Map(tasks.map(task => [task.id, task]));\nif (byId.has(id)) renderTask(byId.get(id));",
  "commonMistakes": [
    "Using object keys with bracket assignment on a Map or assuming get distinguishes missing from undefined."
  ],
  "securityPerformanceNotes": [
    "Bound long-lived maps and remove stale entries; Map is not a serialized JSON format."
  ],
  "relatedLessonIds": [
    "03.02.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map"
},
{
  "id": "javascript-set",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Set"
  ],
  "heading": "JavaScript: Set",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Collection of unique values using SameValueZero equality.",
  "syntax": "const set = new Set(iterable);",
  "lang": "js",
  "parameters": "Optional iterable; add, has, delete and size.",
  "returns": "Set instance retaining insertion order.",
  "minimalExample": "const unique = [...new Set(['a', 'a', 'b'])];",
  "productionExample": "const selected = new Set(selectedIds);\nconst visible = tasks.filter(task => selected.has(task.id));",
  "commonMistakes": [
    "Assuming separately created objects with equal fields deduplicate."
  ],
  "securityPerformanceNotes": [
    "Use stable primitive keys for identity and bound long-lived sets."
  ],
  "relatedLessonIds": [
    "03.02.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set"
},
{
  "id": "javascript-json-parse",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "JSON.parse"
  ],
  "heading": "JavaScript: JSON.parse",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Parses JSON text into a JavaScript value.",
  "syntax": "JSON.parse(text, reviver?)",
  "lang": "js",
  "parameters": "JSON string and optional reviver callback.",
  "returns": "A value described by the JSON; malformed JSON throws SyntaxError.",
  "minimalExample": "const value = JSON.parse('{\"count\":2}');",
  "productionExample": "let raw;\ntry { raw = JSON.parse(requestText); } catch { throw new Error('Invalid JSON'); }\n// Pass raw to a runtime schema validator before accessing fields.",
  "commonMistakes": [
    "Treating parse as schema validation or merging unknown objects into privileged state."
  ],
  "securityPerformanceNotes": [
    "Limit body size before parsing and validate allowed keys and values afterward."
  ],
  "relatedLessonIds": [
    "03.02.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse"
},
{
  "id": "javascript-json-stringify",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "JSON.stringify"
  ],
  "heading": "JavaScript: JSON.stringify",
  "category": "JavaScript",
  "majorVersion": "ECMAScript",
  "status": "Authored reference draft",
  "summary": "Serializes supported JavaScript values into JSON text.",
  "syntax": "JSON.stringify(value, replacer?, space?)",
  "lang": "js",
  "parameters": "Value, optional replacer function/array and indentation.",
  "returns": "String or undefined for unsupported top-level values; cycles and ordinary BigInt values throw.",
  "minimalExample": "const json = JSON.stringify({ done: false });",
  "productionExample": "const dto = { id: task.id, title: task.title, done: task.done };\nreturn new Response(JSON.stringify(dto), { headers: { 'Content-Type': 'application/json' } });",
  "commonMistakes": [
    "Assuming serialization preserves Map, Set, undefined or every JavaScript type."
  ],
  "securityPerformanceNotes": [
    "Project public fields explicitly; avoid exposing secrets and oversized payloads."
  ],
  "relatedLessonIds": [
    "03.02.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify"
},
{
  "id": "typescript-unknown",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "unknown"
  ],
  "heading": "TypeScript: unknown",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Safe top type for values that must be narrowed before use.",
  "syntax": "let input: unknown;",
  "lang": "ts",
  "parameters": "Any value can be assigned; use guards to access specific operations.",
  "returns": "Compile-time type; no runtime validation is added.",
  "minimalExample": "function length(x: unknown) { return typeof x === 'string' ? x.length : 0; }",
  "productionExample": "function parseTitle(input: unknown): string {\n  if (typeof input !== 'string' || input.trim().length === 0) throw new Error('Invalid title');\n  return input.trim();\n}",
  "commonMistakes": [
    "Replacing unknown with any or asserting a remote payload to a trusted type."
  ],
  "securityPerformanceNotes": [
    "Validate untrusted values at the server boundary; type annotations are erased."
  ],
  "relatedLessonIds": [
    "04.03.02"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown"
},
{
  "id": "typescript-keyof",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "keyof"
  ],
  "heading": "TypeScript: keyof",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Produces the union of allowed property keys for an object type.",
  "syntax": "type Keys = keyof T;",
  "lang": "ts",
  "parameters": "An object type; index signatures may widen the key union.",
  "returns": "A compile-time property-key union.",
  "minimalExample": "type Keys = keyof { id: string; done: boolean };",
  "productionExample": "function get<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}",
  "commonMistakes": [
    "Assuming keyof lists actual runtime keys or always returns only string keys."
  ],
  "securityPerformanceNotes": [
    "Validate user-supplied property selectors at runtime; do not expose arbitrary object fields."
  ],
  "relatedLessonIds": [
    "04.02.02"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/keyof-types.html"
},
{
  "id": "typescript-typeof",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "typeof"
  ],
  "heading": "TypeScript: typeof",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Captures the static type of a variable or property in a type position.",
  "syntax": "type Config = typeof config;",
  "lang": "ts",
  "parameters": "An identifier or property access supported in a type query.",
  "returns": "A compile-time type, distinct from the runtime typeof operator.",
  "minimalExample": "const value = { id: 1 };\ntype Value = typeof value;",
  "productionExample": "const defaults = { pageSize: 20, sort: 'newest' as const };\ntype Defaults = typeof defaults;\nconst config: Defaults = { pageSize: 50, sort: 'newest' };",
  "commonMistakes": [
    "Using type-position typeof as a runtime schema or calling arbitrary expressions in a type query."
  ],
  "securityPerformanceNotes": [
    "Keep static config types separate from validation of runtime overrides."
  ],
  "relatedLessonIds": [
    "04.02.02"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/typeof-types.html"
},
{
  "id": "typescript-satisfies",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "satisfies"
  ],
  "heading": "TypeScript: satisfies",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Checks an expression against a type while retaining useful inferred information.",
  "syntax": "expression satisfies TargetType",
  "lang": "ts",
  "parameters": "An expression and target type; the check is compile-time.",
  "returns": "The expression's value with inference preserved subject to contextual typing.",
  "minimalExample": "const colors = { primary: '#0088ff' } satisfies Record<string, string>;",
  "productionExample": "type Role = 'reader' | 'editor';\nconst permissions = { reader: ['read'], editor: ['read', 'write'] } satisfies Record<Role, readonly string[]>;",
  "commonMistakes": [
    "Assuming satisfies validates incoming JSON or makes an object immutable."
  ],
  "securityPerformanceNotes": [
    "Use it for authored configuration; enforce actual permissions on the server."
  ],
  "relatedLessonIds": [
    "04.03.01"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/release-notes/typescript-4-9.html"
},
{
  "id": "typescript-partial",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "Partial"
  ],
  "heading": "TypeScript: Partial",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Makes all top-level properties of a type optional.",
  "syntax": "type Patch = Partial<T>;",
  "lang": "ts",
  "parameters": "An object type T.",
  "returns": "Mapped type with optional properties; not recursively partial.",
  "minimalExample": "type Patch = Partial<{ title: string; done: boolean }>;",
  "productionExample": "type Editable = { title: string; done: boolean };\nfunction merge(current: Editable, patch: Partial<Editable>): Editable {\n  return { ...current, ...patch };\n}",
  "commonMistakes": [
    "Applying Partial to an entire database entity and permitting updates to protected fields."
  ],
  "securityPerformanceNotes": [
    "Use an explicit editable DTO and runtime allowlist; distinguish absent values from explicit undefined."
  ],
  "relatedLessonIds": [
    "04.02.06"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype"
},
{
  "id": "typescript-pick",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "Pick"
  ],
  "heading": "TypeScript: Pick",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Selects specified properties from an existing type.",
  "syntax": "type Public = Pick<T, K>;",
  "lang": "ts",
  "parameters": "T and a key union K constrained to keyof T.",
  "returns": "Object type containing the selected properties.",
  "minimalExample": "type Public = Pick<{ id: string; secret: string }, 'id'>;",
  "productionExample": "type User = { id: string; name: string; passwordHash: string };\ntype PublicUser = Pick<User, 'id' | 'name'>;\nfunction toPublic(user: User): PublicUser { return { id: user.id, name: user.name }; }",
  "commonMistakes": [
    "Assigning a full object to Pick and assuming runtime fields were removed."
  ],
  "securityPerformanceNotes": [
    "Construct the public object explicitly before serialization."
  ],
  "relatedLessonIds": [
    "04.02.06"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys"
},
{
  "id": "typescript-omit",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "Omit"
  ],
  "heading": "TypeScript: Omit",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Creates a type excluding selected keys from an object type.",
  "syntax": "type WithoutSecret = Omit<T, K>;",
  "lang": "ts",
  "parameters": "An object type and keys to omit.",
  "returns": "Mapped type excluding the selected properties.",
  "minimalExample": "type Safe = Omit<{ id: string; token: string }, 'token'>;",
  "productionExample": "type Internal = { id: string; title: string; debug: string };\ntype Public = Omit<Internal, 'debug'>;\nfunction serialize(item: Internal): Public { return { id: item.id, title: item.title }; }",
  "commonMistakes": [
    "Assuming Omit removes fields from a runtime object or protects future sensitive additions."
  ],
  "securityPerformanceNotes": [
    "For public responses prefer explicit field allowlists that fail safely when models grow."
  ],
  "relatedLessonIds": [
    "04.02.06"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys"
},
{
  "id": "typescript-record",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "Record"
  ],
  "heading": "TypeScript: Record",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Constructs an object type mapping a key union to a value type.",
  "syntax": "type Lookup = Record<K, V>;",
  "lang": "ts",
  "parameters": "K must be a property-key type; V is the value type.",
  "returns": "Mapped object type with the specified keys.",
  "minimalExample": "type Flags = Record<'read' | 'write', boolean>;",
  "productionExample": "type Status = 'open' | 'done';\nconst label: Record<Status, string> = { open: 'Open', done: 'Completed' };",
  "commonMistakes": [
    "Treating Record<string,T> as proof every arbitrary runtime key exists."
  ],
  "securityPerformanceNotes": [
    "Use explicit unions or Map for dynamic keys and validate incoming lookup keys."
  ],
  "relatedLessonIds": [
    "04.02.06"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type"
},
{
  "id": "typescript-returntype",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "ReturnType"
  ],
  "heading": "TypeScript: ReturnType",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Extracts the return type of a function type.",
  "syntax": "type Result = ReturnType<typeof fn>;",
  "lang": "ts",
  "parameters": "A callable function type; overloaded functions use the last signature for inference.",
  "returns": "Compile-time return type.",
  "minimalExample": "type Result = ReturnType<() => number>;",
  "productionExample": "function makeTask(id: string) { return { id, done: false }; }\ntype Task = ReturnType<typeof makeTask>;\nconst tasks: Task[] = [];",
  "commonMistakes": [
    "Expecting ReturnType to execute a function or unwrap an async result."
  ],
  "securityPerformanceNotes": [
    "Use Awaited with async return types when appropriate; validate runtime responses separately."
  ],
  "relatedLessonIds": [
    "04.02.06"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype"
},
{
  "id": "typescript-awaited",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "Awaited"
  ],
  "heading": "TypeScript: Awaited",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Models recursive promise-like unwrapping performed by await.",
  "syntax": "type Resolved = Awaited<T>;",
  "lang": "ts",
  "parameters": "A type potentially containing Promise-like values.",
  "returns": "The recursively unwrapped type; distributes over unions.",
  "minimalExample": "type Value = Awaited<Promise<number>>;",
  "productionExample": "async function load() { return { id: 'task-1' }; }\ntype Task = Awaited<ReturnType<typeof load>>;",
  "commonMistakes": [
    "Assuming Awaited converts runtime promises to synchronous values."
  ],
  "securityPerformanceNotes": [
    "Keep rejection handling and cancellation explicit; static types do not model all failures."
  ],
  "relatedLessonIds": [
    "04.02.06"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype"
},
{
  "id": "react-key",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "key"
  ],
  "heading": "React: key",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Provides sibling identity so React can associate rendered elements with previous instances.",
  "syntax": "<Item key={item.id} />",
  "lang": "tsx",
  "parameters": "Stable string or number key, unique among siblings; not delivered as a normal prop.",
  "returns": "React element identity hint.",
  "minimalExample": "const rows = items.map(item => <li key={item.id}>{item.title}</li>);",
  "productionExample": "function TaskList({ tasks }) {\n  return <ul>{tasks.map(task => <TaskRow key={task.id} task={task} />)}</ul>;\n}",
  "commonMistakes": [
    "Using random keys or mutable array indices for reorderable data."
  ],
  "securityPerformanceNotes": [
    "Use stable domain IDs to preserve state; keys are not authorization identifiers."
  ],
  "relatedLessonIds": [
    "06.01.05"
  ],
  "canonicalUrl": "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key"
},
{
  "id": "react-usememo",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useMemo"
  ],
  "heading": "React: useMemo",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Caches the result of a pure calculation between renders when dependencies are unchanged.",
  "syntax": "const result = useMemo(calculateValue, dependencies);",
  "lang": "tsx",
  "parameters": "Pure calculation and every reactive dependency used by it.",
  "returns": "Calculated value; cache is a performance optimization, not semantic storage.",
  "minimalExample": "const sorted = useMemo(() => [...items].sort(compare), [items, compare]);",
  "productionExample": "function Search({ tasks, query }) {\n  const matching = useMemo(() => tasks.filter(t => t.title.includes(query)), [tasks, query]);\n  return <TaskList tasks={matching} />;\n}",
  "commonMistakes": [
    "Using useMemo to guarantee correctness or omitting dependencies."
  ],
  "securityPerformanceNotes": [
    "Measure before adding memoization; avoid side effects during render."
  ],
  "relatedLessonIds": [
    "06.05.06"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useMemo"
},
{
  "id": "react-usecallback",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useCallback"
  ],
  "heading": "React: useCallback",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Caches a function identity between renders while its reactive dependencies remain unchanged.",
  "syntax": "const fn = useCallback(callback, dependencies);",
  "lang": "tsx",
  "parameters": "Function and dependency array; React does not call the callback for you.",
  "returns": "Cached function reference.",
  "minimalExample": "const onClose = useCallback(() => setOpen(false), []);",
  "productionExample": "const addTask = useCallback((task) => {\n  setTasks(previous => [...previous, task]);\n}, []);\nreturn <TaskComposer onAdd={addTask} />;",
  "commonMistakes": [
    "Omitting dependencies to suppress rerenders or expecting the hook to invoke a callback."
  ],
  "securityPerformanceNotes": [
    "Use stable references where profiling or dependency contracts justify them; avoid stale closure bugs."
  ],
  "relatedLessonIds": [
    "06.05.06"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useCallback"
},
{
  "id": "react-usedeferredvalue",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useDeferredValue"
  ],
  "heading": "React: useDeferredValue",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Defers a value used by a lower-priority part of the UI while urgent updates remain responsive.",
  "syntax": "const deferred = useDeferredValue(value);",
  "lang": "tsx",
  "parameters": "Value to defer; optional initial value in React 19.",
  "returns": "Deferred version of the value; may lag during background rendering.",
  "minimalExample": "const deferredQuery = useDeferredValue(query);",
  "productionExample": "function Search({ tasks }) {\n  const [query, setQuery] = useState('');\n  const deferred = useDeferredValue(query);\n  return <><input aria-label=\"Search\" value={query} onChange={e => setQuery(e.target.value)} /><Results tasks={tasks} query={deferred} /></>;\n}",
  "commonMistakes": [
    "Treating deferred rendering as request debouncing or a fixed time delay."
  ],
  "securityPerformanceNotes": [
    "Indicate stale results where useful; expensive child renders may need memoization."
  ],
  "relatedLessonIds": [
    "06.04.04"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useDeferredValue"
},
{
  "id": "react-suspense",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "Suspense"
  ],
  "heading": "React: Suspense",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Shows a fallback while supported descendants suspend during rendering.",
  "syntax": "<Suspense fallback={<Loading />}>…</Suspense>",
  "lang": "tsx",
  "parameters": "fallback and children; suspension requires a compatible data source or lazy code.",
  "returns": "A boundary that renders children or fallback.",
  "minimalExample": "<Suspense fallback={<p>Loading…</p>}><LazyPanel /></Suspense>",
  "productionExample": "function Dashboard() {\n  return <main><h1>Dashboard</h1><Suspense fallback={<p role=\"status\">Loading activity…</p>}><ActivityPanel /></Suspense></main>;\n}",
  "commonMistakes": [
    "Assuming Suspense automatically detects ordinary fetches in effects or replaces error boundaries."
  ],
  "securityPerformanceNotes": [
    "Design boundaries around meaningful regions; do not reveal protected content before authorization."
  ],
  "relatedLessonIds": [
    "06.04.07"
  ],
  "canonicalUrl": "https://react.dev/reference/react/Suspense"
},
{
  "id": "next.js-page-tsx",
  "matchCategories": [
    "Next.js"
  ],
  "matchTitles": [
    "page.tsx"
  ],
  "heading": "Next.js: page.tsx",
  "category": "Next.js",
  "majorVersion": "Next.js 16 App Router",
  "status": "Authored reference draft",
  "summary": "A page special file defines route UI for an App Router segment.",
  "syntax": "export default function Page() { return <main>Page</main>; }",
  "lang": "tsx",
  "parameters": "Default component export; dynamic params and searchParams are asynchronous in Next.js 16 page props.",
  "returns": "Rendered route content.",
  "minimalExample": "export default function Page() { return <h1>Home</h1>; }",
  "productionExample": "export default async function Page({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  const task = await loadAuthorizedTask(id);\n  return <main><h1>{task.title}</h1></main>;\n}",
  "commonMistakes": [
    "Assuming route params are trusted or forgetting to await them."
  ],
  "securityPerformanceNotes": [
    "Authorize on the server and keep secrets out of client modules."
  ],
  "relatedLessonIds": [
    "07.01.02"
  ],
  "canonicalUrl": "https://nextjs.org/docs/app/api-reference/file-conventions/page"
},
{
  "id": "next.js-layout-tsx",
  "matchCategories": [
    "Next.js"
  ],
  "matchTitles": [
    "layout.tsx"
  ],
  "heading": "Next.js: layout.tsx",
  "category": "Next.js",
  "majorVersion": "Next.js 16 App Router",
  "status": "Authored reference draft",
  "summary": "A layout special file wraps route segments with shared UI.",
  "syntax": "export default function Layout({ children }: { children: React.ReactNode }) { return children; }",
  "lang": "tsx",
  "parameters": "children plus supported route parameters; root layout includes html and body.",
  "returns": "Shared route UI; layouts persist across compatible client navigations.",
  "minimalExample": "export default function Layout({ children }: { children: React.ReactNode }) { return <section>{children}</section>; }",
  "productionExample": "export default function DashboardLayout({ children }: { children: React.ReactNode }) {\n  return <div><nav aria-label=\"Dashboard\">Dashboard links</nav><main>{children}</main></div>;\n}",
  "commonMistakes": [
    "Expecting a persistent layout to re-read every query parameter or serve as the only authorization check."
  ],
  "securityPerformanceNotes": [
    "Check authorization close to data access and mutations; avoid duplicated main landmarks."
  ],
  "relatedLessonIds": [
    "07.01.02"
  ],
  "canonicalUrl": "https://nextjs.org/docs/app/api-reference/file-conventions/layout"
},
{
  "id": "next.js-loading-tsx",
  "matchCategories": [
    "Next.js"
  ],
  "matchTitles": [
    "loading.tsx"
  ],
  "heading": "Next.js: loading.tsx",
  "category": "Next.js",
  "majorVersion": "Next.js 16 App Router",
  "status": "Authored reference draft",
  "summary": "Provides an instant loading UI for a route segment using a Suspense boundary.",
  "syntax": "export default function Loading() { return <p>Loading…</p>; }",
  "lang": "tsx",
  "parameters": "Default component export without required parameters.",
  "returns": "Fallback UI during supported segment loading.",
  "minimalExample": "export default function Loading() { return <p role=\"status\">Loading…</p>; }",
  "productionExample": "export default function Loading() {\n  return <section aria-busy=\"true\"><h1>Tasks</h1><p role=\"status\">Loading task list…</p></section>;\n}",
  "commonMistakes": [
    "Using loading UI as a replacement for empty, denied or error states."
  ],
  "securityPerformanceNotes": [
    "Avoid layout shifts and excessive animation; never expose private skeleton data."
  ],
  "relatedLessonIds": [
    "07.01.04"
  ],
  "canonicalUrl": "https://nextjs.org/docs/app/api-reference/file-conventions/loading"
},
{
  "id": "next.js-route-ts",
  "matchCategories": [
    "Next.js"
  ],
  "matchTitles": [
    "route.ts"
  ],
  "heading": "Next.js: route.ts",
  "category": "Next.js",
  "majorVersion": "Next.js 16 App Router",
  "status": "Authored reference draft",
  "summary": "Defines HTTP route handlers in the App Router.",
  "syntax": "export async function GET(request: Request) { return Response.json({ ok: true }); }",
  "lang": "ts",
  "parameters": "Named HTTP method exports; Request and optional route context.",
  "returns": "Response or Promise<Response> for the requested method.",
  "minimalExample": "export function GET() { return Response.json({ status: 'ok' }); }",
  "productionExample": "export async function GET(request: Request) {\n  const session = await authenticate(request);\n  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });\n  return Response.json(await listAuthorizedTasks(session.userId));\n}",
  "commonMistakes": [
    "Treating route handlers as trusted internal calls or returning sensitive data from an unauthenticated GET."
  ],
  "securityPerformanceNotes": [
    "Validate inputs, enforce object-level access and set appropriate cache policy for private data."
  ],
  "relatedLessonIds": [
    "07.02.05"
  ],
  "canonicalUrl": "https://nextjs.org/docs/app/api-reference/file-conventions/route"
},
{
  "id": "next.js-dynamic-segments",
  "matchCategories": [
    "Next.js"
  ],
  "matchTitles": [
    "dynamic segments"
  ],
  "heading": "Next.js: dynamic segments",
  "category": "Next.js",
  "majorVersion": "Next.js 16 App Router",
  "status": "Authored reference draft",
  "summary": "Maps bracketed route folders to URL parameters.",
  "syntax": "app/tasks/[id]/page.tsx",
  "lang": "tsx",
  "parameters": "Dynamic segment names; catch-all segments use [...name] and optional catch-all [[...name]].",
  "returns": "Matched route parameters, read asynchronously in current page props.",
  "minimalExample": "export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <p>{(await params).id}</p>; }",
  "productionExample": "export default async function Page({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  if (!isValidTaskId(id)) notFound();\n  const task = await findTaskForCurrentUser(id);\n  if (!task) notFound();\n  return <h1>{task.title}</h1>;\n}",
  "commonMistakes": [
    "Assuming an identifier from the URL proves ownership."
  ],
  "securityPerformanceNotes": [
    "Validate route identifiers, authorize record access and encode generated URL segments."
  ],
  "relatedLessonIds": [
    "07.01.03"
  ],
  "canonicalUrl": "https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes"
},
{
  "id": "next.js-link",
  "matchCategories": [
    "Next.js"
  ],
  "matchTitles": [
    "Link"
  ],
  "heading": "Next.js: Link",
  "category": "Next.js",
  "majorVersion": "Next.js 16 App Router",
  "status": "Authored reference draft",
  "summary": "Extends anchor navigation with Next.js client-side routing and prefetch behavior.",
  "syntax": "<Link href=\"/learn\">Learn</Link>",
  "lang": "tsx",
  "parameters": "href, children and optional navigation/prefetch options.",
  "returns": "A link element with framework navigation behavior.",
  "minimalExample": "import Link from 'next/link';\nexport default function Nav() { return <Link href=\"/learn\">Learn</Link>; }",
  "productionExample": "import Link from 'next/link';\nfunction TaskLinks({ tasks }) {\n  return <ul>{tasks.map(task => <li key={task.id}><Link href={'/tasks/' + encodeURIComponent(task.id)}>{task.title}</Link></li>)}</ul>;\n}",
  "commonMistakes": [
    "Using Link for button actions or accepting an arbitrary URL from untrusted input."
  ],
  "securityPerformanceNotes": [
    "Keep meaningful anchor text, preserve native navigation semantics and validate destinations."
  ],
  "relatedLessonIds": [
    "07.01.06"
  ],
  "canonicalUrl": "https://nextjs.org/docs/app/api-reference/components/link"
},
{
  "id": "nestjs-controller",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "@Controller"
  ],
  "heading": "NestJS: @Controller",
  "category": "NestJS",
  "majorVersion": "NestJS",
  "status": "Authored reference draft",
  "summary": "Associates a class with a route prefix; decorated methods handle requests.",
  "syntax": "@Controller('tasks')",
  "lang": "ts",
  "parameters": "Optional path or controller options.",
  "returns": "Registers a controller when declared in a module.",
  "minimalExample": "@Controller('tasks') class TasksController {}",
  "productionExample": "@Controller('tasks')\nexport class TasksController {\n  constructor(private readonly tasks: TasksService) {}\n  @Get() list() { return this.tasks.listPublic(); }\n}",
  "commonMistakes": [
    "Putting database access directly in every controller."
  ],
  "securityPerformanceNotes": [
    "Keep authorization and validation at request/service boundaries; register the controller in its module."
  ],
  "relatedLessonIds": [
    "11.01.02"
  ],
  "canonicalUrl": "https://docs.nestjs.com/controllers"
},
{
  "id": "nestjs-get",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "@Get"
  ],
  "heading": "NestJS: @Get",
  "category": "NestJS",
  "majorVersion": "NestJS",
  "status": "Authored reference draft",
  "summary": "Binds a controller method to an HTTP GET route.",
  "syntax": "@Get(':id')",
  "lang": "ts",
  "parameters": "Optional relative path.",
  "returns": "Dispatches GET requests to the method; Nest serializes returned data by default.",
  "minimalExample": "@Get() list() { return []; }",
  "productionExample": "@Get(':id')\n@UseGuards(SessionGuard)\nget(@Param('id') id: string, @Req() req: AuthenticatedRequest) {\n  return this.tasks.getForUser(req.user.id, id);\n}",
  "commonMistakes": [
    "Treating a URL parameter as proof of ownership."
  ],
  "securityPerformanceNotes": [
    "GET should not mutate domain state; validate IDs and enforce object access."
  ],
  "relatedLessonIds": [
    "11.01.02"
  ],
  "canonicalUrl": "https://docs.nestjs.com/controllers"
},
{
  "id": "nestjs-post",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "@Post"
  ],
  "heading": "NestJS: @Post",
  "category": "NestJS",
  "majorVersion": "NestJS",
  "status": "Authored reference draft",
  "summary": "Binds a controller method to POST; Nest defaults to status 201.",
  "syntax": "@Post()",
  "lang": "ts",
  "parameters": "Optional path; use @HttpCode to change status deliberately.",
  "returns": "Handles POST and serializes the result by default.",
  "minimalExample": "@Post() create(@Body() dto: CreateTaskDto) { return this.tasks.create(dto); }",
  "productionExample": "@Post()\n@UseGuards(SessionGuard)\ncreate(@Body() dto: CreateTaskDto, @Req() req: AuthenticatedRequest) {\n  return this.tasks.createForUser(req.user.id, dto);\n}",
  "commonMistakes": [
    "Assuming a TypeScript DTO validates JSON by itself."
  ],
  "securityPerformanceNotes": [
    "Configure runtime validation and explicit editable fields; design safe retry semantics for writes."
  ],
  "relatedLessonIds": [
    "11.01.02"
  ],
  "canonicalUrl": "https://docs.nestjs.com/controllers"
},
{
  "id": "nestjs-inject",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "@Inject"
  ],
  "heading": "NestJS: @Inject",
  "category": "NestJS",
  "majorVersion": "NestJS",
  "status": "Authored reference draft",
  "summary": "Selects a dependency by token when class-based inference is insufficient.",
  "syntax": "@Inject(TASK_REPOSITORY)",
  "lang": "ts",
  "parameters": "Provider token (class, string or symbol).",
  "returns": "Resolves the registered provider in the module graph.",
  "minimalExample": "constructor(@Inject(TASK_REPOSITORY) private readonly repo: TaskRepository) {}",
  "productionExample": "const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');\n@Module({ providers: [{ provide: TASK_REPOSITORY, useClass: PgTaskRepository }, TaskService] })\nclass TasksModule {}",
  "commonMistakes": [
    "Declaring independent symbols with the same description and expecting equality."
  ],
  "securityPerformanceNotes": [
    "Export a single shared token; avoid global mutable providers for request-specific state."
  ],
  "relatedLessonIds": [
    "11.04.01"
  ],
  "canonicalUrl": "https://docs.nestjs.com/fundamentals/custom-providers"
},
{
  "id": "nestjs-executioncontext",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "ExecutionContext"
  ],
  "heading": "NestJS: ExecutionContext",
  "category": "NestJS",
  "majorVersion": "NestJS",
  "status": "Authored reference draft",
  "summary": "Extends ArgumentsHost with information about the invoked handler and class.",
  "syntax": "context.switchToHttp().getRequest()",
  "lang": "ts",
  "parameters": "Context supplied by Nest to guards and interceptors.",
  "returns": "Accesses transport-specific arguments, handler and class metadata.",
  "minimalExample": "const handler = context.getHandler();",
  "productionExample": "canActivate(context: ExecutionContext) {\n  if (context.getType() !== 'http') return false;\n  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();\n  return Boolean(request.user?.id);\n}",
  "commonMistakes": [
    "Using HTTP-only request extraction for WebSocket or RPC handlers."
  ],
  "securityPerformanceNotes": [
    "This sample is only an authentication-presence check; enforce resource-specific authorization separately."
  ],
  "relatedLessonIds": [
    "11.02.03"
  ],
  "canonicalUrl": "https://docs.nestjs.com/fundamentals/execution-context"
},
{
  "id": "nestjs-middleware",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "Middleware"
  ],
  "heading": "NestJS: Middleware",
  "category": "NestJS",
  "majorVersion": "NestJS",
  "status": "Authored reference draft",
  "summary": "Runs before route handlers and can enrich or terminate requests.",
  "syntax": "use(req, res, next)",
  "lang": "ts",
  "parameters": "Request, response and continuation; interfaces depend on adapter.",
  "returns": "Continues the pipeline when next() is called.",
  "minimalExample": "use(req: Request, res: Response, next: NextFunction) { next(); }",
  "productionExample": "// Express adapter example\nuse(req: Request, res: Response, next: NextFunction) {\n  const id = randomUUID();\n  res.setHeader('X-Request-Id', id);\n  next();\n}",
  "commonMistakes": [
    "Forgetting next() without ending the response."
  ],
  "securityPerformanceNotes": [
    "Do not trust incoming correlation IDs by default; avoid logging authorization headers."
  ],
  "relatedLessonIds": [
    "11.02.01"
  ],
  "canonicalUrl": "https://docs.nestjs.com/middleware"
},
{
  "id": "nestjs-testingmodule",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "TestingModule"
  ],
  "heading": "NestJS: TestingModule",
  "category": "NestJS",
  "majorVersion": "NestJS",
  "status": "Authored reference draft",
  "summary": "Builds an isolated Nest dependency graph for tests.",
  "syntax": "Test.createTestingModule({ providers: [] }).compile()",
  "lang": "ts",
  "parameters": "Module metadata and optional provider overrides.",
  "returns": "Promise<TestingModule> with DI lookup and lifecycle methods.",
  "minimalExample": "const module = await Test.createTestingModule({ providers: [TasksService] }).compile();",
  "productionExample": "const module = await Test.createTestingModule({ providers: [TasksService, { provide: TASK_REPOSITORY, useValue: fakeRepo }] }).compile();\ntry { expect(module.get(TasksService)).toBeDefined(); } finally { await module.close(); }",
  "commonMistakes": [
    "Mocking everything and calling it an HTTP integration test."
  ],
  "securityPerformanceNotes": [
    "Test real persistence and request pipeline separately; close test resources."
  ],
  "relatedLessonIds": [
    "11.04.05"
  ],
  "canonicalUrl": "https://docs.nestjs.com/fundamentals/testing"
},
{
  "id": "nestjs-configmodule",
  "matchCategories": [
    "NestJS"
  ],
  "matchTitles": [
    "ConfigModule"
  ],
  "heading": "NestJS: ConfigModule",
  "category": "NestJS",
  "majorVersion": "NestJS",
  "status": "Authored reference draft",
  "summary": "Loads application configuration through dependency injection.",
  "syntax": "ConfigModule.forRoot(options)",
  "lang": "ts",
  "parameters": "Options include validate, isGlobal and environment-file settings.",
  "returns": "A dynamic module exposing ConfigService.",
  "minimalExample": "ConfigModule.forRoot()",
  "productionExample": "ConfigModule.forRoot({ validate: env => {\n  if (typeof env.DATABASE_URL !== 'string' || !env.DATABASE_URL) throw new Error('DATABASE_URL required');\n  return env;\n} })",
  "commonMistakes": [
    "Assuming get<string>() proves a variable exists or has correct format."
  ],
  "securityPerformanceNotes": [
    "Validate all required settings at startup; do not print secrets in validation errors."
  ],
  "relatedLessonIds": [
    "11.01.05"
  ],
  "canonicalUrl": "https://docs.nestjs.com/techniques/configuration"
},
{
  "id": "postgresql-select",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "SELECT"
  ],
  "heading": "PostgreSQL: SELECT",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Reads rows or computed expressions from one or more sources.",
  "syntax": "SELECT columns FROM table WHERE predicate;",
  "lang": "sql",
  "parameters": "Projection, source, filter and optional ordering.",
  "returns": "A result set; order is unspecified without ORDER BY.",
  "minimalExample": "SELECT id, title FROM tasks;",
  "productionExample": "SELECT id, title FROM tasks WHERE workspace_id = $1 AND archived_at IS NULL ORDER BY id LIMIT 50;",
  "commonMistakes": [
    "Using SELECT * in a public API or expecting implicit row ordering."
  ],
  "securityPerformanceNotes": [
    "Bind parameters through a database driver; enforce tenant membership before supplying workspace ID."
  ],
  "relatedLessonIds": [
    "12.01.02"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/sql-select.html"
},
{
  "id": "postgresql-insert",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "INSERT"
  ],
  "heading": "PostgreSQL: INSERT",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Creates rows subject to constraints and privileges.",
  "syntax": "INSERT INTO tasks (title) VALUES ($1);",
  "lang": "sql",
  "parameters": "Target columns and values or query; optional RETURNING.",
  "returns": "Inserted rows if RETURNING is used; otherwise command count.",
  "minimalExample": "INSERT INTO tasks (title) VALUES ('Read docs');",
  "productionExample": "INSERT INTO tasks (workspace_id, title) VALUES ($1, $2) RETURNING id, title;",
  "commonMistakes": [
    "Concatenating untrusted values into SQL or ignoring unique violations."
  ],
  "securityPerformanceNotes": [
    "Check tenant authorization; use constraints and idempotency for replayable operations."
  ],
  "relatedLessonIds": [
    "12.01.08"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/sql-insert.html"
},
{
  "id": "postgresql-update",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "UPDATE"
  ],
  "heading": "PostgreSQL: UPDATE",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Changes matching rows; supports conditional version checks.",
  "syntax": "UPDATE tasks SET title = $1 WHERE id = $2;",
  "lang": "sql",
  "parameters": "SET expressions, WHERE predicate and optional RETURNING.",
  "returns": "Updated rows with RETURNING, otherwise count.",
  "minimalExample": "UPDATE tasks SET done = true WHERE id = 1;",
  "productionExample": "UPDATE tasks SET title = $1, version = version + 1 WHERE id = $2 AND workspace_id = $3 AND version = $4 RETURNING id, version;",
  "commonMistakes": [
    "Omitting WHERE or ignoring zero-row optimistic conflicts."
  ],
  "securityPerformanceNotes": [
    "Use parameter binding and verified tenant scope; distinguish conflicts from successful writes."
  ],
  "relatedLessonIds": [
    "12.03.04"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/sql-update.html"
},
{
  "id": "postgresql-delete",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "DELETE"
  ],
  "heading": "PostgreSQL: DELETE",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Removes rows matching a predicate.",
  "syntax": "DELETE FROM tasks WHERE id = $1;",
  "lang": "sql",
  "parameters": "Target, filter and optional RETURNING.",
  "returns": "Deleted rows with RETURNING or command count.",
  "minimalExample": "DELETE FROM tasks WHERE id = 1;",
  "productionExample": "DELETE FROM tasks WHERE id = $1 AND workspace_id = $2 RETURNING id;",
  "commonMistakes": [
    "Omitting WHERE or overlooking cascade constraints."
  ],
  "securityPerformanceNotes": [
    "Require authorization and review retention requirements before physical deletion."
  ],
  "relatedLessonIds": [
    "12.02.05"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/sql-delete.html"
},
{
  "id": "postgresql-join",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "JOIN"
  ],
  "heading": "PostgreSQL: JOIN",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Combines rows according to a join condition and join type.",
  "syntax": "SELECT * FROM a JOIN b ON a.id = b.a_id;",
  "lang": "sql",
  "parameters": "Left/right sources and ON or USING condition.",
  "returns": "Combined rows; outer joins preserve unmatched rows on their retained side.",
  "minimalExample": "SELECT t.title, p.name FROM tasks t JOIN projects p ON p.id = t.project_id;",
  "productionExample": "SELECT t.id, p.name FROM tasks t LEFT JOIN projects p ON p.id = t.project_id AND p.workspace_id = t.workspace_id WHERE t.workspace_id = $1;",
  "commonMistakes": [
    "Filtering a nullable right-side column in WHERE and unintentionally removing unmatched rows."
  ],
  "securityPerformanceNotes": [
    "Use tenant-safe foreign keys and inspect multiplicity and indexes."
  ],
  "relatedLessonIds": [
    "12.01.03"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/queries-table-expressions.html"
},
{
  "id": "postgresql-group-by",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "GROUP BY"
  ],
  "heading": "PostgreSQL: GROUP BY",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Partitions input rows into groups for aggregate computation.",
  "syntax": "SELECT status, count(*) FROM tasks GROUP BY status;",
  "lang": "sql",
  "parameters": "Grouping expressions and aggregate expressions.",
  "returns": "One result row per group unless grouping sets alter that shape.",
  "minimalExample": "SELECT status, count(*) FROM tasks GROUP BY status;",
  "productionExample": "SELECT status, count(*) AS task_count FROM tasks WHERE workspace_id = $1 GROUP BY status ORDER BY status;",
  "commonMistakes": [
    "Selecting ungrouped nonaggregated columns without a valid functional dependency."
  ],
  "securityPerformanceNotes": [
    "Filter tenant rows before aggregation; bound group cardinality for public reports."
  ],
  "relatedLessonIds": [
    "12.01.04"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/queries-table-expressions.html"
},
{
  "id": "postgresql-having",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "HAVING"
  ],
  "heading": "PostgreSQL: HAVING",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Filters groups after aggregation rather than individual source rows.",
  "syntax": "GROUP BY status HAVING count(*) > 5",
  "lang": "sql",
  "parameters": "Predicate over group expressions and aggregates.",
  "returns": "Only groups satisfying the predicate.",
  "minimalExample": "SELECT status, count(*) FROM tasks GROUP BY status HAVING count(*) > 5;",
  "productionExample": "SELECT project_id, count(*) FROM tasks WHERE workspace_id = $1 GROUP BY project_id HAVING count(*) >= $2;",
  "commonMistakes": [
    "Putting aggregate predicates in WHERE."
  ],
  "securityPerformanceNotes": [
    "Use WHERE to reduce input early and avoid exposing unauthorized aggregate counts."
  ],
  "relatedLessonIds": [
    "12.01.04"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/queries-table-expressions.html"
},
{
  "id": "postgresql-order-by",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "ORDER BY"
  ],
  "heading": "PostgreSQL: ORDER BY",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Sorts query results according to one or more expressions.",
  "syntax": "ORDER BY created_at DESC, id DESC",
  "lang": "sql",
  "parameters": "Expressions, ASC/DESC, optional NULLS FIRST/LAST.",
  "returns": "Ordered result set; ties need additional keys for deterministic ordering.",
  "minimalExample": "SELECT id FROM tasks ORDER BY id DESC;",
  "productionExample": "SELECT id, created_at FROM tasks WHERE workspace_id = $1 ORDER BY created_at DESC NULLS LAST, id DESC LIMIT 50;",
  "commonMistakes": [
    "Paginating on a nonunique sort column without a tie-breaker."
  ],
  "securityPerformanceNotes": [
    "Design indexes to match frequently used filters and order; allowlist user-selected sort columns."
  ],
  "relatedLessonIds": [
    "12.01.02"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/queries-order.html"
},
{
  "id": "postgresql-limit",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "LIMIT"
  ],
  "heading": "PostgreSQL: LIMIT",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Caps how many rows a query returns.",
  "syntax": "LIMIT 50",
  "lang": "sql",
  "parameters": "Nonnegative count or bound parameter.",
  "returns": "At most the requested count.",
  "minimalExample": "SELECT id FROM tasks ORDER BY id LIMIT 10;",
  "productionExample": "SELECT id, title FROM tasks WHERE workspace_id = $1 AND id > $2 ORDER BY id LIMIT $3;",
  "commonMistakes": [
    "Applying LIMIT without stable ordering."
  ],
  "securityPerformanceNotes": [
    "Validate and cap page size; use keyset paging when appropriate."
  ],
  "relatedLessonIds": [
    "12.04.04"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/queries-limit.html"
},
{
  "id": "postgresql-with",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "WITH"
  ],
  "heading": "PostgreSQL: WITH",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Defines named query expressions (CTEs) for a statement.",
  "syntax": "WITH recent AS (SELECT ...) SELECT * FROM recent;",
  "lang": "sql",
  "parameters": "Named query and optional column names, materialization or recursion options.",
  "returns": "Rows produced by the outer statement.",
  "minimalExample": "WITH counts AS (SELECT count(*) AS n FROM tasks) SELECT n FROM counts;",
  "productionExample": "WITH scoped AS (SELECT status FROM tasks WHERE workspace_id = $1) SELECT status, count(*) FROM scoped GROUP BY status;",
  "commonMistakes": [
    "Assuming every CTE is always materialized."
  ],
  "securityPerformanceNotes": [
    "Inspect plans; scope sensitive rows at their source, not only in the final projection."
  ],
  "relatedLessonIds": [
    "12.01.07"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/queries-with.html"
},
{
  "id": "postgresql-begin",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "BEGIN"
  ],
  "heading": "PostgreSQL: BEGIN",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Starts an explicit transaction block on the current connection.",
  "syntax": "BEGIN;",
  "lang": "sql",
  "parameters": "Optional isolation and access mode.",
  "returns": "Transaction remains open until commit or rollback.",
  "minimalExample": "BEGIN; SELECT 1; COMMIT;",
  "productionExample": "BEGIN;\nWITH changed AS (\n  UPDATE tasks SET done = true WHERE id = $1 AND workspace_id = $2 AND done = false\n  RETURNING workspace_id, id\n)\nINSERT INTO audit_events (workspace_id, task_id, action)\nSELECT workspace_id, id, 'completed' FROM changed;\nCOMMIT;",
  "commonMistakes": [
    "Executing statements on different pooled connections."
  ],
  "securityPerformanceNotes": [
    "Keep transactions short; roll back on error and verify the affected row before auditing a mutation."
  ],
  "relatedLessonIds": [
    "12.03.07"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/sql-begin.html"
},
{
  "id": "postgresql-commit",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "COMMIT"
  ],
  "heading": "PostgreSQL: COMMIT",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Completes a successful transaction and makes its changes committed.",
  "syntax": "COMMIT;",
  "lang": "sql",
  "parameters": "Optional transaction chaining mode.",
  "returns": "Ends the current successful transaction.",
  "minimalExample": "BEGIN; SELECT 1; COMMIT;",
  "productionExample": "-- After all invariant checks succeed on the same connection:\nCOMMIT;",
  "commonMistakes": [
    "Reporting success before commit or assuming commit cannot fail."
  ],
  "securityPerformanceNotes": [
    "Handle commit errors and ambiguous network outcomes; design idempotent recovery."
  ],
  "relatedLessonIds": [
    "12.03.07"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/sql-commit.html"
},
{
  "id": "postgresql-rollback",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "ROLLBACK"
  ],
  "heading": "PostgreSQL: ROLLBACK",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Discards uncommitted changes in the current transaction.",
  "syntax": "ROLLBACK;",
  "lang": "sql",
  "parameters": "Optional chaining mode; ROLLBACK TO SAVEPOINT is separate.",
  "returns": "Ends the current transaction without committing changes.",
  "minimalExample": "BEGIN; SELECT 1; ROLLBACK;",
  "productionExample": "-- On any failed validation or database statement:\nROLLBACK;\n-- Release the connection after the transaction is closed.",
  "commonMistakes": [
    "Returning a failed transaction to the connection pool without rollback."
  ],
  "securityPerformanceNotes": [
    "Rollback does not undo external emails or HTTP calls; use an outbox where needed."
  ],
  "relatedLessonIds": [
    "12.03.07"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/sql-rollback.html"
},
{
  "id": "postgresql-create-index",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "CREATE INDEX"
  ],
  "heading": "PostgreSQL: CREATE INDEX",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Creates an access structure that can speed queries at a write and storage cost.",
  "syntax": "CREATE INDEX name ON table (column);",
  "lang": "sql",
  "parameters": "Index method, columns/expressions and optional predicate.",
  "returns": "Creates an index; no query result rows.",
  "minimalExample": "CREATE INDEX tasks_status_idx ON tasks (status);",
  "productionExample": "CREATE INDEX CONCURRENTLY tasks_workspace_created_idx ON tasks (workspace_id, created_at DESC, id DESC);",
  "commonMistakes": [
    "Creating indexes indiscriminately or running CONCURRENTLY inside a transaction block."
  ],
  "securityPerformanceNotes": [
    "Check production migration locking and disk budget; compare actual plans before retaining indexes."
  ],
  "relatedLessonIds": [
    "12.04.02"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/sql-createindex.html"
},
{
  "id": "postgresql-foreign-key",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "FOREIGN KEY"
  ],
  "heading": "PostgreSQL: FOREIGN KEY",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Enforces referential integrity between related keys.",
  "syntax": "FOREIGN KEY (project_id) REFERENCES projects(id)",
  "lang": "sql",
  "parameters": "Referencing and referenced columns; optional update/delete actions.",
  "returns": "Constraint rejects invalid references according to its rules.",
  "minimalExample": "ALTER TABLE tasks ADD FOREIGN KEY (project_id) REFERENCES projects(id);",
  "productionExample": "-- Requires a unique key on projects(workspace_id,id).\nALTER TABLE tasks ADD CONSTRAINT task_project_fk FOREIGN KEY (workspace_id, project_id) REFERENCES projects(workspace_id, id);",
  "commonMistakes": [
    "Using independent tenant and project IDs without ensuring they belong together."
  ],
  "securityPerformanceNotes": [
    "Composite keys can prevent cross-tenant relationships; review delete behavior and referencing-column indexes."
  ],
  "relatedLessonIds": [
    "12.01.05"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/ddl-constraints.html"
},
{
  "id": "postgresql-row-level-security",
  "matchCategories": [
    "PostgreSQL"
  ],
  "matchTitles": [
    "row level security"
  ],
  "heading": "PostgreSQL: row level security",
  "category": "PostgreSQL",
  "majorVersion": "PostgreSQL",
  "status": "Authored reference draft",
  "summary": "Applies policy predicates to row visibility and permitted changes.",
  "syntax": "ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;",
  "lang": "sql",
  "parameters": "Policies specify commands, roles, USING and WITH CHECK predicates.",
  "returns": "Row access is filtered or rejected; absent applicable policies default to denial when RLS applies.",
  "minimalExample": "ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;\nCREATE POLICY read_own ON tasks FOR SELECT TO app_user USING (owner_name = current_user);",
  "productionExample": "-- Supabase example; grants are separate.\nALTER TABLE tasks ENABLE ROW LEVEL SECURITY;\nCREATE POLICY read_own ON tasks FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);\nCREATE POLICY update_own ON tasks FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);",
  "commonMistakes": [
    "Testing only as table owner or a BYPASSRLS role."
  ],
  "securityPerformanceNotes": [
    "Test anon, authenticated and cross-tenant cases; table privileges and privileged server roles require separate review."
  ],
  "relatedLessonIds": [
    "14.03.01"
  ],
  "canonicalUrl": "https://www.postgresql.org/docs/current/ddl-rowsecurity.html"
},
{
  "id": "prisma-model",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "model"
  ],
  "heading": "Prisma: model",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Defines a database-backed model and generated client surface.",
  "syntax": "model Task { ... }",
  "lang": "prisma",
  "parameters": "Fields, scalar types, attributes and relations in schema.prisma.",
  "returns": "Generated model types/client methods after generation; schema migration is separate.",
  "minimalExample": "model Task {\n  id Int @id @default(autoincrement())\n  title String\n}",
  "productionExample": "model Task {\n  id String @id @default(uuid())\n  workspaceId String\n  title String\n  @@index([workspaceId, id])\n}",
  "commonMistakes": [
    "Expecting schema edits to update the deployed database automatically."
  ],
  "securityPerformanceNotes": [
    "Review generated migrations and tenant isolation; keep Prisma Client generated from the matching schema."
  ],
  "relatedLessonIds": [
    "13.01.01"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/models"
},
{
  "id": "prisma-relation",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "@relation"
  ],
  "heading": "Prisma: @relation",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Describes relationships and their relation scalar fields.",
  "syntax": "project Project @relation(fields: [projectId], references: [id])",
  "lang": "prisma",
  "parameters": "Related model, relation scalar fields and referenced fields; actions may be configured.",
  "returns": "Relation-aware generated query input/output and database constraints depending on configuration.",
  "minimalExample": "projectId Int\nproject Project @relation(fields: [projectId], references: [id])",
  "productionExample": "workspaceId String\nprojectId String\nproject Project @relation(fields: [workspaceId, projectId], references: [workspaceId, id])\n// Project requires the corresponding composite unique key.",
  "commonMistakes": [
    "Assuming relation loading alone enforces tenant isolation."
  ],
  "securityPerformanceNotes": [
    "Use composite constraints where appropriate and authorize accesses; examine cascade behavior."
  ],
  "relatedLessonIds": [
    "13.01.02"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations"
},
{
  "id": "prisma-findunique",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "findUnique"
  ],
  "heading": "Prisma: findUnique",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Reads one record via a unique selector, optionally projecting fields.",
  "syntax": "prisma.task.findUnique({ where: { id } })",
  "lang": "ts",
  "parameters": "WhereUniqueInput and optional select/include.",
  "returns": "Record or null (findUniqueOrThrow rejects when absent).",
  "minimalExample": "await prisma.task.findUnique({ where: { id: taskId } });",
  "productionExample": "await prisma.task.findUnique({ where: { id: taskId, workspaceId: authorizedWorkspaceId }, select: { id: true, title: true } });",
  "commonMistakes": [
    "Using a unique ID as evidence of access."
  ],
  "securityPerformanceNotes": [
    "Scope to authorized tenant and handle null without leaking existence; use explicit output projection."
  ],
  "relatedLessonIds": [
    "13.02.01"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference"
},
{
  "id": "prisma-create",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "create"
  ],
  "heading": "Prisma: create",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Creates a record with typed data and optional nested writes.",
  "syntax": "prisma.task.create({ data })",
  "lang": "ts",
  "parameters": "Create input and optional selection; model defaults apply.",
  "returns": "Created record with requested projection.",
  "minimalExample": "await prisma.task.create({ data: { title: 'Learn', workspaceId } });",
  "productionExample": "await prisma.task.create({ data: { title: validated.title, workspaceId: authorizedWorkspaceId }, select: { id: true, title: true } });",
  "commonMistakes": [
    "Passing the entire untrusted request body to data."
  ],
  "securityPerformanceNotes": [
    "Validate allowlisted fields and derive ownership from verified context."
  ],
  "relatedLessonIds": [
    "13.02.03"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference"
},
{
  "id": "prisma-update",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "update"
  ],
  "heading": "Prisma: update",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Updates a uniquely identified record with typed operations.",
  "syntax": "prisma.task.update({ where, data })",
  "lang": "ts",
  "parameters": "Unique selector, update input and optional output selection.",
  "returns": "Updated record; rejects when required record is missing.",
  "minimalExample": "await prisma.task.update({ where: { id }, data: { done: true } });",
  "productionExample": "await prisma.task.update({ where: { id, workspaceId: authorizedWorkspaceId, version: expectedVersion }, data: { title: validated.title, version: { increment: 1 } }, select: { id: true, version: true } });",
  "commonMistakes": [
    "Performing a stale read followed by an unguarded update."
  ],
  "securityPerformanceNotes": [
    "Use atomic predicates/version checks and translate expected missing/conflict errors."
  ],
  "relatedLessonIds": [
    "13.02.03"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference"
},
{
  "id": "prisma-delete",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "delete"
  ],
  "heading": "Prisma: delete",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Deletes one record selected by a unique filter.",
  "syntax": "prisma.task.delete({ where })",
  "lang": "ts",
  "parameters": "Unique selector and optional output projection.",
  "returns": "Deleted record; rejects if the required record does not exist.",
  "minimalExample": "await prisma.task.delete({ where: { id } });",
  "productionExample": "await prisma.task.delete({ where: { id, workspaceId: authorizedWorkspaceId }, select: { id: true } });",
  "commonMistakes": [
    "Assuming deletion is automatically soft-delete or safe with cascade constraints."
  ],
  "securityPerformanceNotes": [
    "Check authorization and retention policy; treat retry behavior explicitly."
  ],
  "relatedLessonIds": [
    "13.02.03"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference"
},
{
  "id": "prisma-upsert",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "upsert"
  ],
  "heading": "Prisma: upsert",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Creates or updates based on a unique selector.",
  "syntax": "prisma.task.upsert({ where, create, update })",
  "lang": "ts",
  "parameters": "Unique selector plus create/update data.",
  "returns": "Resulting record with requested projection.",
  "minimalExample": "await prisma.setting.upsert({ where: { userId }, create: { userId, theme: 'dark' }, update: { theme: 'dark' } });",
  "productionExample": "await prisma.setting.upsert({ where: { userId: verifiedUserId }, create: { userId: verifiedUserId, theme: validated.theme }, update: { theme: validated.theme }, select: { theme: true } });",
  "commonMistakes": [
    "Assuming every upsert is delegated to a single database statement."
  ],
  "securityPerformanceNotes": [
    "Back uniqueness with a database constraint; handle race errors and scope to verified identity."
  ],
  "relatedLessonIds": [
    "13.02.03"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference"
},
{
  "id": "prisma-include",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "include"
  ],
  "heading": "Prisma: include",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Loads related records as part of a query result.",
  "syntax": "prisma.project.findMany({ include: { tasks: true } })",
  "lang": "ts",
  "parameters": "Relation keys and optional nested query options.",
  "returns": "Parent records augmented by selected relation data.",
  "minimalExample": "await prisma.project.findMany({ include: { tasks: true } });",
  "productionExample": "await prisma.project.findMany({ where: { workspaceId: authorizedWorkspaceId }, take: 20, include: { tasks: { where: { archived: false }, take: 10, orderBy: { id: 'asc' }, select: { id: true, title: true } } } });",
  "commonMistakes": [
    "Returning unbounded related collections or assuming include filters the parent."
  ],
  "securityPerformanceNotes": [
    "Bound both levels, inspect generated queries, and ensure relation-level visibility."
  ],
  "relatedLessonIds": [
    "13.02.02"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference"
},
{
  "id": "prisma-cursor",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "cursor"
  ],
  "heading": "Prisma: cursor",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Resumes a query from a uniquely identifiable record.",
  "syntax": "findMany({ cursor: { id }, skip: 1, take: 20, orderBy: { id: 'asc' } })",
  "lang": "ts",
  "parameters": "Unique cursor, take, optional skip and consistent ordering.",
  "returns": "Page of records; skip:1 excludes the cursor itself.",
  "minimalExample": "await prisma.task.findMany({ cursor: { id: lastId }, skip: 1, take: 20, orderBy: { id: 'asc' } });",
  "productionExample": "await prisma.task.findMany({ where: { workspaceId: authorizedWorkspaceId }, ...(verifiedCursor ? { cursor: { id: verifiedCursor }, skip: 1 } : {}), orderBy: { id: 'asc' }, take: pageSize });",
  "commonMistakes": [
    "Using a cursor from another tenant or changing sort between requests."
  ],
  "securityPerformanceNotes": [
    "Validate cursor scope and page size; use stable unique order and suitable indexes."
  ],
  "relatedLessonIds": [
    "13.02.05"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/prisma-client/queries/pagination"
},
{
  "id": "prisma-driver-adapter",
  "matchCategories": [
    "Prisma"
  ],
  "matchTitles": [
    "driver adapter"
  ],
  "heading": "Prisma: driver adapter",
  "category": "Prisma",
  "majorVersion": "Prisma ORM 7",
  "status": "Authored reference draft",
  "summary": "Connects Prisma ORM 7 Client to a supported database driver.",
  "syntax": "new PrismaClient({ adapter })",
  "lang": "ts",
  "parameters": "Generated client and adapter configured for the selected database.",
  "returns": "Client instance using the adapter's underlying connection behavior.",
  "minimalExample": "const adapter = new PrismaPg({ connectionString });\nconst prisma = new PrismaClient({ adapter });",
  "productionExample": "import { PrismaPg } from '@prisma/adapter-pg';\nimport { PrismaClient } from './generated/prisma/client';\nconst connectionString = process.env.DATABASE_URL;\nif (!connectionString) throw new Error('DATABASE_URL required');\nexport const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });",
  "commonMistakes": [
    "Creating a new client per request or importing server credentials into browser code."
  ],
  "securityPerformanceNotes": [
    "Reuse appropriately per process, bound pool connections and keep the generated path aligned with schema output."
  ],
  "relatedLessonIds": [
    "13.01.04"
  ],
  "canonicalUrl": "https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/database-drivers"
},
{
  "id": "supabase-signinwithpassword",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "signInWithPassword"
  ],
  "heading": "Supabase: signInWithPassword",
  "category": "Supabase",
  "majorVersion": "Supabase JS v2",
  "status": "Authored reference draft",
  "summary": "Authenticates a user using an email/password or phone/password credential.",
  "syntax": "supabase.auth.signInWithPassword({ email, password })",
  "lang": "ts",
  "parameters": "Credential pair for a supported sign-in method.",
  "returns": "Promise resolving to data and error; successful data includes user/session.",
  "minimalExample": "const { data, error } = await supabase.auth.signInWithPassword({ email, password });",
  "productionExample": "const { error } = await supabase.auth.signInWithPassword({ email: validated.email, password: validated.password });\nif (error) return { ok: false, message: 'Sign-in failed' };\nreturn { ok: true };",
  "commonMistakes": [
    "Logging credentials or giving account-enumeration clues through detailed errors."
  ],
  "securityPerformanceNotes": [
    "Use HTTPS, rate limiting and safe redirects; sign-in does not replace RLS or object-level access."
  ],
  "relatedLessonIds": [
    "14.02.01"
  ],
  "canonicalUrl": "https://supabase.com/docs/reference/javascript/auth-signinwithpassword"
},
{
  "id": "supabase-getuser",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "getUser"
  ],
  "heading": "Supabase: getUser",
  "category": "Supabase",
  "majorVersion": "Supabase JS v2",
  "status": "Authored reference draft",
  "summary": "Requests the authenticated user from the Auth server rather than merely trusting cached session data.",
  "syntax": "supabase.auth.getUser()",
  "lang": "ts",
  "parameters": "Optional access token; otherwise uses the client's session.",
  "returns": "Promise of user data or auth error.",
  "minimalExample": "const { data: { user }, error } = await supabase.auth.getUser();",
  "productionExample": "const { data: { user }, error } = await supabase.auth.getUser();\nif (error || !user) return new Response('Unauthorized', { status: 401 });\nreturn Response.json(await listAllowedTasks(user.id));",
  "commonMistakes": [
    "Using editable user_metadata for permissions."
  ],
  "securityPerformanceNotes": [
    "Enforce database and resource permissions separately; do not cache private responses across users."
  ],
  "relatedLessonIds": [
    "14.02.06"
  ],
  "canonicalUrl": "https://supabase.com/docs/reference/javascript/auth-getuser"
},
{
  "id": "supabase-signout",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "signOut"
  ],
  "heading": "Supabase: signOut",
  "category": "Supabase",
  "majorVersion": "Supabase JS v2",
  "status": "Authored reference draft",
  "summary": "Signs out according to the selected session scope.",
  "syntax": "supabase.auth.signOut({ scope: 'local' })",
  "lang": "ts",
  "parameters": "Scope local, global (default), or others.",
  "returns": "Promise containing error or successful sign-out result.",
  "minimalExample": "const { error } = await supabase.auth.signOut();",
  "productionExample": "const { error } = await supabase.auth.signOut({ scope: 'local' });\nif (error) return showError('Sign-out failed');\nclearPrivateClientCache();\nwindow.location.assign('/login');",
  "commonMistakes": [
    "Assuming an issued access token becomes invalid immediately in every service."
  ],
  "securityPerformanceNotes": [
    "Keep sensitive token lifetimes short and verify strict session revocation requirements separately."
  ],
  "relatedLessonIds": [
    "14.02.07"
  ],
  "canonicalUrl": "https://supabase.com/docs/reference/javascript/auth-signout"
},
{
  "id": "supabase-createsignedurl",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "createSignedUrl"
  ],
  "heading": "Supabase: createSignedUrl",
  "category": "Supabase",
  "majorVersion": "Supabase JS v2",
  "status": "Authored reference draft",
  "summary": "Creates time-limited access to a private storage object.",
  "syntax": "supabase.storage.from(bucket).createSignedUrl(path, expiresIn)",
  "lang": "ts",
  "parameters": "Object path, expiry in seconds and optional options.",
  "returns": "Promise of signed URL data or error.",
  "minimalExample": "const { data, error } = await supabase.storage.from('documents').createSignedUrl(path, 60);",
  "productionExample": "const path = await authorizedDocumentPath(currentUserId, documentId);\nconst { data, error } = await supabase.storage.from('documents').createSignedUrl(path, 120);\nif (error || !data) throw new Error('Download unavailable');\nreturn data.signedUrl;",
  "commonMistakes": [
    "Signing arbitrary user-supplied paths or using long expiry by default."
  ],
  "securityPerformanceNotes": [
    "Treat signed URLs as bearer capabilities; do not log or share them indiscriminately; enforce storage policy."
  ],
  "relatedLessonIds": [
    "14.03.05"
  ],
  "canonicalUrl": "https://supabase.com/docs/reference/javascript/file-buckets-createsignedurl"
},
{
  "id": "supabase-storage-bucket",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "Storage bucket"
  ],
  "heading": "Supabase: Storage bucket",
  "category": "Supabase",
  "majorVersion": "Supabase JS v2",
  "status": "Authored reference draft",
  "summary": "Groups storage objects under a bucket with public/private access configuration.",
  "syntax": "supabase.storage.from('documents')",
  "lang": "ts",
  "parameters": "Bucket identifier; operations use object paths.",
  "returns": "Bucket-scoped Storage API client.",
  "minimalExample": "const bucket = supabase.storage.from('documents');",
  "productionExample": "const { data, error } = await supabase.storage.from('documents').download(authorizedPath);\nif (error || !data) throw new Error('Document unavailable');\nreturn data;",
  "commonMistakes": [
    "Assuming bucket names or folder prefixes alone authorize access."
  ],
  "securityPerformanceNotes": [
    "Use private buckets for confidential data, policy checks on storage.objects, server validation of uploads and no privileged keys in the browser."
  ],
  "relatedLessonIds": [
    "14.04.01"
  ],
  "canonicalUrl": "https://supabase.com/docs/guides/storage/buckets/fundamentals"
},
{
  "id": "supabase-onauthstatechange",
  "matchCategories": [
    "Supabase"
  ],
  "matchTitles": [
    "onAuthStateChange"
  ],
  "heading": "Supabase: onAuthStateChange",
  "category": "Supabase",
  "majorVersion": "Supabase JS v2",
  "status": "Authored reference draft",
  "summary": "Subscribes to client authentication events and receives session changes.",
  "syntax": "supabase.auth.onAuthStateChange(callback)",
  "lang": "ts",
  "parameters": "Synchronous event callback with event name and session.",
  "returns": "Subscription that can be unsubscribed.",
  "minimalExample": "const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => updateUi(event, session));",
  "productionExample": "useEffect(() => {\n  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {\n    setSignedIn(Boolean(session));\n    if (event === 'SIGNED_OUT') clearPrivateClientCache();\n  });\n  return () => subscription.unsubscribe();\n}, [supabase]);",
  "commonMistakes": [
    "Leaking subscriptions or awaiting other Supabase Auth operations inside the callback."
  ],
  "securityPerformanceNotes": [
    "Treat events as UI synchronization, not server-side proof of identity or authorization."
  ],
  "relatedLessonIds": [
    "14.02.07"
  ],
  "canonicalUrl": "https://supabase.com/docs/reference/javascript/auth-onauthstatechange"
},
{
  "id": "redis-del",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "DEL"
  ],
  "heading": "Redis & BullMQ: DEL",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Removes one or more keys and their associated values.",
  "syntax": "DEL key [key ...]",
  "lang": "text",
  "parameters": "One or more keys.",
  "returns": "Integer number of keys removed.",
  "minimalExample": "DEL cache:task:1",
  "productionExample": "DEL cache:tenant:42:task:1 cache:tenant:42:task-list",
  "commonMistakes": [
    "Deleting unscoped keys or using KEYS to discover large invalidation sets."
  ],
  "securityPerformanceNotes": [
    "Derive tenant-scoped keys from verified context; large values may benefit from UNLINK."
  ],
  "relatedLessonIds": [
    "16.01.04"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/del/"
},
{
  "id": "redis-expire",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "EXPIRE"
  ],
  "heading": "Redis & BullMQ: EXPIRE",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Sets a relative lifetime in seconds on an existing key.",
  "syntax": "EXPIRE key seconds",
  "lang": "text",
  "parameters": "Key, seconds and optional conditional expiration mode.",
  "returns": "1 if timeout was set, 0 otherwise.",
  "minimalExample": "EXPIRE cache:task:1 60",
  "productionExample": "EXPIRE cache:tenant:42:task:1 120 NX",
  "commonMistakes": [
    "Assuming separate SET and EXPIRE always succeed atomically."
  ],
  "securityPerformanceNotes": [
    "For new cache values use SET with expiration; account for missing keys and stale entries."
  ],
  "relatedLessonIds": [
    "16.01.02"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/expire/"
},
{
  "id": "redis-ttl",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "TTL"
  ],
  "heading": "Redis & BullMQ: TTL",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Reports a key's remaining lifetime in seconds.",
  "syntax": "TTL key",
  "lang": "text",
  "parameters": "Key name.",
  "returns": "Seconds remaining, -1 for no expiration, -2 for absent key.",
  "minimalExample": "TTL cache:task:1",
  "productionExample": "TTL cache:tenant:42:task-list\n# Alert on -1 for cache keys that should expire.",
  "commonMistakes": [
    "Treating -1 and -2 as equivalent."
  ],
  "securityPerformanceNotes": [
    "Track unexpectedly persistent cache keys without logging private payloads."
  ],
  "relatedLessonIds": [
    "16.01.02"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/ttl/"
},
{
  "id": "redis-incr",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "INCR"
  ],
  "heading": "Redis & BullMQ: INCR",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Atomically increments an integer string, initializing a missing key at zero.",
  "syntax": "INCR key",
  "lang": "text",
  "parameters": "Key holding an integer-compatible value.",
  "returns": "Incremented integer.",
  "minimalExample": "INCR metric:requests",
  "productionExample": "INCR rate:tenant:42:minute:202611260400\n# Use an atomic script or transaction for counter + expiration in a fixed-window limiter.",
  "commonMistakes": [
    "Assuming INCR alone provides a complete rate limiter."
  ],
  "securityPerformanceNotes": [
    "Attach expiration atomically, choose scoped keys, and handle counter/storage failures explicitly."
  ],
  "relatedLessonIds": [
    "16.02.06"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/incr/"
},
{
  "id": "redis-mget",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "MGET"
  ],
  "heading": "Redis & BullMQ: MGET",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Reads multiple string keys in argument order.",
  "syntax": "MGET key [key ...]",
  "lang": "text",
  "parameters": "One or more keys.",
  "returns": "Array of values or nil for missing/non-string keys.",
  "minimalExample": "MGET cache:a cache:b",
  "productionExample": "MGET cache:{tenant42}:task:1 cache:{tenant42}:task:2",
  "commonMistakes": [
    "Losing positional correspondence when a key is missing."
  ],
  "securityPerformanceNotes": [
    "Bound batch sizes; in Redis Cluster multi-key operations may require the same hash slot."
  ],
  "relatedLessonIds": [
    "16.01.02"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/mget/"
},
{
  "id": "redis-hset",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "HSET"
  ],
  "heading": "Redis & BullMQ: HSET",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Creates or updates fields in a hash.",
  "syntax": "HSET key field value [field value ...]",
  "lang": "text",
  "parameters": "Hash key and one or more field-value pairs.",
  "returns": "Number of newly added fields, not number of changed values.",
  "minimalExample": "HSET task:1 title Learn done 0",
  "productionExample": "HSET cache:tenant:42:task:1 title Learn status open\nEXPIRE cache:tenant:42:task:1 60",
  "commonMistakes": [
    "Interpreting a zero result as failure when existing fields were updated."
  ],
  "securityPerformanceNotes": [
    "Apply key TTL deliberately; use atomic operations if hash and TTL must change together."
  ],
  "relatedLessonIds": [
    "16.01.02"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/hset/"
},
{
  "id": "redis-hget",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "HGET"
  ],
  "heading": "Redis & BullMQ: HGET",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Reads one field from a hash.",
  "syntax": "HGET key field",
  "lang": "text",
  "parameters": "Hash key and field name.",
  "returns": "String value or nil when absent.",
  "minimalExample": "HGET task:1 title",
  "productionExample": "HGET cache:tenant:42:task:1 status\n# If nil, load authorized data from its source.",
  "commonMistakes": [
    "Treating missing values as an empty string."
  ],
  "securityPerformanceNotes": [
    "Cache reads never replace tenant authorization; design explicit cache miss behavior."
  ],
  "relatedLessonIds": [
    "16.01.02"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/hget/"
},
{
  "id": "redis-sadd",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "SADD"
  ],
  "heading": "Redis & BullMQ: SADD",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Adds unique members to a Redis set.",
  "syntax": "SADD key member [member ...]",
  "lang": "text",
  "parameters": "Set key and member strings.",
  "returns": "Number of new members added.",
  "minimalExample": "SADD tags css js css",
  "productionExample": "SADD cache:tenant:42:project:1:task-ids 101 102",
  "commonMistakes": [
    "Assuming set member iteration has stable ordering."
  ],
  "securityPerformanceNotes": [
    "Bound collection size; sets do not provide per-member TTL or durable business uniqueness."
  ],
  "relatedLessonIds": [
    "16.01.02"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/sadd/"
},
{
  "id": "redis-zadd",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "ZADD"
  ],
  "heading": "Redis & BullMQ: ZADD",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Adds or updates members of a sorted set using numeric scores.",
  "syntax": "ZADD key score member",
  "lang": "text",
  "parameters": "Score/member pairs and optional modifiers.",
  "returns": "Number of new members by default; options can alter count semantics.",
  "minimalExample": "ZADD ranking 10 alice 20 bob",
  "productionExample": "ZADD cache:tenant:42:recent-tasks 1730000000 task-101\nZRANGE cache:tenant:42:recent-tasks 0 9 REV",
  "commonMistakes": [
    "Using timestamps as unique scores without handling ties."
  ],
  "securityPerformanceNotes": [
    "Keep retention bounded, and avoid using sorted-set ranking as an authorization mechanism."
  ],
  "relatedLessonIds": [
    "16.01.02"
  ],
  "canonicalUrl": "https://redis.io/docs/latest/commands/zadd/"
},
{
  "id": "redis-bullmq-queue",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "BullMQ Queue"
  ],
  "heading": "Redis & BullMQ: BullMQ Queue",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "BullMQ Queue submits jobs into a Redis-backed queue.",
  "syntax": "queue.add(name, data, options)",
  "lang": "ts",
  "parameters": "Queue name, connection, job name, serializable data and job options.",
  "returns": "Promise<Job> for the added job.",
  "minimalExample": "const queue = new Queue('emails', { connection });\nawait queue.add('send', { messageId });",
  "productionExample": "const queue = new Queue('emails', { connection });\ntry { await queue.add('send', { messageId: verifiedMessageId }, { jobId: verifiedMessageId, attempts: 3, backoff: { type: 'exponential', delay: 1000 } }); } finally { await queue.close(); }",
  "commonMistakes": [
    "Treating job insertion as proof the external effect completed."
  ],
  "securityPerformanceNotes": [
    "Use durable idempotency, small payloads, bounded retries and appropriate queue retention."
  ],
  "relatedLessonIds": [
    "16.03.02"
  ],
  "canonicalUrl": "https://docs.bullmq.io/guide/queues"
},
{
  "id": "redis-worker",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "Worker"
  ],
  "heading": "Redis & BullMQ: Worker",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "BullMQ Worker processes jobs from a queue and reports completion or failure.",
  "syntax": "new Worker(queueName, processor, options)",
  "lang": "ts",
  "parameters": "Queue name, async processor, connection and concurrency options.",
  "returns": "Worker instance; processor result is stored when the job completes.",
  "minimalExample": "const worker = new Worker('emails', job => send(job.data.messageId), { connection });",
  "productionExample": "const worker = new Worker('emails', async job => {\n  await sendIdempotently(job.data.messageId);\n}, { connection, concurrency: 4 });\nworker.on('error', err => logger.error({ name: err.name }, 'worker error'));\n// Await worker.close() during graceful shutdown.",
  "commonMistakes": [
    "Assuming each processor runs exactly once."
  ],
  "securityPerformanceNotes": [
    "Persist effect idempotency; bound concurrency and use a dedicated non-evicting queue Redis configuration."
  ],
  "relatedLessonIds": [
    "16.03.03"
  ],
  "canonicalUrl": "https://docs.bullmq.io/guide/workers"
},
{
  "id": "redis-backoff",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "backoff"
  ],
  "heading": "Redis & BullMQ: backoff",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Delays retry attempts for failed BullMQ jobs.",
  "syntax": "{ attempts: 3, backoff: { type: 'exponential', delay: 1000 } }",
  "lang": "ts",
  "parameters": "Total attempts and fixed/exponential/custom backoff configuration.",
  "returns": "Job options scheduling subsequent attempts after failure.",
  "minimalExample": "await queue.add('sync', data, { attempts: 3, backoff: { type: 'fixed', delay: 1000 } });",
  "productionExample": "await queue.add('deliver', { deliveryId }, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });\n// Processor classifies permanent failures separately and deduplicates effects.",
  "commonMistakes": [
    "Retrying permanent validation failures or assuming retry guarantees delivery."
  ],
  "securityPerformanceNotes": [
    "Use bounded retry budgets, monitoring and idempotent effects."
  ],
  "relatedLessonIds": [
    "16.03.04"
  ],
  "canonicalUrl": "https://docs.bullmq.io/guide/retrying-failing-jobs"
},
{
  "id": "redis-deduplication",
  "matchCategories": [
    "Redis & BullMQ"
  ],
  "matchTitles": [
    "deduplication"
  ],
  "heading": "Redis & BullMQ: deduplication",
  "category": "Redis & BullMQ",
  "majorVersion": "Redis / BullMQ",
  "status": "Authored reference draft",
  "summary": "Suppresses duplicate BullMQ submissions while a configured deduplication identity is active.",
  "syntax": "queue.add(name, data, { deduplication: { id } })",
  "lang": "ts",
  "parameters": "Job name, data and deduplication ID; mode may include TTL or other options.",
  "returns": "Job submission result; duplicate requests may be ignored per mode.",
  "minimalExample": "await queue.add('sync', { accountId }, { deduplication: { id: accountId } });",
  "productionExample": "await queue.add('refresh', { resourceId: authorizedId }, { deduplication: { id: 'refresh-' + authorizedId } });\n// Worker still uses durable idempotency for side effects.",
  "commonMistakes": [
    "Confusing temporary queue deduplication with exactly-once processing."
  ],
  "securityPerformanceNotes": [
    "Scope IDs by tenant and operation; keep durable business invariants outside Redis job metadata."
  ],
  "relatedLessonIds": [
    "16.03.06"
  ],
  "canonicalUrl": "https://docs.bullmq.io/guide/jobs/deduplication"
},
{
  "id": "testing-vitest-describe",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "Vitest describe"
  ],
  "heading": "Testing & Operations: Vitest describe",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "Groups related Vitest tests with nested setup and descriptive names.",
  "syntax": "describe('feature', () => { ... })",
  "lang": "ts",
  "parameters": "Suite name and suite-definition callback.",
  "returns": "Registers a test suite; does not itself assert behavior.",
  "minimalExample": "describe('math', () => { test('adds', () => expect(1 + 1).toBe(2)); });",
  "productionExample": "describe('task access', () => {\n  test('denies another tenant', async () => { await expect(service.read('other-tenant', taskId)).rejects.toThrow(); });\n  test('allows owner', async () => { expect(await service.read(ownerId, taskId)).toMatchObject({ id: taskId }); });\n});",
  "commonMistakes": [
    "Using suite hooks to create shared mutable fixtures across tests."
  ],
  "securityPerformanceNotes": [
    "Exercise denial and positive paths; keep fixtures isolated."
  ],
  "relatedLessonIds": [
    "19.02.01"
  ],
  "canonicalUrl": "https://vitest.dev/api/#describe"
},
{
  "id": "testing-expect",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "expect"
  ],
  "heading": "Testing & Operations: expect",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "Makes assertions about observed values and asynchronous outcomes.",
  "syntax": "expect(actual).toBe(expected)",
  "lang": "ts",
  "parameters": "Actual value and matcher; use resolves/rejects for promises.",
  "returns": "Assertion succeeds or throws a test failure.",
  "minimalExample": "expect(total).toBe(2);",
  "productionExample": "await expect(createTask(invalidInput)).rejects.toThrow();\nexpect(await repo.count()).toBe(beforeCount);",
  "commonMistakes": [
    "Asserting only that a function was called instead of checking outcomes."
  ],
  "securityPerformanceNotes": [
    "Test meaningful invariants and failure side effects; await asynchronous assertions."
  ],
  "relatedLessonIds": [
    "19.02.01"
  ],
  "canonicalUrl": "https://vitest.dev/api/expect.html"
},
{
  "id": "testing-vi-mock",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "vi.mock"
  ],
  "heading": "Testing & Operations: vi.mock",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "Replaces a module with a test double in Vitest.",
  "syntax": "vi.mock('./client', factory)",
  "lang": "ts",
  "parameters": "Module specifier and optional factory; mock declaration is hoisted.",
  "returns": "Registers mocked module behavior.",
  "minimalExample": "vi.mock('./client', () => ({ load: vi.fn() }));",
  "productionExample": "vi.mock('./mailer', () => ({ send: vi.fn().mockResolvedValue({ id: 'test' }) }));\n// Assert domain behavior with the fake; run a separate real adapter integration test.",
  "commonMistakes": [
    "Capturing variables not initialized at hoisted mock time."
  ],
  "securityPerformanceNotes": [
    "Mock external boundaries, not every implementation detail; reset state between cases."
  ],
  "relatedLessonIds": [
    "19.01.05"
  ],
  "canonicalUrl": "https://vitest.dev/api/vi.html#vi-mock"
},
{
  "id": "testing-beforeeach",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "beforeEach"
  ],
  "heading": "Testing & Operations: beforeEach",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "Runs setup before each test in its suite.",
  "syntax": "beforeEach(async () => { ... })",
  "lang": "ts",
  "parameters": "Setup callback and optional timeout/configuration.",
  "returns": "Registers per-test setup, awaiting supported async work.",
  "minimalExample": "beforeEach(() => { items = []; });",
  "productionExample": "beforeEach(async () => { repo = await makeIsolatedTestRepository(); });\nafterEach(async () => { await repo.dispose(); });",
  "commonMistakes": [
    "Reusing mutable fixtures across concurrent tests."
  ],
  "securityPerformanceNotes": [
    "Prefer independent fixtures and clean resources even after failures."
  ],
  "relatedLessonIds": [
    "19.01.03"
  ],
  "canonicalUrl": "https://vitest.dev/api/#beforeeach"
},
{
  "id": "testing-playwright-test",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "Playwright test"
  ],
  "heading": "Testing & Operations: Playwright test",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "Defines a browser test with Playwright fixtures and assertions.",
  "syntax": "test('name', async ({ page }) => { ... })",
  "lang": "ts",
  "parameters": "Name and callback with isolated fixtures such as page.",
  "returns": "Registers a test; async callback completes or fails.",
  "minimalExample": "test('home', async ({ page }) => { await page.goto('/'); await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible(); });",
  "productionExample": "test('keyboard submission', async ({ page }) => {\n  await page.goto('/tasks/new');\n  await page.getByRole('textbox', { name: 'Title' }).fill('Read docs');\n  await page.getByRole('button', { name: 'Save' }).press('Enter');\n  await expect(page.getByText('Task created')).toBeVisible();\n});",
  "commonMistakes": [
    "Using fixed sleeps or testing a page without verifying a user-observable result."
  ],
  "securityPerformanceNotes": [
    "Use isolated test accounts and origins, semantic locators and deterministic fixtures."
  ],
  "relatedLessonIds": [
    "19.02.07"
  ],
  "canonicalUrl": "https://playwright.dev/docs/writing-tests"
},
{
  "id": "testing-docker-compose",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "docker compose"
  ],
  "heading": "Testing & Operations: docker compose",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "Declares and runs multi-container services for a reproducible environment.",
  "syntax": "docker compose up -d",
  "lang": "yaml",
  "parameters": "Compose file, services, networks, volumes and environment configuration.",
  "returns": "Starts declared services; exit status reflects CLI operation, not necessarily app readiness.",
  "minimalExample": "services:\n  redis:\n    image: redis:7-alpine",
  "productionExample": "services:\n  redis:\n    image: redis:7-alpine\n    healthcheck:\n      test: [CMD, redis-cli, ping]\n      interval: 5s\n      timeout: 2s\n      retries: 5\n    volumes: [redis_data:/data]\nvolumes:\n  redis_data: {}",
  "commonMistakes": [
    "Assuming container start means service readiness or publishing database ports unnecessarily."
  ],
  "securityPerformanceNotes": [
    "Use isolated networks, pinned image digests for releases and safe volume/secret management."
  ],
  "relatedLessonIds": [
    "20.01.03"
  ],
  "canonicalUrl": "https://docs.docker.com/compose/"
},
{
  "id": "testing-pino-logger",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "Pino logger"
  ],
  "heading": "Testing & Operations: Pino logger",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "Produces structured JSON application logs with configurable levels and redaction.",
  "syntax": "const logger = pino(options)",
  "lang": "ts",
  "parameters": "Logger options, level, serializers and redaction paths.",
  "returns": "Logger with level methods and child loggers.",
  "minimalExample": "const logger = pino();\nlogger.info({ taskId }, 'Task loaded');",
  "productionExample": "const logger = pino({ redact: ['req.headers.authorization', 'req.headers.cookie', 'password'] });\nlogger.child({ requestId }).info({ operation: 'task.create' }, 'Task created');",
  "commonMistakes": [
    "Assuming redaction covers arbitrary nested objects or secrets interpolated into messages."
  ],
  "securityPerformanceNotes": [
    "Use allowlisted structured fields, bounded retention and no raw credential logging."
  ],
  "relatedLessonIds": [
    "21.01.01"
  ],
  "canonicalUrl": "https://getpino.io/#/docs/api"
},
{
  "id": "testing-slo",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "SLO"
  ],
  "heading": "Testing & Operations: SLO",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "A measurable service reliability target over an explicitly defined window.",
  "syntax": "SLO = target for a specified SLI and time window",
  "lang": "text",
  "parameters": "SLI definition, population, target and evaluation window.",
  "returns": "A target and corresponding error budget, not a monitoring signal by itself.",
  "minimalExample": "99.9% successful eligible requests over 30 days.",
  "productionExample": "Example: 99.9% of eligible API requests succeed over rolling 30 days; define exclusions and track 0.1% error budget consumption.",
  "commonMistakes": [
    "Choosing arbitrary targets without measuring user impact or defining eligible requests."
  ],
  "securityPerformanceNotes": [
    "Use burn-rate alerting and align targets with product expectations and cost."
  ],
  "relatedLessonIds": [
    "21.02.01"
  ],
  "canonicalUrl": "https://sre.google/workbook/implementing-slos/"
},
{
  "id": "testing-sli",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "SLI"
  ],
  "heading": "Testing & Operations: SLI",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "Measures a service behavior relevant to users, often as good events divided by eligible events.",
  "syntax": "availability SLI = good requests / eligible requests",
  "lang": "text",
  "parameters": "Good-event criteria, population and time window.",
  "returns": "Ratio or other explicitly defined reliability measurement.",
  "minimalExample": "990 successful requests / 1000 eligible requests = 99%.",
  "productionExample": "Define good requests as eligible API responses without server errors; record numerator and denominator over a rolling window and alert on budget burn.",
  "commonMistakes": [
    "Using average latency to hide slow tail requests or silently excluding failures."
  ],
  "securityPerformanceNotes": [
    "Define missing-data behavior and avoid high-cardinality personal identifiers in metrics."
  ],
  "relatedLessonIds": [
    "21.02.01"
  ],
  "canonicalUrl": "https://sre.google/workbook/implementing-slos/"
},
{
  "id": "testing-runbook",
  "matchCategories": [
    "Testing & Operations"
  ],
  "matchTitles": [
    "runbook"
  ],
  "heading": "Testing & Operations: runbook",
  "category": "Testing & Operations",
  "majorVersion": "Testing and operations",
  "status": "Authored reference draft",
  "summary": "Documents actionable operational response steps for a defined failure mode.",
  "syntax": "Trigger → diagnose → mitigate → verify → escalate",
  "lang": "text",
  "parameters": "Symptoms, ownership, prerequisites, safe commands, rollback and escalation.",
  "returns": "Repeatable response guidance; not an automatic recovery guarantee.",
  "minimalExample": "If the API is unhealthy, check readiness and recent deploys.",
  "productionExample": "Trigger: sustained error-budget burn.\n1. Confirm impact and assign incident lead.\n2. Compare errors by release and dependency.\n3. Use approved rollback if release-correlated.\n4. Verify SLI recovery; communicate and record evidence.",
  "commonMistakes": [
    "Writing only a list of commands without decision criteria or verification."
  ],
  "securityPerformanceNotes": [
    "Use least-privilege access; rehearse recovery, keep secrets out of the runbook and review after incidents."
  ],
  "relatedLessonIds": [
    "21.03.02"
  ],
  "canonicalUrl": "https://sre.google/workbook/incident-response/"
},
{
  "id": "web-html-document",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "HTML document"
  ],
  "heading": "Web & HTML: HTML document",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "A standards-mode HTML document establishes language, metadata and body content.",
  "syntax": "<!doctype html><html lang=\"en\">…</html>",
  "lang": "html",
  "parameters": "Doctype, root element, head and body.",
  "returns": "Browser parses a DOM in standards mode.",
  "minimalExample": "<!doctype html><html lang=\"en\"><head><title>Home</title></head><body>Home</body></html>",
  "productionExample": "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Tasks</title></head><body><main><h1>Tasks</h1></main></body></html>",
  "commonMistakes": [
    "Missing doctype or document language."
  ],
  "securityPerformanceNotes": [
    "Use semantic landmarks and meaningful titles; validate markup."
  ],
  "relatedLessonIds": [
    "01.01.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML"
},
{
  "id": "web-html",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "html"
  ],
  "heading": "Web & HTML: html",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "The root element contains document head and body.",
  "syntax": "<html lang=\"en\">…</html>",
  "lang": "html",
  "parameters": "Global attributes including lang and dir.",
  "returns": "Root document element.",
  "minimalExample": "<html lang=\"en\"><head><title>Home</title></head><body></body></html>",
  "productionExample": "<html lang=\"ar\" dir=\"rtl\"><head><title>مثال</title></head><body><main>مثال</main></body></html>",
  "commonMistakes": [
    "Using language metadata only on a visual label."
  ],
  "securityPerformanceNotes": [
    "Declare the actual document language to aid pronunciation and translation."
  ],
  "relatedLessonIds": [
    "01.01.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/html"
},
{
  "id": "web-head",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "head"
  ],
  "heading": "Web & HTML: head",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Contains machine-readable document metadata.",
  "syntax": "<head><title>Page</title></head>",
  "lang": "html",
  "parameters": "Metadata elements, stylesheet links and appropriate scripts.",
  "returns": "Metadata rather than primary visible page content.",
  "minimalExample": "<head><title>Academy</title></head>",
  "productionExample": "<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>HTML reference | Academy</title><link rel=\"stylesheet\" href=\"/styles.css\"></head>",
  "commonMistakes": [
    "Putting primary article content in head."
  ],
  "securityPerformanceNotes": [
    "Minimize blocking resources and give each route a descriptive title."
  ],
  "relatedLessonIds": [
    "01.01.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head"
},
{
  "id": "web-meta",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "meta"
  ],
  "heading": "Web & HTML: meta",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Declares metadata such as encoding, viewport and descriptions.",
  "syntax": "<meta name=\"description\" content=\"…\">",
  "lang": "html",
  "parameters": "charset, name/content, or supported http-equiv pairs.",
  "returns": "Document metadata; void element.",
  "minimalExample": "<meta charset=\"utf-8\">",
  "productionExample": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta name=\"description\" content=\"Learn accessible form controls.\">",
  "commonMistakes": [
    "Disabling zoom with viewport settings."
  ],
  "securityPerformanceNotes": [
    "Never place secrets in metadata; send security headers from the server."
  ],
  "relatedLessonIds": [
    "01.01.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta"
},
{
  "id": "web-link",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "link"
  ],
  "heading": "Web & HTML: link",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Connects the document to external resources or relationships.",
  "syntax": "<link rel=\"stylesheet\" href=\"/app.css\">",
  "lang": "html",
  "parameters": "rel, href and relationship-specific attributes.",
  "returns": "Resource or metadata relationship; void element.",
  "minimalExample": "<link rel=\"icon\" href=\"/icon.svg\">",
  "productionExample": "<link rel=\"preload\" href=\"/fonts/ui.woff2\" as=\"font\" type=\"font/woff2\" crossorigin><link rel=\"stylesheet\" href=\"/app.css\">",
  "commonMistakes": [
    "Preloading everything or using mismatched crossorigin attributes."
  ],
  "securityPerformanceNotes": [
    "Preload only critical assets and use trusted resource origins."
  ],
  "relatedLessonIds": [
    "01.01.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link"
},
{
  "id": "web-script",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "script"
  ],
  "heading": "Web & HTML: script",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Embeds or references executable code or supported data blocks.",
  "syntax": "<script type=\"module\" src=\"/app.js\"></script>",
  "lang": "html",
  "parameters": "src, type, async, defer and integrity where applicable.",
  "returns": "Loads/evaluates scripts according to their type and attributes.",
  "minimalExample": "<script defer src=\"/app.js\"></script>",
  "productionExample": "<script type=\"module\" src=\"/assets/app.js\"></script>\n<!-- Serve a CSP that permits the intended script origin. -->",
  "commonMistakes": [
    "Treating async as preserving source execution order."
  ],
  "securityPerformanceNotes": [
    "Avoid untrusted script sources and inline user-controlled script text."
  ],
  "relatedLessonIds": [
    "01.01.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script"
},
{
  "id": "web-article",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "article"
  ],
  "heading": "Web & HTML: article",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Represents self-contained content that could be independently reused.",
  "syntax": "<article><h2>Title</h2>…</article>",
  "lang": "html",
  "parameters": "Global HTML attributes and article content.",
  "returns": "Semantic article element.",
  "minimalExample": "<article><h2>Release notes</h2><p>Version 1</p></article>",
  "productionExample": "<main><h1>News</h1><article aria-labelledby=\"news-1\"><h2 id=\"news-1\">Release notes</h2><time datetime=\"2026-11-26\">26 November</time><p>Updates</p></article></main>",
  "commonMistakes": [
    "Using article as a generic styling wrapper."
  ],
  "securityPerformanceNotes": [
    "Provide useful headings and preserve logical reading order."
  ],
  "relatedLessonIds": [
    "01.01.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article"
},
{
  "id": "web-section",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "section"
  ],
  "heading": "Web & HTML: section",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Groups a thematic section, typically identified by a heading.",
  "syntax": "<section><h2>Topic</h2>…</section>",
  "lang": "html",
  "parameters": "Global attributes; accessible name can make a region landmark.",
  "returns": "Semantic section element.",
  "minimalExample": "<section><h2>Examples</h2><p>Example text</p></section>",
  "productionExample": "<section aria-labelledby=\"security\"><h2 id=\"security\">Security</h2><p>Validate input at the trust boundary.</p></section>",
  "commonMistakes": [
    "Creating a section for every styling wrapper."
  ],
  "securityPerformanceNotes": [
    "Use headings for structure; avoid excessive named landmarks."
  ],
  "relatedLessonIds": [
    "01.01.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section"
},
{
  "id": "web-nav",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "nav"
  ],
  "heading": "Web & HTML: nav",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Identifies a major group of navigation links.",
  "syntax": "<nav aria-label=\"Primary\">…</nav>",
  "lang": "html",
  "parameters": "Global attributes and navigation content.",
  "returns": "Navigation landmark.",
  "minimalExample": "<nav><a href=\"/learn\">Learn</a></nav>",
  "productionExample": "<nav aria-label=\"Curriculum\"><ul><li><a href=\"/learn\" aria-current=\"page\">Learn</a></li><li><a href=\"/reference\">Reference</a></li></ul></nav>",
  "commonMistakes": [
    "Using the same label for multiple distinct navigation landmarks."
  ],
  "securityPerformanceNotes": [
    "Use descriptive landmark labels and visible focus."
  ],
  "relatedLessonIds": [
    "01.01.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav"
},
{
  "id": "web-aside",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "aside"
  ],
  "heading": "Web & HTML: aside",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Represents content tangentially related to surrounding content.",
  "syntax": "<aside>…</aside>",
  "lang": "html",
  "parameters": "Global attributes and complementary content.",
  "returns": "Complementary content; landmark semantics depend on context.",
  "minimalExample": "<aside><h2>Tip</h2><p>Try keyboard navigation.</p></aside>",
  "productionExample": "<main><article><h1>Forms</h1><p>Use native controls.</p></article><aside aria-label=\"Further reading\"><a href=\"/reference\">Reference library</a></aside></main>",
  "commonMistakes": [
    "Putting required main content exclusively in aside."
  ],
  "securityPerformanceNotes": [
    "Keep supplemental content distinct from the primary reading path."
  ],
  "relatedLessonIds": [
    "01.01.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/aside"
},
{
  "id": "web-picture",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "picture"
  ],
  "heading": "Web & HTML: picture",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Lets the browser choose image sources by media condition or format.",
  "syntax": "<picture><source …><img …></picture>",
  "lang": "html",
  "parameters": "Ordered source elements with media/type/srcset and required img fallback.",
  "returns": "One rendered image chosen by the browser.",
  "minimalExample": "<picture><source srcset=\"photo.webp\" type=\"image/webp\"><img src=\"photo.jpg\" alt=\"Mountain\"></picture>",
  "productionExample": "<picture><source media=\"(min-width: 900px)\" srcset=\"wide.jpg\"><img src=\"narrow.jpg\" width=\"640\" height=\"360\" alt=\"Dashboard overview\"></picture>",
  "commonMistakes": [
    "Putting alt on source instead of img."
  ],
  "securityPerformanceNotes": [
    "Reserve space for the chosen image ratio and avoid unnecessary large downloads."
  ],
  "relatedLessonIds": [
    "01.01.07"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture"
},
{
  "id": "web-aria-label",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "aria-label"
  ],
  "heading": "Web & HTML: aria-label",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Supplies an accessible name when the element permits naming.",
  "syntax": "aria-label=\"Close dialog\"",
  "lang": "html",
  "parameters": "A string describing the control's purpose.",
  "returns": "Accessible name subject to accessible-name computation.",
  "minimalExample": "<button aria-label=\"Close\">×</button>",
  "productionExample": "<button type=\"button\" aria-label=\"Remove task\"><svg aria-hidden=\"true\" viewBox=\"0 0 10 10\"><path d=\"M1 1L9 9M9 1L1 9\"/></svg></button>",
  "commonMistakes": [
    "Overriding useful visible text with a different accessible name."
  ],
  "securityPerformanceNotes": [
    "Prefer visible labels when possible; verify accessible name with assistive technology."
  ],
  "relatedLessonIds": [
    "01.03.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label"
},
{
  "id": "web-tabindex",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "tabindex"
  ],
  "heading": "Web & HTML: tabindex",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Controls sequential focus participation and programmatic focus.",
  "syntax": "tabindex=\"0\"",
  "lang": "html",
  "parameters": "Integer; 0 follows natural order, -1 allows programmatic focus without normal tab stop.",
  "returns": "Changes focus behavior, not interaction semantics.",
  "minimalExample": "<h2 tabindex=\"-1\" id=\"results\">Results</h2>",
  "productionExample": "<h2 id=\"errors\" tabindex=\"-1\">Please correct errors</h2><script>document.querySelector('#errors').focus()</script>",
  "commonMistakes": [
    "Using positive tabindex to repair DOM order or making divs behave like buttons without keyboard support."
  ],
  "securityPerformanceNotes": [
    "Prefer native controls and logical DOM order; restore focus after transient UI."
  ],
  "relatedLessonIds": [
    "01.03.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex"
},
{
  "id": "web-request",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "Request"
  ],
  "heading": "Web & HTML: Request",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Represents an HTTP request used by Fetch.",
  "syntax": "new Request(input, init)",
  "lang": "js",
  "parameters": "URL or Request, method, headers, body and signal options.",
  "returns": "Request object; body is a stream that may be consumed once.",
  "minimalExample": "const req = new Request('/api/tasks');",
  "productionExample": "const req = new Request('/api/tasks', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({title}), signal });\nconst res = await fetch(req);",
  "commonMistakes": [
    "Reading a consumed request body twice."
  ],
  "securityPerformanceNotes": [
    "Validate server-side inputs and use same-origin or explicitly trusted destinations."
  ],
  "relatedLessonIds": [
    "01.04.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/Request"
},
{
  "id": "web-response",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "Response"
  ],
  "heading": "Web & HTML: Response",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Represents the status, headers and body of an HTTP response.",
  "syntax": "new Response(body, { status, headers })",
  "lang": "js",
  "parameters": "Optional body and status/statusText/headers.",
  "returns": "Response with body-reading methods and status information.",
  "minimalExample": "const res = new Response('OK', {status:200});",
  "productionExample": "return Response.json({ id: task.id, title: task.title }, { status: 200, headers: { 'Cache-Control': 'private, no-store' } });",
  "commonMistakes": [
    "Assuming every fetch response is successful or every body is JSON."
  ],
  "securityPerformanceNotes": [
    "Project safe fields and avoid shared caches for private results."
  ],
  "relatedLessonIds": [
    "01.04.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/Response"
},
{
  "id": "web-url",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "URL"
  ],
  "heading": "Web & HTML: URL",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Parses, resolves and exposes components of a URL.",
  "syntax": "new URL(input, base?)",
  "lang": "js",
  "parameters": "Absolute URL or relative input with a valid base.",
  "returns": "URL instance; invalid input throws.",
  "minimalExample": "const url = new URL('/learn', 'https://example.org');",
  "productionExample": "const url = new URL('/search', 'https://example.org');\nurl.searchParams.set('q', query);\nconst href = url.toString();",
  "commonMistakes": [
    "Assuming a successfully parsed URL is an authorized destination."
  ],
  "securityPerformanceNotes": [
    "Allowlist protocol and origin for redirects or outbound requests; parsing is not SSRF defense."
  ],
  "relatedLessonIds": [
    "01.04.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/URL"
},
{
  "id": "web-localstorage",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "localStorage"
  ],
  "heading": "Web & HTML: localStorage",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Provides synchronous origin-scoped string storage that can persist across browser sessions.",
  "syntax": "localStorage.setItem(key, value)",
  "lang": "js",
  "parameters": "String keys and values; getItem/removeItem/clear.",
  "returns": "getItem returns string or null; writes may throw.",
  "minimalExample": "localStorage.setItem('theme','dark');",
  "productionExample": "try { localStorage.setItem('preferences:v1', JSON.stringify({ theme: 'dark' })); } catch { showStorageWarning(); }",
  "commonMistakes": [
    "Storing access tokens or assuming storage cannot fail."
  ],
  "securityPerformanceNotes": [
    "Keep non-sensitive preferences only; validate loaded JSON and handle quota/privacy restrictions."
  ],
  "relatedLessonIds": [
    "01.04.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
},
{
  "id": "web-indexeddb",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "IndexedDB"
  ],
  "heading": "Web & HTML: IndexedDB",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Asynchronous transactional browser database for structured data.",
  "syntax": "indexedDB.open(name, version)",
  "lang": "js",
  "parameters": "Database name/version; upgrade handler creates stores and indexes.",
  "returns": "IDBOpenDBRequest with success, error and upgrade events.",
  "minimalExample": "const request = indexedDB.open('notes', 1);\nrequest.onupgradeneeded = () => request.result.createObjectStore('notes', {keyPath:'id'});",
  "productionExample": "const request = indexedDB.open('notes', 1);\nrequest.onupgradeneeded = () => request.result.createObjectStore('notes', {keyPath:'id'});\nrequest.onsuccess = () => {\n const db = request.result; const tx = db.transaction('notes','readwrite');\n tx.objectStore('notes').put({id:'a',text:'Draft'});\n tx.oncomplete = () => db.close(); tx.onabort = () => db.close();\n};",
  "commonMistakes": [
    "Reporting a write as durable before transaction completion."
  ],
  "securityPerformanceNotes": [
    "Handle blocked upgrades, failures and quota; local data is not a trusted server source."
  ],
  "relatedLessonIds": [
    "03.04.05"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
},
{
  "id": "web-service-worker",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "Service Worker"
  ],
  "heading": "Web & HTML: Service Worker",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "A background worker can handle eligible requests and support offline behavior within its scope.",
  "syntax": "navigator.serviceWorker.register('/sw.js')",
  "lang": "js",
  "parameters": "Script URL and optional registration scope/options.",
  "returns": "Promise<ServiceWorkerRegistration>.",
  "minimalExample": "await navigator.serviceWorker.register('/sw.js');",
  "productionExample": "// sw.js: cache only explicitly approved public assets.\nself.addEventListener('fetch', event => {\n const url = new URL(event.request.url);\n if (event.request.method === 'GET' && url.origin === self.location.origin && url.pathname === '/assets/help.css') {\n  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));\n }\n});",
  "commonMistakes": [
    "Caching every response including authenticated pages."
  ],
  "securityPerformanceNotes": [
    "Use HTTPS, scoped cache policies and versioned cleanup; test offline and update lifecycle."
  ],
  "relatedLessonIds": [
    "03.04.05"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"
},
{
  "id": "web-cors",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "CORS"
  ],
  "heading": "Web & HTML: CORS",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Browser cross-origin response-access mechanism based on server response headers.",
  "syntax": "Access-Control-Allow-Origin: https://app.example.org",
  "lang": "text",
  "parameters": "Origin, allowed methods/headers, optional credentials and preflight policy.",
  "returns": "Browser permits or denies script access to cross-origin responses.",
  "minimalExample": "Access-Control-Allow-Origin: https://app.example.org",
  "productionExample": "Access-Control-Allow-Origin: https://app.example.org\nAccess-Control-Allow-Credentials: true\nVary: Origin\n# For preflight, allow only required methods and headers.",
  "commonMistakes": [
    "Treating CORS as server-side authorization or combining credentialed requests with wildcard origin."
  ],
  "securityPerformanceNotes": [
    "Check origin against an allowlist; authenticate and authorize every sensitive operation."
  ],
  "relatedLessonIds": [
    "01.04.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"
},
{
  "id": "web-csp",
  "matchCategories": [
    "Web & HTML"
  ],
  "matchTitles": [
    "CSP"
  ],
  "heading": "Web & HTML: CSP",
  "category": "Web & HTML",
  "majorVersion": "HTML / Web platform",
  "status": "Authored reference draft",
  "summary": "Content Security Policy restricts allowed sources and selected browser behaviors.",
  "syntax": "Content-Security-Policy: default-src 'self'",
  "lang": "text",
  "parameters": "Directives such as script-src, object-src, base-uri and frame-ancestors.",
  "returns": "Browser enforces or reports violations of the supplied policy.",
  "minimalExample": "Content-Security-Policy: default-src 'self'; object-src 'none'",
  "productionExample": "Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'\n# Review violations and adapt before enforcing.",
  "commonMistakes": [
    "Adding unsafe-inline merely to suppress violations."
  ],
  "securityPerformanceNotes": [
    "Use a framework-compatible nonce/hash strategy and output encoding; CSP is defense in depth."
  ],
  "relatedLessonIds": [
    "01.04.07"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP"
},
{
  "id": "css-min",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "min()"
  ],
  "heading": "CSS: min()",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Chooses the smallest compatible calculation.",
  "syntax": "width: min(100%, 60rem);",
  "lang": "css",
  "parameters": "Comma-separated compatible calculations.",
  "returns": "Computed CSS numeric value.",
  "minimalExample": "width: min(100%, 40rem);",
  "productionExample": ".content { inline-size: min(100% - 2rem, 72rem); margin-inline: auto; }",
  "commonMistakes": [
    "Combining incompatible dimensions."
  ],
  "securityPerformanceNotes": [
    "Check zoom and intrinsic sizing rather than forcing fixed widths."
  ],
  "relatedLessonIds": [
    "02.02.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/min"
},
{
  "id": "css-max",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "max()"
  ],
  "heading": "CSS: max()",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Chooses the largest compatible calculation.",
  "syntax": "padding: max(1rem, 2vw);",
  "lang": "css",
  "parameters": "Comma-separated compatible calculations.",
  "returns": "Computed CSS numeric value.",
  "minimalExample": "width: max(10rem, 20vw);",
  "productionExample": ".page { padding-inline: max(1rem, env(safe-area-inset-left)); }",
  "commonMistakes": [
    "Using max to enforce an oversized minimum on narrow screens."
  ],
  "securityPerformanceNotes": [
    "Test narrow containers and safe-area behavior."
  ],
  "relatedLessonIds": [
    "02.02.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/max"
},
{
  "id": "css-font-display",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "font-display"
  ],
  "heading": "CSS: font-display",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Controls font face rendering while the font downloads.",
  "syntax": "@font-face { font-display: swap; }",
  "lang": "css",
  "parameters": "auto, block, swap, fallback or optional.",
  "returns": "Font loading/rendering strategy.",
  "minimalExample": "@font-face { font-family: UI; src: url(ui.woff2); font-display: swap; }",
  "productionExample": "@font-face { font-family: UI; src: url(/ui.woff2) format('woff2'); font-display: optional; }\nbody { font-family: UI, system-ui, sans-serif; }",
  "commonMistakes": [
    "Assuming swap eliminates layout shift."
  ],
  "securityPerformanceNotes": [
    "Choose compatible fallback metrics and preload only necessary faces."
  ],
  "relatedLessonIds": [
    "02.04.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display"
},
{
  "id": "css-contain",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "contain"
  ],
  "heading": "CSS: contain",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Limits propagation of layout, paint, size or style effects.",
  "syntax": "contain: layout paint;",
  "lang": "css",
  "parameters": "Containment keywords, strict or content.",
  "returns": "Changes containment boundaries and potentially containing blocks.",
  "minimalExample": ".card { contain: layout paint; }",
  "productionExample": ".preview { contain: layout paint; overflow: clip; }",
  "commonMistakes": [
    "Using size containment without a meaningful size or clipping intended popovers."
  ],
  "securityPerformanceNotes": [
    "Profile actual performance and test overlays and intrinsic layout."
  ],
  "relatedLessonIds": [
    "02.04.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/contain"
},
{
  "id": "css-content-visibility",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "content-visibility"
  ],
  "heading": "CSS: content-visibility",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Allows the browser to skip rendering work for off-screen content.",
  "syntax": "content-visibility: auto;",
  "lang": "css",
  "parameters": "visible, auto or hidden.",
  "returns": "Rendering work may be deferred; auto does not mean display:none.",
  "minimalExample": ".chapter { content-visibility: auto; }",
  "productionExample": ".chapter { content-visibility: auto; contain-intrinsic-size: auto 600px; }",
  "commonMistakes": [
    "Applying hidden to content intended to remain discoverable."
  ],
  "securityPerformanceNotes": [
    "Test focus, find-in-page and scroll stability; measure before retaining optimization."
  ],
  "relatedLessonIds": [
    "02.04.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility"
},
{
  "id": "css-animation",
  "matchCategories": [
    "CSS"
  ],
  "matchTitles": [
    "animation"
  ],
  "heading": "CSS: animation",
  "category": "CSS",
  "majorVersion": "CSS",
  "status": "Authored reference draft",
  "summary": "Runs named keyframes with timing and iteration settings.",
  "syntax": "animation: fade-in 200ms ease-out;",
  "lang": "css",
  "parameters": "Name, duration, timing, delay, iterations, direction and fill mode.",
  "returns": "Animation of supported properties.",
  "minimalExample": "@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }\n.item { animation: fade-in 200ms; }",
  "productionExample": "@keyframes reveal { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n.card { animation: reveal 180ms ease-out; }\n@media (prefers-reduced-motion: reduce) { .card { animation: none; } }",
  "commonMistakes": [
    "Animating layout-heavy properties continuously or ignoring reduced motion."
  ],
  "securityPerformanceNotes": [
    "Prefer inexpensive properties where suitable and keep content usable without motion."
  ],
  "relatedLessonIds": [
    "02.03.04"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/animation"
},
{
  "id": "javascript-promise",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Promise"
  ],
  "heading": "JavaScript: Promise",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Represents eventual fulfillment or rejection of an asynchronous operation.",
  "syntax": "new Promise((resolve, reject) => …)",
  "lang": "js",
  "parameters": "Executor invoked synchronously; resolve/reject settle the promise.",
  "returns": "Promise with then/catch/finally; handlers run asynchronously.",
  "minimalExample": "const p = Promise.resolve(42);",
  "productionExample": "function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }\nawait delay(100);",
  "commonMistakes": [
    "Using an async executor or leaving a rejection unhandled."
  ],
  "securityPerformanceNotes": [
    "Use native promise-returning APIs directly; cancellation needs a separate mechanism."
  ],
  "relatedLessonIds": [
    "03.03.03"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"
},
{
  "id": "javascript-object-entries",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "Object.entries"
  ],
  "heading": "JavaScript: Object.entries",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Returns own enumerable string-keyed property pairs.",
  "syntax": "Object.entries(object)",
  "lang": "js",
  "parameters": "Object or coercible value; null/undefined throw.",
  "returns": "Array of [key,value] pairs.",
  "minimalExample": "Object.entries({a:1,b:2});",
  "productionExample": "const allowed = new Set(['theme','density']);\nconst prefs = Object.fromEntries(Object.entries(input).filter(([key]) => allowed.has(key)));",
  "commonMistakes": [
    "Assuming inherited or symbol keys are included."
  ],
  "securityPerformanceNotes": [
    "Validate allowed values too; filtering keys alone is not complete input validation."
  ],
  "relatedLessonIds": [
    "03.01.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries"
},
{
  "id": "javascript-try-catch",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "try/catch"
  ],
  "heading": "JavaScript: try/catch",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Handles exceptions from a protected block and optionally performs cleanup.",
  "syntax": "try { … } catch (error) { … } finally { … }",
  "lang": "js",
  "parameters": "Blocks and optional catch binding.",
  "returns": "Control flow continues or propagates according to block behavior.",
  "minimalExample": "try { JSON.parse('{'); } catch { console.log('Invalid JSON'); }",
  "productionExample": "try { await work(); } catch (error) { reportSafeError(error); throw error; } finally { releaseResource(); }",
  "commonMistakes": [
    "Returning from finally and overriding an earlier result or exception."
  ],
  "securityPerformanceNotes": [
    "Handle expected failures narrowly; avoid logging sensitive input."
  ],
  "relatedLessonIds": [
    "03.02.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch"
},
{
  "id": "javascript-throw",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "throw"
  ],
  "heading": "JavaScript: throw",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Raises an exception and transfers control to a matching handler.",
  "syntax": "throw new Error('message');",
  "lang": "js",
  "parameters": "Any expression; Error objects are recommended.",
  "returns": "Does not return normally.",
  "minimalExample": "throw new Error('Invalid input');",
  "productionExample": "if (!Number.isInteger(page) || page < 1) throw new RangeError('Invalid page');",
  "commonMistakes": [
    "Throwing raw user data or relying on strings for error identity."
  ],
  "securityPerformanceNotes": [
    "Map internal exceptions to safe external messages at the boundary."
  ],
  "relatedLessonIds": [
    "03.02.06"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw"
},
{
  "id": "javascript-import",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "import"
  ],
  "heading": "JavaScript: import",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Declares a static module dependency and imported bindings.",
  "syntax": "import { name } from './module.js';",
  "lang": "js",
  "parameters": "Module specifier and named/default/namespace bindings.",
  "returns": "Live read-only imported bindings in an ES module.",
  "minimalExample": "import { parse } from './parse.js';",
  "productionExample": "import { validateTask } from './domain/task.js';\nimport { saveTask } from './adapters/repository.js';",
  "commonMistakes": [
    "Confusing static import with dynamic import() or using wrong runtime extensions."
  ],
  "securityPerformanceNotes": [
    "Separate browser and server module graphs; avoid importing secrets into client bundles."
  ],
  "relatedLessonIds": [
    "03.02.05"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import"
},
{
  "id": "javascript-export",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "export"
  ],
  "heading": "JavaScript: export",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Exposes named or default module bindings to importers.",
  "syntax": "export function name() {}",
  "lang": "js",
  "parameters": "Declarations, export lists or re-export specifiers.",
  "returns": "Module exports; named exports are live bindings.",
  "minimalExample": "export const version = 1;",
  "productionExample": "export { parseTask } from './task.js';\nexport { createTaskService } from './service.js';",
  "commonMistakes": [
    "Exporting every internal helper and accidentally expanding public API."
  ],
  "securityPerformanceNotes": [
    "Keep package boundaries small and avoid exporting secret configuration."
  ],
  "relatedLessonIds": [
    "03.02.05"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export"
},
{
  "id": "javascript-eventtarget",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "EventTarget"
  ],
  "heading": "JavaScript: EventTarget",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Interface for registering listeners and dispatching events.",
  "syntax": "new EventTarget()",
  "lang": "js",
  "parameters": "Event type, listener and dispatchable Event objects.",
  "returns": "EventTarget with listener/dispatch methods.",
  "minimalExample": "const target = new EventTarget();\ntarget.dispatchEvent(new Event('ready'));",
  "productionExample": "const bus = new EventTarget();\nbus.addEventListener('task:changed', e => refresh(e.detail));\nbus.dispatchEvent(new CustomEvent('task:changed', {detail:{id:'a'}}));",
  "commonMistakes": [
    "Expecting dispatchEvent to perform asynchronous event delivery."
  ],
  "securityPerformanceNotes": [
    "Do not treat arbitrary custom-event payloads as trusted authorization evidence."
  ],
  "relatedLessonIds": [
    "03.04.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget"
},
{
  "id": "javascript-addeventlistener",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "addEventListener"
  ],
  "heading": "JavaScript: addEventListener",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Registers a callback for events on an EventTarget.",
  "syntax": "target.addEventListener(type, listener, options)",
  "lang": "js",
  "parameters": "Event type, callback and options such as once, passive or signal.",
  "returns": "Undefined; listener remains until removed or configured cleanup occurs.",
  "minimalExample": "button.addEventListener('click', () => openPanel());",
  "productionExample": "const controller = new AbortController();\nwindow.addEventListener('resize', onResize, {signal:controller.signal});\n// During cleanup:\ncontroller.abort();",
  "commonMistakes": [
    "Adding a new anonymous handler on every render without cleanup."
  ],
  "securityPerformanceNotes": [
    "Use abort/remove cleanup; avoid blocking scroll with unnecessary non-passive handlers."
  ],
  "relatedLessonIds": [
    "03.04.01"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener"
},
{
  "id": "javascript-queuemicrotask",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "queueMicrotask"
  ],
  "heading": "JavaScript: queueMicrotask",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Queues a callback in the microtask queue.",
  "syntax": "queueMicrotask(callback)",
  "lang": "js",
  "parameters": "Function invoked after current stack, before the next task when checkpoint runs.",
  "returns": "Undefined; callback errors surface as exceptions.",
  "minimalExample": "queueMicrotask(() => console.log('after stack'));",
  "productionExample": "let pending = false;\nfunction scheduleFlush() { if (pending) return; pending = true; queueMicrotask(() => { pending = false; flushChanges(); }); }",
  "commonMistakes": [
    "Recursively enqueuing microtasks and starving rendering."
  ],
  "securityPerformanceNotes": [
    "Bound work; use task scheduling when yielding to the browser is required."
  ],
  "relatedLessonIds": [
    "03.03.02"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask"
},
{
  "id": "javascript-structuredclone",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "structuredClone"
  ],
  "heading": "JavaScript: structuredClone",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Copies supported structured-cloneable values, optionally transferring ownership.",
  "syntax": "structuredClone(value, { transfer })",
  "lang": "js",
  "parameters": "Cloneable value and optional transfer list.",
  "returns": "Independent clone; unsupported values throw DataCloneError.",
  "minimalExample": "const copy = structuredClone({items:[1,2]});",
  "productionExample": "const snapshot = structuredClone({ tasks, filters });\n// Work on a detached data snapshot, not live DOM objects.",
  "commonMistakes": [
    "Expecting functions or DOM nodes to clone."
  ],
  "securityPerformanceNotes": [
    "Large clones consume memory; transfer only buffers you no longer need."
  ],
  "relatedLessonIds": [
    "03.02.07"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone"
},
{
  "id": "javascript-abortsignal",
  "matchCategories": [
    "JavaScript"
  ],
  "matchTitles": [
    "AbortSignal"
  ],
  "heading": "JavaScript: AbortSignal",
  "category": "JavaScript",
  "majorVersion": "ECMAScript / Web APIs",
  "status": "Authored reference draft",
  "summary": "Communicates cancellation to APIs that observe a signal.",
  "syntax": "controller.signal",
  "lang": "js",
  "parameters": "Signal from AbortController or supported static constructors such as timeout.",
  "returns": "AbortSignal with aborted, reason and abort events.",
  "minimalExample": "const signal = AbortSignal.timeout(3000);",
  "productionExample": "const signal = AbortSignal.any([userController.signal, AbortSignal.timeout(5000)]);\nconst res = await fetch('/api/tasks', {signal});\nif (!res.ok) throw new Error('Request failed');",
  "commonMistakes": [
    "Reusing a signal after it has aborted."
  ],
  "securityPerformanceNotes": [
    "Check runtime support; aborting a client request does not reverse server-side mutations."
  ],
  "relatedLessonIds": [
    "03.03.05"
  ],
  "canonicalUrl": "https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal"
},
{
  "id": "typescript-type",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "type"
  ],
  "heading": "TypeScript: type",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Defines a named type alias for a type expression.",
  "syntax": "type Name = Expression;",
  "lang": "ts",
  "parameters": "Type expression and optional type parameters.",
  "returns": "Compile-time alias; erased at runtime.",
  "minimalExample": "type ID = string;",
  "productionExample": "type TaskResult = {ok:true; id:string} | {ok:false; reason:string};",
  "commonMistakes": [
    "Assuming a type alias constructs or validates values."
  ],
  "securityPerformanceNotes": [
    "Use runtime validation at external boundaries."
  ],
  "relatedLessonIds": [
    "04.01.04"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases"
},
{
  "id": "typescript-interface",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "interface"
  ],
  "heading": "TypeScript: interface",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Describes an object shape and supports extension/declaration merging.",
  "syntax": "interface Name { field: Type }",
  "lang": "ts",
  "parameters": "Property/method declarations and optional extends.",
  "returns": "Compile-time structural object type.",
  "minimalExample": "interface Task { id: string }",
  "productionExample": "interface TaskRepository { find(id:string): Promise<Task | null>; }\ninterface Task { id:string; title:string; }",
  "commonMistakes": [
    "Assuming interfaces are nominal or exist at runtime."
  ],
  "securityPerformanceNotes": [
    "Keep contracts narrow and validate data crossing process boundaries."
  ],
  "relatedLessonIds": [
    "04.01.04"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces"
},
{
  "id": "typescript-never",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "never"
  ],
  "heading": "TypeScript: never",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Represents values that cannot occur in a valid type flow.",
  "syntax": "const impossible: never = value;",
  "lang": "ts",
  "parameters": "Type position; often used in exhaustiveness checks.",
  "returns": "Bottom type, assignable to other types.",
  "minimalExample": "function fail(message:string): never { throw new Error(message); }",
  "productionExample": "type State = 'open' | 'closed';\nfunction label(s:State):string { switch(s){case 'open':return 'Open';case 'closed':return 'Closed';default:{const unreachable:never=s;return unreachable;}} }",
  "commonMistakes": [
    "Forcing an assertion to never to silence missing cases."
  ],
  "securityPerformanceNotes": [
    "Use exhaustive checks on validated discriminants; unknown runtime values still need rejection."
  ],
  "relatedLessonIds": [
    "04.02.05"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type"
},
{
  "id": "typescript-union",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "union"
  ],
  "heading": "TypeScript: union",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Represents a value belonging to one or more alternative types.",
  "syntax": "type Value = A | B;",
  "lang": "ts",
  "parameters": "Member types separated by |.",
  "returns": "Union with operations limited to safely shared members until narrowing.",
  "minimalExample": "type ID = string | number;",
  "productionExample": "function normalizeId(id:string|number):string { return typeof id === 'number' ? String(id) : id.trim(); }",
  "commonMistakes": [
    "Accessing a member-specific property before narrowing."
  ],
  "securityPerformanceNotes": [
    "Validate runtime inputs instead of trusting union annotations."
  ],
  "relatedLessonIds": [
    "04.01.03"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types"
},
{
  "id": "typescript-intersection",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "intersection"
  ],
  "heading": "TypeScript: intersection",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Combines requirements of multiple types.",
  "syntax": "type Combined = A & B;",
  "lang": "ts",
  "parameters": "Types separated by &.",
  "returns": "Type requiring compatibility with all constituents.",
  "minimalExample": "type Entity = {id:string} & {createdAt:Date};",
  "productionExample": "type AuditedTask = {id:string;title:string} & {createdAt:Date;updatedAt:Date};\nfunction timestamp(t:AuditedTask){return t.updatedAt.toISOString();}",
  "commonMistakes": [
    "Intersecting incompatible properties and assuming the result is usable."
  ],
  "securityPerformanceNotes": [
    "Intersection types do not merge or validate runtime objects."
  ],
  "relatedLessonIds": [
    "04.01.03"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types"
},
{
  "id": "typescript-infer",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "infer"
  ],
  "heading": "TypeScript: infer",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Introduces an inferred type variable inside a conditional type pattern.",
  "syntax": "type Element<T> = T extends (infer U)[] ? U : never;",
  "lang": "ts",
  "parameters": "Conditional extends pattern and inferred variable.",
  "returns": "Derived type selected by conditional inference.",
  "minimalExample": "type Item<T> = T extends Array<infer U> ? U : never;",
  "productionExample": "type ResponseBody<T> = T extends Promise<infer R> ? R : T;\ntype Body = ResponseBody<Promise<{id:string}>>;",
  "commonMistakes": [
    "Expecting infer to inspect runtime values."
  ],
  "securityPerformanceNotes": [
    "Prefer built-in utility types where they express the same intent."
  ],
  "relatedLessonIds": [
    "04.02.04"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types"
},
{
  "id": "typescript-as-const",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "as const"
  ],
  "heading": "TypeScript: as const",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Requests literal inference and readonly object/tuple properties for literal expressions.",
  "syntax": "const value = {kind:'ready'} as const;",
  "lang": "ts",
  "parameters": "Literal expression.",
  "returns": "Narrower compile-time type; does not freeze the runtime object.",
  "minimalExample": "const roles = ['reader','editor'] as const;",
  "productionExample": "const statuses = ['open','done'] as const;\ntype Status = typeof statuses[number];\nfunction isStatus(value:unknown):value is Status { return statuses.some(s=>s===value); }",
  "commonMistakes": [
    "Assuming readonly typing means deep runtime immutability."
  ],
  "securityPerformanceNotes": [
    "Validate external values; use explicit runtime freezing if needed."
  ],
  "relatedLessonIds": [
    "04.01.03"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions"
},
{
  "id": "typescript-type-guards",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "Type guards"
  ],
  "heading": "TypeScript: Type guards",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Narrow values using runtime checks or a user-defined type predicate.",
  "syntax": "function isString(x:unknown): x is string { return typeof x === 'string'; }",
  "lang": "ts",
  "parameters": "Value to inspect and truthful predicate.",
  "returns": "Boolean result that informs control-flow type analysis.",
  "minimalExample": "if (typeof input === 'string') input.trim();",
  "productionExample": "function isTask(x:unknown):x is {id:string;title:string} { return typeof x==='object' && x!==null && 'id' in x && typeof x.id==='string' && 'title' in x && typeof x.title==='string'; }",
  "commonMistakes": [
    "Declaring a predicate that returns true without checking required fields."
  ],
  "securityPerformanceNotes": [
    "Validate nested data and semantic constraints, not just superficial shape."
  ],
  "relatedLessonIds": [
    "04.01.06"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html"
},
{
  "id": "typescript-tsconfig-strict",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "tsconfig strict"
  ],
  "heading": "TypeScript: tsconfig strict",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Enables the TypeScript family of strict checking options.",
  "syntax": "{\"compilerOptions\":{\"strict\":true}}",
  "lang": "json",
  "parameters": "Compiler configuration and optional individual flag overrides.",
  "returns": "Compile-time diagnostics.",
  "minimalExample": "{\"compilerOptions\":{\"strict\":true}}",
  "productionExample": "{\"compilerOptions\":{\"strict\":true,\"noUncheckedIndexedAccess\":true,\"exactOptionalPropertyTypes\":true,\"noEmit\":true}}",
  "commonMistakes": [
    "Assuming strict enables every additional checking flag or validates runtime data."
  ],
  "securityPerformanceNotes": [
    "Run a real typecheck in release gates and avoid blanket suppressions."
  ],
  "relatedLessonIds": [
    "04.01.01"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/tsconfig/#strict"
},
{
  "id": "typescript-nodenext",
  "matchCategories": [
    "TypeScript"
  ],
  "matchTitles": [
    "NodeNext"
  ],
  "heading": "TypeScript: NodeNext",
  "category": "TypeScript",
  "majorVersion": "TypeScript",
  "status": "Authored reference draft",
  "summary": "Models Node.js ESM/CommonJS resolution and emit behavior.",
  "syntax": "{\"compilerOptions\":{\"module\":\"NodeNext\",\"moduleResolution\":\"NodeNext\"}}",
  "lang": "json",
  "parameters": "Module settings, package type and file extensions influence behavior.",
  "returns": "Compiler resolution and emit matching modeled Node semantics.",
  "minimalExample": "{\"compilerOptions\":{\"module\":\"NodeNext\"}}",
  "productionExample": "{\"compilerOptions\":{\"module\":\"NodeNext\",\"moduleResolution\":\"NodeNext\",\"strict\":true,\"outDir\":\"dist\"}}\n// In ESM source: import { task } from './task.js';",
  "commonMistakes": [
    "Using extensionless relative imports in native Node ESM without a supporting loader."
  ],
  "securityPerformanceNotes": [
    "Test the emitted package under the intended Node version."
  ],
  "relatedLessonIds": [
    "04.04.02"
  ],
  "canonicalUrl": "https://www.typescriptlang.org/docs/tsconfig/#module"
},
{
  "id": "react-jsx",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "JSX"
  ],
  "heading": "React: JSX",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Syntax extension for expressing React element trees.",
  "syntax": "const element = <h1>Hello</h1>;",
  "lang": "tsx",
  "parameters": "Tags, props, children and JavaScript expressions in braces.",
  "returns": "React element descriptions, not immediate DOM nodes.",
  "minimalExample": "const title = <h1>Learn</h1>;",
  "productionExample": "function Task({title}:{title:string}) { return <article><h2>{title}</h2><button type=\"button\">Open</button></article>; }",
  "commonMistakes": [
    "Treating JSX as raw HTML or inserting untrusted HTML."
  ],
  "securityPerformanceNotes": [
    "React escapes text by default; avoid unsafe HTML injection."
  ],
  "relatedLessonIds": [
    "06.01.01"
  ],
  "canonicalUrl": "https://react.dev/learn/writing-markup-with-jsx"
},
{
  "id": "react-component",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "Component"
  ],
  "heading": "React: Component",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "A React component describes UI based on props and state.",
  "syntax": "function Task() { return <p>Task</p>; }",
  "lang": "tsx",
  "parameters": "Props object; hooks follow React rules.",
  "returns": "React node returned for rendering.",
  "minimalExample": "function Greeting(){return <h1>Hello</h1>;}",
  "productionExample": "function TaskCard({title,done}:{title:string;done:boolean}){return <article><h2>{title}</h2><p>{done?'Completed':'Open'}</p></article>;}",
  "commonMistakes": [
    "Calling a component directly as a normal function or mutating during render."
  ],
  "securityPerformanceNotes": [
    "Keep render pure; isolate side effects and state ownership."
  ],
  "relatedLessonIds": [
    "06.01.02"
  ],
  "canonicalUrl": "https://react.dev/learn/your-first-component"
},
{
  "id": "react-props",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "props"
  ],
  "heading": "React: props",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Read-only inputs passed from a parent to a component.",
  "syntax": "<Task title=\"Read\" />",
  "lang": "tsx",
  "parameters": "Named props; component reads the props object.",
  "returns": "Component receives a snapshot of inputs.",
  "minimalExample": "function Title({text}:{text:string}){return <h1>{text}</h1>;}",
  "productionExample": "function TaskRow({task,onOpen}:{task:{id:string;title:string};onOpen:(id:string)=>void}){return <button onClick={()=>onOpen(task.id)}>{task.title}</button>;}",
  "commonMistakes": [
    "Mutating a prop or copying it to state without a reason."
  ],
  "securityPerformanceNotes": [
    "Pass only needed data; do not expose secrets to client component props."
  ],
  "relatedLessonIds": [
    "06.01.02"
  ],
  "canonicalUrl": "https://react.dev/learn/passing-props-to-a-component"
},
{
  "id": "react-children",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "children"
  ],
  "heading": "React: children",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "The children prop carries nested JSX/content supplied by the parent.",
  "syntax": "<Panel><Content /></Panel>",
  "lang": "tsx",
  "parameters": "ReactNode children; may be empty or multiple nodes.",
  "returns": "Component receives nested content as props.children.",
  "minimalExample": "function Box({children}:{children:React.ReactNode}){return <div>{children}</div>;}",
  "productionExample": "function Section({title,children}:{title:string;children:React.ReactNode}){return <section><h2>{title}</h2>{children}</section>;}",
  "commonMistakes": [
    "Assuming children is always one element or a normal array."
  ],
  "securityPerformanceNotes": [
    "Use composition without forcing unnecessary wrappers or cloning arbitrary children."
  ],
  "relatedLessonIds": [
    "06.01.03"
  ],
  "canonicalUrl": "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children"
},
{
  "id": "react-uselayouteffect",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "useLayoutEffect"
  ],
  "heading": "React: useLayoutEffect",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Runs layout-related effects before browser repaint after DOM updates.",
  "syntax": "useLayoutEffect(setup, deps)",
  "lang": "tsx",
  "parameters": "Setup, optional cleanup and dependency list.",
  "returns": "Undefined; setup/cleanup follow effect lifecycle.",
  "minimalExample": "useLayoutEffect(()=>{setWidth(ref.current?.offsetWidth??0);},[]);",
  "productionExample": "useLayoutEffect(()=>{const node=ref.current;if(!node)return;const update=()=>setWidth(node.getBoundingClientRect().width);update();const observer=new ResizeObserver(update);observer.observe(node);return()=>observer.disconnect();},[]);",
  "commonMistakes": [
    "Using it for routine data fetching or omitting cleanup."
  ],
  "securityPerformanceNotes": [
    "Prefer useEffect unless pre-paint measurement is necessary; server has no layout."
  ],
  "relatedLessonIds": [
    "06.03.06"
  ],
  "canonicalUrl": "https://react.dev/reference/react/useLayoutEffect"
},
{
  "id": "react-error-boundaries",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "Error boundaries"
  ],
  "heading": "React: Error boundaries",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "A React error boundary catches rendering failures in its descendant tree.",
  "syntax": "class Boundary extends React.Component { static getDerivedStateFromError() { … } }",
  "lang": "tsx",
  "parameters": "Child tree, fallback state and optional logging lifecycle.",
  "returns": "Fallback UI after a caught descendant render error.",
  "minimalExample": "class Boundary extends React.Component { state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<p>Unavailable</p>:this.props.children;} }",
  "productionExample": "class Boundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(error:Error){reportSafeError(error);}render(){return this.state.failed?<p role=\"alert\">This panel is unavailable.</p>:this.props.children;}}",
  "commonMistakes": [
    "Expecting boundaries to catch all event-handler or asynchronous failures."
  ],
  "securityPerformanceNotes": [
    "Design meaningful recovery and sanitize diagnostics; do not expose stack traces to users."
  ],
  "relatedLessonIds": [
    "06.04.07"
  ],
  "canonicalUrl": "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary"
},
{
  "id": "react-context",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "Context"
  ],
  "heading": "React: Context",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Shares a value with descendants without threading props through every intermediate component.",
  "syntax": "const Theme = createContext(defaultValue);",
  "lang": "tsx",
  "parameters": "Default value; provider supplies value; consumers call useContext.",
  "returns": "Context object and closest-provider value.",
  "minimalExample": "const Theme=createContext('light');",
  "productionExample": "const Theme=createContext<'light'|'dark'>('light');\nfunction App(){return <Theme value=\"dark\"><Toolbar/></Theme>;}\nfunction Toolbar(){return <span>{useContext(Theme)}</span>;}",
  "commonMistakes": [
    "Using context as server authorization or creating provider objects unnecessarily."
  ],
  "securityPerformanceNotes": [
    "Split unrelated frequently changing contexts and avoid sensitive client values."
  ],
  "relatedLessonIds": [
    "06.04.01"
  ],
  "canonicalUrl": "https://react.dev/reference/react/createContext"
},
{
  "id": "react-custom-hooks",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "Custom hooks"
  ],
  "heading": "React: Custom hooks",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "A custom Hook composes reusable stateful logic using React Hooks.",
  "syntax": "function useOnline() { … }",
  "lang": "tsx",
  "parameters": "Arguments and return values defined by the hook.",
  "returns": "Reusable logic; each call has its own hook state unless external store is shared.",
  "minimalExample": "function useFlag(){const [flag,setFlag]=useState(false);return [flag,setFlag] as const;}",
  "productionExample": "function useDocumentTitle(title:string){useEffect(()=>{const previous=document.title;document.title=title;return()=>{document.title=previous;};},[title]);}",
  "commonMistakes": [
    "Calling hooks conditionally or assuming state is shared between hook calls."
  ],
  "securityPerformanceNotes": [
    "Design stable contracts and clean up subscriptions/resources."
  ],
  "relatedLessonIds": [
    "06.04.02"
  ],
  "canonicalUrl": "https://react.dev/learn/reusing-logic-with-custom-hooks"
},
{
  "id": "react-react-memo",
  "matchCategories": [
    "React"
  ],
  "matchTitles": [
    "React.memo"
  ],
  "heading": "React: React.memo",
  "category": "React",
  "majorVersion": "React 19",
  "status": "Authored reference draft",
  "summary": "Memoizes a component to potentially skip rerendering when props are unchanged.",
  "syntax": "const MemoTask = memo(Task);",
  "lang": "tsx",
  "parameters": "Component and optional equality comparator.",
  "returns": "Memoized component; state/context updates can still rerender it.",
  "minimalExample": "const Row = memo(function Row({title}:{title:string}){return <li>{title}</li>;});",
  "productionExample": "const TaskRow=memo(function TaskRow({id,title,onOpen}:{id:string;title:string;onOpen:(id:string)=>void}){return <button onClick={()=>onOpen(id)}>{title}</button>;});",
  "commonMistakes": [
    "Using custom equality that ignores function props or assuming memo guarantees no rerender."
  ],
  "securityPerformanceNotes": [
    "Profile real bottlenecks; do not depend on memo for correctness."
  ],
  "relatedLessonIds": [
    "06.05.05"
  ],
  "canonicalUrl": "https://react.dev/reference/react/memo"
}
];

export function findAuthoredReference(category: string, title: string): AuthoredReference | undefined {
  return AUTHORED_REFERENCES.find(
    (ref) => ref.matchCategories.includes(category) && ref.matchTitles.includes(title)
  );
}

/* ------------------------------------------------------------------ */
/* Pure timeline & waveform helpers                                    */
/* ------------------------------------------------------------------ */

export function getStepAtTime(lesson: AuthoredLesson, time: number): LessonStep {
  let current = lesson.steps[0];
  for (const s of lesson.steps) {
    if (time >= s.at) current = s;
    else break;
  }
  return current;
}

export function getChapterAtTime(lesson: AuthoredLesson, time: number): LessonChapter {
  let current = lesson.chapters[0];
  for (const c of lesson.chapters) {
    if (time >= c.t) current = c;
    else break;
  }
  return current;
}

export function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function diffLines(prev: string, next: string): number[] {
  const prevSet = new Set(prev.split('\n').map((l) => l.trim()));
  const changed: number[] = [];
  next.split('\n').forEach((line, i) => {
    if (!prevSet.has(line.trim()) && line.trim().length > 0) changed.push(i + 1);
  });
  return changed.slice(0, 12);
}

export function generateWaveform(lesson: AuthoredLesson, bars = 168): number[] {
  let seed = lesson.seed;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out: number[] = [];
  for (let i = 0; i < bars; i++) {
    const t = (i / bars) * lesson.duration;
    const chapterIdx = Math.max(
      0,
      lesson.chapters.findIndex((c, idx) => {
        const nextCh = lesson.chapters[idx + 1];
        return t >= c.t && (!nextCh || t < nextCh.t);
      })
    );
    const energy = lesson.waveformEnergy[chapterIdx] ?? 0.5;
    const wobble = 0.55 + 0.45 * Math.sin((i / bars) * Math.PI * 10 + chapterIdx);
    const v = Math.min(1, Math.max(0.14, energy * wobble * (0.7 + rand() * 0.6)));
    out.push(v);
  }
  return out;
}

