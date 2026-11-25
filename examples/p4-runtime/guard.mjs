import assert from 'node:assert/strict';
export function pgConfig(env=process.env){
 assert.equal(env.ACADEMY_PRISMA_ISOLATED,'YES','Use a disposable Prisma database only');
 const u=new URL(env.ACADEMY_PRISMA_URL??'');
 assert.ok(['postgres:','postgresql:'].includes(u.protocol),'PostgreSQL URL required');
 assert.ok(['127.0.0.1','[::1]'].includes(u.hostname),'Numeric loopback required');
 assert.equal(u.pathname,'/academy_test_prisma','Dedicated database required');
 assert.ok(!u.search&&!u.hash,'Connection overrides forbidden');
 assert.ok(u.username&&u.password,'Explicit test credentials required');
 return u.href;
}
export function supabaseConfig(env=process.env){
 assert.equal(env.ACADEMY_SUPABASE_ISOLATED,'YES','Use an independent disposable local stack only');
 const u=new URL(env.ACADEMY_SUPABASE_URL??'');
 assert.ok(u.protocol==='http:'&&['127.0.0.1','[::1]'].includes(u.hostname)&&u.port&&u.pathname==='/'&&!u.search&&!u.hash&&!u.username&&!u.password,'Explicit numeric loopback origin required');
 const key=env.ACADEMY_SUPABASE_PUBLIC_KEY??'';
 if(!key.startsWith('sb_publishable_')){
  const parts=key.split('.');assert.equal(parts.length,3,'Publishable or legacy anon key required');
  let claims;try{claims=JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8'));}catch{throw Error('Invalid legacy anon key');}
  assert.equal(claims.role,'anon','Privileged key refused');
 }
 const users=['A','B'].map(s=>({email:env['ACADEMY_SUPABASE_'+s+'_EMAIL'],password:env['ACADEMY_SUPABASE_'+s+'_PASSWORD']}));
 for(const user of users){assert.ok(/^[a-z0-9._+-]+@example\.test$/i.test(user.email??''),'Synthetic example.test email required');assert.ok(typeof user.password==='string'&&user.password.length>=12,'Explicit test password required');}
 assert.notEqual(users[0].email.toLowerCase(),users[1].email.toLowerCase(),'Two distinct accounts required');
 return {origin:u.origin,key,users};
}
export function assertDbIdentity(row){
 assert.equal(row.database,'academy_test_prisma');assert.ok(row.loopback&&row.safeRole&&Number(row.version)>=170000,'Unsafe database or role');
}
export async function preflightPg(client){
 const {rows}=await client.query("SELECT current_database() AS database, (inet_server_addr() <<= inet '127.0.0.0/8' OR inet_server_addr()=inet '::1') AS loopback, current_setting('server_version_num') AS version, (NOT rolsuper AND NOT rolcreatedb AND NOT rolcreaterole AND NOT rolreplication AND NOT rolbypassrls) AS \"safeRole\" FROM pg_roles WHERE rolname=current_user");
 assert.equal(rows.length,1);assertDbIdentity(rows[0]);
}
