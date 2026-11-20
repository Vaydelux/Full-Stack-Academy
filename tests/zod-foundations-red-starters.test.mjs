import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const slugs=["zod-object-primitives","zod-safeparse-issues","zod-optional-defaults","zod-cross-field-refine","zod-transform-coerce","zod-discriminated-requests","zod-composition-types","zod-profile-form"];
test('eight Zod learner starters fail real schema assertions and never pass accidentally',{timeout:240000},()=>{
 for(const slug of slugs){
  const result=spawnSync(process.execPath,['--import','tsx','--test','--test-reporter=tap','labs/'+slug+'/solution.test.mjs'],{
   cwd:root,encoding:'utf8',timeout:25000,
   env:{...process.env,NODE_TEST_CONTEXT:undefined,ACADEMY_LAB_TARGET:'starter'},
  });
  assert.equal(result.error,undefined,slug+' test runner failed');
  assert.notEqual(result.status,0,slug+' starter unexpectedly passes');
  assert.match(result.stdout||'',/not ok\s+\d+/,slug+' should fail an assertion, not only fail to import');
  assert.match(result.stdout||'',/code:\s*['"]ERR_ASSERTION['"]/,slug+': expected AssertionError, not import/transform failure');
 }
});
