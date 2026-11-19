import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.04.08 Lab SEO audit local SEO/accessibility contract",()=>{
const pages=[{id:'draft',published:false,index:true,canonical:'',description:''},{id:'a',published:true,index:true,canonical:'https://a.example/a',description:'A page'},{id:'b',published:true,index:true,canonical:'https://a.example/a',description:''}];
assert.deepEqual(mod.auditPages(pages),['draft:draft-indexed','b:missing-description','b:duplicate-canonical']);
assert.deepEqual(mod.auditPages([]),[]);
});
