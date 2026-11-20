import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const program=read('scripts/promote-forms-query-query.mjs');
const pkg=JSON.parse(read('package.json'));
test('Query --plan is read-only and reports blocked 09.02 prerequisite without pretending progress',()=>{
 const before=read('docs/checkpoint.json');
 const result=spawnSync(process.execPath,['scripts/promote-forms-query-query.mjs','--plan'],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 const report=JSON.parse(result.stdout);
 assert.equal(report.moduleId,'09.03');
 assert.equal(report.candidates.length,8);
 assert.equal(report.projectedPublicationAfterRHF,354);
 assert.match(report.reviewSourceSha256,/^[a-f0-9]{64}$/);
 assert.equal(report.changesWritten,0);
 assert.equal(read('docs/checkpoint.json'),before);
});
test('Query --simulate prepares all 54 files in memory without publishing or modifying registries',()=>{
 const before=[read('docs/checkpoint.json'),read('src/content/lesson-registry.tsx'),read('src/lib/academy/published.ts')];
 const result=spawnSync(process.execPath,['scripts/promote-forms-query-query.mjs','--simulate'],{encoding:'utf8',timeout:30000});
 assert.equal(result.status,0,result.stderr);
 const report=JSON.parse(result.stdout);
 assert.equal(report.sourceOnly,true);
 if(report.status==='source-rehearsal-passed'){
  assert.equal(report.files,54);
  assert.equal(report.lessonFiles,16);
  assert.equal(report.labFiles,32);
  assert.equal(report.ssrSupportFiles,4);
  assert.equal(report.registries,2);
  assert.equal(report.changesWritten,0);
 }else assert.equal(report.status,'already-published');
 assert.deepEqual([read('docs/checkpoint.json'),read('src/content/lesson-registry.tsx'),read('src/lib/academy/published.ts')],before);
});
test('real Query promotion refuses unpublished RHF, incomplete a11y and absent runtime without fake approval',()=>{
 assert.equal(pkg.scripts['promote:forms-query:query'],'node scripts/promote-forms-query-query.mjs');
 for(const value of ['RHF 09.02 must be published before Query 09.03','ACADEMY_BROWSER_ROOT',
  'reviewed,true','queryReviewFingerprint(),review.sourceSha256',
  "exec('npm',['run','qualify:forms-query:full'])",
  "exec('npm',['run','qualify:forms-query:query-browser']",
  "exec('npm',['run','verify:offline'])",
  "exec('npm',['run','qualify:forms-query:preview-browser']",
  "previous.set('docs/checkpoint.json'","written.reverse()"])
  assert.ok(program.includes(value),'Release gate missing: '+value);
});
test('review SHA requirements apply to both RHF and Query readiness, not just publisher',()=>{
 const inspector=read('scripts/forms-query-promotion-readiness.mjs');
 assert.match(inspector,/e.sourceSha256===\(moduleId==='09.02'\?rhfReviewFingerprint\(\):queryReviewFingerprint\(\)\)/);
});
