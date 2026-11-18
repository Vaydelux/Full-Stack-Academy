export async function solve(){const out=['sync'];out.push('timer');queueMicrotask(()=>out.push('microtask'));await Promise.resolve();return out;}
