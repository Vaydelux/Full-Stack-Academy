import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const names=["react-props","react-children","react-conditional","react-list-identity","react-render-commit","react-events","react-profile-capstone","react-state-snapshots","react-batched-updates","react-derived-state","react-immutable-updates","react-state-identity","react-lift-state","react-reducer","react-stale-closures"];
test('all new React learner starters fail their own acceptance tests (negative gate)',{timeout:300000},()=>{
 for(const name of names){
  const result=spawnSync(process.execPath,['--import','tsx','--test','labs/'+name+'/solution.test.mjs'],{
   cwd:root,env:{...process.env,ACADEMY_LAB_TARGET:'starter'},encoding:'utf8',timeout:25000
  });
  assert.equal(result.error,undefined,name+' failed to execute: '+result.error);
  assert.notEqual(result.status,0,name+' starter unexpectedly passed all checks');
  assert.match(result.stdout||'',/not ok\s+\d+/,name+' must fail a real test assertion rather than an import error');
 }
});
