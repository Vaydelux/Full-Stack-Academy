import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const part=s=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(s);
export function cacheKeys(run,tenant,id){assert.ok([run,tenant,id].every(part),'Invalid cache identity');const prefix='academy:'+run+':cache:'+tenant+':'+id;return [prefix+':generation',prefix+':value'];}
export const SNAPSHOT="local g=redis.call('GET',KEYS[1]); if not g then g=ARGV[1]; redis.call('SET',KEYS[1],g,'PX',ARGV[2]); redis.call('DEL',KEYS[2]); end; return {g,redis.call('GET',KEYS[2])}";
export const FILL="if redis.call('GET',KEYS[1])~=ARGV[1] then return 0 end; redis.call('SET',KEYS[2],ARGV[2],'PX',ARGV[3]); return 1";
export const INVALIDATE="redis.call('SET',KEYS[1],ARGV[1],'PX',ARGV[2]); redis.call('DEL',KEYS[2]); return 1";
/** Call only AFTER application authorization; this is derived data, not an authority. */
export function redisCatalog(redis,run,{ttlMs=5000}={}){
 assert.ok(part(run)&&Number.isSafeInteger(ttlMs)&&ttlMs>=50&&ttlMs<=60000,'Invalid cache configuration');const generationTtl=String(ttlMs+60000);
 return {
  async read(tenant,id,load){assert.equal(typeof load,'function');const keys=cacheKeys(run,tenant,id);
   for(let i=0;i<4;i++){const [generation,value]=await redis.eval(SNAPSHOT,2,...keys,randomUUID(),generationTtl);assert.equal(typeof generation,'string');if(value!==null&&value!==false)return JSON.parse(value);
    const result=await load(tenant,id);if(result==null)return result;const payload=JSON.stringify(result);assert.ok(typeof payload==='string'&&Buffer.byteLength(payload)<=65536,'Invalid cache payload');
    if(await redis.eval(FILL,2,...keys,generation,payload,String(ttlMs))===1)return JSON.parse(payload);
   }
   throw Error('Concurrent invalidations prevented a stable cache fill');
  },
  async invalidate(tenant,id){const keys=cacheKeys(run,tenant,id);assert.equal(await redis.eval(INVALIDATE,2,...keys,randomUUID(),generationTtl),1);},
  async cleanup(tenant,id){await redis.del(...cacheKeys(run,tenant,id));}
 };
}
