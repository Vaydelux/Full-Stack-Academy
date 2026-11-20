import assert from 'node:assert/strict';

const save = page => page.getByRole('button', { name: 'Save', exact: true });
const values = page => page.locator('input').evaluateAll(inputs => inputs.map(input => input.value));
const waitForSubmission = async (page, count = 1) => {
  await page.waitForFunction(expected => window.lessonSubmissions.length >= expected, count);
  return page.evaluate(() => window.lessonSubmissions.at(-1));
};
const focusIsInput = page => page.locator('input').first().evaluate(input => input === document.activeElement);

async function mockTasks(page, respond) {
  await page.route('**/api/tasks', route => respond(route));
}

const labs = {
  'controlled-uncontrolled': async (page, variant) => {
    const input = page.getByRole('textbox');
    await input.fill('Practice HTTP');
    await save(page).click();
    if (variant === 'starter') {
      assert.equal((await waitForSubmission(page)).title, 'Practice HTTP');
      return;
    }
    await page.getByText('Practice HTTP', { exact: true }).waitFor();
    for (const [value, message] of [['', 'Enter a task title'], ['no', 'Enter at least 3 characters']]) {
      await input.fill(value);
      await save(page).click();
      await page.getByRole('alert').filter({ hasText: message }).waitFor();
      assert.equal(await page.locator('output').textContent(), 'Practice HTTP');
    }
  },
  'register-controller': async page => {
    await page.getByLabel('Review title').fill('Keyboard review');
    const rating = page.getByRole('button', { name: /rating/i });
    await rating.press('Space');
    await rating.press('Enter');
    await save(page).click();
    assert.deepEqual(await waitForSubmission(page), { title: 'Keyboard review', rating: 3 });
  },
  'zod-resolver': async (page, variant) => {
    const input = page.getByRole('textbox');
    const submit = page.getByRole('button', { name: 'Submit' });
    if (variant === 'starter') {
      await input.fill('   ');
      await submit.click();
      await waitForSubmission(page);
      assert.deepEqual(await page.evaluate(() => window.lessonSubmissions), []);
      return;
    }
    for (const value of ['   ', 'x'.repeat(101)]) {
      await input.fill(value);
      await submit.click();
      await page.getByRole('alert').waitFor();
      assert.deepEqual(await page.evaluate(() => window.lessonSubmissions), []);
    }
    await input.fill('  done ');
    await submit.click();
    assert.equal(await waitForSubmission(page), 'done');
  },
  'dynamic-field-arrays': async page => {
    const add = page.getByRole('button', { name: /^Add/ });
    await add.click();
    const fields = page.getByRole('textbox');
    for (const [index, text] of ['First', 'Middle', 'Last'].entries()) await fields.nth(index).fill(text);
    await page.getByRole('button', { name: 'Remove' }).nth(1).click();
    assert.deepEqual(await values(page), ['First', 'Last']);
    for (let index = 0; index < 6; index++) await add.click();
    assert.equal(await fields.count(), 8);
    assert.equal(await add.isDisabled(), true);
  },
  'async-submission': async (page, variant) => {
    const requests = [];
    let committedStatus;
    let sent;
    const firstSent = new Promise(resolve => { sent = resolve; });
    let release;
    const pending = new Promise(resolve => { release = resolve; });
    await mockTasks(page, async route => {
      requests.push({ key: route.request().headers()['idempotency-key'], body: route.request().postDataJSON() });
      if (requests.length === 1) {
        sent();
        await pending;
        if (variant === 'solution') {
          committedStatus = (await route.fetch()).status();
          return route.abort();
        }
        return route.fulfill({ status: 503, body: 'Response unavailable' });
      }
      if (variant === 'solution') return route.continue();
      await route.fulfill({ status: 201, json: {} });
    });
    const create = page.getByRole('button', { name: /^Create/ });
    await create.click();
    await firstSent;
    if (variant === 'solution') {
      assert.equal(await create.isDisabled(), true);
      await create.evaluate(button => button.click());
    }
    release();
    const retry = page.getByRole('button', { name: /^Retry/ });
    if (variant === 'solution') await page.getByText('Not confirmed; retry using the same key').waitFor();
    const replay = page.waitForResponse(response => response.status() === 201);
    await retry.click();
    await replay;
    if (variant === 'solution') assert.equal(committedStatus, 201);
    assert.equal(requests.length, 2);
    assert.deepEqual(requests[1], requests[0]);
  },
  'reset-dirty': async (page, variant) => {
    let status = 503;
    await mockTasks(page, route => route.fulfill({ status, json: {} }));
    await page.getByRole('textbox').fill('Keep this draft');
    const failed = page.waitForResponse(response => response.status() === 503);
    await save(page).click();
    await failed;
    if (variant === 'solution') await page.getByText('Save failed; your draft is preserved').waitFor();
    assert.deepEqual(await values(page), ['Keep this draft']);
    status = 201;
    await save(page).click();
    await page.getByText('Saved', { exact: true }).waitFor();
    assert.deepEqual(await values(page), ['']);
    assert.equal(await save(page).isDisabled(), true);
  },
  'server-error-focus': async (page, variant) => {
    let status = 422;
    let successDialogs = 0;
    page.on('dialog', async dialog => {
      successDialogs++;
      await dialog.dismiss();
    });
    await mockTasks(page, route => route.fulfill({ status, json: {} }));
    await page.getByRole('textbox').fill('Task from form');
    if (variant === 'starter') {
      const dialog = page.waitForEvent('dialog');
      await save(page).click();
      await dialog;
      assert.equal(successDialogs, 0);
      return;
    }
    await save(page).click();
    const alert = page.getByRole('alert');
    await alert.filter({ hasText: 'Title must be between 3 and 100 characters' }).waitFor();
    assert.equal(await focusIsInput(page), true);
    status = 503;
    await save(page).click();
    await alert.filter({ hasText: 'Could not save.' }).waitFor();
    assert.equal(successDialogs, 0);
  },
  'form-state-bug-hunt': async (page, variant) => {
    await page.getByRole('textbox').fill('Current field');
    const preview = page.getByText(/^Preview:/);
    if (variant === 'solution') await page.getByText('Preview: Current field').waitFor();
    assert.equal(await preview.textContent(), 'Preview: Current field');
    await save(page).click();
    assert.deepEqual(await waitForSubmission(page), { title: 'Current field' });
    await page.getByRole('button', { name: 'Use suggested title' }).click();
    await page.getByText('Preview: Suggested title').waitFor();
    assert.deepEqual(await values(page), ['Suggested title']);
    await save(page).click();
    assert.deepEqual(await waitForSubmission(page, 2), { title: 'Suggested title' });
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('[aria-live]').textContent.trim() === 'Preview:');
    assert.deepEqual(await values(page), ['']);
  },
};

