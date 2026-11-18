import test from 'node:test';
import assert from 'node:assert/strict';
const target = process.env.ACADEMY_LAB_TARGET === 'starter' ? 'starter' : 'solution';
const api = await import(`./${target}/exercise.mjs`);
test('walks causes toward deepest error', () => {
  const low = new TypeError('missing config');
  const high = new Error('dashboard failed', { cause: low });
  assert.deepEqual(api.traceCauses(high), [{name:'Error',message:'dashboard failed'},{name:'TypeError',message:'missing config'}]);
});
test('handles circular causes and bounded depth',()=>{
  const a=new Error('a'),b=new Error('b'); a.cause=b;b.cause=a;
  assert.equal(api.traceCauses(a).length,2);
  assert.equal(api.traceCauses(a,1).length,1);
  assert.deepEqual(api.traceCauses(null),[]);
});
test('picks first application lab frame and ignores internal-only stacks',()=>{
  assert.equal(api.firstLabFrame('Error: bad\n at f (node:internal)\n at run (/repo/labs/error-causes/main.mjs:9:2)'), 'at run (/repo/labs/error-causes/main.mjs:9:2)');
  assert.equal(api.firstLabFrame('Error: no app\n at internal (node:internal)'),null);
});
