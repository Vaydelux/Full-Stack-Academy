import type { TaskFormOutput } from './schema';

export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'normal' | 'high';
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
  list: (signal?: AbortSignal) => request<TaskPage>('/api/tasks?limit=10', { signal }),
  create: (data: TaskFormOutput, key: string) => request<Task>('/api/tasks', {
    method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': key }, body: JSON.stringify(data),
  }),
  remove: (id: string) => {
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new TypeError('Invalid task ID');
    return request<null>(`/api/tasks/${id}`, { method: 'DELETE' });
  },
};
