import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.01.05 File system safety: actual Node core module behavior",async()=>{
const {mkdtemp,writeFile,rm}=await import('node:fs/promises');
const {tmpdir}=await import('node:os');const {join}=await import('node:path');
const root=await mkdtemp(join(tmpdir(),'academy-path-'));
const outer=await mkdtemp(join(tmpdir(),'academy-outer-'));
try{
 await writeFile(join(root,'ok.txt'),'allowed');await writeFile(join(outer,'secret.txt'),'private');
 assert.equal(await mod.readContained(root,'ok.txt'),'allowed');
 await assert.rejects(mod.readContained(root,join('..',outer.split(/[\\/]/).pop(),'secret.txt')),/Path outside root|ENOENT/);
}finally{await rm(root,{recursive:true,force:true});await rm(outer,{recursive:true,force:true});}
});
