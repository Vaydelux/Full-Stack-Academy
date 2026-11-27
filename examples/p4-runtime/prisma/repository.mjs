import assert from 'node:assert/strict';
import {seedTasks,taskPage,exactTitle} from './data-exercises.mjs';
export class AccessDenied extends Error {constructor(){super('Access denied');this.name='AccessDenied';}}
export class Conflict extends Error {constructor(){super('Missing task or stale version');this.name='Conflict';}}
export function taskRepository(db){
 async function scoped(actor,tenant,write,fn){
  assert.ok(typeof actor==='string'&&actor.length&&typeof tenant==='string'&&tenant.length,'Verified actor and requested tenant required');
  return db.$transaction(async tx=>{
   const membership=await tx.membership.findUnique({where:{tenantId_actorId:{tenantId:tenant,actorId:actor}}});
   if(!membership||!['reader','editor'].includes(membership.role)||write&&membership.role!=='editor')throw new AccessDenied();
   return fn(tx);
  });
 }
 return {
  seed:(actor,tenant,rows)=>scoped(actor,tenant,true,tx=>seedTasks(tx,tenant,rows)),
  page:(actor,tenant,opts)=>scoped(actor,tenant,false,tx=>taskPage(tx,tenant,opts)),
  exactTitle:(actor,tenant,title)=>scoped(actor,tenant,false,tx=>exactTitle(tx,tenant,title)),
  list:(actor,tenant)=>scoped(actor,tenant,false,tx=>tx.task.findMany({where:{tenantId:tenant},orderBy:{id:'asc'},select:{id:true,title:true,version:true}})),
  create:(actor,tenant,id,title)=>scoped(actor,tenant,true,tx=>tx.task.create({data:{tenantId:tenant,id,title}})),
  update:(actor,tenant,id,version,title)=>scoped(actor,tenant,true,async tx=>{
   assert.ok(Number.isSafeInteger(version)&&version>0,'Valid version required');
   const result=await tx.task.updateMany({where:{tenantId:tenant,id,version},data:{title,version:{increment:1}}});
   if(result.count!==1)throw new Conflict();
   return tx.task.findUniqueOrThrow({where:{tenantId_id:{tenantId:tenant,id}}});
  }),
  remove:(actor,tenant,id)=>scoped(actor,tenant,true,async tx=>{
   const result=await tx.task.deleteMany({where:{tenantId:tenant,id}});if(result.count!==1)throw new Conflict();
  }),
 };
}
