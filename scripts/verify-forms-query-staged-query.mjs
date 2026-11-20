import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const button = (page, name) => page.getByRole('button', { name, exact: true });
const row = (page, title) => page.getByRole('listitem').filter({ hasText: title });
const apiList = '**/api/tasks*';
const readCache = async page => {
  await button(page, 'Inspect cache').click();
  return JSON.parse(await page.getByLabel('Query cache snapshot').textContent());
};
const pageData = title => ({ items: [{ id: title, title }], nextCursor: null });
const apiResponse = (page, method, status) => page.waitForResponse(response =>
  response.url().includes('/api/tasks') && response.request().method() === method && response.status() === status);
const toggle = page => button(page, 'Toggle lesson').click();

const labs = {
  'query-keys': async (page, variant, open) => {
    await page.route(apiList, route => route.fulfill({
      json: pageData(new URL(route.request().url()).searchParams.get('status') + ' fixture'),
    }));
    await open();
    await row(page, 'todo fixture').waitFor();
    assert.deepEqual((await readCache(page)).queries[0].key, ['tasks', { status: 'todo', limit: 10 }]);
    await page.getByLabel('Test status').selectOption('done');
    await row(page, 'done fixture').waitFor();
    assert.equal(await row(page, 'todo fixture').count(), 0);
    assert.deepEqual((await readCache(page)).queries.map(query => query.key), [
      ['tasks', { status: 'todo', limit: 10 }], ['tasks', { status: 'done', limit: 10 }],
    ]);
  },
  'stale-garbage': async (page, variant, open) => {
    await page.clock.install();
    let reads = 0;
    await page.route(apiList, route => { reads++; return route.fulfill({ json: pageData('cached') }); });
    await open();
    await page.getByText(/^1(?: task\(s\))?$/).waitFor();
    await page.clock.fastForward(2000);
    await button(page, 'Refocus queries').click();
    assert.equal(reads, 1);
    assert.deepEqual((await readCache(page)).queries[0].key, ['tasks', { limit: 10 }]);
    await page.clock.fastForward(9000);
    const refetched = apiResponse(page, 'GET', 200);
    await button(page, 'Refocus queries').click();
    await refetched;
    assert.equal(reads, 2);
    await toggle(page);
    await page.clock.fastForward(299_000);
    assert.equal((await readCache(page)).queries.length, 1);
    await page.clock.fastForward(2000);
    assert.equal((await readCache(page)).queries.length, 0);
  },
  'mutation-invalidation': async (page, variant, open) => {
    let accepted = false;
    let reads = 0;
    let posted;
    await page.route(apiList, route => {
      const request = route.request();
      if (request.method() === 'GET') {
        reads++;
        return route.fulfill({ json: pageData(accepted ? 'New after create' : 'Initial record') });
      }
      posted = request;
      if (accepted) return route.fulfill({ status: 422, json: {} });
      accepted = true;
      return route.fulfill({ status: 201, json: {} });
    });
    await open();
    await row(page, 'Initial record').waitFor();
    const submit = page.getByRole('button', { name: /^Create/ });
    const created = apiResponse(page, 'POST', 201);
    await submit.click();
    await created;
    assert.ok(posted.headers()['idempotency-key']);
    assert.equal(posted.postDataJSON().title, 'Practice cache invalidation');
    await row(page, 'New after create').waitFor();
    assert.equal(reads, 2);
    const rejected = apiResponse(page, 'POST', 422);
    await submit.click();
    await rejected;
    await submit.waitFor();
    assert.equal((await readCache(page)).mutation, 'error');
    assert.equal(reads, 2);
  },
  'optimistic-rollback': async (page, variant, open) => {
    let fail = true;
    let removed = false;
    const record = { id: 'fixture', title: 'Rollback fixture' };
    await page.route(apiList, route => route.fulfill({ json: { items: removed ? [] : [record] } }));
    let allowDelete;
    let requestStarted;
    const deleting = new Promise(resolve => { requestStarted = resolve; });
    const held = new Promise(resolve => { allowDelete = resolve; });
    await page.route('**/api/tasks/fixture', async route => {
      requestStarted();
      await held;
      if (fail) return route.fulfill({ status: 404, json: {} });
      removed = true;
      return route.fulfill({ status: 204 });
    });
    await open();
    const task = row(page, record.title);
    await task.waitFor();
    const rejected = apiResponse(page, 'DELETE', 404);
    await button(page, 'Delete').click();
    await deleting;
    try {
      if (variant === 'solution') await task.waitFor({ state: 'hidden' });
      assert.equal(await task.isVisible(), false);
    } finally {
      allowDelete();
      await rejected;
    }
    await task.waitFor();
    fail = false;
    const success = apiResponse(page, 'DELETE', 204);
    await button(page, 'Delete').click();
    await success;
    await task.waitFor({ state: 'hidden' });
  },
  'infinite-queries': async (page, variant, open, apiOrigin) => {
    const firstRead = page.waitForRequest(request => request.url().includes('/api/tasks?'));
    await open();
    assert.equal(new URL((await firstRead).url()).searchParams.get('offset'), null);
    const loadMore = button(page, 'Load more');
    await page.getByRole('listitem').nth(9).waitFor();
    await loadMore.click();
    await page.getByRole('listitem').nth(19).waitFor();
    await loadMore.click();
    await page.getByRole('listitem').nth(24).waitFor();
    const all = await page.getByRole('listitem').allTextContents();
    assert.equal(new Set(all).size, 25);
    assert.equal(await loadMore.isDisabled(), true);
    // Start a fresh view so the first page cursor can be invalidated by a write.
    await page.reload();
    await page.getByRole('listitem').nth(9).waitFor();
    await createTask(apiOrigin, 'Stale cursor fixture');
    const conflict = apiResponse(page, 'GET', 409);
    await loadMore.click();
    await conflict;
    await page.getByRole('alert').filter({ hasText: 'Pagination failed.' }).waitFor();
    await button(page, 'Restart pages').click();
    await row(page, 'Stale cursor fixture').waitFor();
  },
  'retries-cancellation': async (page, variant, open) => {
    const started = page.waitForRequest(request => request.url().includes('/api/tasks'));
    let unblock;
    const pending = new Promise(resolve => { unblock = resolve; });
    let mode = 'cancel';
    let attempts = 0;
    await page.route(apiList, async route => {
      attempts++;
      if (mode === 'cancel') {
        await pending;
        return route.fulfill({ json: pageData('late result') });
      }
      if (mode === 'network') return route.abort();
      return route.fulfill({ status: Number(mode), json: {} });
    });
    await open();
    await started;
    try {
      assert.equal(await page.evaluate(() => window.queryRequestHasSignal), true);
      await toggle(page);
      await page.waitForFunction(() => window.queryRequestAborted);
      assert.equal((await readCache(page)).queries[0].items, undefined);
    } finally { unblock(); }
    mode = '422';
    attempts = 0;
    await toggle(page);
    await page.getByRole('alert').waitFor();
    assert.equal(attempts, 1);
    for (const outcome of ['503', 'network']) {
      await toggle(page);
      mode = outcome;
      attempts = 0;
      await toggle(page);
      await page.getByRole('alert').waitFor();
      assert.equal(attempts, 3);
    }
  },
  'remote-task-capstone': async (page, variant, open) => {
    await open();
    const textbox = page.getByRole('textbox');
    await textbox.waitFor();
    const submit = page.getByRole('button', { name: variant === 'solution' ? 'Create' : 'Save', exact: true });
    if (variant === 'starter') {
      await textbox.fill('Capstone staged task');
      const badWrite = page.waitForResponse(response => response.request().method() === 'POST');
      await submit.click();
      assert.equal((await badWrite).status(), 201);
      return;
    }
    let posts = 0;
    await page.route(apiList, route => {
      if (route.request().method() === 'POST' && ++posts === 1) {
        return route.fulfill({ status: 422, json: {} });
      }
      return route.continue();
    });
    await textbox.fill('  ');
    await submit.click();
    await page.getByRole('alert').waitFor();
    assert.equal(posts, 0);
    await textbox.fill('Capstone staged task');
    await submit.click();
    await page.getByText('Request rejected; correct the input before a new create.').waitFor();
    assert.equal(await button(page, 'Retry same create').isDisabled(), true);
    const created = apiResponse(page, 'POST', 201);
    await submit.click();
    await created;
    await row(page, 'Capstone staged task').waitFor();
  },
};

