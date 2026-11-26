import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const source=read('scripts/forms-query-p1-report.mjs');
test('both candidate audits contribute to P1 source readiness and checkpoint date',()=>{
 assert.match(source,/inspectRHFPublicationCandidates\(\)/);
 assert.match(source,/inspectQueryPublicationCandidates\(\)/);
 assert.match(source,/sourceReady:errors.length===0/);
 assert.match(source,/date:checkpoint.updatedAt/);
 assert.match(source,/structuralErrors:\[\.\.\.audit.sourceErrors/);
});
test('status JSON reports both modules independently without asserting real browser execution',()=>{
 const result=spawnSync(process.execPath,['scripts/forms-query-p1-report.mjs','--json'],{
  encoding:'utf8',timeout:30000
 });
 assert.equal(result.status,0,result.stderr);
 const report=JSON.parse(result.stdout);
 assert.equal(report.modules.length,2);
 assert.equal(report.rhfCandidatePacks,8);
 assert.equal(report.queryCandidatePacks,8);
 assert.equal(report.claimedRuntimeOrA11yExecution,false);
 assert.equal(report.queryRuntimeBrowserQualified,false);
 for(const courseModule of report.modules){
  assert.equal(courseModule.topics,8);
  assert.equal(courseModule.candidatePacks,8);
  assert.equal(courseModule.sourceReady,courseModule.candidateErrors.length===0&&
   courseModule.blockers.every(b=>!b.startsWith('No valid staged')));
 }
 const checkpoint=JSON.parse(read('docs/checkpoint.json'));
 assert.equal(report.date,checkpoint.updatedAt);
 assert.ok(typeof report.next==='string'&&report.next.length>30);
});
