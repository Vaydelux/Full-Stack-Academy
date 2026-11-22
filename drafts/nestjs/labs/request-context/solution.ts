import { AsyncLocalStorage } from 'node:async_hooks';
const context = new AsyncLocalStorage<{ id: string }>();
export async function withRequest<T>(id: string, work: () => Promise<T>): Promise<T> {
  return context.run({ id }, work);
}
export const requestId = () => context.getStore()?.id;
