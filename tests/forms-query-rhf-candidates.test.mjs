import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {inspectRHFPublicationCandidates} from '../scripts/verify-forms-query-rhf-candidates.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const audit=inspectRHFPublicationCandidates();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('all eight canonical candidate bundles and source-equivalent lab examples exist',()=>{
 assert.equal(audit.candidateCount,8);
 assert.deepEqual(audit.issues,[]);
 assert.equal(new Set(audit.records.map(x=>x.id)).size,8);
});
test('a candidate stays outside both live registries and cannot inflate 338',()=>{
 assert.ok(audit.publishedCount>=338);
 assert.equal(audit.readyToPublish,false);
 assert.ok(audit.records.every(r=>r.readyToPublish===false));
});
test('all eight lab scripts run the actual RHF browser qualification, not text checks',()=>{
 const pkg=JSON.parse(read('package.json'));
 for(const r of audit.records){
  assert.equal(pkg.scripts['lab:forms-query-'+r.labSlug],
   'node scripts/verify-rhf-release-browser.mjs --lab '+r.labSlug);
 }
});
test('short exact canonical titles are valid while arbitrary short titles remain denied',()=>{
 const validator=read('scripts/validate-content.mjs');
 assert.match(validator,/title: z\.string\(\)\.min\(4\)/);
 assert.match(validator,/meta\.title === entry\.title \|\| meta\.title\.length >= 15/);
 const zod=JSON.parse(read('release-candidates/forms-query/09.02/lessons/09.02.03.meta.json'));
 assert.equal(zod.publishedMetadata.title,'Zod resolvers');
 assert.equal(zod.publishedMetadata.reviewedAt,null);
});
test('the strict release flag fails safely without synthesizing reviewer approval',()=>{
 const command=spawnSync(process.execPath,['scripts/verify-forms-query-rhf-candidates.mjs','--strict'],
  {cwd:root,encoding:'utf8'});
 assert.equal(command.status,1);
 assert.equal(audit.readyToPublish,false);
});
test('source-level JSON report is valid and does not claim runtime execution',()=>{
 const output=execFileSync(process.execPath,['scripts/verify-forms-query-rhf-candidates.mjs','--json'],
  {cwd:root,encoding:'utf8'});
 const report=JSON.parse(output);
 assert.equal(report.candidateCount,8);
 assert.ok(report.publishedCount>=338);
 assert.equal(report.pending.perLabTestImplementations,0);
 assert.equal(report.pending.perLabTestsUnrun,8);
 assert.equal(report.readyToPublish,false);
});

test('all eight planned lab test files really spawn the exact lesson browser gate',()=>{
 for(const lesson of audit.records){
  const path='release-candidates/forms-query/09.02/labs/forms-query-'+lesson.labSlug+'/solution.test.mjs';
  const source=read(path);
  assert.ok(source.includes('spawnSync(process.execPath'),lesson.id);
  assert.ok(source.includes("'--lab','"+lesson.labSlug+"'"),lesson.id);
  assert.ok(source.includes('assert.equal(result.status,0'),lesson.id);
  assert.equal(lesson.runtimeTestAuthored,true);
  assert.equal(lesson.runtimeTestsExecuted,'not-established-by-this-source-audit');
 }
});

test('publication candidates allow exactly zero or all eight live lessons',()=>{
 const live=audit.records.filter(x=>x.published).length;
 assert.ok(live===0||live===8);
 assert.equal(audit.records.every(x=>x.publishCandidatePresent),true);
});
