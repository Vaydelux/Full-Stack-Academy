import test from 'node:test';
import assert from 'node:assert/strict';
import { accountResponse as safeResponse } from '../drafts/nestjs/labs/structured-responses/solution.ts';
import { accountResponse as unsafeResponse } from '../drafts/nestjs/labs/structured-responses/starter.ts';
import { withRequest as safeContext, requestId as safeId } from '../drafts/nestjs/labs/request-context/solution.ts';
import { withRequest as unsafeContext, requestId as unsafeId } from '../drafts/nestjs/labs/request-context/starter.ts';

function verifyProjection(project) {
  const account = Object.freeze({ id: 'a', displayName: 'Student', passwordHash: 'fake-hash', internalNote: 'private' });
  const result = project(account);
  assert.deepEqual(JSON.parse(JSON.stringify(result)), { id: 'a', displayName: 'Student' });
  assert.notEqual(result, account);
  assert.equal(account.passwordHash, 'fake-hash');
}
test('11.02.06 allowlisted public DTO projects extra fields without mutating source', () => {
  verifyProjection(safeResponse);
  assert.throws(() => verifyProjection(unsafeResponse), { code: 'ERR_ASSERTION' });
});
async function nested(withRequest, requestId) {
  return withRequest('outer', async () => {
    const before = requestId();
    const inner = await withRequest('inner', async () => { await Promise.resolve(); return requestId(); });
    return [before, inner, requestId()];
  });
}
test('11.02.07 nested context restores the outer ID after an await', async () => {
  assert.deepEqual(await nested(safeContext, safeId), ['outer', 'inner', 'outer']);
  assert.equal(safeId(), undefined);
  await assert.rejects(async () => assert.deepEqual(await nested(unsafeContext, unsafeId), ['outer', 'inner', 'outer']), { code: 'ERR_ASSERTION' });
});
async function rejectedNested(withRequest, requestId) {
  return withRequest('outer', async () => {
    await assert.rejects(withRequest('inner', async () => { await Promise.resolve(); throw Error('deliberate'); }), /deliberate/);
    return requestId();
  });
}
test('11.02.07 context restores outer scope after nested rejection', async () => {
  assert.equal(await rejectedNested(safeContext, safeId), 'outer');
  assert.equal(safeId(), undefined);
  await assert.rejects(async () => assert.equal(await rejectedNested(unsafeContext, unsafeId), 'outer'), { code: 'ERR_ASSERTION' });
});
test('11.02.07 independent rejection leaves no active context', async () => {
  await assert.rejects(safeContext('failed', async () => { throw Error('deliberate'); }), /deliberate/);
  assert.equal(safeId(), undefined);
  await assert.rejects(unsafeContext('failed', async () => { throw Error('deliberate'); }), /deliberate/);
  assert.throws(() => assert.equal(unsafeId(), undefined), { code: 'ERR_ASSERTION' });
});
