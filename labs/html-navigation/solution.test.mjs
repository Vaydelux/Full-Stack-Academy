import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
// Static contract checks; actual browser behavior is tested in scripts/browser-smoke.mjs.
test('all named internal fragments resolve to actual IDs',()=>{
 assert.match(page,/<nav aria-label="Page navigation">/);
 const ids=new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 const anchors=[...page.matchAll(/<a href="#([^"]+)">([^<]+)<\/a>/g)];
 assert.equal(anchors.length,3);
 for(const a of anchors){assert.ok(ids.has(a[1]),'Missing fragment target '+a[1]);assert.ok(a[2].trim().length>8);}
 assert.match(page,/<body>\s*<a href="#main-content">Skip to main content/);
});
test('external navigation is descriptive and protected',()=>{
 assert.match(page,/<a href="https:\/\/developer\.mozilla\.org\/en-US\/docs\/Web\/HTML\/Element\/a" target="_blank" rel="noopener noreferrer">HTML anchor documentation \(opens in a new tab\)<\/a>/);
 assert.doesNotMatch(page,/href="javascript:/i);
 assert.doesNotMatch(page,/>Click here<\/a>/i);
});
