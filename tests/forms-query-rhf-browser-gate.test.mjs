import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const verifier=read('scripts/verify-forms-query-staged-rhf.mjs');
const launcher=read('scripts/verify-rhf-release-browser.mjs');
const slugs=['controlled-uncontrolled','register-controller','zod-resolver','dynamic-field-arrays','async-submission','reset-dirty','server-error-focus','form-state-bug-hunt'];

test('full module command and all eight independently invocable browser lab scripts are registered',()=>{
 assert.equal(pkg.scripts['qualify:forms-query:rhf-browser'],'node scripts/verify-rhf-release-browser.mjs');
 for(const slug of slugs){
  assert.equal(pkg.scripts['lab:forms-query-'+slug],'node scripts/verify-rhf-release-browser.mjs --lab '+slug);
 }
});
test('per-lab selector validates the slug and never silently skips an unknown lab',()=>{
 assert.match(verifier,/verifyStagedRHF\(browser, \{ onlyLab = null \} = \{\}\)/);
 assert.match(verifier,/Object\.hasOwn\(labs, onlyLab\)/);
 assert.match(verifier,/Unknown React Hook Form lab/);
 assert.match(verifier,/onlyLab === null \? Object\.entries\(labs\)/);
});
test('the harness exercises both instructor and deliberately failing starter in real browser',()=>{
 assert.match(verifier,/\['solution', 'starter'\]/);
 assert.match(verifier,/await assert\.rejects\(\(\) => verify\(page, variant\)/);
 assert.match(verifier,/await browser\.newPage\(\)/);
 assert.match(launcher,/await verifyStagedRHF\(browser,\{onlyLab\}\)/);
 assert.match(launcher,/const \{ chromium \}=requireBrowser\('playwright'\)/);
});
test('the harness binds the teaching server to loopback and cleans up failed runs',()=>{
 assert.match(launcher,/api\.start\(3337\)/);
 assert.match(launcher,/origin!=='http:\/\/127\.0\.0\.1:3337'/);
 assert.match(launcher,/await browser\?\.close\(\)/);
 assert.match(launcher,/await vite\?\.close\(\)/);
 assert.match(launcher,/await api\.close\(\)/);
 assert.doesNotMatch(launcher,/github\.com|vercel\.com|fetch\('https:\/\//);
});
test('the runtime harness does not claim to publish lessons',()=>{
 assert.match(launcher,/publication:'not granted by this command'/);
 const bundle=JSON.parse(read('release-candidates/forms-query/09.02/labs/forms-query-controlled-uncontrolled/lab.json'));
 assert.equal(bundle.promotionReady,false);
});
