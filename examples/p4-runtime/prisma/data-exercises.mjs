import assert from 'node:assert/strict';
export async function seedTasks(tx,tenant,rows){
 assert.ok(typeof tenant==='string'&&tenant.length>0);
 assert.ok(Array.isArray(rows)&&rows.length>0&&rows.length<=100);
 assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
 for(const row of rows){assert.ok(typeof row.id==='string'&&row.id.length&&typeof row.title==='string'&&row.title.trim());}
 return tx.task.createMany({data:rows.map(({id,title})=>({tenantId:tenant,id,title})),skipDuplicates:true});
}
export async function taskPage(tx,tenant,{after=null,limit=20}={}){
 assert.ok(typeof tenant==='string'&&tenant.length>0);
 assert.ok(after===null||typeof after==='string'&&after.length>0);
 assert.ok(Number.isSafeInteger(limit)&&limit>=1&&limit<=100);
 const rows=await tx.task.findMany({where:{tenantId:tenant,...(after===null?{}:{id:{gt:after}})},orderBy:{id:'asc'},take:limit+1,select:{id:true,title:true,version:true}});
 const items=rows.slice(0,limit);return {items,next:rows.length>limit?items.at(-1).id:null};
}
export async function exactTitle(tx,tenant,title){
 assert.ok(typeof tenant==='string'&&tenant.length&&typeof title==='string'&&title.length);
 return tx.$queryRaw`SELECT "id", "title", "version" FROM "Task" WHERE "tenantId" = ${tenant} AND "title" = ${title} ORDER BY "id"`;
}
