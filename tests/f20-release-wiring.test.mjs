import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RELEASE_STEPS,STEPS} from '../scripts/qualification-coordinator.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const scripts=JSON.parse(read('package.json')).scripts;
test('release profile extends all existing qualification steps without adding mutations',()=>{
 assert.equal(RELEASE_STEPS.length,STEPS.length+5);
 assert.ok(STEPS.every(s=>RELEASE_STEPS.includes(s)));
 assert.equal(new Set(RELEASE_STEPS.map(s=>s.id)).size,RELEASE_STEPS.length);
 for(const step of RELEASE_STEPS){assert.ok(scripts[step.script]);assert.doesNotMatch(step.script,/deploy|promote|publish/);}
 assert.equal(RELEASE_STEPS[2].script,'audit:release:workspaces');
 assert.equal(scripts['audit:release:workspaces'],'node scripts/audit-release-workspaces.mjs');
 assert.ok(scripts['test:release-gate-coverage'].includes('tests/audit-release-workspaces.test.mjs'));
 assert.equal(scripts['qualify:release:source'],'node scripts/f18-qualification-audit.mjs --check');
});
test('responsive and boundary browser commands start a local production server',()=>{
 const source=read('scripts/verify-academy-browser.mjs');
 assert.equal(scripts['qualify:f17:browser'],'node scripts/verify-academy-browser.mjs --responsive');
 assert.equal(scripts['qualify:f20:browser'],'node scripts/verify-academy-browser.mjs --release-boundaries');
 assert.match(source,/responsiveOnly \? '\.\/f17-ux-browser-smoke\.mjs'/);
 assert.match(source,/releaseBoundaries \? '\.\/f20-release-browser-smoke\.mjs'/);
 assert.match(source,/server\.listen\(0, hostname, resolve\)/);
 assert.match(source,/await app\.prepare\(\)/);
 assert.match(source,/await app\?\.close\(\)/);
});
test('release boundary browser checks require loopback, validate headers and exercise corrupt storage',()=>{
 const source=read('scripts/f20-release-browser-smoke.mjs');
 for(const marker of ['127\\.0\\.0\\.1','x-frame-options','x-powered-by','noindex','{corrupt','Note saved on this device.','publicationApproved:false'])assert.ok(source.includes(marker),marker);
});
test('dashboard surfaces storage failure and syntax gate covers browser-compatible modules',()=>{
 assert.match(read('src/components/course/LearningDashboard.tsx'),/storageError && <p role="alert"/);
 assert.ok(read('scripts/verify-js-syntax.mjs').includes("'src/lib/academy'"));
 assert.ok(scripts['test:release-gate-coverage'].includes('tests/f20-release-wiring.test.mjs'));
});
