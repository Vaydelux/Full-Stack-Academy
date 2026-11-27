import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from './generated/client.ts';
import {PrismaPg} from '@prisma/adapter-pg';
import {pgConfig} from '../guard.mjs';
import {taskRepository,AccessDenied,Conflict} from './repository.mjs';

test('real Prisma generated client: tenant CRUD, permissions, constraints, rollback and optimistic conflict',{timeout:45000},async()=>{
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:pgConfig(),connectionTimeoutMillis:5000})});
 const prefix=randomUUID(),alpha=prefix+'-alpha',beta=prefix+'-beta',actor=prefix+'-actor',reader=prefix+'-reader',other=prefix+'-other';
 const repo=taskRepository(db);
 try{
  await db.membership.createMany({data:[{tenantId:alpha,actorId:actor,role:'editor'},{tenantId:alpha,actorId:reader,role:'reader'},{tenantId:beta,actorId:other,role:'editor'}]});
  await repo.create(actor,alpha,'same','Alpha');await repo.create(other,beta,'same','Beta');
  assert.deepEqual(await repo.list(reader,alpha),[{id:'same',title:'Alpha',version:1}]);
  await assert.rejects(repo.list(actor,beta),AccessDenied);
  await assert.rejects(repo.update(reader,alpha,'same',1,'wrong'),AccessDenied);
  await assert.rejects(repo.remove(actor,beta,'same'),AccessDenied);
  await assert.rejects(repo.create(actor,alpha,'same','duplicate'),e=>e?.code==='P2002');
  const changed=await repo.update(actor,alpha,'same',1,'New alpha');assert.equal(changed.version,2);
  await assert.rejects(repo.update(actor,alpha,'same',1,'stale'),Conflict);
  assert.deepEqual(await repo.list(other,beta),[{id:'same',title:'Beta',version:1}]);
  const forced=new Error('Deliberate rollback');
  await assert.rejects(db.$transaction(async tx=>{await tx.task.create({data:{tenantId:alpha,id:'rollback',title:'not committed'}});throw forced;}),e=>e===forced);
  assert.equal(await db.task.count({where:{tenantId:alpha,id:'rollback'}}),0);
  await db.membership.delete({where:{tenantId_actorId:{tenantId:alpha,actorId:reader}}});
  await assert.rejects(repo.list(reader,alpha),AccessDenied);
  await repo.remove(actor,alpha,'same');assert.deepEqual(await repo.list(actor,alpha),[]);
 }finally{
  try{await db.task.deleteMany({where:{tenantId:{in:[alpha,beta]}}});await db.membership.deleteMany({where:{tenantId:{in:[alpha,beta]}}});}
  finally{await db.$disconnect();}
 }
});

test('real Prisma: repeatable seed, tenant filters, bounded keyset, raw parameters and concurrent writers',{timeout:60000},async()=>{
 const connect=()=>new PrismaClient({adapter:new PrismaPg({connectionString:pgConfig(),connectionTimeoutMillis:5000})});
 const a=connect(),b=connect(),prefix=randomUUID(),alpha=prefix+'-alpha',beta=prefix+'-beta';
 const ids=['01','02','03','04','05'],title="literal ' OR '1'='1";
 try{
  const actor=prefix+'-editor',reader=prefix+'-reader',repo=taskRepository(a);
  await a.membership.createMany({data:[{tenantId:alpha,actorId:actor,role:'editor'},{tenantId:alpha,actorId:reader,role:'reader'}]});
  const seed=()=>repo.seed(actor,alpha,ids.map(id=>({id,title:id==='03'?title:'Task '+id})));
  assert.equal((await seed()).count,5);assert.equal((await seed()).count,0);
  await b.task.create({data:{tenantId:beta,id:'03',title}});
  assert.equal(await a.task.count({where:{tenantId:alpha}}),5);
  assert.deepEqual(await a.task.findMany({where:{tenantId:alpha,title},select:{id:true}}),[{id:'03'}]);
  assert.deepEqual(await a.task.findUnique({where:{tenantId_id:{tenantId:alpha,id:'03'}},select:{title:true}}),{title});
  await assert.rejects(repo.seed(reader,alpha,[{id:'denied',title:'Denied'}]),AccessDenied);
  await assert.rejects(repo.page(actor,beta),AccessDenied);
  await assert.rejects(repo.exactTitle(actor,beta,title),AccessDenied);
  const first=await repo.page(reader,alpha,{limit:2});assert.deepEqual(first.items.map(r=>r.id),['01','02']);assert.equal(first.next,'02');
  const second=await repo.page(reader,alpha,{after:first.next,limit:2});assert.deepEqual(second.items.map(r=>r.id),['03','04']);assert.equal(second.next,'04');
  const third=await repo.page(reader,alpha,{after:second.next,limit:2});assert.deepEqual(third.items.map(r=>r.id),['05']);assert.equal(third.next,null);
  assert.deepEqual(await repo.page(reader,alpha,{after:'05',limit:2}),{items:[],next:null});
  const exact=await repo.exactTitle(reader,alpha,title);
  assert.deepEqual(exact,[{id:'03',title,version:1}]);
  const absent=await repo.exactTitle(reader,alpha,"missing ' OR 1=1 --");
  assert.deepEqual(absent,[]);
  const [left,right]=await Promise.all([a,b].map(db=>db.task.findUniqueOrThrow({where:{tenantId_id:{tenantId:alpha,id:'03'}}})));
  assert.equal(left.version,1);assert.equal(right.version,1);
  const results=await Promise.all([a,b].map((db,i)=>db.task.updateMany({where:{tenantId:alpha,id:'03',version:1},data:{title:'Winner '+i,version:{increment:1}}})));
  assert.deepEqual(results.map(r=>r.count).sort(),[0,1]);
  const final=await a.task.findUniqueOrThrow({where:{tenantId_id:{tenantId:alpha,id:'03'}}});
  assert.equal(final.version,2);assert.equal(final.title,'Winner '+results.findIndex(r=>r.count===1));
  assert.deepEqual(await b.task.findUnique({where:{tenantId_id:{tenantId:beta,id:'03'}},select:{title:true,version:true}}),{title,version:1});
 }finally{try{await a.task.deleteMany({where:{tenantId:{in:[alpha,beta]}}});await a.membership.deleteMany({where:{tenantId:alpha}});}finally{await Promise.all([a.$disconnect(),b.$disconnect()]);}}
});
