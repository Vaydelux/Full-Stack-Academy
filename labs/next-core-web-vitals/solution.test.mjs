import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.04.06 Core Web Vitals local SEO/accessibility contract",()=>{
assert.equal(mod.vitalsGrade('LCP',2500),'good');
assert.equal(mod.vitalsGrade('INP',200),'good');
assert.equal(mod.vitalsGrade('CLS',0.1),'good');
assert.equal(mod.vitalsGrade('LCP',4500),'poor');
assert.equal(mod.vitalsGrade('INP',400),'needs-improvement');
assert.throws(()=>mod.vitalsGrade('CLS',-0.1),RangeError);
});
