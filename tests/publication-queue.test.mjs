import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPublicationQueue, PROGRAM } from '../scripts/publication-queue.mjs';

function fixture(){
 const modules=[],lessons=[],published=[],staged=[];
 const add=(id,count,live=false)=>{
  modules.push({id,title:id,track:id.split('.')[0]});
  for(let i=1;i<=count;i++){
   const topic=id+'.'+String(i).padStart(2,'0');
   lessons.push({id:topic,moduleId:id});
   if(live||topic==='15.02.04')published.push(topic);
   else staged.push(topic);
  }
 };
 add('00.01',337,true);
 for(const [track,n] of [['11',4],['12',5],['13',4],['14',4],['15',4],['16',4],['17',3],['18',4],['19',4],['20',4],['21',3],['22',3],['23',4],['24',4],['25',4],['26',4],['27',5]]){
  for(let i=1;i<=n;i++)add(track+'.'+String(i).padStart(2,'0'),8);
 }
 add('09.02',8);add('09.03',8);
 return {curriculum:{modules,lessons},published,staged};
}
const queue=f=>buildPublicationQueue(f.curriculum,f.published,f.staged);
const promote=(f,id)=>f.published.push(...f.curriculum.lessons.filter(l=>l.moduleId===id&&!f.published.includes(l.id)).map(l=>l.id));
test('entire frozen publication program reconciles exact phase targets',()=>{
 const q=queue(fixture());
 assert.deepEqual(q.phases.map(p=>p.targetPublished),[354,386,426,490,609,753,889]);
 assert.equal(q.remaining,551);assert.equal(q.remainingModules,69);assert.equal(q.next.id,'09.02');assert.deepEqual(q.issues,[]);
});
test('historical identity overlap is not a new publication',()=>{
 const f=fixture();f.staged.push('15.02.04');const q=queue(f);
 const m=q.phases[4].modules.find(m=>m.id==='15.02');
 assert.equal(m.planned,7);assert.equal(m.remaining.length,7);assert.deepEqual(m.preexisting,['15.02.04']);assert.equal(q.remaining,551);
});
test('completed RHF advances to Query without recounting retained drafts',()=>{
 const f=fixture();promote(f,'09.02');const q=queue(f);
 assert.equal(q.remaining,543);assert.equal(q.next.id,'09.03');assert.deepEqual(q.issues,[]);
});
test('completed P1 advances to NestJS',()=>{
 const f=fixture();promote(f,'09.02');promote(f,'09.03');const q=queue(f);
 assert.equal(q.remaining,535);assert.equal(q.next.id,'11.01');assert.deepEqual(q.issues,[]);
});
test('completion leaves no pending module but cannot grant release approval',()=>{
 const f=fixture();f.published=f.curriculum.lessons.map(l=>l.id);f.staged=[];const q=queue(f);
 assert.equal(q.remaining,0);assert.equal(q.next,null);assert.equal(q.publicationApproved,false);assert.equal(q.qualification,'not-evaluated');assert.deepEqual(q.issues,[]);
});
test('partial atomic module is reported',()=>{
 const f=fixture();f.published.push('09.02.01');assert.ok(queue(f).issues.includes('Partial module publication: 09.02'));
});
test('missing source and missing historical identity are reported',()=>{
 const f=fixture();f.staged=f.staged.filter(id=>id!=='09.02.01');f.published=f.published.filter(id=>id!=='15.02.04');const q=queue(f);
 assert.ok(q.issues.includes('Missing manuscript coverage: 09.02'));assert.ok(q.issues.includes('Previously published identity lesson missing: 15.02.04'));
});
test('previously complete module regression is reported',()=>{
 const f=fixture();f.published.shift();assert.ok(queue(f).issues.includes('Previously complete module regressed: 00.01'));
});
test('later phase publication before earlier completion is reported',()=>{
 const f=fixture();promote(f,'11.01');assert.ok(queue(f).issues.includes('Publication phase order violated: P2'));
});
test('scope mutation is rejected rather than silently changing release targets',()=>{
 const f=fixture();f.curriculum.modules=f.curriculum.modules.filter(m=>m.id!=='09.03');assert.throws(()=>queue(f),/Unexpected module count/);
});
test('all phases expose requirements without implying qualification',()=>{
 const q=queue(fixture());assert.equal(q.phases.length,PROGRAM.length);
 for(const p of q.phases){assert.ok(p.requiredRuntimeExamples.length);for(const m of p.modules)assert.equal(m.publicationApproved,false);}
});
