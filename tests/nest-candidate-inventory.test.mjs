import test from 'node:test';
import assert from 'node:assert/strict';
import { candidatePaths } from '../scripts/nest-candidate-contract.mjs';
import { buildCandidateModule, inspectCandidateModule } from '../scripts/nest-candidate-inventory.mjs';
function fixture(moduleId='11.01'){
 const catalog={lessons:[]},data=new Map();
 const suite=candidatePaths(moduleId+'.01','lab-one').suite;
 for(let i=1;i<=8;i++){
  const id=moduleId+'.0'+i,slug='lab-'+i,title='Practice topic '+i;
  catalog.lessons.push({id,moduleId,title,level:'Intermediate'});
  const p=candidatePaths(id,slug);
  const meta={id,title,moduleId,labSlug:slug,sourceStatus:'draft-unverified',runtimeQualification:'not-run',reviewStatus:'unreviewed',estimatedMinutes:60,objective:'Register modules in the root graph.',acceptance:'Verify behavior with real Nest runtime.',misconception:'The example fails its intended contract.',securityBoundary:'Use loopback only; verify authorization at the boundary.',prerequisites:['10.04.08'],officialReferences:['https://docs.nestjs.com/','https://docs.nestjs.com/modules']};
  const lab={lessonId:id,readyToPublish:false,requiresRealNestTest:true,expectedPositive:meta.acceptance,expectedNegative:meta.misconception,starter:p.sources[3],solution:p.sources[4]};
  for(const [path,source] of [[p.sources[0],'```ts\nred\n```\n\n```ts\ngreen\n```\n'],[p.sources[1],JSON.stringify(meta)],[p.sources[2],JSON.stringify(lab)],[p.sources[3],'red'],[p.sources[4],'green']])data.set(path,source);
  if(p.integration)data.set(p.integration,`test('${id} integration',()=>{});`);
 }
 data.set(suite,catalog.lessons.map(l=>`test('${l.id} behavior',()=>{});`).join('\n'));
 const read=p=>data.get(p)??(p.startsWith('examples/nestjs-vertical/')?'shared fixture\n':assert.fail('missing '+p));
 const pack=buildCandidateModule(moduleId,catalog,read,'a'.repeat(40));
 return {pack,moduleId,catalog,data,read};
}
const check=f=>inspectCandidateModule(f.pack,f.moduleId,f.catalog,f.read);
test('all four module manifests have eight candidates and 48 future targets',()=>{for(const id of ['11.01','11.02','11.03','11.04'])assert.deepEqual(check(fixture(id)),{moduleId:id,candidates:8,targets:48,sourceBound:true,publicationApproved:false});});
test('module manifest rejects missing or repeated topic',()=>{const f=fixture();f.pack.candidates.pop();assert.throws(()=>check(f),/Missing, duplicate/);});
test('shared dependency manifest drift invalidates all bound candidates',()=>{const f=fixture();f.data.set(f.pack.commonSourceBindings[0].path,'changed');assert.throws(()=>check(f),/Shared candidate source changed/);});
test('module rebind never grants review or runtime approval',()=>{const f=fixture();const next=buildCandidateModule(f.moduleId,f.catalog,f.read,'b'.repeat(40));assert.equal(next.sourceCommit,'b'.repeat(40));assert.ok(next.candidates.every(c=>c.reviewedAt===null&&!c.publicationReady&&!c.runtimeExecuted));});
test('common source paths cannot be replaced or omitted',()=>{const f=fixture();f.pack.commonSourceBindings.pop();assert.throws(()=>check(f));});

test('shared lock and PostgreSQL safety guard are source-bound',()=>{const f=fixture();for(const path of ['package-lock.json','tests/pg-test-guard.mjs','tests/pg-test-guard.test.mjs']){const full='examples/nestjs-vertical/'+path;assert.ok(f.pack.commonSourceBindings.some(b=>b.path===full));f.data.set(full,'tampered');assert.throws(()=>check(f),/Shared candidate source changed/);f.data.delete(full);}});
