import test from 'node:test';
import assert from 'node:assert/strict';
const target = process.env.ACADEMY_LAB_TARGET === 'starter' ? 'starter' : 'solution';
const api = await import(`./${target}/exercise.mjs`);
test('reduces a known failure to its smallest contiguous trigger',()=>{
  const fails=s=>s.includes('BUG');
  const result=api.minimizeRepro('helloBUGworld',fails);
  assert.equal(result,'BUG');
  assert.equal(fails(result),true);
  for(let i=0;i<result.length;i++)assert.equal(fails(result.slice(0,i)+result.slice(i+1)),false);
});
test('requires an actual bounded failing sample',()=>{
  assert.throws(()=>api.minimizeRepro('good',s=>s.includes('BUG')));
  assert.throws(()=>api.minimizeRepro('x'.repeat(2001),()=>true));
});
test('handles a one-character reproducer',()=>{
  assert.equal(api.minimizeRepro('abcXdef', s=>s.includes('X')),'X');
});
