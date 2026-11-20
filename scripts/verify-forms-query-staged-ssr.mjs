import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { copyFile, cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');
const drafts = new URL('../drafts/forms-query/labs/ssr-hydration/', import.meta.url);
const fixtureRoot = fileURLToPath(new URL('../examples/forms-query-vertical/', import.meta.url));
const host = '127.0.0.1';

async function buildFixture(dir) {
  const app = path.join(dir, 'app');
  const scope = path.join(dir, 'node_modules', '@tanstack');
  await mkdir(scope, { recursive: true });
  // Keep Next and the fixture on the academy's single React installation.
  for (const name of ['react-query', 'query-core']) {
    await cp(path.join(fixtureRoot, 'react-client', 'node_modules', '@tanstack', name),
      path.join(scope, name), { recursive: true });
  }
  await writeFile(path.join(dir, 'package.json'), '{"private":true}\n');
  await mkdir(path.join(app, 'solution'), { recursive: true });
  await mkdir(path.join(app, 'starter'), { recursive: true });
  await mkdir(path.join(app, 'api', 'tasks'), { recursive: true });
  for (const file of ['starter.tsx', 'solution.tsx', 'task-list.tsx', 'providers.tsx']) {
    await copyFile(new URL(file, drafts), path.join(app, file));
  }
  await writeFile(path.join(app, 'solution', 'page.tsx'), [
    "export const dynamic = 'force-dynamic';",
    "export { default } from '../solution';",
  ].join('\n'));
  await writeFile(path.join(app, 'starter', 'page.tsx'), [
    "import Providers from '../providers';",
    "import Starter from '../starter';",
    "export const dynamic = 'force-dynamic';",
    'export default function Page() { return <Providers><Starter /></Providers>; }',
  ].join('\n'));
  await writeFile(path.join(app, 'layout.tsx'), [
    "import type { ReactNode } from 'react';",
    "import HydrationMarker from './hydration-marker';",
    'export default function Layout({ children }: { children: ReactNode }) {',
    '  return <html lang="en"><body>{children}<HydrationMarker /></body></html>;',
    '}',
  ].join('\n'));
  await writeFile(path.join(app, 'hydration-marker.tsx'), [
    "'use client';",
    "import { useEffect } from 'react';",
    'export default function HydrationMarker() {',
    "  useEffect(() => { document.documentElement.dataset.hydrated = 'true'; }, []);",
    '  return null;',
    '}',
  ].join('\n'));
  await writeFile(path.join(app, 'api', 'tasks', 'route.ts'), [
    'export async function GET(request: Request) {',
    "  return fetch('http://127.0.0.1:3337/api/tasks' + new URL(request.url).search, { cache: 'no-store' });",
    '}',
  ].join('\n'));
  await new Promise((resolve, reject) => {
    const build = spawn(process.execPath, [nextBin, 'build', '--webpack', dir], {
      cwd: dir,
      env: { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' },
      stdio: 'inherit',
      windowsHide: true,
      timeout: 180_000,
    });
    build.once('error', reject);
    build.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error('SSR hydration fixture build failed: ' + (signal ?? code)));
    });
  });
}

export async function verifyStagedSsr(browser, apiOrigin) {
  const title = 'Next hydration fixture ' + randomUUID();
  const seed = await fetch(apiOrigin + '/api/tasks', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'idempotency-key': randomUUID() },
    body: JSON.stringify({ title, priority: 'normal' }),
  });
  assert.equal(seed.status, 201);

  const dir = await mkdtemp(path.join(fixtureRoot, '.ssr-qualification-'));
  const server = createServer();
  const previousNodeEnv = process.env.NODE_ENV;
  let app;
  try {
    await buildFixture(dir);
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, host, resolve);
    });
    const port = server.address().port;
    process.env.NODE_ENV = 'production';
    app = require('next')({ dir, dev: false, hostname: host, port });
    await app.prepare();
    server.on('request', app.getRequestHandler());
    const base = 'http://' + host + ':' + port;
    for (const variant of ['solution', 'starter']) {
      const response = await fetch(base + '/' + variant);
      assert.equal(response.status, 200, variant + ' HTML request');
      const html = await response.text();
      if (variant === 'solution') assert.ok(html.includes(title), 'Prefetched title missing from server HTML');
      else assert.throws(() => assert.ok(html.includes(title)), { code: 'ERR_ASSERTION' });

      const page = await browser.newPage();
      const errors = [];
      const clientRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => {
        if (new URL(request.url()).pathname === '/api/tasks') clientRequests.push(request.url());
      });
      try {
        await page.goto(base + '/' + variant);
        await page.locator('html[data-hydrated=true]').waitFor({ state: 'attached' });
        await page.getByRole('listitem').filter({ hasText: title }).waitFor();
        assert.deepEqual(errors, []);
        assert.equal(clientRequests.length, variant === 'solution' ? 0 : 1);
        console.log('ssr-hydration ' + variant + (variant === 'solution'
          ? ' server-rendered and hydrated a fresh Query cache without a browser fetch'
          : ' failed its prefetch assertion and required a browser fetch'));
      } finally { await page.close(); }
    }
  } finally {
    try {
      if (server.listening) await new Promise(resolve => server.close(resolve));
      await app?.close();
    } finally {
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousNodeEnv;
      // mkdtemp creates this directory inside the explicitly selected example root.
      if (path.dirname(path.resolve(dir)) !== path.resolve(fixtureRoot)) {
        throw new Error('Refusing to remove an SSR fixture outside the example directory.');
      }
      await rm(dir, { recursive: true, force: true, maxRetries: 3 });
    }
  }
}
