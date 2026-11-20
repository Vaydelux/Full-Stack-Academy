import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PHASE_DEFINITIONS, buildPublicationProgram, readPublicationProgram,
  formatPublicationProgram,
} from '../scripts/curriculum-phase-program.mjs';

const program=readPublicationProgram();
const first=(published=[],staged=[])=>buildPublicationProgram({
 curriculum:{
  tracks:[{id:'09'},{id:'11'}],
  modules:[{id:'09.02',track:'09',title:'React Hook Form'},
   {id:'09.03',track:'09',title:'TanStack Query'}, {id:'11.01',track:'11',title:'Nest'}],
  lessons:[{id:'09.02.01',moduleId:'09.02'},{id:'09.02.02',moduleId:'09.02'},
   {id:'09.03.01',moduleId:'09.03'},{id:'11.01.01',moduleId:'11.01'}],
 },publishedIds:published,stagedIds:staged,
});

test('exactly seven nonoverlapping publication phases are defined',()=>{
 assert.deepEqual(PHASE_DEFINITIONS.map(p=>p.id),['P1','P2','P3','P4','P5','P6','P7']);
 assert.equal(new Set(program.phases.flatMap(p=>p.modules.map(m=>m.id))).size,program.scheduledModules);
});
test('phase scope covers all unpublished canonical topics and finishes exactly 889',()=>{
 const total=program.phases.reduce((sum,p)=>sum+p.remaining,0);
 assert.equal(total,program.baseline.unpublished);
 assert.equal(program.finalPublished,program.baseline.topics);
 assert.equal(program.phases.at(-1).afterCompletionPublished,program.baseline.topics);
});
test('baseline is derived from repository publication metadata rather than roadmap claims',()=>{
 assert.equal(program.baseline.topics,889);
 assert.equal(program.baseline.published+program.baseline.unpublished,889);
 assert.equal(program.baseline.remainingModules,program.phases.flatMap(p=>p.modules).filter(m=>m.unpublished>0).length);
 assert.equal(program.baseline.staged+program.baseline.unstaged,program.baseline.unpublished);
});
test('one existing identity lesson 15.02.04 is preserved as already published',()=>{
 const security=program.phases.find(p=>p.id==='P5').modules.find(m=>m.id==='15.02');
 assert.ok(security);
 assert.ok(security.published>=1);
 assert.ok(!security.ids.includes('15.02.04'));
});
test('Forms/Query are first and remain separate atomic eight-lesson modules',()=>{
 const p1=program.phases[0];
 assert.deepEqual(p1.modules.map(m=>m.id),['09.02','09.03']);
 assert.ok(p1.modules.every(m=>m.total===8));
 assert.equal(p1.moduleCount,2);
});
test('module-by-module stage state is distinct from published state',()=>{
 const p=first(['09.02.01'],['09.02.02','09.03.01']);
 const rhf=p.phases[0].modules[0];
 assert.equal(rhf.published,1);
 assert.equal(rhf.staged,1);
 assert.equal(rhf.unpublished,1);
 assert.equal(rhf.status,'partially-published');
 assert.equal(p.activePhase,'P1');
 assert.equal(p.finalPublished,4);
});
test('phase targets remain stable when a module transitions to published',()=>{
 const before=first();
 const after=first(['09.02.01','09.02.02']);
 assert.equal(before.phases[0].afterCompletionPublished,after.phases[0].afterCompletionPublished);
 assert.equal(after.phases[0].modules[0].status,'published');
 assert.equal(after.phases[0].remaining,before.phases[0].remaining-2);
});
test('all phases complete results in a null next phase',()=>{
 const p=first(['09.02.01','09.02.02','09.03.01','11.01.01']);
 assert.equal(p.activePhase,null);
 assert.ok(p.phases.every(x=>x.complete));
});
test('duplicate published IDs, duplicate canonical IDs and phantom lessons fail closed',()=>{
 assert.throws(()=>first(['09.02.01','09.02.01']),/Duplicate published/);
 assert.throws(()=>first(['99.99.99']),/Unknown published/);
 assert.throws(()=>buildPublicationProgram({
  curriculum:{tracks:[],modules:[{id:'09.02',track:'09'},{id:'09.03',track:'09'}],
   lessons:[{id:'09.02.01',moduleId:'09.02'},{id:'09.02.01',moduleId:'09.02'}]},
  publishedIds:[],
 }),/Duplicate canonical/);
});
test('staged topics cannot be unknown or already published',()=>{
 assert.throws(()=>first([],['99.01.01']),/Unknown staged/);
 assert.throws(()=>first(['09.02.01'],['09.02.01']),/Published topic still staged/);
});
test('unassigned incomplete modules are rejected instead of silently dropped',()=>{
 assert.throws(()=>buildPublicationProgram({
  curriculum:{tracks:[],modules:[{id:'09.02',track:'09'},{id:'09.03',track:'09'},{id:'28.01',track:'28'}],
   lessons:[{id:'28.01.01',moduleId:'28.01'}]},
  publishedIds:[],
 }),/Unassigned unpublished modules/);
});
test('text output shows exact module counts and does not imply publication',()=>{
 const text=formatPublicationProgram(program,'P1');
 assert.match(text,/React Hook Form/);
 assert.match(text,/TanStack Query/);
 assert.match(text,/Status rule/);
 assert.throws(()=>formatPublicationProgram(program,'P99'),/Unknown publication phase/);
});
test('module sums reconcile to baseline including all phase targets',()=>{
 const all=program.phases.flatMap(p=>p.modules);
 assert.equal(all.reduce((s,m)=>s+m.unpublished,0),program.baseline.unpublished);
 assert.equal(all.reduce((s,m)=>s+m.staged,0),program.baseline.staged);
 assert.equal(all.length,program.scheduledModules);
});
