import test from 'node:test';
import assert from 'node:assert/strict';
import {auditP7} from './verify-track.mjs';
const modules=['24.01','24.02','24.03','24.04','25.01','25.02','25.03','25.04','26.01','26.02','26.03','26.04','27.01','27.02','27.03','27.04','27.05'];
const models=['bridgeAllowed','applyOperation','desktopAllowed','resumeQueue','aggregateEvents','citedAnswer','validPoint','mediaAllowed','enterpriseAccess','entitlement','retentionDecision','adminAllowed','webAcceptance','apiAcceptance','workspaceAcceptance','productionAcceptance','defenseAcceptance'];
function fixture(){const lessons=[],specs={},sources={},files=[];
 for(const [i,mod] of modules.entries())for(let n=1;n<=8;n++){
  const id=mod+'.0'+n,title='Topic '+id;lessons.push({id,moduleId:mod,title});const s={context:'Context '+id,concept:'Concept '+id,exercise:'Exercise '+id,positive:'Positive '+id,negative:'Negative '+id,reference:'https://example.invalid/'+id,model:models[i],boundary:'Boundary '+id};specs[id]=s;
  files.push((i<8?'p7-platforms':'p7-enterprise')+'/lessons/'+id+'.mdx');
  sources[id]=['---','id: '+JSON.stringify(id),'title: '+JSON.stringify(title),'module: '+JSON.stringify(mod),'status: "draft-unverified"','readyToPublish: false','---','## Learning outcomes','## Step 1','## Step 2','## Step 3','## Qualification boundary','## Knowledge check','## References','## Publication conditions',...Object.values(s),'node --test --test-name-pattern="'+mod.replaceAll('.','[.]')+'" examples/p7-platforms/labs.test.mjs'].join('\n');
 }
 return {catalog:{lessons},specs,sources,files,publishedIds:[],load:id=>sources[id]};}
const id='24.01.01';
const fails=(mutate,code)=>{const f=fixture();mutate(f);const r=auditP7(f);assert.equal(r.ok,false);assert.ok(r.errors.some(e=>e.includes(code)),JSON.stringify(r.errors));};
test('all 136 canonical fixtures pass',()=>assert.equal(auditP7(fixture()).ok,true));
test('missing canonical topic fails',()=>fails(f=>f.catalog.lessons.pop(),'canonical-count'));
test('wrong file family fails',()=>fails(f=>f.files[0]=f.files[0].replace('p7-platforms','p7-enterprise'),'file-inventory'));
test('missing specification fails',()=>fails(f=>delete f.specs[id],'spec-inventory'));
test('duplicate scenario fails',()=>fails(f=>f.specs['24.01.02'].context=f.specs[id].context,'duplicate-context'));
test('wrong module model fails',()=>fails(f=>f.specs[id].model='apiAcceptance','model:'));
test('premature published ID fails',()=>fails(f=>f.publishedIds.push(id),'premature-publication'));
test('duplicate readiness flags fail',()=>fails(f=>f.sources[id]=f.sources[id].replace('readyToPublish: false','readyToPublish: false\nreadyToPublish: true'),'frontmatter:'+id+':readyToPublish'));
test('missing negative evidence fails',()=>fails(f=>f.sources[id]=f.sources[id].replace(f.specs[id].negative,''),'spec-drift:'+id+':negative'));
test('wrong command fails',()=>fails(f=>f.sources[id]=f.sources[id].replace('node --test','node wrong'),'command:'));
test('insecure reference fails',()=>fails(f=>f.specs[id].reference='http://example.invalid','reference:'));
