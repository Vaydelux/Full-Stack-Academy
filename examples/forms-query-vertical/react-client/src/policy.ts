import { TaskRequestError } from './api.ts';
import type { TaskFilter, TaskStatus } from './api.ts';

/** Stable, non-secret cache identity for the bounded local task list. */
export const taskQueryRoot = ['practice-tasks'] as const;
export function taskQueryKey(status: TaskFilter) {
  if (!['all', 'todo', 'doing', 'done'].includes(status)) throw new TypeError('Invalid task filter');
  return [...taskQueryRoot, { status, limit: 10, mode: 'infinite' }] as const;
}

/** A state transition must remain inspectable and deterministic. */
export function nextTaskStatus(status: TaskStatus): TaskStatus {
  switch (status) {
    case 'todo': return 'doing';
    case 'doing': return 'done';
    case 'done': return 'todo';
    default: throw new TypeError('Invalid task status');
  }
}

/**
 * A received terminal HTTP response proves a request was rejected: it must
 * not be offered as an ambiguous-success idempotent create retry.
 * Network failures and 5xx can be ambiguous and must retain the SAME key.
 */
export function shouldRetainCreateAttempt(error: unknown): boolean {
  return !(error instanceof TaskRequestError) || error.status === 429 || error.status >= 500;
}

/** Intentional read cancellation is not a transport fault. Never retry terminal errors. */
export function shouldRetryRead(count: number, error: unknown): boolean {
  if (error !== null && typeof error === 'object' && 'name' in error && error.name === 'AbortError') return false;
  return Number.isInteger(count) && count >= 0 && count < 1 && shouldRetainCreateAttempt(error);
}
