import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const names=["react-testing-library-intro","react-accessible-queries","react-user-journey","react-profiler-diagnosis","react-memo-evidence","react-usememo-callback-cost","react-concurrent-rendering","react-unstable-keys-capstone"];
test("React performance starters fail acceptance",{timeout:240000},()=>{
 for(const name of names){
  const result=spawnSync(process.execPath,['--import','tsx','--test','labs/'+name+'/solution.test.mjs'],{
   cwd:root,env:{...process.env,ACADEMY_LAB_TARGET:'starter'},encoding:'utf8',timeout:25000
  });
  assert.equal(result.error,undefined,name+': failed to run');
  assert.notEqual(result.status,0,name+': starter unexpectedly passed');
  assert.match(result.stdout||'',/not ok\s+\d+/,name+': expected a genuine assertion failure');
 }
});
