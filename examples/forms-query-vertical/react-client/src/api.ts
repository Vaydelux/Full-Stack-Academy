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
export class TaskRequestError extends Error {
  constructor(readonly status: number, message: string) { super(message); this.name = 'TaskRequestError'; }
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options, credentials: 'same-origin', cache: 'no-store', redirect: 'error',
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
  list: (filter: TaskFilter, signal?: AbortSignal) => request<TaskPage>('/api/tasks?limit=10&status=' + filter, { signal }),
  get: (id: string) => {
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new TypeError('Invalid task ID');
    return request<Task>('/api/tasks/' + id);
  },
  updateStatus: (id: string, status: TaskStatus, revision: number) => {
    if (!/^[0-9a-f-]{36}$/.test(id) || !Number.isSafeInteger(revision) || revision < 1) throw new TypeError('Invalid revision or task ID');
    return request<Task>('/api/tasks/' + id, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'if-match': `"${revision}"` },
      body: JSON.stringify({ status }),
    });
  },
  create: (data: TaskFormOutput, key: string) => request<Task>('/api/tasks', {
    method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': key }, body: JSON.stringify(data),
  }),
  remove: (id: string) => {
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new TypeError('Invalid task ID');
    return request<null>(`/api/tasks/${id}`, { method: 'DELETE' });
  },
};
