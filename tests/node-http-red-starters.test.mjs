import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const slugs=["node-event-loop-order","node-env-signals","node-stream-buffer-limit","node-fetch-abort","node-path-containment","node-memory-cpu-metrics","node-graceful-lifecycle","node-streaming-upload","http-method-status","http-accept-json","http-safe-json","http-idempotency-retry","http-filter-page","http-rfc9457-problem","http-etag-conditional","http-local-rest-contract"];
test('all 16 Node/HTTP broken starters fail actual assertions rather than loader errors',{timeout:360000},()=>{
 for(const slug of slugs){
  const proc=spawnSync(process.execPath,['--test','--test-reporter=tap','labs/'+slug+'/solution.test.mjs'],{
   cwd:root,encoding:'utf8',timeout:20000,env:{...process.env,NODE_TEST_CONTEXT:undefined,ACADEMY_LAB_TARGET:'starter'},
  });
  assert.equal(proc.error,undefined,slug+' runner error');
  assert.notEqual(proc.status,0,slug+' starter unexpectedly passed');
  assert.match(proc.stdout??'',/not ok\s+\d+/,slug+' should fail a test');
  assert.match(proc.stdout??'',/code:\s*['"]ERR_ASSERTION['"]/,slug+' must fail an assertion, not an import/module error');
 }
});
