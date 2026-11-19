import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const slugs=["security-proxy-tls","security-cors-csrf","security-session-cookies","security-request-limiter","security-body-size","security-ssrf-allowlist","security-log-redaction","security-insecure-endpoint","openapi-document-layout","openapi-request-response","openapi-bearer-schemes","openapi-operation-ids","openapi-generate-client","openapi-contract-compat","openapi-version-strategy","openapi-generated-client-capstone"];
test('all 16 security/OpenAPI red starters fail genuine assertions, not imports',{timeout:360000},()=>{
 for(const slug of slugs){
  const result=spawnSync(process.execPath,['--test','labs/'+slug+'/solution.test.mjs'],{
   cwd:root,encoding:'utf8',timeout:20000,env:{...process.env,ACADEMY_LAB_TARGET:'starter'},
  });
  assert.equal(result.error,undefined,slug+' test runtime error');
  assert.notEqual(result.status,0,slug+' intentionally broken learner unexpectedly passes');
  assert.match(result.stdout??'',/not ok\s+\d+/,slug+' should fail a test');
  assert.match(result.stdout??'',/code:\s*['"]ERR_ASSERTION['"]/,slug+' must fail a real assertion, not a module/loader error');
 }
});
