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
    id: 'prisma-transaction',
    matchCategories: ['Prisma'],
    matchTitles: ['$transaction'],
    heading: 'Prisma 7: prisma.$transaction()',
    category: 'Prisma · Database transactions',
    majorVersion: 'Prisma 7',
    status: 'Authored reference draft',
    summary:
      'Group dependent database reads and writes into a single atomic unit that commits together or rolls back completely on failure.',
    syntax: `await prisma.$transaction(async (tx) => {
  await tx.account.update({ /* ... */ });
  await tx.ledgerEntry.create({ /* ... */ });
});`,
    lang: 'ts',
    parameters: 'Interactive callback `(tx) => Promise<T>` or sequential array `[op1, op2]` plus optional `{ isolationLevel, timeout, maxWait }`.',
    returns: 'Promise resolving with the callback result or tuple of sequential query outputs; rolls back on thrown error.',
    minimalExample: `await prisma.$transaction([
  prisma.user.update({ where: { id }, data: { active: true } }),
  prisma.auditLog.create({ data: { actorId: id, action: 'activate' } }),
]);`,
    productionExample: `await prisma.$transaction(async (tx) => {
  const project = await tx.project.findFirstOrThrow({
    where: { id: projectId, organizationId },
  });
  await tx.task.create({ data: { projectId: project.id, title } });
  await tx.outboxEvent.create({
    data: { topic: 'task.created', payload: { projectId: project.id } },
  });
});`,
    commonMistakes: [
      'Performing external HTTP requests or sending emails while database locks are held inside a transaction.',
      'Assuming a database transaction enforces object-level authorization automatically without tenant scoping.',
      'Forgetting bounded retries when running under strict isolation levels like Serializable.',
    ],
    securityPerformanceNotes: [
      'Keep transactions as short as possible to avoid connection-pool exhaustion and lock contention.',
      'Use a transactional outbox table for async side effects (emails, webhooks) instead of calling external providers mid-transaction.',
    ],
    relatedLessonIds: ['15.02.04'],
    canonicalUrl: 'https://www.prisma.io/docs/orm/prisma-client/queries/transactions',
  },
  {
    id: 'nestjs-canactivate',
    matchCategories: ['NestJS'],
    matchTitles: ['CanActivate', '@UseGuards', 'APP_GUARD'],
    heading: 'NestJS: CanActivate & @UseGuards()',
    category: 'NestJS · Backend authorization',
    majorVersion: 'NestJS 12',
    status: 'Authored reference draft',
    summary:
      'Guards inspect trusted execution context to decide whether an incoming request may proceed to a controller route handler.',
    syntax: `@UseGuards(AuthGuard)
@Get(':id')
findOne() { /* ... */ }`,
    lang: 'ts',
    parameters: 'context: ExecutionContext — grants access to HTTP/WebSocket/RPC request metadata and handler decorators.',
    returns: 'boolean | Promise<boolean> | Observable<boolean> — returning false denies access (403 Forbidden unless customized).',
    minimalExample: `import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class DemoGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return Boolean(context.switchToHttp().getRequest().user);
  }
}`,
    productionExample: `@UseGuards(JwtAuthGuard, OrgMembershipGuard)
@Get(':id')
async findProject(
  @Param('id') id: string,
  @CurrentPrincipal() principal: VerifiedPrincipal,
) {
  return this.projectsService.findAuthorized(principal, id);
}`,
    commonMistakes: [
      'Treating any valid authenticated user as authorized to read any record ID (BOLA/IDOR vulnerability).',
      'Trusting unverified user or organization IDs supplied in route params or JSON bodies.',
      'Registering guards globally via `new Guard()` instead of `APP_GUARD` when dependency injection is required.',
      'Forgetting equivalent authorization checks on WebSocket gateways and background job triggers.',
    ],
    securityPerformanceNotes: [
      'Verify JWT signature, issuer, audience, and expiry before trusting principal claims.',
      'Pair route guards with tenant-scoped service queries and negative cross-tenant integration tests.',
    ],
    relatedLessonIds: ['15.02.04'],
    canonicalUrl: 'https://docs.nestjs.com/guards',
  },
  {
    id: 'redis-set',
    matchCategories: ['Redis & BullMQ'],
    matchTitles: ['SET', 'SET EX'],
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
    relatedLessonIds: [],
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