export async function verifyStagedRHF(browser, { onlyLab = null, origin = 'http://127.0.0.1:5173' } = {}) {
  if (onlyLab !== null && !Object.hasOwn(labs, onlyLab)) {
    throw new Error('Unknown React Hook Form lab: ' + String(onlyLab));
  }
  const selected = onlyLab === null ? Object.entries(labs) : [[onlyLab, labs[onlyLab]]];
  for (const [lab, verify] of selected) {
    for (const variant of ['solution', 'starter']) {
      const page = await browser.newPage();
      page.setDefaultTimeout(10_000);
      const errors = [];
      // The starter examples intentionally exercise faulty behavior, but must mount successfully.
      page.on('pageerror', error => errors.push(error.message));
      try {
        await page.addInitScript(() => {
          window.lessonSubmissions = [];
          console.log = value => window.lessonSubmissions.push(value);
        });
        const search = new URLSearchParams({ lab, variant });
        await page.goto(origin + '/qualification/?' + search);
        await page.getByRole('textbox').first().waitFor();
        if (variant === 'solution') await verify(page, variant);
        else await assert.rejects(() => verify(page, variant), { code: 'ERR_ASSERTION' });
        assert.deepEqual(errors, [], lab + ' ' + variant + ' browser errors');
        console.log(lab + ' ' + variant + (variant === 'solution' ? ' passed' : ' failed its behavior assertion'));
      } finally {
        await page.close();
      }
    }
  }
}
