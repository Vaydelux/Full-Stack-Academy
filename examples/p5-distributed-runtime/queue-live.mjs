import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
import {redisOptions} from './guards.mjs';
import {openRedis} from './redis-live.mjs';
import {withDatabase} from './pg-live.mjs';
import {consumeOnce} from './outbox.mjs';
const idFor=e=>createHash('sha256').update(JSON.stringify([e.tenant,e.id])).digest('hex');
async function settle(queue,id,state){
 const deadline=Date.now()+20000;
 while(Date.now()<deadline){const job=await queue.getJob(id);if(job&&await job.getState()===state)return job;await delay(100);}
 throw Error('Expected job state not reached: '+state);
}
export async function queueAcceptance(){
 const probe=await openRedis();probe.disconnect();const {Queue,Worker}=await import('bullmq');
 const name='academy-'+randomUUID(),options=redisOptions();
 await withDatabase(async(pool,schema,s)=>{
  const queue=new Queue(name,{connection:options});queue.on('error',()=>{});let worker;
  const event={tenant:'alpha',id:'event-1'},bad={tenant:'alpha',id:'poison'};
  const config={attempts:2,backoff:{type:'fixed',delay:100},removeOnComplete:false,removeOnFail:false};
  // Commit intent before enqueue. If dispatch marking fails, the same retained job ID can be submitted again.
  async function publish(event){
   const result=await pool.query('SELECT dispatched FROM '+s+'.outbox WHERE tenant=$1 AND event_id=$2',[event.tenant,event.id]);assert.equal(result.rowCount,1,'Missing durable intent');
   if(result.rows[0].dispatched)return;
   await queue.add('effect',event,{...config,jobId:idFor(event)});
   await pool.query('UPDATE '+s+'.outbox SET dispatched=true WHERE tenant=$1 AND event_id=$2',[event.tenant,event.id]);
  }
  try{
   await queue.waitUntilReady();
   await pool.query('INSERT INTO '+s+'.outbox(tenant,event_id) VALUES($1,$2),($1,$3)',[event.tenant,event.id,bad.id]);
   // Dispatch twice before starting the worker; producer-side job ID deduplication.
   await queue.add('effect',event,{...config,jobId:idFor(event)});await publish(event);await publish(bad);
   assert.equal(await queue.getWaitingCount(),2);
   worker=new Worker(name,async job=>{
    const failBeforeCommit=job.data.id===bad.id||job.data.id===event.id&&job.attemptsMade===0&&job.id===idFor(event);
    return consumeOnce(pool,schema,job.data,{failBeforeCommit});
   },{connection:{...options,maxRetriesPerRequest:null,enableOfflineQueue:true},concurrency:2});
   worker.on('error',()=>{});
   const good=await settle(queue,idFor(event),'completed'),failed=await settle(queue,idFor(bad),'failed');
   assert.equal(good.attemptsMade,2);assert.equal(failed.attemptsMade,2);
   // Different transport job ID, same logical event, simulating redelivery after an uncertain acknowledgment.
   const replay=await queue.add('effect',event,{...config,jobId:'replay-'+idFor(event)});
   const repeated=await settle(queue,replay.id,'completed');assert.equal(repeated.returnvalue,'duplicate');
   const rows=(await pool.query('SELECT tenant,event_id FROM '+s+'.effects ORDER BY event_id')).rows;
   assert.deepEqual(rows,[{tenant:'alpha',event_id:'event-1'}]);
   assert.equal((await pool.query('SELECT count(*)::int AS n FROM '+s+'.receipts')).rows[0].n,1);
  }finally{try{if(worker)await worker.close(true);}finally{try{await queue.obliterate({force:true});}finally{await queue.close();}}}
 });
 console.log('Real BullMQ + PostgreSQL: durable intent, job-ID dedupe, retry, failed job, rollback, replay and atomic receipt/effect passed. Publication NOT approved.');
}
