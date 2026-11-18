import { createServer } from 'node:net';
import { checkServerIdentity } from 'node:tls';
export function createGreetingServer() {
  return createServer(socket => socket.end('hello transport'));
}
export function transportInfo(input) {
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('HTTP(S) only');
  return { host: url.hostname, port: Number(url.port || (url.protocol === 'https:' ? 443 : 80)), encrypted: url.protocol === 'https:' };
}
export function verifyIdentity(hostname, subjectaltname) {
  const error = checkServerIdentity(hostname, { subjectaltname });
  return error ? { ok: false, code: error.code } : { ok: true };
}
