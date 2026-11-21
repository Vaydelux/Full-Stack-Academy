import test from 'node:test';
import assert from 'node:assert/strict';
import {projectionFingerprint,verifyProjectionOnDisk} from '../scripts/forms-query-projection-integrity.mjs';

test('publication digests are stable across map insertion order and include path and bytes',()=>{
 const first=new Map([['src/content/lessons/09.02.01.mdx','one'],['labs/forms-query-a/lab.json','{}']]);
 const second=new Map([...first].reverse());
 assert.deepEqual(projectionFingerprint(first),projectionFingerprint(second));
 assert.match(projectionFingerprint(first).sha256,/^[a-f0-9]{64}$/);
 assert.notEqual(projectionFingerprint(new Map([['src/content/lessons/09.02.01.mdx','two'],['labs/forms-query-a/lab.json','{}']])).sha256,
  projectionFingerprint(first).sha256);
 assert.notEqual(projectionFingerprint(new Map([['src/content/lessons/09.02.01.mdx','one'],['labs/forms-query-b/lab.json','{}']])).sha256,
  projectionFingerprint(first).sha256);
});
test('on-disk readback must be byte-identical for every proposed published file',()=>{
 const expected=new Map([['src/content/lessons/09.03.01.mdx','lesson'],['src/lib/academy/published.ts','registry']]);
 assert.deepEqual(verifyProjectionOnDisk(expected,p=>expected.get(p)),projectionFingerprint(expected));
 assert.throws(()=>verifyProjectionOnDisk(expected,p=>p.endsWith('.mdx')?'altered':expected.get(p)),/rollback required/);
 assert.throws(()=>verifyProjectionOnDisk(expected,p=>{if(p.endsWith('.mdx'))throw Error('missing published file');return expected.get(p)}),/missing published file/);
});
test('unexpected paths and non-text source are refused',()=>{
 for(const bad of ['../outside','/absolute','src/../outside','src//../outside','src\\outside']){
  assert.throws(()=>projectionFingerprint(new Map([[bad,'text']])),/Invalid publication target path/);
 }
 assert.throws(()=>projectionFingerprint(new Map()),/nonempty Map/);
 assert.throws(()=>projectionFingerprint(new Map([['labs/form/lab.json',null]])),/Non-text publication source/);
});
