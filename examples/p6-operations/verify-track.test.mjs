import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOperations} from './verify-track.mjs';
function fixture(){
 const modules=['21.01','21.02','21.03','22.01','22.02','22.03','23.01','23.02','23.03','23.04'];
 const models=['safeLog','errorBudget','incidentDecision','webBudget','requestProfile','capacity','boundaryViolations','dependencyCycle','idempotentConsumer','retryDecision'];
 const lessons=[],specs={},sources={};
 for(const [i,m] of modules.entries())for(let n=1;n<=8;n++){
  const id=m+'.0'+n,title='Topic '+id;lessons.push({id,title,moduleId:m});
  const s={context:'Context '+id,concept:'Concept '+id,exercise:'Exercise '+id,positive:'Positive '+id,negative:'Negative '+id,reference:'https://example.invalid/'+id,model:models[i],boundary:'Boundary '+id};specs[id]=s;
  sources[id]=['---','id: '+JSON.stringify(id),'title: '+JSON.stringify(title),'module: '+JSON.stringify(m),'status: "draft-unverified"','readyToPublish: false','---','## Learning outcomes','## Step 1','## Step 2','## Step 3','## Qualification boundary','## Knowledge check','## References','## Publication conditions',...Object.values(s),'node --test --test-name-pattern="'+m.replaceAll('.','[.]')+'" examples/p6-operations/labs.test.mjs'].join('\n');
 }
 return {catalog:{lessons},specs,sources,files:Object.keys(sources).map(x=>x+'.mdx'),publishedIds:[],load:id=>sources[id]};
}
const id='21.01.01';
const fails=(mutate,code)=>{const f=fixture();mutate(f);const r=auditOperations(f);assert.equal(r.ok,false);assert.ok(r.errors.some(e=>e.includes(code)),JSON.stringify(r.errors));};
test('full 80-topic fixture passes',()=>assert.equal(auditOperations(fixture()).ok,true));
test('missing canonical topic fails',()=>fails(f=>f.catalog.lessons.pop(),'canonical-count'));
test('missing file fails',()=>fails(f=>f.files.pop(),'manuscript-inventory'));
test('unexpected spec fails',()=>fails(f=>f.specs.extra={},'spec-inventory'));
test('duplicate context fails',()=>fails(f=>f.specs['21.01.02'].context=f.specs[id].context,'duplicate-context'));
test('wrong model fails',()=>fails(f=>f.specs[id].model='capacity','model:'));
test('publication overlap fails',()=>fails(f=>f.publishedIds.push(id),'premature-publication'));
test('duplicate readiness flag fails',()=>fails(f=>f.sources[id]=f.sources[id].replace('readyToPublish: false','readyToPublish: false\nreadyToPublish: true'),'publication-flag'));
test('missing negative target fails',()=>fails(f=>f.sources[id]=f.sources[id].replace(f.specs[id].negative,''),'spec-drift:'));
test('wrong command fails',()=>fails(f=>f.sources[id]=f.sources[id].replace('node --test','node wrong'),'command:'));
test('non-HTTPS reference fails',()=>fails(f=>f.specs[id].reference='http://example.invalid','reference:'));
