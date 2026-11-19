import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.04.04 JSON-LD and structured data local SEO/accessibility contract",()=>{
const result=mod.safeJsonLd({name:'</script><script>alert(1)</script>'});
assert.doesNotMatch(result,/<script>|<\/script>/i);
assert.ok(result.includes(String.fromCharCode(92)+'u003c'));
assert.deepEqual(JSON.parse(result),{name:'</script><script>alert(1)</script>'});
assert.throws(()=>mod.safeJsonLd(undefined),TypeError);
});
