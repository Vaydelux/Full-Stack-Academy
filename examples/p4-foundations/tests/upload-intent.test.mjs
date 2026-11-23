import test from 'node:test';
import assert from 'node:assert/strict';
import { createDocumentUploadIntent } from './upload-intent.mjs';

const alpha = Object.freeze({ userId: '11111111-1111-4111-8111-111111111111', tenantId: 'alpha', canWrite: true });
const beta = Object.freeze({ userId: '22222222-2222-4222-8222-222222222222', tenantId: 'beta', canWrite: true });
const payload = Object.freeze({ documentId: '33333333-3333-4333-8333-333333333333', byteLength: 900, contentType: 'application/pdf' });
const build = (actor = alpha, body = payload) => createDocumentUploadIntent(actor, body);

test('server-verified actor determines owner and PENDING private path', () => {
  assert.deepEqual(build(), { tenantId: 'alpha', ownerId: alpha.userId,
    objectPath: alpha.userId + '/' + payload.documentId + '.pdf', contentType: 'application/pdf',
    declaredBytes: 900, status: 'PENDING' });
});
test('different verified users get disjoint object paths', () => {
  assert.notEqual(build().objectPath, build(beta).objectPath);
});
test('reject unverified or unauthorized actors', () => {
  for (const actor of [null, {}, { ...alpha, canWrite: false }, { ...alpha, userId: '../alpha' }, { ...alpha, tenantId: '../beta' }]) {
    assert.throws(() => build(actor), /Forbidden/);
  }
});
test('reject forged tenant and owner override properties', () => {
  for (const field of ['tenantId', 'ownerId', 'objectPath', 'upsert', 'bucket']) {
    assert.throws(() => build(alpha, { ...payload, [field]: 'beta' }), /Invalid upload intent/);
  }
});
test('reject traversal and malformed document identifiers', () => {
  for (const id of ['../file', '/root/secret.pdf', 'alpha', '', 33]) {
    assert.throws(() => build(alpha, { ...payload, documentId: id }), /Invalid upload intent/);
  }
});
test('reject invalid size or non-integer byte values', () => {
  for (const size of [0, -1, NaN, Infinity, 5 * 1024 * 1024 + 1, '900', 0.5]) {
    assert.throws(() => build(alpha, { ...payload, byteLength: size }), /Invalid upload intent/);
  }
});
test('allow exact maximum declared bytes but never more', () => {
  assert.equal(build(alpha, { ...payload, byteLength: 5 * 1024 * 1024 }).status, 'PENDING');
});
test('reject MIME spoofing and missing required fields', () => {
  assert.throws(() => build(alpha, { ...payload, contentType: 'text/html' }), /Invalid upload intent/);
  assert.throws(() => build(alpha, { ...payload, contentType: 'image/png' }), /Invalid upload intent/);
  assert.throws(() => build(alpha, { documentId: payload.documentId }), /Invalid upload intent/);
  assert.throws(() => build(alpha, null), /Invalid upload intent/);
});
