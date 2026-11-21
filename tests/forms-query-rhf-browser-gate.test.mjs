import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const verifier=read('scripts/verify-forms-query-staged-rhf.mjs');
const launcher=read('scripts/verify-rhf-release-browser.mjs');
const pkg=JSON.parse(read('package.json'));
const slugs=['controlled-uncontrolled','register-controller','zod-resolver','dynamic-field-arrays','async-submission','reset-dirty','server-error-focus','form-state-bug-hunt'];

test('full eight-topic and individual browser lab commands are registered',()=>{
 assert.equal(pkg.scripts['qualify:forms-query:rhf-browser'],'node scripts/verify-rhf-release-browser.mjs');
 for(const slug of slugs)assert.equal(pkg.scripts['lab:forms-query-'+slug],'node scripts/verify-rhf-release-browser.mjs --lab '+slug);
});
test('an unknown lab cannot pass as an empty selection',()=>{
 assert.ok(verifier.includes('Object.hasOwn(labs, onlyLab)'));
 assert.ok(verifier.includes('Unknown React Hook Form lab:'));
 assert.ok(verifier.includes('onlyLab === null ? Object.entries(labs)'));
});
test('the real-browser harness verifies positive instructor and failing starter cases',()=>{
 assert.ok(verifier.includes("['solution', 'starter']"));
 assert.ok(verifier.includes('await assert.rejects(() => verify(page, variant)'));
 assert.ok(verifier.includes('await browser.newPage()'));
 assert.ok(launcher.includes('await verifyStagedRHF(browser,{onlyLab,origin:viteOrigin})'));
 assert.ok(launcher.includes("requireBrowser('playwright')"));
});
test('isolated listeners and Origin translation support parallel independent labs',()=>{
 assert.ok(launcher.includes('api.start(0)'));
 assert.ok(launcher.includes('port:0'));
 assert.ok(launcher.includes('configFile:false'));
 assert.ok(launcher.includes("vite.httpServer?.address()"));
 assert.ok(launcher.includes("proxyReq.setHeader('origin',apiOrigin)"));
 assert.ok(verifier.includes("page.goto(origin + '/qualification/?' + search)"));
});
test('the learner fixture is never launched publicly and resources close on failures',()=>{
 assert.ok(launcher.includes("host:'127.0.0.1'"));
 assert.ok(launcher.includes('await browser?.close()'));
 assert.ok(launcher.includes('await vite?.close()'));
 assert.ok(launcher.includes('await api.close()'));
 assert.ok(launcher.includes("publication:'not granted by this command'"));
});
