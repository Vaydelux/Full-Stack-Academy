import test from 'node:test';
import assert from 'node:assert/strict';
import { combineExpected } from '../scripts/rehearse-p1-p2-publication.mjs';
import { registryPaths } from '../scripts/nest-release-projection.mjs';
test('combined projection preserves predecessor lessons and updates only shared registries',()=>{
 const first=new Map([['labs/old/solution.ts','old'],[registryPaths[0],'one']]);
 const next=new Map([[registryPaths[0],'two'],['labs/new/solution.ts','new']]);
 assert.deepEqual([...combineExpected(first,next)],[['labs/old/solution.ts','old'],[registryPaths[0],'two'],['labs/new/solution.ts','new']]);
 assert.equal(first.get(registryPaths[0]),'one');
});
test('combined projection rejects predecessor lesson or lab overwrite even if identical',()=>{
 const first=new Map([['src/content/lessons/09.02.01.mdx','old'],['labs/old/solution.ts','old']]);
 for(const [file,content] of first)assert.throws(()=>combineExpected(first,new Map([[file,content]])),/predecessor overwrite/);
});
