import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('the eight-lesson publication rehearsal validates actual generated outputs without writes',()=>{
 const checkpoint=read('docs/checkpoint.json');
 const source=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const result=spawnSync(process.execPath,['scripts/promote-forms-query-rhf.mjs','--simulate'],
  {cwd:root,encoding:'utf8',timeout:30_000});
 assert.equal(result.status,0,result.stderr);
 const report=JSON.parse(result.stdout);
 assert.equal(report.sourceOnly,true);
 if(report.status==='source-rehearsal-passed'){
  assert.equal(report.lessons,8);
  assert.equal(report.lessonFiles,16);
  assert.equal(report.labFiles,32);
  assert.equal(report.registries,2);
  assert.equal(report.filesPrepared,50);
  assert.equal(report.changesWritten,0);
 }else assert.equal(report.status,'already-published');
 assert.equal(read('docs/checkpoint.json'),checkpoint);
 assert.equal(read('src/content/lesson-registry.tsx'),source);
 assert.equal(read('src/lib/academy/published.ts'),published);
});
test('schema fixture cannot masquerade as human accessibility evidence',()=>{
 const source=read('scripts/promote-forms-query-rhf.mjs');
 assert.match(source,/preparedWrites\('2000-01-01'\)/);
 assert.match(source,/No Node24, npm, Chromium or actual human accessibility verification performed/);
 assert.match(source,/if\(!fs\.existsSync\(local\(evidencePath\)\)\)/);
 assert.match(source,/const reviewer=mode==='--review'\?\{date:REVIEW_FIXTURE_DATE,sourceSha256:rhfReviewFingerprint\(\)\}:humanEvidence\(\);/);
 assert.match(source,/assertP1Checkout\(root,\{reviewOnly:mode==='--review',\.\.\.\(mode==='--apply'\?\{evidencePath\}:\{\}\)\}\)/);
});
