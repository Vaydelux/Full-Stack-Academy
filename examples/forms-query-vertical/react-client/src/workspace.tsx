import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TaskInputSchema, type TaskFormInput, type TaskFormOutput } from './schema';
import { tasksApi, type TaskPage, type TaskFilter, type TaskStatus } from './api';

const taskQueryRoot = ['practice-tasks'] as const;
const taskQueryKey = (status: TaskFilter) => [...taskQueryRoot, { limit: 10, status }] as const;
type CreateAttempt = { payload: TaskFormOutput; key: string };
const errorMessage = (error: unknown): string => error instanceof Error ? error.message : 'Unexpected request error';

export function TaskWorkspace() {
  const client = useQueryClient();
  const [feedback, setFeedback] = useState('');
  const [retryAttempt, setRetryAttempt] = useState<CreateAttempt | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskFilter>('all');
  const activeKey = taskQueryKey(statusFilter);
  const submissionLock = useRef(false);
  const {
    register, handleSubmit, formState: { errors, isSubmitting }, reset, setError,
  } = useForm<TaskFormInput, unknown, TaskFormOutput>({
    resolver: zodResolver(TaskInputSchema),
    mode: 'onBlur',
    defaultValues: { title: '', priority: 'normal' },
  });
  const tasks = useQuery({
    queryKey: activeKey,
    queryFn: ({ signal }) => tasksApi.list(statusFilter, signal),
  });
  const create = useMutation({
    mutationFn: ({ payload, key }: CreateAttempt) => tasksApi.create(payload, key),
    onSuccess: async () => { await client.invalidateQueries({ queryKey: taskQueryRoot }); },
  });
  const remove = useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: activeKey });
      const snapshot = client.getQueryData<TaskPage>(activeKey);
      client.setQueryData<TaskPage>(activeKey, existing => existing
        ? { ...existing, items: existing.items.filter(item => item.id !== id) }
        : existing);
      return { snapshot, key: activeKey };
    },
    onError: (error, _id, context) => {
      if (context?.snapshot) client.setQueryData(context.key, context.snapshot);
      setDeleteError(errorMessage(error));
    },
    onSettled: () => client.invalidateQueries({ queryKey: taskQueryRoot }),
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status, revision }: { id: string; status: TaskStatus; revision: number }) =>
      tasksApi.updateStatus(id, status, revision),
    onMutate: async ({ id, status }) => {
      await client.cancelQueries({ queryKey: activeKey });
      const snapshot = client.getQueryData<TaskPage>(activeKey);
      client.setQueryData<TaskPage>(activeKey, existing => existing
        ? {
            ...existing,
            items: existing.items
              .map(item => item.id === id ? { ...item, status } : item)
              .filter(item => statusFilter === 'all' || item.status === statusFilter),
          }
        : existing);
      return { snapshot, key: activeKey };
    },
    onError: (error, _variables, context) => {
      if (context?.snapshot) client.setQueryData(context.key, context.snapshot);
      setStatusError(errorMessage(error));
    },
    onSettled: () => client.invalidateQueries({ queryKey: taskQueryRoot }),
  });

  async function createAttempt(attempt: CreateAttempt) {
    if (submissionLock.current) return;
    submissionLock.current = true;
    setFeedback('Saving…');
    try {
      await create.mutateAsync(attempt);
      setRetryAttempt(null);
      setFeedback('Task created and server state refreshed.');
      reset();
    } catch (error) {
      setRetryAttempt(attempt);
      setFeedback('Request failed. Retry reuses the same idempotency key.');
      setError('root.server', { type: 'server', message: errorMessage(error) });
    } finally { submissionLock.current = false; }
  }
  const onSubmit = async (values: TaskFormOutput) => {
    await createAttempt({ payload: values, key: crypto.randomUUID() });
  };
  const showTask = (task: NonNullable<typeof tasks.data>['items'][number]) => (
    <li key={task.id} className="task">
      <div className="task-main"><strong>{task.title}</strong><span>{task.priority} · {task.status} · revision {task.revision} · {new Date(task.createdAt).toLocaleString()}</span></div>
      <button type="button" disabled={remove.isPending || changeStatus.isPending} onClick={() => {
        setStatusError('');
        const next = task.status === 'todo' ? 'doing' : task.status === 'doing' ? 'done' : 'todo';
        changeStatus.mutate({ id: task.id, status: next, revision: task.revision });
      }} aria-label={'Advance ' + task.title + ' from ' + task.status}>
        {task.status === 'todo' ? 'Start' : task.status === 'doing' ? 'Complete' : 'Reopen'}
      </button>
      <button type="button" disabled={remove.isPending || changeStatus.isPending} onClick={() => { setDeleteError(''); remove.mutate(task.id); }} aria-label={'Delete ' + task.title}>Delete</button>
    </li>
  );

  return <div className="shell">
    <header className="masthead"><strong>Full-Stack Academy</strong><span>09.02 + 09.03 · React practice</span></header>
    <main>
      <p className="eyebrow">Forms and remote data</p>
      <h1>Validate locally. Verify on the server.</h1>
      <p className="lede">This teaching app uses actual React Hook Form, Zod resolver and TanStack Query. The backing API is a loopback-only in-memory fixture, not a production backend.</p>
      <div className="columns">
        <section aria-labelledby="create-heading" className="panel">
          <h2 id="create-heading">Create a task</h2>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="task-title">Task title</label>
            <input id="task-title" placeholder="Practice optimistic rollback" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error' : 'title-help'} maxLength={100} {...register('title')} />
            {errors.title ? <p id="title-error" role="alert" className="error">{errors.title.message}</p> : <p id="title-help" className="help">Enter 3 to 100 characters.</p>}
            <label htmlFor="task-priority">Priority</label>
            <select id="task-priority" {...register('priority')}><option value="normal">Normal</option><option value="low">Low</option><option value="high">High</option></select>
            {errors.priority && <p role="alert" className="error">{errors.priority.message}</p>}
            <button className="primary" disabled={isSubmitting || create.isPending} type="submit">{isSubmitting || create.isPending ? 'Saving…' : 'Create task'}</button>
          </form>
          {errors.root?.server && <p role="alert" className="error">{errors.root.server.message}</p>}
          <p role="status" aria-live="polite" className="help">{feedback}</p>
          {retryAttempt && <button type="button" disabled={create.isPending} onClick={() => { void createAttempt(retryAttempt); }}>Retry same request safely</button>}
        </section>
        <section aria-labelledby="list-heading" className="panel">
          <div className="row"><h2 id="list-heading">Tasks from HTTP</h2><button type="button" disabled={tasks.isFetching} onClick={() => { void tasks.refetch(); }}>Refresh</button></div>
          <label htmlFor="react-status-filter">Filter remote tasks</label>
          <select id="react-status-filter" value={statusFilter} onChange={event => setStatusFilter(event.target.value as TaskFilter)}>
            <option value="all">All tasks</option><option value="todo">To do</option><option value="doing">In progress</option><option value="done">Completed</option>
          </select>
          {tasks.isPending ? <p role="status">Loading tasks…</p> : tasks.isError ? <div role="alert"><p>{errorMessage(tasks.error)}</p><button type="button" onClick={() => { void tasks.refetch(); }}>Try again</button></div> : <>
            <ul className="tasks">{tasks.data.items.map(showTask)}</ul>
            {tasks.data.items.length === 0 && <p className="help">No tasks yet. Submit the form to add one.</p>}
            {tasks.data.nextCursor && <p className="help">More pages exist. Pagination and cursor recovery are covered in the HTTP lab; this React component intentionally shows the first 10 entries.</p>}
          </>}
          {deleteError && <p role="alert" className="error">Delete failed and the cache was restored: {deleteError}</p>}
          {statusError && <p role="alert" className="error">Status change failed; the previous cache was restored: {statusError}. Refresh before retrying if the revision is stale.</p>}
          {tasks.isFetching && !tasks.isPending && <p role="status" className="help">Refreshing remote data…</p>}
        </section>
      </div>
      <section className="footnote"><h2>Things to investigate</h2><p>Change the title to whitespace, repeat a request with the same idempotency key, remove an item after the server stops, and inspect the query cache in React DevTools. Server and client validation have different responsibilities.</p></section>
    </main>
    <footer>Developer-only lab · no credentials · no durable database · no cloud sync</footer>
  </div>;
}
