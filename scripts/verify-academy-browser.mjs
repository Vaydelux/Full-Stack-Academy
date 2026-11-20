import { spawn } from 'node:child_process';
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

try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, hostname, resolve);
  });
  const port = server.address().port;
  app = require('next')({ dev: false, dir: root, hostname, port });
  await app.prepare();
  server.on('request', app.getRequestHandler());
  const draftOnly = process.argv.length === 3 && process.argv[2] === '--draft-preview';
  if (process.argv.length > (draftOnly ? 3 : 2)) throw new Error('Usage: node scripts/verify-academy-browser.mjs [--draft-preview]');
  const smokeScript = fileURLToPath(new URL(draftOnly ? './forms-query-draft-preview-browser-runner.mjs' : './browser-smoke.mjs', import.meta.url));
  await new Promise((resolve, reject) => {
    const smoke = spawn(process.execPath, [smokeScript], {
      cwd: root,
      env: { ...process.env, ACADEMY_BASE_URL: 'http://' + hostname + ':' + port },
      stdio: 'inherit',
      windowsHide: true,
      timeout: 300_000,
    });
    smoke.once('error', reject);
    smoke.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error('Academy browser smoke failed: ' + (signal ?? code)));
    });
  });
} finally {
  try {
    if (server.listening) await new Promise(resolve => server.close(resolve));
  } finally {
    await app?.close();
  }
}
