/** Execute trusted, source-bound SQL fixtures on an explicitly disposable local DB. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
export const sha256 = text => createHash('sha256').update(text).digest('hex');
export function connectionEnvironment(raw, approval, parent = process.env) {
 assert.equal(approval,'YES','Set ACADEMY_ISOLATED_PG=YES only for a disposable local DB');
 assert.ok(typeof raw==='string'&&raw.length,'PG_TEST_URL required');
 const u=new URL(raw);
 assert.ok(['postgres:','postgresql:'].includes(u.protocol),'PostgreSQL URL required');
 assert.ok(['127.0.0.1','localhost','[::1]'].includes(u.hostname),'Loopback only');
 assert.ok(!u.search&&!u.hash,'Connection overrides forbidden');
 const database=decodeURIComponent(u.pathname.slice(1)), user=decodeURIComponent(u.username);
 assert.match(database,/^academy[_-]test(?:[_-][a-z0-9]+)?$/i,'Dedicated test database required');
 assert.ok(user&&!/[\u0000-\u001f\u007f]/.test(user),'Explicit test role required');
 const host=u.hostname==='[::1]'?'::1':'127.0.0.1';
 const env=Object.fromEntries(Object.entries(parent).filter(([key])=>!/^PG/i.test(key)&&!/^ACADEMY_ISOLATED_PG$/i.test(key)));
 return { ...env, PGHOST:host, PGHOSTADDR:host, PGPORT:u.port||'5432', PGDATABASE:database, PGUSER:user, PGPASSWORD:decodeURIComponent(u.password), PGSSLMODE:'disable', PGCONNECT_TIMEOUT:'4', PGAPPNAME:'academy-persistence-lab', LC_ALL:'C', LANG:'C' };
}
export function sqlInvocation({id,fixture,source,acceptance},env){
 assert.match(id,/^12\.0[1-5]\.0[1-8]$/);
 const marker='ACADEMY_ACCEPTANCE_'+id.replaceAll('.','_'), done=marker+'_DONE';
 const messages=[...acceptance.matchAll(/RAISE EXCEPTION '([^'\r\n]+)'/g)].map(m=>m[1]).filter(m=>m.startsWith(id+' '));
 assert.ok(messages.length,'Missing named semantic SQL assertion: '+id);
 const db=env.PGDATABASE;assert.match(db,/^academy[_-]test(?:[_-][a-z0-9]+)?$/i);
 const guard="DO $academy_guard$ BEGIN IF current_database() <> '"+db+"' OR current_setting('server_version_num')::integer < 170000 OR inet_server_addr() IS NULL OR NOT (inet_server_addr() <<= inet '127.0.0.0/8' OR inet_server_addr() = inet '::1') OR NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname=current_user AND NOT rolsuper AND NOT rolcreaterole AND NOT rolcreatedb AND NOT rolreplication AND NOT rolbypassrls) THEN RAISE EXCEPTION 'ACADEMY isolated database guard refused'; END IF; END $academy_guard$;";
 return {args:['-X','--no-password','-q','-A','-t','-v','ON_ERROR_STOP=1','-v','VERBOSITY=verbose'],input:['BEGIN;',"SET LOCAL statement_timeout='5000ms';","SET LOCAL lock_timeout='1000ms';",guard,fixture,source,"SELECT '"+marker+"';",acceptance,'ROLLBACK;',"SELECT '"+done+"';",''].join('\n'),marker,done,messages};
}
export function verifySqlResult(result,inv,variant){
 assert.ok(!result.error&&!result.signal,'SQL process unavailable or interrupted');
 const lines=(result.stdout??'').split(/\r?\n/), errors=(result.stderr??'').split(/\r?\n/).filter(l=>/^ERROR:/.test(l));
 assert.equal(lines.filter(l=>l===inv.marker).length,1,'Acceptance stage was not reached');
 if(variant==='solution'){
  assert.equal(result.status,0,'Instructor SQL failed');assert.equal(errors.length,0,'Unexpected SQL error');assert.equal(lines.filter(l=>l===inv.done).length,1,'Rollback completion not observed');
 }else{
  assert.equal(variant,'starter');assert.equal(result.status,3,'Starter must fail ON_ERROR_STOP');assert.equal(lines.filter(l=>l===inv.done).length,0,'Starter unexpectedly completed');
  assert.equal(errors.length,1,'Expected one semantic assertion error');
  assert.ok(inv.messages.some(message=>errors[0].replace(/^ERROR:\s+P0001:\s+/,'')===message),'Wrong semantic assertion error');
 }
}
export function runSqlPair({id,fixture,starter,solution,acceptance},env=process.env,execute=spawnSync){
 const safe=connectionEnvironment(env.PG_TEST_URL,env.ACADEMY_ISOLATED_PG,env);
 for(const [variant,source] of [['solution',solution],['starter',starter]]){
  const inv=sqlInvocation({id,fixture,source,acceptance},safe);
  const result=execute('psql',inv.args,{env:safe,input:inv.input,encoding:'utf8',timeout:15000,maxBuffer:256*1024,windowsHide:true});
  verifySqlResult(result,inv,variant);
 }
 return {id,instructorPassed:true,starterRejected:true,scope:'single-session-sql',publicationApproved:false};
}
