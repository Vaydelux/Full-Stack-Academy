import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock, DocNotice, DocShell } from '@/components/course/DocShell';

export const metadata: Metadata = {
  title: 'Reliable Task Workflow Project | Full-Stack Academy',
  description: 'A local-only project for forms, remote state, conditional updates, request validation and HTTP conflict recovery.',
  robots: { index: false, follow: true },
};

const repository = 'https://github.com/Vaydelux/Full-Stack-Academy/blob/main/examples/forms-query-vertical';
const steps = [
  { title: 'Validate and submit', copy: 'Client constraints make errors helpful, while strict server validation rejects untrusted inputs. Use a fresh idempotency key for a new task.', output: 'POST /api/tasks → 201 Created, or 422 Invalid task' },
  { title: 'Fetch and filter', copy: 'Read the current server list with a bounded page size and an optional status filter. Each list revision has its own pagination cursors.', output: 'GET /api/tasks?status=todo → 200 TaskPage' },
  { title: 'Change task status safely', copy: 'Read the current revision, then send an If-Match precondition with PATCH. Only one competing update against a given revision can win.', output: 'PATCH /api/tasks/{id} → 200, 412 stale revision, or 428 missing precondition' },
  { title: 'Recover from conflicts', copy: 'A stale cursor means a write occurred; start pagination again. A stale task edit means someone else won; read fresh state before a new edit.', output: 'GET or PATCH → 409 or 412, then refresh' },
  { title: 'Inspect the lifecycle', copy: 'The browser demo has a bounded request journal that shows operations and outcomes without storing task payloads or idempotency secrets.', output: 'GET → POST → GET → PATCH → GET → DELETE' },
];

export default function FormsQueryProjectPage() {
  return (
    <DocShell>
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500">
        <Link href="/learn" className="hover:underline">Curriculum</Link>{' / '}
        <Link href="/learn/projects" className="hover:underline">Practice projects</Link>{' / '}Reliable Task Workflow
      </nav>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-300">Project · 09.02 React Hook Form + 09.03 TanStack Query</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Reliable Task Workflow</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        Learn the boundary between form data, remote server truth and local interface state by exercising real HTTP validation, idempotency, optimistic concurrency and retry behavior.
      </p>
      <div className="mt-6">
        <DocNotice>
          <strong>Local developer project, not a hosted API.</strong> The server stores everything in memory, binds only to loopback and does not have authentication or durable storage. Do not expose it to the internet. The separate React example still requires a real npm install, typecheck and browser review before its parent lessons can be published.
        </DocNotice>
      </div>
      <section aria-labelledby="run-project" className="mt-9">
        <h2 id="run-project" className="text-xl font-bold">1. Start the tested Node practice server</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">With the repository checked out on your device and Node.js 22 or later available, run this command from the repository root. There are no third-party dependencies for the native browser interface.</p>
        <CodeBlock file="Terminal · repository root" code="node examples/forms-query-vertical/task-api.mjs" />
        <p className="text-sm">Open <code className="rounded bg-slate-200 px-1 dark:bg-white/10">http://127.0.0.1:3337/</code> in a browser running on the same machine.</p>
        <h3 className="mt-6 text-base font-bold">Optional separate React client (requires package installation)</h3>
        <CodeBlock file="Second terminal · local machine" code={'cd examples/forms-query-vertical/react-client\nnpm install\nnpm run typecheck\nnpm run dev'} />
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">Visit <code className="rounded bg-slate-200 px-1 dark:bg-white/10">http://127.0.0.1:5173/</code> only after those commands pass. The React package lockfile and browser qualification are still outstanding; the app should not be considered ready merely because source exists.</p>
      </section>
      <section aria-labelledby="flow" className="mt-10">
        <h2 id="flow" className="text-xl font-bold">2. Follow the request lifecycle</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.title} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.035]">
              <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Step {index+1}</p>
              <h3 className="mt-2 font-bold">{step.title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">{step.copy}</p>
              <code className="mt-3 block overflow-x-auto rounded-lg bg-slate-100 p-2 text-[11px] leading-5 dark:bg-black/25">{step.output}</code>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="test-project" className="mt-10">
        <h2 id="test-project" className="text-xl font-bold">3. Verify the HTTP contracts locally</h2>
        <CodeBlock file="Terminal · repository root" code={'node --test tests/forms-query-http.test.mjs\nnode --test tests/forms-query-workflow.test.mjs\nnode --test tests/forms-query-contract.test.mjs'} />
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">The workflow suite covers stale revision rejection, invalid input, list cursor/filter isolation and spoofed Host rejection. The OpenAPI suite checks the documented request/response shape. A successful test run is separate from React browser acceptance.</p>
      </section>
      <section aria-labelledby="resources" className="mt-10 border-t border-slate-200 pt-7 dark:border-white/10">
        <h2 id="resources" className="text-xl font-bold">Source, exercises and references</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-cyan-700 dark:text-cyan-300">
          <li><a href={repository + '/README.md'} target="_blank" rel="noopener noreferrer" className="hover:underline">Full runbook and safety boundaries</a></li>
          <li><a href={repository + '/WORKBOOK.md'} target="_blank" rel="noopener noreferrer" className="hover:underline">16-topic guided workbook</a></li>
          <li><a href={repository + '/task-workflow.openapi.json'} target="_blank" rel="noopener noreferrer" className="hover:underline">OpenAPI 3.1 request and response contract</a></li>
          <li><a href="https://react-hook-form.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">React Hook Form documentation</a></li>
          <li><a href="https://tanstack.com/query/latest/docs/framework/react/overview" target="_blank" rel="noopener noreferrer" className="hover:underline">TanStack Query documentation</a></li>
        </ul>
        <Link href="/learn" className="mt-7 inline-block text-sm font-semibold text-slate-700 underline hover:text-cyan-700 dark:text-slate-200 dark:hover:text-cyan-300">Return to curriculum</Link>
      </section>
    </DocShell>
  );
}
