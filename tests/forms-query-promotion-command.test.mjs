import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const program=read('scripts/promote-forms-query-rhf.mjs');
const pkg=JSON.parse(read('package.json'));

test('the read-only plan works before or after a complete eight-topic publication',()=>{
 const before=read('docs/checkpoint.json');
 const result=spawnSync(process.execPath,['scripts/promote-forms-query-rhf.mjs','--plan'],
  {cwd:root,encoding:'utf8',timeout:30000});
 assert.equal(result.status,0,result.stderr);
 const plan=JSON.parse(result.stdout);
 assert.equal(plan.moduleId,'09.02');
 assert.equal(plan.sourceCandidates.length,8);
 assert.ok(plan.publishedBefore>=338&&plan.publishedBefore<=889);
 assert.equal(plan.rootDependenciesUnchanged,true);
 assert.match(plan.reviewedSourceSha256,/^[a-f0-9]{64}$/);
 assert.equal(plan.targetPublished,plan.alreadyPublished?plan.publishedBefore:plan.publishedBefore+8);
 assert.equal(read('docs/checkpoint.json'),before,'Planning must not change the checkpoint');
});
test('apply is explicit and requires real browser, human review and Node24',()=>{
 assert.equal(pkg.scripts['promote:forms-query:rhf'],'node scripts/promote-forms-query-rhf.mjs');
 assert.match(program,/--plan','--apply'/);
 assert.match(program,/Number\(process\.versions\.node\.split\('\.'\)\[0\]\)!==24/);
 assert.match(program,/ACADEMY_BROWSER_ROOT/);
 assert.match(program,/humanEvidence\(\)/);
 assert.match(program,/reviewer\.date/);
 assert.match(program,/evidence\.sourceSha256,rhfReviewFingerprint\(\)/);
 assert.match(program,/git',\['status','--porcelain'\]/);
});
test('the promote runner performs genuine full tests before and after publication',()=>{
 for(const marker of [
  "run('npm',['ci'])",
  "run('npm',['run','qualify:forms-query:full'])",
  "run('npm',['run','qualify:forms-query:rhf-browser']",
  "run('npm',['run','checkpoint:write']",
  "run('npm',['run','verify:offline'])",
  "run('npm',['run','qualify:forms-query:preview-browser']"
 ])assert.ok(program.includes(marker),'Missing mandatory gate: '+marker);
 assert.match(program,/docs\/release-evidence\/forms-query-09\.02-accessibility\.json/);
});
test('transition writes both registries and all eight lab assets with rollback on failure',()=>{
 assert.match(program,/src\/content\/lesson-registry\.tsx/);
 assert.match(program,/src\/lib\/academy\/published\.ts/);
 assert.match(program,/for\(const name of \['starter\/solution\.tsx','solution\/solution\.tsx','solution\.test\.mjs'\]\)/);
 assert.match(program,/writes\.set\('labs\/'\+lab\+'\/'\+name/);
 assert.match(program,/previous\.set\('docs\/checkpoint\.json'/);
 assert.match(program,/done\.reverse\(\)/);
 assert.match(program,/fs\.rmSync\(local\(file\),\{force:true\}\)/);
});

test('human evidence and the source-readiness audit use the same immutable RHF fingerprint',()=>{
 const readiness=read('scripts/forms-query-promotion-readiness.mjs');
 const helper=read('scripts/forms-query-review-fingerprint.mjs');
 assert.match(program,/rhfReviewFingerprint\(\)/);
 assert.match(readiness,/e\.sourceSha256===rhfReviewFingerprint\(\)/);
 assert.doesNotMatch(helper,/src\/content\/lesson-registry\.tsx|src\/lib\/academy\/published\.ts/);
 assert.match(helper,/src\/app\/learn\/projects\/forms-query\/page\.tsx/);
});

test('the apply path rechecks fingerprint and clean worktree after long qualification',()=>{
 assert.match(program,/assert\.equal\(rhfReviewFingerprint\(\),reviewer\.sourceSha256/);
 assert.match(program,/Preflight modified the Git worktree/);
 assert.match(program,/Reviewed RHF source changed during qualification/);
 assert.match(program,/Reviewed lesson source drifted during publication/);
});
