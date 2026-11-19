import type { TaskFormOutput } from './schema';

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskFilter = 'all' | TaskStatus;
export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'normal' | 'high';
  status: TaskStatus;
  revision: number;
  createdAt: string;
}
export interface TaskPage { items: Task[]; nextCursor: string | null }

/**
 * HTTP errors are differentiated from transport failures so query retries
 * never indiscriminately repeat validation or stale-cursor failures.
 * Avoid TypeScript parameter properties so Node 22 can execute this file
 * with --experimental-strip-types for real HTTP contract tests.
 */
export class TaskRequestError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'TaskRequestError';
    this.status = status;
  }
}

const taskIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const idempotencyPattern = /^[a-zA-Z0-9_-]{8,96}$/;
function assertTaskId(id: string): void {
  if (!taskIdPattern.test(id)) throw new TypeError('Invalid task ID');
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    cache: 'no-store',
    redirect: 'error',
    headers: { accept: 'application/json', ...options.headers },
  });
  if (!response.ok) {
    const problem: unknown = await response.json().catch(() => null);
    const title = problem && typeof problem === 'object' && 'title' in problem && typeof problem.title === 'string'
      ? problem.title : `HTTP ${response.status}`;
    throw new TaskRequestError(response.status, title);
  }
  return (response.status === 204 ? null : await response.json()) as T;
}

export const tasksApi = {
  list(filter: TaskFilter, cursor: string | null = null, signal?: AbortSignal, limit = 10): Promise<TaskPage> {
    if (!['all', 'todo', 'doing', 'done'].includes(filter)) throw new TypeError('Invalid task filter');
    if (!Number.isInteger(limit) || limit < 1 || limit > 25) throw new TypeError('Invalid page size');
    if (cursor !== null && !/^[A-Za-z0-9_-]{1,40}$/.test(cursor)) throw new TypeError('Invalid page cursor');
    const params = new URLSearchParams({ limit: String(limit), status: filter });
    if (cursor !== null) params.set('cursor', cursor);
    return request<TaskPage>('/api/tasks?' + params, { signal });
  },
  get(id: string, signal?: AbortSignal): Promise<Task> {
    assertTaskId(id);
    return request<Task>('/api/tasks/' + id, { signal });
  },
  updateStatus(id: string, status: TaskStatus, revision: number): Promise<Task> {
    assertTaskId(id);
    if (!['todo', 'doing', 'done'].includes(status)) throw new TypeError('Invalid task status');
    if (!Number.isSafeInteger(revision) || revision < 1) throw new TypeError('Invalid task revision');
    return request<Task>('/api/tasks/' + id, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'if-match': `"${revision}"` },
      body: JSON.stringify({ status }),
    });
  },
  create(data: TaskFormOutput, key: string): Promise<Task> {
    if (!idempotencyPattern.test(key)) throw new TypeError('Invalid idempotency key');
    return request<Task>('/api/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'idempotency-key': key },
      body: JSON.stringify(data),
    });
  },
  remove(id: string): Promise<null> {
    assertTaskId(id);
    return request<null>('/api/tasks/' + id, { method: 'DELETE' });
  },
};
