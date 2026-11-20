import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectFormsQueryPromotion } from '../scripts/forms-query-promotion-readiness.mjs';

const report=inspectFormsQueryPromotion();

test('exactly sixteen canonical topics map to two eight-topic modules',()=>{
 assert.deepEqual(report.modules.map(m=>[m.id,m.total]),[['09.02',8],['09.03',8]]);
 assert.equal(report.topics.length,16);
 assert.equal(new Set(report.topics.map(t=>t.id)).size,16);
});
test('all staged source examples match their real red and instructor fixtures',()=>{
 assert.deepEqual(report.sourceErrors,[]);
 assert.equal(report.topics.filter(t=>t.stagedValid).length,16);
});
test('every staged topic has an actual browser behavior verification entry',()=>{
 assert.ok(report.topics.every(t=>t.stagedValid));
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
 for(const module of report.modules){
  if(!module.a11y)assert.ok(module.blockers.some(b=>b.includes('screen-reader')));
 }
});
test('each prepublication module has explicit actionable blockers',()=>{
 for(const module of report.modules){
  assert.ok(Array.isArray(module.blockers));
  assert.equal(module.ready,module.blockers.length===0);
  if(module.published<module.total)assert.ok(module.blockers.some(b=>b.includes('Published MDX')));
 }
});
test('audit explicitly states that execution and assistive technology are out-of-scope',()=>{
 assert.match(report.warning,/does not execute/i);
 assert.match(report.warning,/screen reader/i);
});
