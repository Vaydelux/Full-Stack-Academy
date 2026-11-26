import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOfflineMatrix} from '../scripts/offline-contract.mjs';
const phase=['test:release-gate-coverage','test:mdx:expressions','audit:mdx:expressions','test:forms-query-resilience','test:curriculum-readiness','test:publication-phases','test:p4-source','test:p5-bundle','test:p6-quality-source','test:p6-operations-source','test:p6-runtime','test:p7-source','test:p7-runtime','test:late-phase','test:p8-learning','test:p8-reference','test:p8-ui','test:course-roadmap','test:f17-discovery','test:f18','test:f19','lint','typecheck','test','build'];
const p5=['test:p5-security','test:p5-postgresql-source','test:p5-rls-source','test:p5-curriculum-source','test:p5-httpdb-source','test:p5-container-source','test:p5-evidence-source','test:p5-cache-jobs','test:p5-distributed-source','test:p5-redis-source','test:p5-realtime-labs','test:p5-realtime-source','test:p5-integrations-labs','test:p5-integrations-source','test:p5-integrations-http','test:p5-postgres-search-source','test:p5-webhook-integrity','test:p5-durable-inbox','test:p5-durable-http','test:p5-multiprocess-inbox','test:p5-postgres-inbox-source'];
const scripts=Object.fromEntries([...phase,...p5].map(name=>[name,'node --test source.test.mjs']));
scripts['test:p5-bundle']=p5.map(name=>'npm run '+name).join(' && ');
const source=(steps=phase)=>`import {requireReleaseNodeRuntime} from './release-runtime.mjs';\nconst steps = [\n${steps.map(x=>`  '${x}',`).join('\n')}\n];\nrequireReleaseNodeRuntime(process.version);`;
const run=(changes={})=>auditOfflineMatrix({offlineSource:source(),scripts,...changes});
const expect=(report,text)=>assert.ok(report.errors.some(x=>x.includes(text)),JSON.stringify(report.errors));
test('valid source-only coverage matrix',()=>{const r=run();assert.equal(r.ok,true,JSON.stringify(r.errors));assert.equal(r.requiredP5Count,21);});
test('no P5 bundle in full gate is rejected',()=>expect(run({offlineSource:source(phase.filter(x=>x!=='test:p5-bundle'))}),'missing-required-release-step:test:p5-bundle'));
test('no P5 HTTP test in bundle is rejected',()=>expect(run({scripts:{...scripts,'test:p5-bundle':scripts['test:p5-bundle'].replace('npm run test:p5-integrations-http','npm run test:p5-security')}}),'missing-p5-substep:npm run test:p5-integrations-http'));
test('no webhook integrity gate in bundle is rejected',()=>expect(run({scripts:{...scripts,'test:p5-bundle':scripts['test:p5-bundle'].replace(' && npm run test:p5-webhook-integrity','')}}),'missing-p5-substep:npm run test:p5-webhook-integrity'));
test('no release Node guard is rejected',()=>expect(run({offlineSource:source().replace('requireReleaseNodeRuntime(process.version);','')}),'missing-node24-guard'));
test('missing release step script is rejected',()=>{const broken={...scripts};delete broken['build'];expect(run({scripts:broken}),'missing-script:build');});
test('duplicate release steps are rejected',()=>expect(run({offlineSource:source([...phase,'build'])}),'duplicate-release-step'));
test('dynamic step execution is rejected',()=>expect(run({offlineSource:source().replace("'build',","getExternalCommand(),")}),'dynamic-or-unsupported-release-step'));
test('missing static steps list rejected',()=>expect(run({offlineSource:'export const something = []'}),'missing-static-step-list'));
test('P5 injected chained shell command rejected',()=>expect(run({scripts:{...scripts,'test:p5-bundle':scripts['test:p5-bundle']+' && echo dangerous'}}),'unsafe-p5-bundle-command'));
test('P5 duplicate script rejected',()=>expect(run({scripts:{...scripts,'test:p5-bundle':scripts['test:p5-bundle']+' && npm run test:p5-security'}}),'duplicate-p5-substep'));
test('no published registry write implied by source audit',()=>assert.equal(phase.includes('promote:forms-query:rhf'),false));

test('missing encrypted inbox source tests blocks release',()=>expect(run({scripts:{...scripts,'test:p5-bundle':scripts['test:p5-bundle'].replace(' && npm run test:p5-durable-inbox','')}}),'missing-p5-substep:npm run test:p5-durable-inbox'));
test('missing durable HTTP restart tests blocks release',()=>expect(run({scripts:{...scripts,'test:p5-bundle':scripts['test:p5-bundle'].replace(' && npm run test:p5-durable-http','')}}),'missing-p5-substep:npm run test:p5-durable-http'));

test('missing interprocess race tests blocks release',()=>expect(run({scripts:{...scripts,'test:p5-bundle':scripts['test:p5-bundle'].replace(' && npm run test:p5-multiprocess-inbox','')}}),'missing-p5-substep:npm run test:p5-multiprocess-inbox'));

test('missing transactional PostgreSQL inbox tests blocks release',()=>expect(run({scripts:{...scripts,'test:p5-bundle':scripts['test:p5-bundle'].replace(' && npm run test:p5-postgres-inbox-source','')}}),'missing-p5-substep:npm run test:p5-postgres-inbox-source'));

for(const step of ['test:p6-quality-source','test:p6-operations-source','test:p7-source'])test('missing '+step+' blocks release',()=>expect(run({offlineSource:source(phase.filter(x=>x!==step))}),'missing-required-release-step:'+step));

test('missing P1 resilience regression group blocks release',()=>expect(run({offlineSource:source(phase.filter(x=>x!=='test:forms-query-resilience'))}),'missing-required-release-step:test:forms-query-resilience'));

for(const step of ['test:p8-learning','test:p8-reference','test:p8-ui'])test('missing '+step+' blocks release',()=>expect(run({offlineSource:source(phase.filter(x=>x!==step))}),'missing-required-release-step:'+step));

test('missing late-phase qualification plan blocks offline gate',()=>expect(run({offlineSource:source(phase.filter(x=>x!=='test:late-phase'))}),'missing-required-release-step:test:late-phase'));

test('missing real distributed service source checks blocks offline verification',()=>expect(run({scripts:{...scripts,'test:p5-bundle':scripts['test:p5-bundle'].replace(' && npm run test:p5-distributed-source','')}}),'missing-p5-substep:npm run test:p5-distributed-source'));

test('missing real P6 runtime tests blocks offline gate',()=>expect(run({offlineSource:source(phase.filter(x=>x!=='test:p6-runtime'))}),'missing-required-release-step:test:p6-runtime'));

test('missing P7 runtime acceptance suite blocks release',()=>expect(run({offlineSource:source(phase.filter(x=>x!=='test:p7-runtime'))}),'missing-required-release-step:test:p7-runtime'));

for(const step of ['test:course-roadmap','test:f17-discovery','test:f18','test:f19'])test('missing '+step+' blocks release',()=>expect(run({offlineSource:source(phase.filter(x=>x!==step))}),'missing-required-release-step:'+step));

for(const step of ['test:mdx:expressions','audit:mdx:expressions'])test('missing '+step+' blocks release',()=>expect(run({offlineSource:source(phase.filter(x=>x!==step))}),'missing-required-release-step:'+step));
