import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
import {redisOptions,redisPreflight,requireInstalled} from './guards.mjs';
import {redisCatalog,cacheKeys} from './cache.mjs';
export async function openRedis(){
 requireInstalled(new URL('.',import.meta.url));const options=redisOptions(),{default:Redis}=await import('ioredis');
 const client=new Redis({...options,lazyConnect:true,commandTimeout:5000});client.on('error',()=>{});
 try{await client.connect();assert.equal(await client.ping(),'PONG');const config=await client.config('GET','maxmemory-policy');redisPreflight(await client.info(),config[1]);return client;}
 catch(error){client.disconnect();throw error;}
}
export async function redisAcceptance(){
 const run=randomUUID(),a=await openRedis();let b;
 try{
  b=await openRedis();const ca=redisCatalog(a,run,{ttlMs:100}),cb=redisCatalog(b,run,{ttlMs:100});
  let loads=0;assert.deepEqual(await ca.read('alpha','x',async()=>({tenant:'alpha',n:++loads})),{tenant:'alpha',n:1});
  assert.deepEqual(await cb.read('alpha','x',async()=>assert.fail('Unexpected load')),{tenant:'alpha',n:1});
  assert.deepEqual(await cb.read('beta','x',async()=>({tenant:'beta'})),{tenant:'beta'});
  const key=cacheKeys(run,'alpha','x')[1];assert.ok(await a.pttl(key)>0);
  const deadline=Date.now()+3000;while(await a.exists(key)){assert.ok(Date.now()<deadline,'TTL did not expire');await delay(25);}
  assert.deepEqual(await ca.read('alpha','x',async()=>({tenant:'alpha',n:++loads})),{tenant:'alpha',n:2});
  await ca.invalidate('alpha','x');let enter,release;const entered=new Promise(r=>{enter=r;}),resume=new Promise(r=>{release=r;});let first=true;
  const pending=ca.read('alpha','x',async()=>{if(first){first=false;enter();await resume;return {version:1};}return {version:2};});
  try{await Promise.race([entered,delay(3000).then(()=>{throw Error('Loader did not start');})]);await cb.invalidate('alpha','x');}
  finally{release();}
  assert.deepEqual(await pending,{version:2});assert.deepEqual(await cb.read('alpha','x',async()=>assert.fail('Stale cache fill')),{version:2});
  await ca.cleanup('alpha','x');await ca.cleanup('beta','x');
 }finally{if(b)b.disconnect();a.disconnect();}
 console.log('Real Redis: tenant isolation, TTL, shared hit and invalidation race passed. Publication NOT approved.');
}
