import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pkg=JSON.parse(read('package.json'));
const launcher=read('scripts/verify-query-release-browser.mjs');
const harness=read('scripts/verify-forms-query-staged-query.mjs');
const ssr=read('scripts/verify-forms-query-staged-ssr.mjs');
const slugs=['query-keys','stale-garbage','mutation-invalidation','optimistic-rollback',
 'infinite-queries','ssr-hydration','retries-cancellation','remote-task-capstone'];
test('eight query labs each have a real browser or Next SSR verification command',()=>{
 for(const slug of slugs)assert.equal(pkg.scripts['lab:forms-query-'+slug],
  'node scripts/verify-query-release-browser.mjs --lab '+slug);
 assert.equal(pkg.scripts['qualify:forms-query:query-browser'],'node scripts/verify-query-release-browser.mjs');
});
test('browser qualification accepts only named labs, isolates ports and does not claim publication',()=>{
 assert.match(launcher,/choices\.includes\(args\[1\]\)/);
 assert.match(launcher,/api\.start\(0\)/);
 assert.match(launcher,/port:0/);
 assert.match(launcher,/host:'127\.0\.0\.1'/);
 assert.match(launcher,/publicationGranted:false/);
 assert.match(launcher,/await browser\?\.close\(\)/);
 assert.match(launcher,/await vite\?\.close\(\)/);
 assert.match(launcher,/await api\.close\(\)/);
});
test('query harness exercises one selected lab while preserving all-lab regression',()=>{
 assert.match(harness,/Unknown TanStack Query lab/);
 assert.match(harness,/onlyLab===null\?Object\.entries\(labs\)/);
 assert.match(harness,/page\.goto\(origin\+'\/qualification\/\?'/);
 assert.match(harness,/assert\.rejects\(\(\) => verify\(page, variant, open, apiOrigin\)/);
});
test('SSR fixture uses exact isolated API rather than the shared hardcoded :3337 port',()=>{
 assert.match(ssr,/buildFixture\(dir, apiOrigin\)/);
 assert.match(ssr,/JSON\.stringify\(apiOrigin\+'\/api\/tasks'\)/);
 assert.doesNotMatch(ssr,/127\.0\.0\.1:3337\/api\/tasks/);
 assert.match(launcher,/verifyStagedSsr\(browser,apiOrigin\)/);
});

test('isolated SSR Next fixture retargets both server prefetch and route handler to its ephemeral API',()=>{
 assert.match(ssr,/prefetched\.replace\(fixed,apiOrigin\+'\/api\/tasks'\)/);
 assert.match(ssr,/const fixed='http:\/\/127\.0\.0\.1:3337\/api\/tasks'/);
 assert.match(ssr,/prefetched\.split\(fixed\)\.length,2/);
 assert.match(ssr,/writeFile\(path\.join\(app,'solution\.tsx'\)/);
});