async function createTask(apiOrigin, title) {
  const response = await fetch(apiOrigin + '/api/tasks', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'idempotency-key': randomUUID() },
    body: JSON.stringify({ title, priority: 'normal' }),
  });
  assert.equal(response.status, 201);
}

async function seedPaging(apiOrigin) {
  for (;;) {
    const response = await fetch(apiOrigin + '/api/tasks?limit=25');
    assert.equal(response.status, 200);
    const { items } = await response.json();
    if (!items.length) break;
    for (const { id } of items) {
      assert.equal((await fetch(apiOrigin + '/api/tasks/' + id, { method: 'DELETE' })).status, 204);
    }
  }
  for (let index = 1; index <= 25; index++) await createTask(apiOrigin, 'Staged paging fixture ' + index);
}

export async function verifyStagedQuery(browser, apiOrigin) {
  for (const [lab, verify] of Object.entries(labs)) {
    for (const variant of ['solution', 'starter']) {
      const page = await browser.newPage();
      page.setDefaultTimeout(10_000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        if (lab === 'infinite-queries' && variant === 'solution') await seedPaging(apiOrigin);
        if (lab === 'retries-cancellation') await page.addInitScript(() => {
          const fetchRequest = window.fetch;
          window.fetch = (url, options) => {
            if (typeof url === 'string' && url.startsWith('/api/tasks')) {
              window.queryRequestHasSignal = Boolean(options?.signal);
              options?.signal?.addEventListener('abort', () => { window.queryRequestAborted = true; });
            }
            return fetchRequest(url, options);
          };
        });
        const open = async () => {
          await page.goto('http://127.0.0.1:5173/qualification/?' + new URLSearchParams({ lab, variant }));
          await button(page, 'Toggle lesson').waitFor();
        };
        if (variant === 'solution') await verify(page, variant, open, apiOrigin);
        else await assert.rejects(() => verify(page, variant, open, apiOrigin), { code: 'ERR_ASSERTION' });
        assert.deepEqual(errors, [], lab + ' ' + variant + ' browser errors');
        console.log(lab + ' ' + variant + (variant === 'solution' ? ' passed' : ' failed its behavior assertion'));
      } finally { await page.close(); }
    }
  }
}
