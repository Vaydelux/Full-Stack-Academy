import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
export function redisOptions(env=process.env){
 assert.equal(env.ACADEMY_REDIS_ISOLATED,'YES','Use a dedicated disposable Redis instance');
 const u=new URL(env.ACADEMY_REDIS_URL??'');
 assert.ok(u.protocol==='redis:'&&['127.0.0.1','[::1]'].includes(u.hostname)&&u.port&&u.pathname==='/0'&&!u.search&&!u.hash,'Numeric loopback Redis URL, explicit port and DB 0 required');
 return {host:u.hostname==='[::1]'?'::1':u.hostname,port:Number(u.port),db:0,username:decodeURIComponent(u.username)||undefined,password:decodeURIComponent(u.password)||undefined,connectTimeout:4000,enableOfflineQueue:false,maxRetriesPerRequest:1,retryStrategy:()=>null};
}
export function distributedPgUrl(env=process.env){
 assert.equal(env.ACADEMY_DISTRIBUTED_PG_ISOLATED,'YES','Use a dedicated disposable database');
 const u=new URL(env.ACADEMY_DISTRIBUTED_PG_URL??'');
 assert.ok(['postgres:','postgresql:'].includes(u.protocol)&&['127.0.0.1','[::1]'].includes(u.hostname)&&u.port&&u.pathname==='/academy_test_distributed'&&!u.search&&!u.hash&&u.username&&u.password,'Dedicated local PostgreSQL URL required');
 return u.href;
}
export async function pgPreflight(client){
 const {rows}=await client.query("SELECT current_database() AS db, (inet_server_addr() <<= inet '127.0.0.0/8' OR inet_server_addr()=inet '::1') AS local, current_setting('server_version_num')::int AS version, (NOT rolsuper AND NOT rolcreatedb AND NOT rolcreaterole AND NOT rolreplication AND NOT rolbypassrls) AS safe FROM pg_roles WHERE rolname=current_user");
 assert.equal(rows.length,1);assert.equal(rows[0].db,'academy_test_distributed');assert.equal(rows[0].local,true);assert.equal(rows[0].safe,true);assert.ok(rows[0].version>=170000,'PostgreSQL 17+ required');
}
export function redisPreflight(info,policy){
 assert.match(info,/^redis_mode:standalone\r?$/m);const version=info.match(/^redis_version:(\d+)\.(\d+)\.(\d+)\r?$/m);assert.ok(version&&(+version[1]>7||+version[1]===7&&(+version[2]>0||+version[3]>=8)),'Redis 7.0.8+ required');assert.equal(policy,'noeviction','Dedicated queue Redis must use noeviction');
}
export function requireInstalled(root){
 assert.equal(process.versions.node.split('.')[0],'24','Node 24 required');
 const read=p=>JSON.parse(readFileSync(new URL(p,root),'utf8'));const pkg=read('package.json'),lock=read('package-lock.json');assert.ok(lock.lockfileVersion>=3&&lock.packages?.[''],'Genuine npm lockfile required');
 for(const [name,version] of Object.entries(pkg.dependencies)){assert.equal(lock.packages['node_modules/'+name]?.version,version,'Lock mismatch '+name);assert.equal(read('node_modules/'+name+'/package.json').version,version,'Installed version mismatch '+name);}
}
