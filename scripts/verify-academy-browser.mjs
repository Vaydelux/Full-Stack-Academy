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

const readingOnly = process.argv.length === 3 && process.argv[2] === '--reading';
const responsiveOnly = process.argv.length === 3 && process.argv[2] === '--responsive';
const releaseBoundaries = process.argv.length === 3 && process.argv[2] === '--release-boundaries';
const draftOnly = process.argv.length === 3 && process.argv[2] === '--draft-preview';
const nestModule = process.argv.length === 4 && process.argv[2] === '--nest-module' && /^11\.0[1-4]$/.test(process.argv[3]) ? process.argv[3] : null;
const pgModule = process.argv.length === 4 && process.argv[2] === '--postgres-module' && /^12\.0[12]$/.test(process.argv[3]) ? process.argv[3] : null;
if (process.argv.length > (nestModule || pgModule ? 4 : draftOnly || readingOnly || responsiveOnly || releaseBoundaries ? 3 : 2)) throw new Error('Usage: node scripts/verify-academy-browser.mjs [--reading | --responsive | --release-boundaries | --draft-preview | --nest-module 11.01 | --postgres-module 12.01]');

// Next installs its own uncaught-exception handlers; do not let a failed
// child assertion or teardown escape as a swallowed top-level rejection.
try {
  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, hostname, resolve);
    });
    const port = server.address().port;
    app = require('next')({ dev: false, dir: root, hostname, port });
    await app.prepare();
    server.on('request', app.getRequestHandler());
    const smokeScript = fileURLToPath(new URL(nestModule || pgModule ? './nest-browser-smoke.mjs' : draftOnly ? './forms-query-draft-preview-browser-runner.mjs' : readingOnly ? './reading-edition-browser-smoke.mjs' : responsiveOnly ? './f17-ux-browser-smoke.mjs' : releaseBoundaries ? './f20-release-browser-smoke.mjs' : './browser-smoke.mjs', import.meta.url));
    await runBoundedChild(process.execPath, [smokeScript], {
      cwd: root,
      env: { ...process.env, ACADEMY_BASE_URL: 'http://' + hostname + ':' + port, ...(nestModule || pgModule ? { ACADEMY_MODULE_REVIEW: nestModule || pgModule, ACADEMY_NEST_MODULE: nestModule ?? '' } : {}) },
      stdio: 'inherit',
      windowsHide: true,
      timeoutMs: readingOnly ? 1_800_000 : 300_000,
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
} catch (error) {
  console.error('Browser qualification failed:', error);
  process.exitCode = 1;
}
