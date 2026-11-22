let currentRequestId = '';
export async function withRequest<T>(id: string, work: () => Promise<T>) {
  currentRequestId = id; // BUG: shared across concurrent requests
  return work();
}
export const requestId = () => currentRequestId;
