/** Advisory P1-P7 publication queue. Inventory is not runtime or review evidence. */
import assert from 'node:assert/strict';

const phase = (id, title, tracks, modules, additions, gates) => Object.freeze({ id, title, tracks, modules, additions, gates });
export const PROGRAM = Object.freeze([
 phase('P1','Forms and server state',['09'],2,16,['Real RHF/Query browser and Next SSR','Named accessibility review']),
 phase('P2','NestJS and Fastify',['11'],4,32,['Genuine Nest lock and installed runtime','Actual HTTP and database integration']),
 phase('P3','PostgreSQL',['12'],5,40,['Disposable PostgreSQL SQL and recovery tests']),
 phase('P4','Prisma and Supabase',['13','14'],8,64,['Actual ORM migrations, Auth, RLS and storage']),
 phase('P5','Security and integrations',['15','16','17','18'],15,119,['Real database, Redis, realtime and provider-specific tests']),
 phase('P6','Operations and architecture',['19','20','21','22','23'],18,144,['Actual test, delivery, observability and performance exercises']),
 phase('P7','Platforms, enterprise and capstone',['24','25','26','27'],17,136,['Actual native, data, identity, billing and capstone integration tests']),
]);
const legacy = '15.02.04';
const phaseFor = courseModule => courseModule.track === '09'
 ? (['09.02','09.03'].includes(courseModule.id) ? PROGRAM[0] : undefined)
 : PROGRAM.find(p=>p.tracks.includes(courseModule.track));

export function buildPublicationQueue(curriculum, publishedIds, stagedIds) {
 const published=new Set(publishedIds), staged=new Set(stagedIds);
 const groups=new Map(PROGRAM.map(p=>[p.id,[]]));
 const issues=[];
 let baseline=0;
 for(const courseModule of [...curriculum.modules].sort((a,b)=>a.id.localeCompare(b.id))){
  const ids=curriculum.lessons.filter(l=>l.moduleId===courseModule.id).map(l=>l.id).sort();
  const p=phaseFor(courseModule);
  if(!p){
   baseline+=ids.length;
   if(ids.some(id=>!published.has(id)))issues.push('Previously complete module regressed: '+courseModule.id);
   continue;
  }
  const preexisting=ids.filter(id=>id===legacy);
  if(preexisting.some(id=>!published.has(id)))issues.push('Previously published identity lesson missing: '+legacy);
  const planned=ids.filter(id=>id!==legacy);
  const remaining=planned.filter(id=>!published.has(id));
  const missingSource=remaining.filter(id=>!staged.has(id));
  const complete=remaining.length===0;
  if(ids.length!==8)issues.push('Unexpected canonical module size: '+courseModule.id);
  if(remaining.length!==planned.length&&!complete)issues.push('Partial module publication: '+courseModule.id);
  if(missingSource.length)issues.push('Missing manuscript coverage: '+courseModule.id);
  groups.get(p.id).push({id:courseModule.id,title:courseModule.title,planned:planned.length,published:planned.length-remaining.length,
   remaining,missingSource,preexisting,complete,qualification:'not-evaluated',publicationApproved:false});
 }
 assert.equal(baseline+1,338,'Historical publication scope changed');
 let target=baseline+1, earlierIncomplete=false;
 const phases=PROGRAM.map(p=>{
  const modules=groups.get(p.id);
  assert.equal(modules.length,p.modules,'Unexpected module count for '+p.id);
  assert.equal(modules.reduce((n,m)=>n+m.planned,0),p.additions,'Unexpected topic count for '+p.id);
  target+=p.additions;
  const remaining=modules.reduce((n,m)=>n+m.remaining.length,0);
  const completed=modules.filter(m=>m.complete).length;
  if(earlierIncomplete&&completed)issues.push('Publication phase order violated: '+p.id);
  if(remaining)earlierIncomplete=true;
  return {id:p.id,title:p.title,targetPublished:target,planned:p.additions,remaining,completedModules:completed,
   requiredRuntimeExamples:p.gates,modules};
 });
 const pending=phases.flatMap(p=>p.modules.filter(m=>!m.complete).map(m=>({phase:p.id,...m})));
 return {baselinePublished:baseline+1,remaining:pending.reduce((n,m)=>n+m.remaining.length,0),remainingModules:pending.length,
  next:pending[0]??null,phases,issues,qualification:'not-evaluated',publicationApproved:false};
}
