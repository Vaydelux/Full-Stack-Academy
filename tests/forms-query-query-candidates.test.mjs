import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectQueryPublicationCandidates} from '../scripts/verify-forms-query-query-candidates.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const report=inspectQueryPublicationCandidates();
test('eight Query publication packs mirror actual draft TSX and learning contracts',()=>{
 assert.equal(report.candidateCount,8);
 assert.deepEqual(report.issues,[]);
 assert.equal(new Set(report.records.map(r=>r.id)).size,8);
 assert.equal(report.readyToPublish,false);
});
test('Query SSR candidate includes independently copied providers and TaskList dependencies',()=>{
 const c=JSON.parse(read('release-candidates/forms-query/09.03/labs/forms-query-ssr-hydration/lab.json'));
 assert.equal(c.extraFiles.length,4);
 assert.ok(c.proposedPublishedLabManifest.runtime.includes('next-16-ssr'));
 for(const p of c.extraFiles)assert.ok(fs.statSync(path.join(root,'release-candidates/forms-query/09.03/labs/forms-query-ssr-hydration',p)).isFile());
});
test('published count stays unchanged until atomic 8-lesson 09.03 promotion',()=>{
 assert.ok([0,8].includes(report.published));
 assert.ok(report.publishedSnapshot>=338);
 assert.ok(report.records.every(r=>r.humanAccessibilityReviewed===false));
});
test('candidate status flags distinguish structural --check from the intentionally blocked --strict',()=>{
 const ok=spawnSync(process.execPath,['scripts/verify-forms-query-query-candidates.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(ok.status,0,ok.stderr);
 assert.match(ok.stdout,/8\/8/);
 const strict=spawnSync(process.execPath,['scripts/verify-forms-query-query-candidates.mjs','--strict'],{cwd:root,encoding:'utf8'});
 assert.equal(strict.status,1);
});

test('each candidate browser wrapper resolves the real repo and compares exact compiled lab bytes',()=>{
 for(const lesson of report.records){
  const code=read('release-candidates/forms-query/09.03/labs/forms-query-'+lesson.labSlug+'/solution.test.mjs');
  assert.match(code,/while\(root!==path\.dirname\(root\)/);
  assert.match(code,/fs\.readFileSync\(path\.join\(here,variant,'solution\.tsx'\)/);
  assert.match(code,/fs\.readFileSync\(path\.join\(sourceDir,variant\+'\.tsx'\)/);
  assert.match(code,/publicationGranted/);
  if(lesson.labSlug==='ssr-hydration')assert.match(code,/SSR support file drift/);
 }
});
