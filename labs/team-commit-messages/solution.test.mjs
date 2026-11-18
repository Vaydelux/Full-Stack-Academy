import test from 'node:test';
import assert from 'node:assert/strict';
const {solve}=await import(new URL('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs',import.meta.url));
test("Commit message conventions — policy regression",()=>{assert.deepEqual(solve('feat(api): add endpoint'),{type:'feat',scope:'api',breaking:false,description:'add endpoint'});assert.deepEqual(solve('fix!: remove legacy client'),{type:'fix',scope:null,breaking:true,description:'remove legacy client'});assert.equal(solve('update'),null);assert.equal(solve('feat: '),null);});
