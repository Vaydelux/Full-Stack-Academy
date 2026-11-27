import assert from 'node:assert/strict';

// Never infer test isolation from an environment flag alone.
export function isolatedPgConfig(env){
 assert.equal(env.ACADEMY_ISOLATED_PG,'YES','Explicit isolated PostgreSQL approval required');
 assert.ok(typeof env.PG_TEST_URL==='string'&&env.PG_TEST_URL.length,'PG_TEST_URL required');
 let url;try{url=new URL(env.PG_TEST_URL);}catch{throw Error('Invalid PostgreSQL test URL');}
 assert.ok(['postgres:','postgresql:'].includes(url.protocol),'PostgreSQL URL required');
 assert.ok(['127.0.0.1','[::1]'].includes(url.hostname),'Numeric loopback only');
 assert.ok(!url.search&&!url.hash,'Connection overrides forbidden');
 const database=decodeURIComponent(url.pathname.slice(1));
 const user=decodeURIComponent(url.username),password=decodeURIComponent(url.password);
 assert.match(database,/^academy[_-]test(?:[_-][a-z0-9]+)?$/i,'Dedicated test database required');
 assert.ok(user&&password&&!/[\u0000-\u001f\u007f]/.test(user),'Explicit test role and password required');
 return {host:url.hostname==='[::1]'?'::1':'127.0.0.1',port:Number(url.port||5432),database,user,password,ssl:false,connectionTimeoutMillis:5000,statement_timeout:5000,application_name:'academy-nest-integration'};
}

export async function verifyIsolatedPg(client,config){
 const {rows}=await client.query(`SELECT current_database() AS database, current_user AS role,
 session_user AS session_role, host(inet_server_addr()) AS server,
 current_setting('server_version_num')::integer AS version,
 NOT (rolsuper OR rolcreatedb OR rolcreaterole OR rolreplication OR rolbypassrls) AS restricted,
 NOT EXISTS (SELECT 1 FROM pg_roles privileged WHERE
 (privileged.rolsuper OR privileged.rolcreatedb OR privileged.rolcreaterole OR privileged.rolreplication OR privileged.rolbypassrls)
 AND pg_has_role(current_user, privileged.oid, 'MEMBER')) AS no_privileged_membership
 FROM pg_roles WHERE rolname=current_user`);
 assert.equal(rows.length,1,'Database identity unavailable');
 const row=rows[0];
 assert.equal(row.database,config.database,'Unexpected test database');
 assert.equal(row.role,config.user,'Unexpected test role');
 assert.equal(row.session_role,config.user,'Unexpected session role');
 assert.ok(['127.0.0.1','::1'].includes(row.server),'Server must be loopback');
 assert.ok(Number.isInteger(row.version)&&row.version>=170000&&row.version<180000,'PostgreSQL 17 required');
 assert.equal(row.restricted,true,'Privileged test role refused');
 assert.equal(row.no_privileged_membership,true,'Privileged role membership refused');
}
