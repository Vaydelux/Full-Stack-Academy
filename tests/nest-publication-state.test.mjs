import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectNestPublication } from '../scripts/nest-publication-state.mjs';
const topic={id:'11.01.01',title:'Bootstrap and module graph',moduleId:'11.01',slug:'bootstrap-module-graph'};
const prefix='labs/nestjs-bootstrap-module-graph/';
const mdx='src/content/lessons/11.01.01.mdx',meta='src/content/lessons/11.01.01.meta.json';
const labId='lab.node.nestjs-bootstrap-module-graph';
function fixture(live=false){
 const files=new Map([['drafts/nestjs/labs/bootstrap-module-graph/starter.ts','red'],['drafts/nestjs/labs/bootstrap-module-graph/solution.ts','green']]);
 if(live){
  files.set(mdx,'<LabGate lessonId="11.01.01" />');
  files.set(meta,JSON.stringify({...topic,trackId:'11',labId,status:'authored'}));
  files.set(prefix+'lab.json',JSON.stringify({id:labId,lessonId:topic.id,status:'authored',starter:prefix+'starter/solution.ts',solution:prefix+'solution/solution.ts',tests:prefix+'solution.test.mjs'}));
  files.set(prefix+'starter/solution.ts','red');files.set(prefix+'solution/solution.ts','green');files.set(prefix+'solution.test.mjs','test source');
 }
 const io={exists:p=>files.has(p),read:p=>{if(!files.has(p))throw Error('missing '+p);return files.get(p);},json:p=>JSON.parse(io.read(p)),liveIndex:live?'lessons/11.01.01.meta.json':'',liveMdx:live?'./lessons/11.01.01.mdx':''};
 return {files,io};
}
const inspect=f=>inspectNestPublication(topic,f.io);
test('retained manuscript alone remains a draft',()=>assert.deepEqual(inspect(fixture()),{publication:'draft',issues:[]}));
test('fully integrated canonical assets can coexist with retained draft',()=>assert.deepEqual(inspect(fixture(true)),{publication:'published',issues:[]}));
test('each missing live artifact or registry entry fails closed',()=>{
 for(const path of [mdx,meta,prefix+'lab.json']){const f=fixture(true);f.files.delete(path);assert.equal(inspect(f).publication,'partial');}
 for(const key of ['liveIndex','liveMdx']){const f=fixture(true);f.io[key]='';assert.equal(inspect(f).publication,'partial');}
});
test('wrong canonical metadata and lab ID are rejected',()=>{
 const f=fixture(true);f.files.set(meta,JSON.stringify({...topic,trackId:'11',labId:'lab.node.other',status:'authored'}));assert.equal(inspect(f).publication,'partial');
});
test('path traversal is not followed',()=>{
 const f=fixture(true);const lab=f.io.json(prefix+'lab.json');lab.starter='../outside.ts';f.files.set(prefix+'lab.json',JSON.stringify(lab));assert.ok(inspect(f).issues.some(x=>x.includes('unsafe')));
});
test('live lab must match the real retained starter and solution',()=>{
 const f=fixture(true);f.files.set(prefix+'solution/solution.ts','unreviewed drift');assert.ok(inspect(f).issues.some(x=>x.includes('differs')));
});
test('missing test file or canonical LabGate is rejected',()=>{
 const f=fixture(true);f.files.delete(prefix+'solution.test.mjs');f.files.set(mdx,'no gate');assert.equal(inspect(f).issues.length,2);
});
