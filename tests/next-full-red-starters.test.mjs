import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const names=["next-server-client-boundary","next-rsc-request-lifecycle","next-serialization-projection","next-server-action-authorization","next-route-handler-bff","next-suspense-streaming","next-server-only-secrets","next-accidental-client-import","next-fetch-behavior","next-explicit-cache-boundary","next-cache-tags","next-cache-revalidation","next-private-cache-risks","next-rendering-strategies","next-cache-debugging","next-publish-revalidate-capstone","next-semantic-metadata","next-canonical-og","next-sitemap-robots","next-jsonld-safe","next-images-fonts-lcp","next-core-web-vitals","next-content-architecture","next-seo-audit-capstone","next-environment-separation","next-proxy-host-guard","next-image-assets","next-node-edge-runtime","next-error-redaction","next-diagnostic-triage","next16-migration-audit","next-tenant-cache-leak"];
test('32 intentionally broken Next 16 learner starters fail real assertions, not import errors',{timeout:720000},()=>{
 for(const name of names){
  const result=spawnSync(process.execPath,['--import','tsx','--test','--test-reporter=tap','labs/'+name+'/solution.test.mjs'],{
   cwd:root,encoding:'utf8',timeout:25000,env:{...process.env,NODE_TEST_CONTEXT:undefined,ACADEMY_LAB_TARGET:'starter'}
  });
  assert.equal(result.error,undefined,name+' failed to spawn');
  assert.notEqual(result.status,0,name+' starter unexpectedly passed');
  assert.match(result.stdout||'',/not ok\s+\d+/,name+' should fail a test, not module import');
  assert.match(result.stdout||'',/code:\s*['"]ERR_ASSERTION['"]/,name+': expected AssertionError, not import/transform failure');
 }
});
