import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
import path from 'node:path';
test('resolves a relative path with spaces',()=>{const root=path.resolve('workspace');assert.equal(api.within(root,'my files/a.txt'),path.join(root,'my files','a.txt'));});
test('rejects absolute and parent traversal paths',()=>{const root=path.resolve('workspace');assert.throws(()=>api.within(root,'../escape'));assert.throws(()=>api.within(root,path.resolve('outside')));assert.equal(api.within(root,'..safe/file'),path.join(root,'..safe','file'));});
