import assert from 'node:assert/strict';

/** Only guarded published PostgreSQL modules may enter the local lab runner. */
export function sqlLabTimeout(file){
 const match=/^labs\/postgresql-12-0([123])-0[1-8]\/solution\.test\.mjs$/.exec(file);
 assert.ok(match,'Invalid published PostgreSQL test path: '+file);
 return match[1]==='3'?150_000:60_000;
}

/** Select an explicitly separate Nest DB for mixed SQL/Nest release gates. */
export function nestLabEnvironment(env,hasSql){
 if(!hasSql&&!env.ACADEMY_NEST_PG_TEST_URL)return env;
 const url=env.ACADEMY_NEST_PG_TEST_URL;
 assert.ok(typeof url==='string'&&url.length,'Separate Nest PostgreSQL URL required for mixed lab gate');
 const nest=new URL(url),sql=new URL(env.PG_TEST_URL);
 for(const u of [nest,sql]){
  assert.ok(['postgres:','postgresql:'].includes(u.protocol)&&['127.0.0.1','[::1]'].includes(u.hostname)&&!u.search&&!u.hash&&u.username&&u.password,'Explicit restricted numeric-loopback PostgreSQL URL required');
  assert.match(decodeURIComponent(u.pathname),/^\/academy[_-]test(?:[_-][a-z0-9]+)?$/i);
 }
 assert.notEqual(decodeURIComponent(nest.pathname).toLowerCase(),decodeURIComponent(sql.pathname).toLowerCase(),'Nest and SQL must use distinct disposable databases');
 return {...env,PG_TEST_URL:url};
}
