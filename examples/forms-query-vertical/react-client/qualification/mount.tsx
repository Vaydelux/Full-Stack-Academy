import { useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { focusManager, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

type Filter = 'todo' | 'done';
type LessonProps = { status: Filter; id: string };
const variants = import.meta.glob<Record<string, ComponentType<LessonProps>>>(
  '../../../../drafts/forms-query/labs/*/{starter,solution}.tsx',
);
const params = new URLSearchParams(location.search);
const lab = params.get('lab') ?? '';
const file = '../../../../drafts/forms-query/labs/' + lab + '/' + params.get('variant') + '.tsx';
const load = variants[file];
const root = document.getElementById('root');
if (!load || !root) throw new Error('Unknown staged lesson variant.');

const namedExports: Record<string, string> = {
  'stale-garbage': 'Tasks',
  'mutation-invalidation': 'CreateTask',
  'optimistic-rollback': 'DeleteButton',
  'infinite-queries': 'Pager',
  'retries-cancellation': 'TaskList',
};
const Lesson = (await load())[namedExports[lab] ?? 'default'];
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function Observer() {
  const tasks = useQuery({
    queryKey: ['tasks', { status: 'all', limit: 10 }],
    queryFn: async () => {
      const response = await fetch('/api/tasks?limit=10');
      if (!response.ok) throw new Error('Unable to load test tasks');
      return response.json() as Promise<{ items: { id: string; title: string }[] }>;
    },
  });
  return <ul aria-label="Observed tasks">{tasks.data?.items.map(task => <li key={task.id}>{task.title}</li>)}</ul>;
}

function QueryFixture() {
  const [status, setStatus] = useState<Filter>('todo');
  const [mounted, setMounted] = useState(true);
  const observesTasks = lab === 'mutation-invalidation' || lab === 'optimistic-rollback';
  return <QueryClientProvider client={queryClient}>
    {lab === 'query-keys' && <label>Test status<select value={status}
      onChange={event => setStatus(event.target.value as Filter)}>
      <option value="todo">To do</option><option value="done">Done</option>
    </select></label>}
    <button onClick={() => setMounted(value => !value)}>Toggle lesson</button>
    <button onClick={() => { focusManager.setFocused(false); focusManager.setFocused(true); }}>Refocus queries</button>
    <button onClick={() => {
      const queries = queryClient.getQueryCache().getAll();
      const latestMutation = queryClient.getMutationCache().getAll().at(-1);
      document.querySelector('output#cache')!.textContent = JSON.stringify({
        queries: queries.map(query => ({ key: query.queryKey, items: query.state.data, status: query.state.status })),
        mutation: latestMutation?.state.status,
      });
    }}>Inspect cache</button>
    <output id="cache" aria-label="Query cache snapshot" />
    {observesTasks && <Observer />}
    {mounted && <Lesson status={status} id="fixture" />}
  </QueryClientProvider>;
}

createRoot(root).render(lab.startsWith('query-') || lab in namedExports || lab === 'remote-task-capstone'
  ? <QueryFixture />
  : <Lesson status="todo" id="fixture" />);
