import test from 'node:test';
import assert from 'node:assert/strict';
import {auditQualityTrack} from './verify-track.mjs';
function fixture(){
 const lessons=[],specs={},sources={};
 for(const track of ['19','20'])for(let m=1;m<=4;m++)for(let n=1;n<=8;n++){
  const moduleId=track+'.0'+m,id=moduleId+'.0'+n,title='Topic '+id;
  lessons.push({id,moduleId,title});const spec={context:'Context '+id,concept:'Concept '+id,exercise:'Exercise '+id,positive:'Positive '+id,negative:'Negative '+id,reference:'https://example.invalid/'+id,model:'model'+m,boundary:'Boundary '+id};specs[id]=spec;
  sources[id]=['---','id: '+JSON.stringify(id),'title: '+JSON.stringify(title),'module: '+JSON.stringify(moduleId),'status: "draft-unverified"','readyToPublish: false','---','## Learning outcomes','## Step 1','## Step 2','## Step 3','## Qualification boundary','## Knowledge check','## References','## Publication conditions',...Object.values(spec),'node --test --test-name-pattern="'+moduleId.replaceAll('.','[.]')+'" examples/p6-quality/labs.test.mjs'].join('\n');
 }
 return {catalog:{lessons},specs,sources,files:Object.keys(sources).map(id=>id+'.mdx'),load:id=>sources[id],publishedIds:[]};
}
const id='19.01.01';
const check=(mutate,error)=>{const f=fixture();mutate(f);const r=auditQualityTrack(f);assert.equal(r.ok,false);assert.ok(r.errors.some(x=>x.includes(error)),JSON.stringify(r.errors));};
test('complete 64-topic fixture accepted',()=>assert.equal(auditQualityTrack(fixture()).ok,true));
test('missing canonical topic denied',()=>check(f=>f.catalog.lessons.pop(),'canonical-count'));
test('missing file denied',()=>check(f=>f.files.pop(),'manuscript-file-inventory'));
test('orphan spec denied',()=>check(f=>f.specs['99.99.99']={},'spec-inventory'));
test('duplicate scenario denied',()=>check(f=>f.specs['19.01.02'].context=f.specs[id].context,'duplicate-context'));
test('bad title denied',()=>check(f=>f.sources[id]=f.sources[id].replace('title: "Topic 19.01.01"','title: "Other"'),'frontmatter-title'));
test('unsafe readiness flag denied',()=>check(f=>f.sources[id]=f.sources[id].replace('readyToPublish: false','readyToPublish: true'),'publication-flag'));
test('premature publication denied',()=>check(f=>f.publishedIds.push(id),'premature-publication'));
test('missing negative outcome denied',()=>check(f=>f.sources[id]=f.sources[id].replace(f.specs[id].negative,''),'spec-drift-negative'));
test('missing exercise command denied',()=>check(f=>f.sources[id]=f.sources[id].replace('node --test','node wrong'),'lab-command'));
test('insecure reference denied',()=>check(f=>f.specs[id].reference='http://example.invalid','reference:'));
