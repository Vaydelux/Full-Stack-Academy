import { useRef, useState } from 'react';
import { taskQueryRoot, taskQueryKey, nextTaskStatus, shouldRetainCreateAttempt, shouldRetryRead } from './policy';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { TaskInputSchema, type TaskFormInput, type TaskFormOutput } from './schema';
import {
  tasksApi, TaskRequestError, type Task, type TaskPage, type TaskFilter, type TaskStatus,
} from './api';

type TaskPages = InfiniteData<TaskPage, string | null>;
type CreateAttempt = { payload: TaskFormOutput; key: string };
type UpdateAttempt = { id: string; status: TaskStatus; revision: number };

const message = (error: unknown): string => error instanceof Error ? error.message : 'Unexpected request failure';

/**
 * A real RHF + TanStack Query teaching integration, intentionally limited to
 * one mutation at a time. The server stores only 100 tasks and this client
 * caches at most ten 10-record pages per status filter.
 */
export function TaskWorkspace() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState('');
  const [retryAttempt, setRetryAttempt] = useState<CreateAttempt | null>(null);
  const [taskError, setTaskError] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskFilter>('all');
  const [operationPending, setOperationPending] = useState(false);
  const mutationLock = useRef(false);
  const activeKey = taskQueryKey(statusFilter);

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
    reset, setError, clearErrors,
  } = useForm<TaskFormInput, unknown, TaskFormOutput>({
    resolver: zodResolver(TaskInputSchema),
    mode: 'onBlur',
    defaultValues: { title: '', priority: 'normal' },
  });

  const tasks = useInfiniteQuery({
    queryKey: activeKey,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) => tasksApi.list(statusFilter, pageParam, signal),
    getNextPageParam: lastPage => lastPage.nextCursor,
    maxPages: 10,
    retry: (count, error) => shouldRetryRead(count, error),
  });
  const records = tasks.data?.pages.flatMap(page => page.items) ?? [];

  const create = useMutation({
    mutationFn: (attempt: CreateAttempt) => tasksApi.create(attempt.payload, attempt.key),
    retry: false,
  });

  const remove = useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    retry: false,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: taskQueryRoot });
      const snapshot = queryClient.getQueryData<TaskPages>(activeKey);
      queryClient.setQueryData<TaskPages>(activeKey, existing => existing
        ? { ...existing, pages: existing.pages.map(page => ({
            ...page, items: page.items.filter(item => item.id !== id),
          })) }
        : existing);
      return { snapshot, key: activeKey };
    },
    onError: (error, _id, context) => {
      if (context?.snapshot) queryClient.setQueryData(context.key, context.snapshot);
      setTaskError('Delete failed; the removed task was restored. ' + message(error));
    },
    onSettled: () => { void queryClient.resetQueries({ queryKey: taskQueryRoot }); },
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status, revision }: UpdateAttempt) => tasksApi.updateStatus(id, status, revision),
    retry: false,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: taskQueryRoot });
      const snapshot = queryClient.getQueryData<TaskPages>(activeKey);
      queryClient.setQueryData<TaskPages>(activeKey, existing => existing
        ? { ...existing, pages: existing.pages.map(page => ({
            ...page, items: page.items
              .map(item => item.id === id ? { ...item, status } : item)
              .filter(item => statusFilter === 'all' || item.status === statusFilter),
          })) }
        : existing);
      return { snapshot, key: activeKey };
    },
    onError: (error, _attempt, context) => {
      if (context?.snapshot) queryClient.setQueryData(context.key, context.snapshot);
      setTaskError(
        error instanceof TaskRequestError && error.status === 412
          ? 'Task changed elsewhere. The list was restored; refresh to get the newest revision.'
          : 'Status change failed; the list was restored. ' + message(error),
      );
    },
    onSettled: () => { void queryClient.resetQueries({ queryKey: taskQueryRoot }); },
  });

  // This single synchronous lock prevents two kinds of optimistic update from
  // overwriting each other's snapshots while HTTP requests are pending.
  async function exclusively(operation: () => Promise<void>) {
    if (mutationLock.current) return;
    mutationLock.current = true;
    setOperationPending(true);
    try { await operation(); }
    finally {
      mutationLock.current = false;
      setOperationPending(false);
    }
  }

  async function submitAttempt(attempt: CreateAttempt) {
    await exclusively(async () => {
      clearErrors('root.server');
      setFeedback('Creating task…');
      try {
        await create.mutateAsync(attempt);
        setRetryAttempt(null);
        reset();
        setFeedback('Task created; fetching the latest server list.');
        // Read failures must not turn a confirmed 201 create into an
        // "unconfirmed" POST that users could accidentally repeat.
        void queryClient.resetQueries({ queryKey: taskQueryRoot });
      } catch (error) {
        setError('root.server', { type: 'server', message: message(error) });
        if (shouldRetainCreateAttempt(error)) {
          setRetryAttempt(attempt);
          setFeedback('The result is unconfirmed. Retry with the SAME operation key.');
        } else {
          setRetryAttempt(null);
          setFeedback('The server rejected this operation. Correct the input before trying again.');
        }
      }
    });
  }

  const onSubmit = async (values: TaskFormOutput) => {
    if (retryAttempt) {
      setFeedback('Resolve the previous unconfirmed create by retrying or discarding it before creating another.');
      return;
    }
    await submitAttempt({ payload: values, key: crypto.randomUUID() });
  };

  async function performStatus(task: Task) {
    const status = nextTaskStatus(task.status);
    await exclusively(async () => {
      setTaskError('');
      try { await changeStatus.mutateAsync({ id: task.id, status, revision: task.revision }); }
      catch { /* mutation onError restores the snapshot and reports the conflict */ }
    });
  }

  async function performRemove(task: Task) {
    await exclusively(async () => {
      setTaskError('');
      try { await remove.mutateAsync(task.id); }
      catch { /* mutation onError restores the snapshot and reports the failure */ }
    });
  }

  const mutationBusy = operationPending || isSubmitting || create.isPending || remove.isPending || changeStatus.isPending;
  const listConflict = tasks.error instanceof TaskRequestError && tasks.error.status === 409;

  return <div className="shell">
    <header className="masthead"><strong>Full-Stack Academy</strong><span>09.02 + 09.03 · React practice</span></header>
    <main>
      <p className="eyebrow">Forms and remote data</p>
      <h1>Validate locally. Verify on the server.</h1>
      <p className="lede">Practice real React Hook Form, Zod resolver and TanStack Query against a local, in-memory HTTP API. There are no accounts, production persistence or hosted endpoints.</p>
      <div className="columns">
        <section aria-labelledby="create-heading" className="panel">
          <h2 id="create-heading">Create a task</h2>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="task-title">Task title</label>
            <input id="task-title" placeholder="Practice reliable mutation recovery" maxLength={100}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : 'title-help'} {...register('title')}/>
            {errors.title
              ? <p id="title-error" role="alert" className="error">{errors.title.message}</p>
              : <p id="title-help" className="help">Enter 3–100 characters.</p>}
            <label htmlFor="task-priority">Priority</label>
            <select id="task-priority" {...register('priority')}>
              <option value="normal">Normal</option><option value="low">Low</option><option value="high">High</option>
            </select>
            {errors.priority && <p role="alert" className="error">{errors.priority.message}</p>}
            <button className="primary" disabled={mutationBusy || Boolean(retryAttempt)} type="submit">
              {mutationBusy ? 'Saving…' : 'Create task'}
            </button>
          </form>
          {errors.root?.server && <p role="alert" className="error">{errors.root.server.message}</p>}
          <p role="status" aria-live="polite" className="help">{feedback}</p>
          {retryAttempt && <div className="row">
            <button type="button" disabled={mutationBusy} onClick={() => { void submitAttempt(retryAttempt); }}>
              Retry same request safely
            </button>
            <button type="button" disabled={mutationBusy} onClick={() => {
              setRetryAttempt(null);
              clearErrors('root.server');
              setFeedback('Unconfirmed attempt discarded. A new create may duplicate a task the server already accepted.');
            }}>Discard unconfirmed attempt</button>
          </div>}
        </section>
        <section aria-labelledby="list-heading" className="panel">
          <div className="row">
            <h2 id="list-heading">Tasks from HTTP</h2>
            <button type="button" disabled={tasks.isFetching || mutationBusy} onClick={() => {
              void queryClient.resetQueries({ queryKey: activeKey, exact: true });
            }}>Refresh from start</button>
          </div>
          <label htmlFor="react-status-filter">Filter remote tasks</label>
          <select id="react-status-filter" value={statusFilter} disabled={mutationBusy}
            onChange={event => setStatusFilter(event.target.value as TaskFilter)}>
            <option value="all">All tasks</option><option value="todo">To do</option>
            <option value="doing">In progress</option><option value="done">Completed</option>
          </select>
          {tasks.isPending ? <p role="status">Loading tasks…</p> : <div>
            <ul className="tasks">{records.map(task => <li key={task.id} className="task">
              <div className="task-main"><strong>{task.title}</strong>
                <span>{task.priority} · {task.status} · revision {task.revision} · {new Date(task.createdAt).toLocaleString()}</span>
              </div>
              <button type="button" disabled={mutationBusy} onClick={() => { void performStatus(task); }}
                aria-label={'Change status of ' + task.title}>
                {task.status === 'todo' ? 'Start' : task.status === 'doing' ? 'Complete' : 'Reopen'}
              </button>
              <button type="button" disabled={mutationBusy} onClick={() => { void performRemove(task); }}
                aria-label={'Delete ' + task.title}>Delete</button>
            </li>)}</ul>
            {!tasks.isError && records.length === 0 && <p className="help">No tasks for this filter.</p>}
            {tasks.hasNextPage && <button type="button" disabled={mutationBusy || tasks.isFetchingNextPage}
              onClick={() => { void tasks.fetchNextPage(); }}>
              {tasks.isFetchingNextPage ? 'Loading more…' : 'Load more tasks'}
            </button>}
            <p className="help">{records.length} records displayed. Pages are bounded and discarded on server mutations.</p>
          </div>}
          {tasks.isError && <div role="alert" className="error">
            <p>{listConflict
              ? 'The task list changed during pagination. Restart from page one.'
              : 'Unable to read the latest tasks: ' + message(tasks.error)}</p>
            <button type="button" onClick={() => {
              void queryClient.resetQueries({ queryKey: activeKey, exact: true });
            }}>Restart from first page</button>
          </div>}
          {taskError && <p role="alert" className="error">{taskError}</p>}
          {tasks.isFetching && !tasks.isPending && <p role="status" className="help">Refreshing remote state…</p>}
        </section>
      </div>
      <section className="footnote"><h2>What to investigate</h2>
        <p>Try whitespace-only titles, a dropped POST response, two competing edits with one revision, a 409 stale page cursor, and a rejected optimistic delete. The server, not the React cache, is authoritative.</p>
      </section>
    </main>
    <footer>Developer-only lab · no credentials · no durable database · no cloud synchronization</footer>
  </div>;
}
