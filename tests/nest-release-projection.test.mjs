import test from 'node:test';
import assert from 'node:assert/strict';
import { candidatePaths } from '../scripts/nest-candidate-contract.mjs';
import { buildCandidateModule } from '../scripts/nest-candidate-inventory.mjs';
import { projectNestModule, renderNestArticle, registryPaths } from '../scripts/nest-release-projection.mjs';
import { nestLabPlan, verifyTap, independentTestEnvironment } from '../scripts/run-published-nest-lab.mjs';
function fixture(moduleId='11.01'){
 const catalog={lessons:[]},data=new Map([[registryPaths[0],"function lesson(id) {\n switch(id) {\n    default: return null;\n }\n}\n"],[registryPaths[1],"export const MDX_METADATA = new Map([existing]);\nexport const LOCAL_LAB_LESSONS = [existing];\n"],[registryPaths[2],JSON.stringify({scripts:{test:'node --test'}})]]);
 const suite=candidatePaths(moduleId+'.01','lab-one').suite;
 for(let i=1;i<=8;i++){
  const id=moduleId+'.0'+i,slug='lab-'+i,title='Practice topic '+i;
  catalog.lessons.push({id,moduleId,title,level:'Intermediate'});
  const p=candidatePaths(id,slug);
  const meta={id,title,moduleId,labSlug:slug,sourceStatus:'draft-unverified',runtimeQualification:'not-run',reviewStatus:'unreviewed',estimatedMinutes:60,objective:'Register modules in the root graph.',acceptance:'Verify behavior with real Nest runtime.',misconception:'The example fails its intended contract.',securityBoundary:'Use loopback only; verify authorization at the boundary.',prerequisites:['10.04.08'],officialReferences:['https://docs.nestjs.com/','https://docs.nestjs.com/modules']};
  const lab={lessonId:id,readyToPublish:false,requiresRealNestTest:true,expectedPositive:meta.acceptance,expectedNegative:meta.misconception,starter:p.sources[3],solution:p.sources[4]};
  for(const [path,source] of [[p.sources[0],"import { LearningGoals, LessonStep, Misconception } from '@/components/course/LessonBlocks';\n\n**Scope:** staged authoring only\n\nComplete 10.04.08 first.\n\n```ts\nred\n```\n\n```ts\ngreen\n```\n\n**Qualification boundary:** not run\n\n## Guided local lab\n\nUnpublished.\n\n## Reflect\n\nThink.\n"],[p.sources[1],JSON.stringify(meta)],[p.sources[2],JSON.stringify(lab)],[p.sources[3],'red'],[p.sources[4],'green']])data.set(path,source);
  if(p.integration)data.set(p.integration,`test('${id} integration',()=>{});`);
 }
 data.set(suite,catalog.lessons.map(l=>`test('${l.id} behavior',()=>{});`).join('\n'));
 const read=p=>data.get(p)??(p.startsWith('examples/nestjs-vertical/')?'shared fixture\n':assert.fail('missing '+p));
 const pack=buildCandidateModule(moduleId,catalog,read,'a'.repeat(40));
 return {pack,moduleId,catalog,data,read};
}
const project=f=>projectNestModule(f.pack,f.catalog,f.read,p=>f.data.has(p));
test('all four module rehearsals produce 51 synchronized files without writing',()=>{
 for(const id of ['11.01','11.02','11.03','11.04']){
  const f=fixture(id),before=[...f.data],writes=project(f);
  assert.equal(writes.size,51);assert.deepEqual([...f.data],before);
  assert.equal([...writes.keys()].filter(p=>p.endsWith('.mdx')).length,8);
  assert.equal([...writes.keys()].filter(p=>p.endsWith('solution.test.mjs')).length,8);
  for(const c of f.pack.candidates){
   const article=writes.get(c.targetPaths[0]);assert.ok(article.includes('interactive={false}'));assert.ok(article.includes('lessonId="'+c.id+'"'));
   assert.match(article,/```ts\nred\n```/);assert.match(article,/```ts\ngreen\n```/);
   assert.equal(JSON.parse(writes.get(c.targetPaths[1])).reviewedAt,'2000-01-01');
   assert.ok(writes.get(registryPaths[0]).includes("case '"+c.id+"':"));
   assert.ok(writes.get(registryPaths[1]).includes(c.id+'.meta.json'));
   assert.equal(JSON.parse(writes.get(registryPaths[2])).scripts['lab:nestjs-'+c.id.replaceAll('.','-')],'node --test '+c.targetPaths[5]);
   assert.ok(writes.get(c.targetPaths[5]).includes('runPublishedNestLab('+JSON.stringify(c.id)));
  }
 }
});
test('rehearsal refuses overwrite and existing command',()=>{
 const f=fixture();f.data.set(f.pack.candidates[0].targetPaths[0],'existing');assert.throws(()=>project(f),/overwrite/);
 const g=fixture();g.data.set(registryPaths[2],JSON.stringify({scripts:{'lab:nestjs-11-01-01':'existing'}}));assert.throws(()=>project(g),/Existing lab command/);
});
test('registry insertion must have exactly one marker',()=>{const f=fixture();f.data.set(registryPaths[0],'missing');assert.throws(()=>project(f),/release marker/);});
test('rendered articles retain actual code and reject missing or duplicate marker',()=>{const f=fixture(),c=f.pack.candidates[0],source=f.read(c.sourceBindings[0].path);assert.throws(()=>renderNestArticle(source.replace('## Reflect','## Other'),c),/release marker/);assert.throws(()=>renderNestArticle(source+'\nComplete other.\n',c),/release marker/);});
test('actual service requirements and unsafe starter warning stay visible',()=>{
 for(const [module,id,pattern] of [['11.03','11.03.06',/PG_TEST_URL/],['11.04','11.04.03',/Socket.IO/],['11.04','11.04.08',/Do not execute the unsafe starter/]]){
  const f=fixture(module),c=f.pack.candidates.find(c=>c.id===id);assert.match(project(f).get(c.targetPaths[0]),pattern);
 }
});
test('lab plan invokes genuine lock and compiler, exact topic test, and only relevant integration',()=>{
 const normal=nestLabPlan('11.01.01','lab-one');assert.deepEqual(normal.steps[0].args,['scripts/require-lock.mjs']);assert.equal(normal.steps[1].args[0],'node_modules/typescript/bin/tsc');assert.equal(normal.steps.length,3);assert.equal(normal.steps[2].args[2],'--test-name-pattern=^11\\.01\\.01 ');
 for(const [id,count,service] of [['11.03.06',1,'postgres'],['11.04.03',2,'websocket']]){const p=nestLabPlan(id,'lab-one');assert.equal(p.steps.length,4);assert.equal(p.steps[3].count,count);assert.match(p.steps[3].args.at(-1),new RegExp(service));}
});
const tap=(n=1)=>`# tests ${n}\n# pass ${n}\n# fail 0\n# cancelled 0\n# skipped 0\n# todo 0\n`;
test('TAP verifier refuses skipped, empty, failed or interrupted runs',()=>{
 assert.doesNotThrow(()=>verifyTap({status:0,stdout:tap()},1));
 for(const result of [{status:0,stdout:tap(0)},{status:0,stdout:tap().replace('# skipped 0','# skipped 1')},{status:0,stdout:tap()+tap()},{status:1,stdout:tap()},{status:0,signal:'SIGTERM',stdout:tap()},{status:0,error:Error('spawn'),stdout:tap()}])assert.throws(()=>verifyTap(result,1));
});

test('nested Node test process runs independently and retains exact TAP assertions',async t=>{
 const {mkdtempSync,writeFileSync,rmSync}=await import('node:fs');
 const {tmpdir}=await import('node:os');
 const {join}=await import('node:path');
 const {spawnSync}=await import('node:child_process');
 const dir=mkdtempSync(join(tmpdir(),'academy-nested-test-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const file=join(dir,'acceptance.mjs');writeFileSync(file,"import test from 'node:test'; test('real child',()=>{});\n");
 const env={...process.env,NODE_TEST_CONTEXT:'child-v8',ACADEMY_TEST_SENTINEL:'preserved'};
 const child=independentTestEnvironment(env);assert.equal(child.NODE_TEST_CONTEXT,undefined);assert.equal(child.ACADEMY_TEST_SENTINEL,'preserved');assert.equal(env.NODE_TEST_CONTEXT,'child-v8');
 verifyTap(spawnSync(process.execPath,['--test','--test-reporter=tap',file],{env:child,encoding:'utf8',timeout:15000}),1);
});
