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
