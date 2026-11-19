/** Fetch client with an injected fetch implementation for isolated tests. */

export class TaskHttpError extends Error {
  constructor(status, title) { super(title); this.name = 'TaskHttpError'; this.status = status; }
}
export function createTaskClient(baseUrl, fetchImpl = globalThis.fetch) {
  const base = new URL(baseUrl);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new TypeError('Unsafe API base URL');
  if (typeof fetchImpl !== 'function') throw new TypeError('fetch implementation required');
  async function request(path, init) {
    const url = new URL(path, base);
    if (url.origin !== base.origin) throw new TypeError('Cross-origin API request');
    const response = await fetchImpl(url, { ...init, redirect: 'error', cache: 'no-store', headers: { accept: 'application/json', ...init?.headers } });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new TaskHttpError(response.status, typeof data?.title === 'string' ? data.title : `HTTP ${response.status}`);
    }
    return response.status === 204 ? null : response.json();
  }
  return {
    health: (signal) => request('/api/health', { signal }),
    list: ({ cursor = null, limit = 10, signal } = {}) => {
      if (!Number.isInteger(limit) || limit < 1 || limit > 25) throw new TypeError('limit must be between 1 and 25');
      const params = new URLSearchParams({ limit: String(limit) });
      if (cursor !== null) params.set('cursor', cursor);
      return request(`/api/tasks?${params}`, { signal });
    },
    create: (input, { key = globalThis.crypto.randomUUID(), signal } = {}) => request('/api/tasks', {
      method: 'POST', signal,
      headers: { 'content-type': 'application/json', 'idempotency-key': key },
      body: JSON.stringify(input),
    }),
    remove: (id, { signal } = {}) => {
      if (!/^[0-9a-f-]{36}$/.test(id)) throw new TypeError('Invalid task ID');
      return request(`/api/tasks/${id}`, { method: 'DELETE', signal });
    },
  };
}
