import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const names=["react-render-purity","react-external-effect","react-effect-cleanup","react-effect-dependencies","react-ref-mutable","react-dom-ref-focus","react-avoid-effect","react-timer-keyboard","react-context-provider","react-custom-hook","react-use-transition","react-use-deferred-value","react-use-optimistic","react-use-action-state","react-error-suspense","react-optimistic-capstone"];
test('advanced React starters fail their intended assertions, not module loading',{timeout:360000},()=>{
 for(const name of names) {
  const result=spawnSync(process.execPath,['--import','tsx','--test','--test-reporter=tap','labs/'+name+'/solution.test.mjs'],{
   cwd:root,env:{...process.env,NODE_TEST_CONTEXT:undefined,ACADEMY_LAB_TARGET:'starter'},encoding:'utf8',timeout:30000
  });
  assert.equal(result.error,undefined,name+': spawn failed');
  assert.notEqual(result.status,0,name+': starter unexpectedly satisfies all acceptance assertions');
  assert.match(result.stdout||'',/not ok\s+\d+/,name+': must show a test assertion failure');
  assert.match(result.stdout||'',/code:\s*['"]ERR_ASSERTION['"]/,name+': expected AssertionError, not import/transform failure');
 }
});
