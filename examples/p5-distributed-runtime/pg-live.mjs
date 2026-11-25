import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {distributedPgUrl,pgPreflight,requireInstalled} from './guards.mjs';
import {checkedSchema,consumeOnce} from './outbox.mjs';
export async function withDatabase(fn){
 requireInstalled(new URL('.',import.meta.url));const url=distributedPgUrl();
 for(const key of Object.keys(process.env))if(/^PG/i.test(key))delete process.env[key];
 const {Pool}=await import('pg');const pool=new Pool({connectionString:url,max:6,connectionTimeoutMillis:4000,statement_timeout:12000,lock_timeout:8000});
 const schema='academy_'+randomUUID().replaceAll('-',''),s=checkedSchema(schema);let created=false;
 try{
  const connection=await pool.connect();try{await pgPreflight(connection);}finally{connection.release();}
  await pool.query('CREATE SCHEMA '+s);created=true;
  await pool.query('CREATE TABLE '+s+'.wallets(id int PRIMARY KEY,balance int NOT NULL CHECK(balance>=0),version int NOT NULL DEFAULT 1); INSERT INTO '+s+'.wallets(id,balance) VALUES (1,10),(2,10); CREATE TABLE '+s+'.jobs(id int PRIMARY KEY); INSERT INTO '+s+'.jobs VALUES(1),(2); CREATE TABLE '+s+'.receipts(tenant text,event_id text,PRIMARY KEY(tenant,event_id)); CREATE TABLE '+s+'.effects(tenant text,event_id text,PRIMARY KEY(tenant,event_id)); CREATE TABLE '+s+'.outbox(tenant text,event_id text,dispatched boolean NOT NULL DEFAULT false,PRIMARY KEY(tenant,event_id))');
  return await fn(pool,schema,s);
 }finally{try{if(created)await pool.query('DROP SCHEMA '+s+' CASCADE');}finally{await pool.end();}}
}
async function transactionPair(pool,fn){
 const a=await pool.connect();let b;
 try{b=await pool.connect();assert.notEqual((await a.query('SELECT pg_backend_pid() AS pid')).rows[0].pid,(await b.query('SELECT pg_backend_pid() AS pid')).rows[0].pid);await fn(a,b);}
 finally{for(const c of [b,a])if(c){let discard=false;try{await c.query('ROLLBACK');}catch{discard=true;}c.release(discard);}}
}
export async function concurrency(){
 await withDatabase(async(pool,schema,s)=>{
  const wallets=s+'.wallets',jobs=s+'.jobs';
  await transactionPair(pool,async(a,b)=>{
   // Snapshot stays stable even after another physical session commits.
   await a.query('BEGIN ISOLATION LEVEL REPEATABLE READ');
   const read=c=>c.query('SELECT balance,version FROM '+wallets+' WHERE id=1');
   assert.deepEqual((await read(a)).rows,[{balance:10,version:1}]);
   await b.query('UPDATE '+wallets+' SET balance=11,version=2 WHERE id=1');
   assert.deepEqual((await read(a)).rows,[{balance:10,version:1}]);await a.query('COMMIT');
   assert.deepEqual((await read(a)).rows,[{balance:11,version:2}]);
   // Two independently locked workers claim different rows.
   await a.query('BEGIN');await b.query('BEGIN');
   const claim=c=>c.query('SELECT id FROM '+jobs+' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1');
   assert.deepEqual((await claim(a)).rows,[{id:1}]);assert.deepEqual((await claim(b)).rows,[{id:2}]);
   await a.query('ROLLBACK');await b.query('ROLLBACK');
   // Deliberate deadlock: two opposing lock orders, one exact SQLSTATE 40P01.
   await a.query('BEGIN');await b.query('BEGIN');await a.query('SELECT id FROM '+wallets+' WHERE id=1 FOR UPDATE');await b.query('SELECT id FROM '+wallets+' WHERE id=2 FOR UPDATE');
   const locked=await Promise.allSettled([a.query('UPDATE '+wallets+' SET balance=balance+1 WHERE id=2'),b.query('UPDATE '+wallets+' SET balance=balance+1 WHERE id=1')]);
   assert.equal(locked.filter(x=>x.status==='fulfilled').length,1);assert.equal(locked.filter(x=>x.status==='rejected'&&x.reason.code==='40P01').length,1);
   await a.query('ROLLBACK');await b.query('ROLLBACK');
   // The unsafe read/modify/write loses one increment; version-guarded writes reject it.
   const first=(await read(a)).rows[0],second=(await read(b)).rows[0];assert.deepEqual(first,second);
   await a.query('UPDATE '+wallets+' SET balance=$1 WHERE id=1',[first.balance+1]);await b.query('UPDATE '+wallets+' SET balance=$1 WHERE id=1',[second.balance+1]);
   assert.equal((await read(a)).rows[0].balance,first.balance+1);
   const update=(c,v)=>c.query('UPDATE '+wallets+' SET balance=balance+1,version=version+1 WHERE id=1 AND version=$1',[v]);
   const wins=await Promise.all([update(a,first.version),update(b,second.version)]);assert.deepEqual(wins.map(x=>x.rowCount).sort(),[0,1]);
   // Atomic transfer failure is rolled back, not partially committed.
   const before=(await a.query('SELECT id,balance FROM '+wallets+' ORDER BY id')).rows;
   await a.query('BEGIN');await a.query('UPDATE '+wallets+' SET balance=balance-1 WHERE id=1');await assert.rejects(a.query('UPDATE '+wallets+' SET balance=-1 WHERE id=2'),e=>e.code==='23514');await a.query('ROLLBACK');
   assert.deepEqual((await b.query('SELECT id,balance FROM '+wallets+' ORDER BY id')).rows,before);
   await a.query('BEGIN');await a.query('UPDATE '+wallets+' SET balance=balance-1 WHERE id=1');await a.query('UPDATE '+wallets+' SET balance=balance+1 WHERE id=2');await a.query('COMMIT');
   const after=(await b.query('SELECT id,balance FROM '+wallets+' ORDER BY id')).rows;assert.equal(after[0].balance,before[0].balance-1);assert.equal(after[1].balance,before[1].balance+1);
  });
  // Competing consumers race on the unique receipt; effect is committed once.
  const outcomes=await Promise.all([consumeOnce(pool,schema,{tenant:'alpha',id:'race'}),consumeOnce(pool,schema,{tenant:'alpha',id:'race'})]);assert.deepEqual(outcomes.sort(),['applied','duplicate']);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM '+s+'.effects')).rows[0].n,1);
  await assert.rejects(consumeOnce(pool,schema,{tenant:'alpha',id:'rollback'},{failBeforeCommit:true}),/Deliberate/);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM '+s+'.receipts WHERE event_id=$1',['rollback'])).rows[0].n,0);
 });
 console.log('Real independent PostgreSQL sessions: snapshot, locks, deadlock, lost update, optimistic write, transfer, unique race and rollback passed. Publication NOT approved.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await concurrency();
