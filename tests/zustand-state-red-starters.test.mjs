import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const slugs=["zustand-local-url-server","zustand-selectors-slices","zustand-persist-private","zustand-derived-subscription","zustand-multitab-revisions","zustand-url-search-state","zustand-dont-cache-records","zustand-filter-preference-capstone"];
test('eight deliberately broken Zustand starter stores fail assertions (not missing imports)',{timeout:280000},()=>{
 for(const slug of slugs){
  const result=spawnSync(process.execPath,['--import','tsx','--test','--test-reporter=tap','labs/'+slug+'/solution.test.mjs'],{
   cwd:root,encoding:'utf8',timeout:25000,env:{...process.env,NODE_TEST_CONTEXT:undefined,ACADEMY_LAB_TARGET:'starter'}
  });
  assert.equal(result.error,undefined,slug+' runner failure');
  assert.notEqual(result.status,0,slug+' starter unexpectedly passed');
  assert.match(result.stdout||'',/not ok\s+\d+/,slug+' must fail a real assertion');
  assert.match(result.stdout||'',/code:\s*['"]ERR_ASSERTION['"]/,slug+': expected AssertionError, not import/transform failure');
 }
});
