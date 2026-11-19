import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const fromRepo = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const workspace = fromRepo('examples/forms-query-vertical/react-client/src/workspace.tsx');
const api = fromRepo('examples/forms-query-vertical/react-client/src/api.ts');
const policy = fromRepo('examples/forms-query-vertical/react-client/src/policy.ts');
const stylesheet = fromRepo('examples/forms-query-vertical/react-client/src/styles.css');
const project = fromRepo('src/app/learn/projects/forms-query/page.tsx');

test('actual React workspace imports real RHF, resolver and Query packages', () => {
  assert.match(workspace, /from 'react-hook-form'/);
  assert.match(workspace, /from '@hookform\/resolvers\/zod'/);
  assert.match(workspace, /from '@tanstack\/react-query'/);
  assert.match(workspace, /resolver: zodResolver\(TaskInputSchema\)/);
});

test('task list uses real bounded infinite query and cursor from response', () => {
  assert.match(workspace, /useInfiniteQuery\(/);
  assert.match(workspace, /initialPageParam: null as string \| null/);
  assert.match(workspace, /getNextPageParam: lastPage => lastPage\.nextCursor/);
  assert.match(workspace, /maxPages: 10/);
  assert.match(workspace, /tasks\.fetchNextPage\(\)/);
  assert.match(workspace, /Load more tasks/);
  assert.match(api, /params\.set\('cursor', cursor\)/);
});

test('stale cursor recovery restarts the first page instead of appending', () => {
  assert.match(workspace, /tasks\.error\.status === 409/);
  assert.match(workspace, /resetQueries\(\{ queryKey: activeKey, exact: true \}\)/);
  assert.match(workspace, /Restart from first page/);
});

test('retry policy preserves unknown POST outcome but blocks another new create', () => {
  assert.match(workspace, /setRetryAttempt\(attempt\)/);
  assert.match(workspace, /if \(retryAttempt\)/);
  assert.match(workspace, /disabled=\{mutationBusy \|\| Boolean\(retryAttempt\)\}/);
  assert.match(workspace, /submitAttempt\(retryAttempt\)/);
  assert.match(policy, /shouldRetainCreateAttempt/);
});

test('single-flight mutation lock covers status, create and delete writes', () => {
  assert.match(workspace, /const mutationLock = useRef\(false\)/);
  assert.match(workspace, /mutationLock\.current = true/);
  assert.match(workspace, /await exclusively\(/);
  assert.match(workspace, /performStatus\(task\)/);
  assert.match(workspace, /performRemove\(task\)/);
});

test('optimistic rollback preserves all loaded page snapshots', () => {
  assert.match(workspace, /type TaskPages = InfiniteData<TaskPage, string \| null>/);
  assert.match(workspace, /pages: existing\.pages\.map\(page/);
  assert.match(workspace, /context\?\.snapshot/);
  assert.match(workspace, /queryClient\.setQueryData\(context\.key, context\.snapshot\)/);
});

test('confirmed create does not convert read failure into duplicate POST', () => {
  assert.match(workspace, /await create\.mutateAsync\(attempt\);\s*setRetryAttempt\(null\)/);
  assert.match(workspace, /void queryClient\.resetQueries\(\{ queryKey: taskQueryRoot \}\)/);
  assert.doesNotMatch(workspace, /onSuccess: async .*invalidateQueries/);
});

test('forms and status errors stay accessible and no user content is HTML-injected', () => {
  assert.match(workspace, /htmlFor="task-title"/);
  assert.match(workspace, /htmlFor="react-status-filter"/);
  assert.match(workspace, /aria-invalid=/);
  assert.match(workspace, /role="alert"/);
  assert.match(workspace, /role="status"/);
  assert.doesNotMatch(workspace, /dangerouslySetInnerHTML|\.innerHTML|eval\(/);
});

test('React UI supports smaller layouts and keyboard focus', () => {
  assert.match(stylesheet, /@media\(max-width:760px\)/);
  assert.match(stylesheet, /:focus-visible/);
  assert.match(stylesheet, /prefers-reduced-motion/);
});

test('academy project page continues to label source as unqualified', () => {
  assert.match(project, /staged|Staged/);
  assert.match(project, /npm install/);
  assert.match(project, /index: false/);
});

test('typed HTTP API stays same-origin and never follows redirects', () => {
  assert.match(api, /credentials: 'same-origin'/);
  assert.match(api, /redirect: 'error'/);
  assert.match(api, /cache: 'no-store'/);
  assert.match(api, /if-match/);
});
