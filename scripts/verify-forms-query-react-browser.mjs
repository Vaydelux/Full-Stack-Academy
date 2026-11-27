import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';
import { verifyStagedRHF } from './verify-forms-query-staged-rhf.mjs';
import { verifyStagedQuery } from './verify-forms-query-staged-query.mjs';
import { verifyStagedSsr } from './verify-forms-query-staged-ssr.mjs';

const browserRoot = process.env.ACADEMY_BROWSER_ROOT;
if (!browserRoot) throw new Error('Set ACADEMY_BROWSER_ROOT to an isolated Playwright installation.');
const browserRequire = createRequire(path.resolve(browserRoot, 'package.json'));
const { chromium } = browserRequire('playwright');
const clientRoot = fileURLToPath(new URL('../examples/forms-query-vertical/react-client/', import.meta.url));
const clientRequire = createRequire(path.join(clientRoot, 'package.json'));
const { createServer } = await import(pathToFileURL(clientRequire.resolve('vite')).href);
const api = createTaskApi();
let vite;
let browser;
const passed = [];

try {
  // Use the example's documented ports so this exercises its actual Origin rewrite.
  const apiOrigin = await api.start(3337);
  vite = await createServer({
    root: clientRoot,
    resolve: { dedupe: ['react', 'react-dom', 'react-hook-form', '@hookform/resolvers', 'zod', '@tanstack/react-query'] },
    server: { fs: { allow: [clientRoot, fileURLToPath(new URL('../drafts/forms-query/', import.meta.url))] } },
  });
  await vite.listen();
  browser = await chromium.launch({
    headless: true,
    ...(process.env.ACADEMY_CHROME_BIN ? { executablePath: process.env.ACADEMY_CHROME_BIN } : {}),
  });
  const page = await browser.newPage({ viewport: { width: 320, height: 780 } });
  page.setDefaultTimeout(10_000);
  const browserErrors = [];
  page.on('pageerror', error => browserErrors.push(error.message));
  const title = page.getByLabel('Task title', { exact: true });
  const button = name => page.getByRole('button', { name, exact: true });
  const task = name => page.getByRole('listitem').filter({ hasText: name });
  const filter = page.getByLabel('Filter remote tasks');
  const waitForText = text => page.getByText(text, { exact: false }).first().waitFor();
  const waitForRevision = (name, text) => task(name).getByText(text, { exact: false }).waitFor();
  const isTaskRequest = (response, method) =>
    response.request().method() === method && new URL(response.url()).pathname.startsWith('/api/tasks');
  const directCreate = async name => {
    const response = await fetch(apiOrigin + '/api/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'idempotency-key': randomUUID() },
      body: JSON.stringify({ title: name, priority: 'normal' }),
    });
    assert.equal(response.status, 201);
    return response.json();
  };

  await page.goto('http://127.0.0.1:5173/');
  await waitForText('No tasks for this filter.');
  await title.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('alert').filter({ hasText: 'Enter at least 3 characters' }).waitFor();
  assert.equal(await title.evaluate(input => document.activeElement === input), true);
  assert.equal(await title.getAttribute('aria-invalid'), 'true');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual((await (await fetch(apiOrigin + '/api/tasks')).json()).items, []);
  passed.push('Keyboard validation, error focus and mobile layout at 320px');

  await title.fill('  Qualify React task  ');
  const created = page.waitForResponse(response => isTaskRequest(response, 'POST'));
  await button('Create task').click();
  const createResponse = await created;
  assert.equal(createResponse.status(), 201);
  // Chromium may evict a completed POST body before Playwright retrieves it
  // (Network.getResponseBody). Check the real response status above, then
  // independently verify the committed record and the rendered Query refresh.
  await waitForRevision('Qualify React task', 'todo · revision 1');
  const committedList = await fetch(apiOrigin + '/api/tasks');
  assert.equal(committedList.status, 200);
  const { items: committedItems } = await committedList.json();
  assert.equal(committedItems.length, 1, 'One browser POST must create exactly one task');
  const record = committedItems[0];
  assert.equal(record.title, 'Qualify React task');
  assert.equal(record.status, 'todo');
  assert.equal(record.revision, 1);
  assert.match(record.id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  assert.equal(await title.inputValue(), '');
  passed.push('RHF resolver, live Vite proxy, API create and Query refresh');

  const statusChanged = page.waitForResponse(response => isTaskRequest(response, 'PATCH'));
  await button('Change status of ' + record.title).click();
  assert.equal((await statusChanged).status(), 200);
  await waitForRevision(record.title, 'doing · revision 2');
  await filter.selectOption('todo');
  await waitForText('No tasks for this filter.');
  await filter.selectOption('doing');
  await waitForRevision(record.title, 'doing · revision 2');
  passed.push('Conditional status write and status-scoped list');

  const externalChange = await fetch(apiOrigin + '/api/tasks/' + record.id, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', 'if-match': '"2"' },
    body: JSON.stringify({ status: 'done' }),
  });
  assert.equal(externalChange.status, 200);
  const staleWrite = page.waitForResponse(response => isTaskRequest(response, 'PATCH'));
  await button('Change status of ' + record.title).click();
  assert.equal((await staleWrite).status(), 412);
  await waitForText('Task changed elsewhere.');
  await filter.selectOption('done');
  await waitForRevision(record.title, 'done · revision 3');
  passed.push('Stale status recovery and authoritative revision');

  await page.route('**/api/tasks/*', async route => {
    if (route.request().method() !== 'DELETE') return route.continue();
    await task(record.title).waitFor({ state: 'hidden' });
    await route.fulfill({ status: 503, json: { title: 'Temporary failure' } });
  });
  await button('Delete ' + record.title).click();
  await waitForText('Delete failed; the removed task was restored.');
  await waitForRevision(record.title, 'done · revision 3');
  await page.unroute('**/api/tasks/*');
  const deleted = page.waitForResponse(response => isTaskRequest(response, 'DELETE'));
  await button('Delete ' + record.title).click();
  assert.equal((await deleted).status(), 204);
  await waitForText('No tasks for this filter.');
  passed.push('Optimistic delete, rollback on failure and confirmed delete');

  const attemptTitle = 'Committed before network failure';
  let droppedKey;
  await page.route('**/api/tasks', async route => {
    if (route.request().method() !== 'POST') return route.continue();
    droppedKey = route.request().headers()['idempotency-key'];
    assert.equal((await route.fetch()).status(), 201);
    await route.abort();
  }, { times: 1 });
  await filter.selectOption('all');
  await title.fill(attemptTitle);
  await button('Create task').click();
  await button('Retry same request safely').waitFor();
  assert.equal(await button('Create task').isDisabled(), true);
  const replayResponse = page.waitForResponse(response => isTaskRequest(response, 'POST'));
  await button('Retry same request safely').click();
  const replay = await replayResponse;
  assert.equal(replay.status(), 201);
  assert.ok(droppedKey);
  assert.equal(replay.request().headers()['idempotency-key'], droppedKey);
  await waitForRevision(attemptTitle, 'todo · revision 1');
  const serverList = await (await fetch(apiOrigin + '/api/tasks')).json();
  assert.equal(serverList.items.filter(item => item.title === attemptTitle).length, 1);
  passed.push('Real committed POST with lost response and same-key replay');

  for (let index = 1; index <= 11; index++) await directCreate('Pagination fixture ' + index);
  await button('Refresh from start').click();
  await button('Load more tasks').waitFor();
  await directCreate('Changed while paging');
  const stalePage = page.waitForResponse(response => isTaskRequest(response, 'GET') && response.status() === 409);
  await button('Load more tasks').click();
  await stalePage;
  await waitForText('The task list changed during pagination.');
  await button('Restart from first page').click();
  await waitForRevision('Changed while paging', 'todo · revision 1');
  await button('Load more tasks').click();
  await waitForText('13 records displayed.');
  assert.deepEqual(browserErrors, []);
  passed.push('Stale cursor recovery and successful multi-page read');
  console.log(JSON.stringify({ passed, browserVersion: browser.version(), nodeVersion: process.version }, null, 2));
  await verifyStagedRHF(browser);
  await verifyStagedQuery(browser, apiOrigin);
  await verifyStagedSsr(browser, apiOrigin);
} finally {
  try {
    await browser?.close();
  } finally {
    try { await vite?.close(); }
    finally { await api.close(); }
  }
}
