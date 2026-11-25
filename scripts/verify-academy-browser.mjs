import { runBoundedChild } from './bounded-child.mjs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
const hostname = '127.0.0.1';
const server = createServer();
let app;
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

const draftOnly = process.argv.length === 3 && process.argv[2] === '--draft-preview';
const nestModule = process.argv.length === 4 && process.argv[2] === '--nest-module' && /^11\.0[1-4]$/.test(process.argv[3]) ? process.argv[3] : null;
if (process.argv.length > (nestModule ? 4 : draftOnly ? 3 : 2)) throw new Error('Usage: node scripts/verify-academy-browser.mjs [--draft-preview | --nest-module 11.01]');

try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, hostname, resolve);
  });
  const port = server.address().port;
  app = require('next')({ dev: false, dir: root, hostname, port });
  await app.prepare();
  server.on('request', app.getRequestHandler());
  const smokeScript = fileURLToPath(new URL(nestModule ? './nest-browser-smoke.mjs' : draftOnly ? './forms-query-draft-preview-browser-runner.mjs' : './browser-smoke.mjs', import.meta.url));
  await runBoundedChild(process.execPath, [smokeScript], {
    cwd: root,
    env: { ...process.env, ACADEMY_BASE_URL: 'http://' + hostname + ':' + port, ...(nestModule ? { ACADEMY_NEST_MODULE: nestModule } : {}) },
    stdio: 'inherit',
    windowsHide: true,
    timeoutMs: 300_000,
  });
} finally {
  try {
    if (server.listening) await new Promise(resolve => {
      server.close(resolve);
      server.closeAllConnections();
    });
  } finally {
    await app?.close();
  }
}
