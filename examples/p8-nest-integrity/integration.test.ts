import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {Pool} from 'pg';
import {startLab} from './app';

test('real Nest HTTP and PostgreSQL transfer contract', {timeout:60_000}, async ()=>{
 const url=process.env.ACADEMY_TEST_DATABASE_URL;
 assert.ok(process.env.ACADEMY_ISOLATED_PG==='YES' && url,'Set ACADEMY_ISOLATED_PG=YES and ACADEMY_TEST_DATABASE_URL to a disposable database');
 assert.ok(!new URL(url).searchParams.has('options'),'Connection URL must not override isolation options');
 const schema='academy_p8_'+randomUUID().replaceAll('-','');
 const connection={connectionString:url,connectionTimeoutMillis:5000,statement_timeout:5000,query_timeout:7000};
 const admin=new Pool({...connection,max:1});
 let pool:Pool|undefined;
 let app:Awaited<ReturnType<typeof startLab>>|undefined;
 let created=false;
 try {
  await admin.query('CREATE SCHEMA "'+schema+'"');
  created=true;
  pool=new Pool({...connection,max:4,options:'-c search_path='+schema+',pg_catalog'});
  const check=await pool.query('SELECT current_schema() AS name');
  assert.equal(check.rows[0].name,schema);
  await pool.query(await readFile(resolve(__dirname,'../../p8-backend-integrity/schema.sql'),'utf8'));
  await pool.query('INSERT INTO accounts(id,balance) VALUES (1,100),(2,20)');
  app=await startLab(pool);
  const endpoint=(await app.getUrl())+'/transfers';
  const send=(body:unknown)=>fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
  const request={requestId:randomUUID(),source:1,target:2,amount:30};
  assert.equal((await send({...request,amount:-1})).status,400);
  assert.equal((await send({...request,target:1})).status,400);
  const first=await send(request);assert.equal(first.status,200);assert.deepEqual(await first.json(),{applied:true});
  const replay=await send(request);assert.equal(replay.status,200);assert.deepEqual(await replay.json(),{applied:false});
  assert.equal((await send({...request,amount:31})).status,409);
  assert.equal((await send({...request,requestId:randomUUID(),amount:999})).status,409);
  const competing=await Promise.all([send({...request,requestId:randomUUID(),amount:60}),send({...request,requestId:randomUUID(),amount:60})]);
  assert.deepEqual(competing.map(x=>x.status).sort(),[200,409]);
  const repeated={...request,requestId:randomUUID(),amount:1};
  const responses=await Promise.all([send(repeated),send(repeated)]);
  assert.ok(responses.every(x=>x.status===200));
  const bodies=await Promise.all(responses.map(x=>x.json()));
  assert.deepEqual(bodies.map(x=>x.applied).sort(),[false,true]);
  const rows=await pool.query('SELECT balance::int AS balance, revision::int AS revision FROM accounts ORDER BY id');
  assert.deepEqual(rows.rows,[{balance:9,revision:4},{balance:111,revision:4}]);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM transfer_requests')).rows[0].n,3);

  // Force destination overflow: the source debit and request record must roll back.
  await pool.query('UPDATE accounts SET balance=9223372036854775807 WHERE id=2');
  const overflow={...request,requestId:randomUUID(),amount:1};
  const rejected=await send(overflow);
  assert.equal(rejected.status,500);
  assert.equal((await rejected.json()).message,'Transfer unavailable');
  const after=await pool.query('SELECT balance::text AS balance, revision::int AS revision FROM accounts ORDER BY id');
  assert.deepEqual(after.rows,[{balance:'9',revision:4},{balance:'9223372036854775807',revision:4}]);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM transfer_requests WHERE request_id=$1',[overflow.requestId])).rows[0].n,0);
 } finally {
  try { await app?.close(); }
  finally {
   try { await pool?.end(); }
   finally {
    try { if(created)await admin.query('DROP SCHEMA "'+schema+'" CASCADE'); }
    finally { await admin.end(); }
   }
  }
 }
});
