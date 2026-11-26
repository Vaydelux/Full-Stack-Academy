import test from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { inspectFormsQueryPromotion, hasTopicBrowserSource } from '../scripts/forms-query-promotion-readiness.mjs';

const report=inspectFormsQueryPromotion();

test('exactly sixteen canonical topics map to two eight-topic modules',()=>{
 assert.deepEqual(report.modules.map(m=>[m.id,m.total]),[['09.02',8],['09.03',8]]);
 assert.equal(report.topics.length,16);
 assert.equal(new Set(report.topics.map(t=>t.id)).size,16);
});
test('all staged source examples match their real red and instructor fixtures',()=>{
 assert.deepEqual(report.sourceErrors,[]);
 assert.equal(report.topics.filter(t=>t.stagedValid||t.published).length,16);
});
test('every staged topic has an actual browser behavior verification entry',()=>{
 assert.ok(report.topics.every(t=>t.stagedValid||t.published));
});
test('nested locked React client has real Forms/Query dependencies',()=>{
 assert.equal(report.nestedDependenciesPresent,true);
});
test('future publication cannot be partially merged across registries',()=>{
 assert.equal(report.sourceErrors.filter(e=>e.detail.includes('Partial publication')).length,0);
});
test('published totals remain source-derived rather than adding staged lessons',()=>{
 assert.ok(Number.isInteger(report.snapshot.published));
 assert.ok(report.snapshot.published>=338);
 assert.ok(report.snapshot.mdx>=337);
 assert.ok(report.snapshot.labs>=337);
});
test('manual a11y evidence cannot be inferred from browser test source alone',()=>{
 for(const courseModule of report.modules){
  if(!courseModule.a11y)assert.ok(courseModule.blockers.some(b=>b.includes('screen-reader')));
 }
});
test('each prepublication module has explicit actionable blockers',()=>{
 for(const courseModule of report.modules){
  assert.ok(Array.isArray(courseModule.blockers));
  assert.equal(courseModule.ready,courseModule.blockers.length===0);
  if(courseModule.published<courseModule.total)assert.ok(courseModule.blockers.some(b=>b.includes('Published MDX')));
 }
});
test('audit explicitly states that execution and assistive technology are out-of-scope',()=>{
 assert.match(report.warning,/does not execute/i);
 assert.match(report.warning,/screen reader/i);
});

test('RHF/Query learning packages stay in the locked nested exercise workspace',()=>{
 const rhf=report.modules.find(m=>m.id==='09.02');
 const query=report.modules.find(m=>m.id==='09.03');
 assert.equal(report.nestedDependenciesPresent,true);
 assert.equal(rhf.blockers.some(x=>x.includes('Root runtime missing')),false);
 assert.equal(query.blockers.some(x=>x.includes('Root runtime missing')),false);
 assert.equal(rhf.blockers.some(x=>x.includes('Nested npm lock')),false);
 assert.equal(query.blockers.some(x=>x.includes('Nested npm lock')),false);
});

test('source audit invalidates review evidence when RHF lesson/UI files change',()=>{
 const program=fs.readFileSync(new URL('../scripts/forms-query-promotion-readiness.mjs',import.meta.url),'utf8');
 assert.match(program,/e\.sourceSha256===\(moduleId==='09\.02'\?rhfReviewFingerprint\(\):queryReviewFingerprint\(\)\)/);
 assert.match(program,/obsolete Forms\/Query lesson\/UI fingerprint/);
});


test('SSR hydration requires the dedicated Next fixture and both actual runner call sites',()=>{
 const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
 const ssr=read('scripts/verify-forms-query-staged-ssr.mjs');
 const launcher=read('scripts/verify-query-release-browser.mjs');
 const browser=read('scripts/verify-forms-query-react-browser.mjs');
 const checks={'09.03':read('scripts/verify-forms-query-staged-query.mjs')};
 assert.equal(hasTopicBrowserSource('09.03','ssr-hydration',checks,ssr,launcher,browser),true);
 for(const args of [['',launcher,browser],[ssr,'',browser],[ssr,launcher,''],[ssr.replace('Prefetched title missing from server HTML','removed'),launcher,browser]]){
  assert.equal(hasTopicBrowserSource('09.03','ssr-hydration',checks,...args),false);
 }
 assert.equal(hasTopicBrowserSource('09.03','query-keys',checks,'','',''),true);
 assert.equal(hasTopicBrowserSource('09.03','unknown-lab',checks,ssr,launcher,browser),false);
 assert.equal(hasTopicBrowserSource('09.02','ssr-hydration',checks,ssr,launcher,browser),false);
});
