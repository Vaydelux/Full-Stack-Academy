import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRepository} from './connection.mjs';

const env={
 P5_LAB_CONFIRM:'DISPOSABLE_ONLY',
 P5_HTTP_DB_CONFIRM:'ISOLATED_CLUSTER',
 P5_LAB_DATABASE_URL:'postgresql://p5_qualifier:fixtureSecret_123@127.0.0.1:5432/p5_lab_security',
 PATH:'/usr/bin:/bin'
};
const file=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const expected=(role)=>JSON.stringify({role,canEditMemberships:false,canEditUsers:false,canCreateObjects:false,canReadDocuments:true,canUpdateDocuments:true});

test('runtime role is random, paired with the schema and never client-controlled',()=>{
 const a=createRepository(env,{executor:async()=>({stdout:'null'})});
 const b=createRepository(env,{executor:async()=>({stdout:'null'})});
 assert.match(a.schema,/^p5h_[a-f0-9]{16}$/);
 assert.match(a.runtimeRole,/^p5r_[a-f0-9]{16}$/);
 assert.equal(a.runtimeRole.slice(4),a.schema.slice(4));
 assert.notEqual(a.runtimeRole,b.runtimeRole);
});

test('each query binds only generated identifiers through psql -v, never shell',async()=>{
 const seen=[];
 const repo=createRepository(env,{executor:async(binary,args,options)=>{seen.push({binary,args,options});return {stdout:'null'};}});
 await repo.action('read',{actor:'alice',docId:'alpha-1'});
 assert.equal(seen[0].binary,'psql');
 assert.ok(seen[0].args.includes('runtime_role='+repo.runtimeRole));
 assert.ok(seen[0].args.includes('schema='+repo.schema));
 assert.equal(seen[0].args.some(x=>x.includes('fixtureSecret_123')),false);
 assert.equal(seen[0].options.env.PGPASSWORD,'fixtureSecret_123');
 assert.equal(seen[0].options.shell,undefined);
});

test('runtime privileges probe accepts precisely least-privilege truth',async()=>{
 let role;
 const repo=createRepository(env,{executor:async(_b,args)=>({stdout:expected(args.find(x=>x.startsWith('runtime_role=')).slice(13))})});
 role=repo.runtimeRole;
 const result=await repo.runtimePrivileges();
 assert.equal(result.role,role);
 assert.equal(result.canEditMemberships,false);
});

test('runtime privileges probe rejects ability to edit membership',async()=>{
 const repo=createRepository(env,{executor:async(_b,args)=>({stdout:expected(args.find(x=>x.startsWith('runtime_role=')).slice(13)).replace('"canEditMemberships":false','"canEditMemberships":true')})});
 await assert.rejects(repo.runtimePrivileges(),/privileges/);
});

test('runtime privileges probe rejects schema CREATE, users edit or missing read rights',async()=>{
 for(const [from,to] of [
  ['"canCreateObjects":false','"canCreateObjects":true'],
  ['"canEditUsers":false','"canEditUsers":true'],
  ['"canReadDocuments":true','"canReadDocuments":false'],
  ['"canUpdateDocuments":true','"canUpdateDocuments":false']
 ]) {
  const repo=createRepository(env,{executor:async(_b,args)=>({stdout:expected(args.find(x=>x.startsWith('runtime_role=')).slice(13)).replace(from,to)})});
  await assert.rejects(repo.runtimePrivileges(),/privileges/);
 }
});

test('runtime privileges probe rejects a forged role or malformed output',async()=>{
 const a=createRepository(env,{executor:async()=>({stdout:expected('postgres')})});
 await assert.rejects(a.runtimePrivileges(),/privileges/);
 const b=createRepository(env,{executor:async()=>({stdout:'no json'})});
 await assert.rejects(b.runtimePrivileges(),/JSON|Unexpected token|Unexpected end/);
});

test('setup grants minimum document/membership read and scopes SQL roles',()=>{
 const sql=file('./setup.sql');
 assert.match(sql,/CREATE ROLE :"runtime_role" NOLOGIN NOSUPERUSER NOBYPASSRLS/);
 assert.match(sql,/GRANT :"runtime_role" TO CURRENT_USER/);
 assert.match(sql,/REVOKE ALL ON SCHEMA :"schema" FROM PUBLIC/);
 assert.match(sql,/GRANT USAGE ON SCHEMA :"schema" TO :"runtime_role"/);
 assert.match(sql,/GRANT SELECT ON :"schema".users, :"schema".memberships TO :"runtime_role"/);
 assert.match(sql,/GRANT SELECT, UPDATE\(title\), DELETE ON :"schema".documents TO :"runtime_role"/);
 assert.doesNotMatch(sql,/GRANT\s+UPDATE\s+ON\s+:"schema"\.(?:users|memberships)/i);
 assert.match(sql,/FORCE ROW LEVEL SECURITY/);
});

test('query sets actor within transaction, then drops privileges before SQL',()=>{
 const sql=file('./query.sql');
 assert.ok(sql.indexOf('BEGIN;')<sql.indexOf('SET LOCAL p5.actor'));
 assert.ok(sql.indexOf('SET LOCAL p5.actor')<sql.indexOf('SET LOCAL ROLE :"runtime_role"'));
 assert.ok(sql.indexOf('SET LOCAL ROLE :"runtime_role"')<sql.indexOf('\\if :{?P5_READ}'));
 assert.match(sql,/COMMIT;/);
 assert.doesNotMatch(sql,/CREATE ROLE|GRANT\s/i);
});

test('privilege evidence is evaluated as runtime role, not fixture owner',()=>{
 const sql=file('./privileges.sql');
 assert.match(sql,/SET LOCAL ROLE :"runtime_role"/);
 assert.match(sql,/canEditMemberships/);
 assert.match(sql,/has_table_privilege/);
 assert.match(sql,/canCreateObjects/);
 assert.match(sql,/has_schema_privilege/);
 assert.match(sql,/canUpdateDocuments/);
 assert.match(sql,/has_column_privilege/);
});

test('cleanup is idempotent and drops schema before its role',()=>{
 const sql=file('./cleanup.sql');
 assert.match(sql,/BEGIN;/);
 assert.match(sql,/DROP SCHEMA IF EXISTS :"schema" CASCADE/);
 assert.match(sql,/DROP ROLE IF EXISTS :"runtime_role"/);
 assert.ok(sql.indexOf('DROP SCHEMA')<sql.indexOf('DROP ROLE'));
 assert.match(sql,/COMMIT;/);
});

test('revoke remains a fixture-admin-only SQL script',()=>{
 const userSQL=file('./revoke.sql');
 assert.match(userSQL,/UPDATE :"schema".memberships/);
 assert.doesNotMatch(userSQL,/SET\s+ROLE/);
 const http=file('./server.mjs');
 assert.doesNotMatch(http,/revokeForQualification|\/admin\/revoke/);
});

test('live database acceptance requires runtime role probe before HTTP starts',()=>{
 const script=file('./qualify.mjs');
 assert.ok(script.indexOf('await repo.setup()')<script.indexOf('await repo.runtimePrivileges()'));
 assert.ok(script.indexOf('await repo.runtimePrivileges()')<script.indexOf('createHttpDbLab(repo)'));
 assert.match(script,/canEditMemberships,false/);
 assert.match(script,/canCreateObjects,false/);
});
