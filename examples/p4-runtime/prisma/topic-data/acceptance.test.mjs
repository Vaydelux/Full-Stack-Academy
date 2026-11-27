import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {once} from 'node:events';
import {randomBytes} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {PrismaClient} from '../generated/topic-data/client.ts';
import {PrismaPg} from '@prisma/adapter-pg';
import {Client} from 'pg';
import {pgConfig,preflightPg} from '../../guard.mjs';
import {loadPair} from './load-pair.mjs';
const url=pgConfig(),db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[{emit:'event',level:'query'}]});
let queries=0;db.$on('query',()=>queries++);
const pairs=await Promise.all(Array.from({length:8},(_,i)=>loadPair(i+1)));
const secret='synthetic-secret-never-return',a='alpha',b='beta';
const owner=(id)=>({id,displayName:'Owner '+id,passwordHash:secret,internalRole:'internal'});
const task=(id,tenantId,projectId=1)=>({id,tenantId,title:'Task '+id,ownerId:tenantId===a?1:2,projectId,createdAt:new Date('2026-01-01T00:00:00Z')});
async function reset(){
 await db.task.deleteMany();await db.project.deleteMany();await db.wallet.deleteMany();await db.owner.deleteMany();
 await db.owner.createMany({data:[owner(1),owner(2)]});
 await db.project.createMany({data:[{tenantId:a,id:1,name:'Alpha project'},{tenantId:b,id:2,name:'Private beta project'}]});
 await db.task.createMany({data:[task(1,a),task(2,a),task(3,a),task(99,b,2)]});
}
const pre=new Client({connectionString:url});
try{
 await pre.connect();await preflightPg(pre);
 const {rows}=await pre.query("SELECT has_schema_privilege(current_user,'public','CREATE') AS can_create, current_user AS role");
 assert.equal(rows[0].can_create,false);assert.equal(rows[0].role,'academy_prisma_learner');
}finally{await pre.end();}
test.after(async()=>{await db.$disconnect();});
const check=(i,fn)=>test('13.02.0'+i,{timeout:60000},async()=>{await reset();await fn(pairs[i-1]);console.log('TOPIC '+JSON.stringify({id:'13.02.0'+i,sourceDigest:pairs[i-1].sourceDigest,positivePassed:true,negativePassed:true,publicationApproved:false}));});
async function request(exercise,kind,id){
 const token=randomBytes(24).toString('hex');
 const server=createServer(async(req,res)=>{
  const tenant=req.headers.authorization==='Bearer '+token?a:null;
  res.setHeader('Content-Type','application/json');
  if(!tenant){res.writeHead(401);res.end('{}');return;}
  try{
   const value=await exercise(tenant,id);res.writeHead(value===null?404:200);res.end(JSON.stringify(value??{}));
  }catch{res.writeHead(500);res.end('{}');}
 });
 server.listen(0,'127.0.0.1');await once(server,'listening');
 try{
  const origin='http://127.0.0.1:'+server.address().port;
  const denied=await fetch(origin,{signal:AbortSignal.timeout(5000)});assert.equal(denied.status,401);
  const res=await fetch(origin,{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(5000)});
  const text=await res.text();assert.ok(!text.includes(secret));
  return {status:res.status,body:JSON.parse(text)};
 }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
}
check(1,async({red,green})=>{
 const run=(fn,id)=>request((tenant,id)=>fn===red?fn(db,id):fn(db,tenant,id),'task',id);
 assert.equal((await run(red,99)).body.id,99);
 assert.deepEqual(await run(green,1),{status:200,body:{id:1,title:'Task 1',status:'open'}});
 assert.deepEqual(await run(green,99),{status:404,body:{}});
});
check(2,async({red,green})=>{
 const unsafe=await red(db,a);assert.ok(JSON.stringify(unsafe).includes(secret));
 const safe=await green(db,a);assert.equal(safe.length,3);
 for(const row of safe){assert.deepEqual(Object.keys(row).sort(),['id','owner','title']);assert.deepEqual(Object.keys(row.owner).sort(),['displayName','id']);}
 assert.ok(!JSON.stringify(safe).includes(secret));assert.ok(!JSON.stringify(safe).includes('internalRole'));
});
check(3,async({red,green})=>{
 await red(db,99,'cross tenant');assert.equal((await db.task.findUniqueOrThrow({where:{id:99}})).title,'cross tenant');
 await reset();await green(db,a,1,'Allowed update');
 for(const args of [[a,99,'Forbidden update'],[a,1000,'Missing task'],[a,1,'x']])await assert.rejects(green(db,...args));
 assert.equal((await db.task.findUniqueOrThrow({where:{id:99}})).title,'Task 99');
 assert.equal((await db.task.findUniqueOrThrow({where:{id:1}})).title,'Allowed update');
});
check(4,async({red,green})=>{
 const seed=()=>db.wallet.createMany({data:[{id:1,tenantId:a,balance:100},{id:2,tenantId:a,balance:0},{id:3,tenantId:a,balance:0},{id:99,tenantId:b,balance:0}]});
 const bal=async id=>(await db.wallet.findUniqueOrThrow({where:{id}})).balance;
 await seed();await assert.rejects(red(db,a,1,1000,60));assert.equal(await bal(1),40);
 await db.wallet.deleteMany();await seed();
 for(const args of [[a,1,1000,60],[a,1,2,101],[a,1,99,60]]){await assert.rejects(green(db,...args));assert.equal(await bal(1),100);}
 const second=new PrismaClient({adapter:new PrismaPg({connectionString:url})});
 try{const results=await Promise.allSettled([green(db,a,1,2,80),green(second,a,1,3,80)]);
 assert.equal(results.filter(x=>x.status==='fulfilled').length,1);assert.equal(await bal(1),20);assert.equal((await bal(2))+(await bal(3)),80);assert.equal(await bal(99),0);}
 finally{await second.$disconnect();}
});
check(5,async({red,green})=>{
 const first=await green(db,a,2,null,0);assert.deepEqual(first.map(x=>x.id),[1,2]);
 const next=await green(db,a,2,2,1);assert.deepEqual(next.map(x=>x.id),[3]);
 assert.deepEqual(await green(db,a,2,3,2),[]);
 await assert.rejects(green(db,a,2,99,0));await assert.rejects(green(db,a,2,1000,0));
 assert.deepEqual(await green(db,'empty',2,null,0),[]);
 const old=(await red(db,a,2,null,0)).map(x=>x.id);assert.equal(old.length,3);
 // Offset pages shift on removal; keyset resumes from the retained cursor.
 await db.task.delete({where:{id:1}});await db.task.create({data:task(4,a)});
 assert.deepEqual((await green(db,a,2,2,1)).map(x=>x.id),[3,4]);
 // Red implementation ignores foreign cursor entirely.
 assert.ok((await red(db,a,2,99,0)).length>0);
});
check(6,async({red,green})=>{
 const dup=()=>db.task.create({data:task(1,a)});
 const missing=()=>db.task.update({where:{id:1000},data:{title:'missing'}});
 assert.deepEqual(await green(dup),{status:409,error:'Conflict'});
 assert.deepEqual(await green(missing),{status:404,error:'Not found'});
 const unknown=async()=>{throw Error(secret);};
 assert.ok(JSON.stringify(await red(unknown)).includes(secret));
 assert.deepEqual(await green(unknown),{status:500,error:'Request failed'});
});
check(7,async({red,green})=>{
 await db.project.deleteMany();await db.task.deleteMany();
 for(const size of [1,10,50]){
  await db.task.deleteMany();await db.project.deleteMany();
  await db.project.createMany({data:[...Array.from({length:size},(_,i)=>({id:i+1,tenantId:a,name:'Project '+i})),{id:1,tenantId:b,name:'Beta'}]});
  await db.task.createMany({data:[task(1,a,1),task(99,b,1)]});
  let start=queries,t=performance.now();const unsafe=await red(db,a);const redQueries=queries-start,redMs=performance.now()-t;
  assert.ok(unsafe[0].tasks.some(x=>x.id===99));
  start=queries;t=performance.now();const safe=await green(db,a);const greenQueries=queries-start,greenMs=performance.now()-t;
  assert.equal(safe.length,size);assert.deepEqual(safe[0].tasks,[{id:1,title:'Task 1',projectId:1}]);
  assert.ok(safe.slice(1).every(x=>x.tasks.length===0));
  assert.equal(greenQueries,2);assert.equal(redQueries,size+1);
  console.log('MEASURE '+JSON.stringify({projects:size,redQueries,greenQueries,redMs,greenMs,redBytes:Buffer.byteLength(JSON.stringify(unsafe)),greenBytes:Buffer.byteLength(JSON.stringify(safe))}));
 }
});
check(8,async({red,green})=>{
 const unsafe=await request((tenant,id)=>red(db,id),'project',2);assert.ok(unsafe.body.some(x=>x.id===99));
 assert.deepEqual((await request((tenant,id)=>green(db,tenant,id),'project',2)).body,[]);
 const safe=await request((tenant,id)=>green(db,tenant,id),'project',1);assert.equal(safe.status,200);
 assert.equal(safe.body.length,3);assert.ok(safe.body.every(x=>Object.keys(x).sort().join(',')==='id,status,title'));
});
