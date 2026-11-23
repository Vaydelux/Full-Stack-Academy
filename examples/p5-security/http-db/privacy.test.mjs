import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRepository} from './connection.mjs';

const env={P5_LAB_CONFIRM:'DISPOSABLE_ONLY',P5_HTTP_DB_CONFIRM:'ISOLATED_CLUSTER',P5_LAB_DATABASE_URL:'postgresql://lab:throwaway@127.0.0.1:5432/p5_lab_security',PATH:'/usr/bin:/bin'};
const sql=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const tenants={alice:['alpha',2],bob:['beta',1],viewer:['alpha',2],suspended:['alpha',0]};
const fixture=(role,id,changes={})=>JSON.stringify({role,actor:id,visibleUsers:1,visibleMemberships:1,otherUsers:0,otherMemberships:0,otherTenantDocuments:0,visibleDocuments:tenants[id][1],...changes});
const make=(changes={})=>{
 const calls=[];
 const repo=createRepository(env,{executor:async(program,args,opts)=>{
  const vars=Object.fromEntries(args.filter(v=>v.includes('=')).filter(v=>/^(actor|tenant_id|runtime_role)=/.test(v)).map(v=>{const i=v.indexOf('=');return [v.slice(0,i),v.slice(i+1)]}));
  calls.push({program,args,opts,vars});
  return {stdout:fixture(vars.runtime_role,vars.actor,changes)};
 }});
 return {repo,calls};
};

test('fixture RLS limits user and membership reads',()=>{
 const setup=sql('./setup.sql');
 for(const table of ['users','memberships']){
  assert.match(setup,new RegExp('ALTER TABLE :"schema"\\.'+table+' ENABLE ROW LEVEL SECURITY'));
  assert.match(setup,new RegExp('CREATE POLICY p5_'+(table==='users'?'user':'membership')+'_self ON :"schema"\\.'+table));
 }
 assert.match(setup,/FOR SELECT TO :"runtime_role"/);
 assert.match(setup,/id=current_setting\('p5.actor',true\)/);
 assert.match(setup,/user_id=current_setting\('p5.actor',true\)/);
});
test('identity policies do not grant direct writes',()=>{
 const setup=sql('./setup.sql');
 assert.doesNotMatch(setup,/FOR UPDATE TO :"runtime_role"/);
 assert.doesNotMatch(setup,/FOR INSERT TO :"runtime_role"/);
 assert.doesNotMatch(setup,/GRANT .*UPDATE.*(?:users|memberships) TO :"runtime_role"/);
});
test('privacy probe uses one transaction and role switching before access',()=>{
 const source=sql('./privacy.sql');
 assert.ok(source.indexOf('BEGIN;')<source.indexOf('SET LOCAL p5.actor'));
 assert.ok(source.indexOf('SET LOCAL p5.actor')<source.indexOf('SET LOCAL ROLE :"runtime_role"'));
 assert.ok(source.indexOf('SET LOCAL ROLE :"runtime_role"')<source.indexOf('SELECT json_build_object'));
 assert.match(source,/otherUsers/);assert.match(source,/otherMemberships/);assert.match(source,/otherTenantDocuments/);
 assert.match(source,/COMMIT;/);
});
test('instructor proof for Alice verifies expected visible rows',async()=>{
 const {repo}=make();
 assert.deepEqual(await repo.proveIdentityScope('alice'),{actor:'alice',passed:true,visibleDocuments:2});
});
test('instructor proof rejects cross-tenant user leakage',async()=>{
 const {repo}=make({otherUsers:1});
 await assert.rejects(repo.proveIdentityScope('alice'),/privacy boundary/);
});
test('instructor proof rejects cross-tenant membership leakage',async()=>{
 const {repo}=make({otherMemberships:1});
 await assert.rejects(repo.proveIdentityScope('bob'),/privacy boundary/);
});
test('instructor proof rejects visible documents in other tenant',async()=>{
 const {repo}=make({otherTenantDocuments:1});
 await assert.rejects(repo.proveIdentityScope('viewer'),/privacy boundary/);
});
test('instructor proof rejects extra visible users or memberships',async()=>{
 for(const change of [{visibleUsers:2},{visibleMemberships:2}]){
  const {repo}=make(change);await assert.rejects(repo.proveIdentityScope('alice'),/privacy boundary/);
 }
});
test('instructor proof rejects wrong role and actor in SQL output',async()=>{
 for(const change of [{role:'postgres'},{actor:'bob'}]){
  const {repo}=make(change);await assert.rejects(repo.proveIdentityScope('alice'),/privacy boundary/);
 }
});
test('instructor proof checks all four synthetic identities',async()=>{
 for(const [id,[tenant,count]] of Object.entries(tenants)){
  const {repo,calls}=make();
  const result=await repo.proveIdentityScope(id);
  assert.equal(result.visibleDocuments,count);
  assert.equal(calls[0].vars.actor,id);
  assert.equal(calls[0].vars.tenant_id,tenant);
  assert.ok(calls[0].args.at(-1).endsWith('privacy.sql'));
 }
});
test('rejects caller-selected arbitrary identity and malformed SQL JSON',async()=>{
 const {repo,calls}=make();
 await assert.rejects(repo.proveIdentityScope('admin'),/Unknown synthetic/);
 await assert.rejects(repo.proveIdentityScope('../alice'),/Unknown synthetic/);
 assert.equal(calls.length,0);
 const broken=createRepository(env,{executor:async()=>({stdout:'{'})});
 await assert.rejects(broken.proveIdentityScope('alice'),/Invalid identity privacy response/);
});
test('new instructor-only check is required by the real database acceptance gate',()=>{
 const qualify=sql('./qualify.mjs');
 assert.match(qualify,/repo.proveIdentityScope\(syntheticUser\)/);
 assert.ok(qualify.indexOf('await repo.runtimePrivileges()')<qualify.indexOf('repo.proveIdentityScope(syntheticUser)'));
 assert.ok(qualify.indexOf('repo.proveIdentityScope(syntheticUser)')<qualify.indexOf('createHttpDbLab(repo)'));
 assert.doesNotMatch(sql('./server.mjs'),/proveIdentityScope/);
});
