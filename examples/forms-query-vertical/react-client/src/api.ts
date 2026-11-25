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

/** A success response that violates the API contract is not a confirmed write. */
export class TaskResponseError extends Error {
  constructor() {
    super('Unexpected task API response');
    this.name = 'TaskResponseError';
  }
}

const taskIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const idempotencyPattern = /^[a-zA-Z0-9_-]{8,96}$/;
function assertTaskId(id: string): void {
  if (!taskIdPattern.test(id)) throw new TypeError('Invalid task ID');
}
const cursorPattern = /^[A-Za-z0-9_-]{1,40}$/;
function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function decodeTask(value: unknown, expectedId?: string): Task {
  if (!object(value) || typeof value.id !== 'string' || !taskIdPattern.test(value.id) ||
      (expectedId !== undefined && value.id !== expectedId) ||
      typeof value.title !== 'string' || value.title.trim() !== value.title || value.title.length < 3 || value.title.length > 100 ||
      (value.priority !== 'low' && value.priority !== 'normal' && value.priority !== 'high') ||
      (value.status !== 'todo' && value.status !== 'doing' && value.status !== 'done') ||
      typeof value.revision !== 'number' || !Number.isSafeInteger(value.revision) || value.revision < 1 ||
      typeof value.createdAt !== 'string' || !Number.isFinite(Date.parse(value.createdAt))) throw new TaskResponseError();
  // Project only validated fields rather than retaining arbitrary server data.
  return { id: value.id, title: value.title, priority: value.priority, status: value.status, revision: value.revision, createdAt: value.createdAt };
}
function decodePage(value: unknown, filter: TaskFilter, cursor: string | null, limit: number): TaskPage {
  if (!object(value) || !Array.isArray(value.items) || value.items.length > limit ||
      (value.nextCursor !== null && (typeof value.nextCursor !== 'string' || !cursorPattern.test(value.nextCursor) || value.nextCursor === cursor || value.items.length === 0))) throw new TaskResponseError();
  const items = value.items.map(item => decodeTask(item));
  if (new Set(items.map(item => item.id)).size !== items.length || (filter !== 'all' && items.some(item => item.status !== filter))) throw new TaskResponseError();
  return { items, nextCursor: value.nextCursor };
}
async function request<T>(path: string, expectedStatus: number, decode: (value: unknown) => T, options: RequestInit = {}): Promise<T> {
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
  if (response.status !== expectedStatus) throw new TaskResponseError();
  if (expectedStatus === 204) return decode(null);
  if (!/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') ?? '')) throw new TaskResponseError();
  let value: unknown;
  try { value = await response.json(); }
  catch (error) {
    if (error instanceof SyntaxError) throw new TaskResponseError();
    throw error; // Preserve transport failures and intentional cancellation.
  }
  return decode(value);
}

export const tasksApi = {
  list(filter: TaskFilter, cursor: string | null = null, signal?: AbortSignal, limit = 10): Promise<TaskPage> {
    if (!['all', 'todo', 'doing', 'done'].includes(filter)) throw new TypeError('Invalid task filter');
    if (!Number.isInteger(limit) || limit < 1 || limit > 25) throw new TypeError('Invalid page size');
    if (cursor !== null && !/^[A-Za-z0-9_-]{1,40}$/.test(cursor)) throw new TypeError('Invalid page cursor');
    const params = new URLSearchParams({ limit: String(limit), status: filter });
    if (cursor !== null) params.set('cursor', cursor);
    return request('/api/tasks?' + params, 200, value => decodePage(value, filter, cursor, limit), { signal });
  },
  get(id: string, signal?: AbortSignal): Promise<Task> {
    assertTaskId(id);
    return request('/api/tasks/' + id, 200, value => decodeTask(value, id), { signal });
  },
  updateStatus(id: string, status: TaskStatus, revision: number): Promise<Task> {
    assertTaskId(id);
    if (!['todo', 'doing', 'done'].includes(status)) throw new TypeError('Invalid task status');
    if (!Number.isSafeInteger(revision) || revision < 1) throw new TypeError('Invalid task revision');
    return request('/api/tasks/' + id, 200, value => decodeTask(value, id), {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'if-match': `"${revision}"` },
      body: JSON.stringify({ status }),
    });
  },
  create(data: TaskFormOutput, key: string): Promise<Task> {
    if (!idempotencyPattern.test(key)) throw new TypeError('Invalid idempotency key');
    return request('/api/tasks', 201, value => decodeTask(value), {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'idempotency-key': key },
      body: JSON.stringify(data),
    });
  },
  remove(id: string): Promise<null> {
    assertTaskId(id);
    return request('/api/tasks/' + id, 204, () => null, { method: 'DELETE' });
  },
};
