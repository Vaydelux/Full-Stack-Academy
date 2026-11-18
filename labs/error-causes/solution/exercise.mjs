export function traceCauses(error, maxDepth = 8) {
  const chain = [], seen = new Set();
  let current = error;
  while (current instanceof Error && !seen.has(current) && chain.length < maxDepth) {
    seen.add(current);
    chain.push({ name: current.name, message: current.message });
    current = current.cause;
  }
  return chain;
}
export function firstLabFrame(stack) {
  return String(stack ?? '').split('\n').slice(1)
    .map(line => line.trim())
    .find(line => line.includes('/labs/') || line.includes('\\labs\\')) ?? null;
}
