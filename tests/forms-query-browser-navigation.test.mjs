import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyTaskBrowserPage as classify } from '../scripts/forms-query-browser-navigation.mjs';

const ready = { href: 'http://127.0.0.1:3337/', ready: 'complete', hasForm: true, body: 'Full-Stack Academy' };

test('accepts a loaded native form at the intended loopback URL', () => {
  assert.deepEqual(classify(ready), { kind: 'ready' });
  assert.deepEqual(classify({ ...ready, href: 'http://[::1]:3337/' }), { kind: 'ready' });
});

test('does not treat a loading or empty document as qualified', () => {
  assert.deepEqual(classify({ ...ready, ready: 'loading' }), { kind: 'pending' });
  assert.deepEqual(classify({ ...ready, hasForm: false }), { kind: 'pending' });
});

test('recognizes the managed-Chromium organization policy rejection', () => {
  const state = { href: 'chrome-error://chromewebdata/', ready: 'complete', hasForm: false,
    body: '127.0.0.1 is blocked\nYour organization doesn’t allow you to view this site' };
  assert.equal(classify(state).kind, 'blocked');
  assert.match(classify(state).message, /managed browser or organization policy/);
});

test('recognizes ASCII apostrophe policy block text', () => {
  const state = { href: 'chrome-error://chromewebdata/', body: "Your organization doesn't allow you to view this site" };
  assert.equal(classify(state).kind, 'blocked');
});

test('distinguishes a generic failed navigation from policy denial', () => {
  const result = classify({ href: 'chrome-error://chromewebdata/', body: 'ERR_CONNECTION_REFUSED' });
  assert.equal(result.kind, 'blocked');
  assert.match(result.message, /failed to navigate/);
});

test('classifies Edge and Firefox error document schemes as navigation failures', () => {
  for (const href of ['edge-error://blocked/', 'about:neterror?e=connectionFailure']) {
    assert.equal(classify({ href }).kind, 'blocked');
  }
});

test('rejects a form unexpectedly rendered on a non-loopback URL', () => {
  const result = classify({ ...ready, href: 'https://example.com/' });
  assert.equal(result.kind, 'blocked');
  assert.match(result.message, /unexpected URL/);
});

test('does not leak the browser page body in diagnostics', () => {
  const secret = 'PRIVATE_FIELD_SENSITIVE';
  const result = classify({ href: 'chrome-error://chromewebdata/', body: 'Your organization blocked this site '+secret });
  assert.equal(result.kind, 'blocked');
  assert.ok(!result.message.includes(secret));
});

test('handles malformed and missing CDP values without crashing', () => {
  for (const state of [undefined, null, 0, '', {}, { body: 123, href: null }, { hasForm: true, ready: 'complete' }]) {
    assert.deepEqual(classify(state), { kind: 'pending' });
  }
});

test('non-policy text about an organization does not classify as denial', () => {
  const result = classify({ href: 'about:blank', body: 'Organization profile information', ready: 'complete' });
  assert.deepEqual(result, { kind: 'pending' });
});
