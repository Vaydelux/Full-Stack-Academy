import { lookup } from 'node:dns/promises';
export function inspect(input) {
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('HTTP(S) only');
  return {hostname: url.hostname, protocol: url.protocol, port: url.port || (url.protocol === 'https:' ? '443' : '80'), path: url.pathname};
}
export async function resolveHost(hostname, resolver = lookup) {
  return await resolver(hostname, { all: true });
}
export async function diagnose(hostname, resolver = lookup) {
  try { return { ok: true, addresses: await resolveHost(hostname, resolver) }; }
  catch (error) { return { ok: false, reason: error.code === 'ENOTFOUND' ? 'name-not-found' : 'lookup-failed' }; }
}
