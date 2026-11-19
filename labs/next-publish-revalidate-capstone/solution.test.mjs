import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.03.08 Lab publish and revalidate cache decision model",()=>{
const post={id:'react',ownerId:'u1',title:'Draft',revision:1};
assert.equal(mod.publishPost(post,'u2','Changed'),null);
const result=mod.publishPost(post,'u1',' Ready ');
assert.deepEqual(result,{id:'react',ownerId:'u1',title:'Ready',revision:2});
assert.equal(post.revision,1);
});
