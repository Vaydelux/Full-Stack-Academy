/** Disposable local stack only. The admin credential never enters acceptance subprocesses. */
import assert from 'node:assert/strict';
import {readFileSync,realpathSync,lstatSync} from 'node:fs';
import {resolve,join,dirname,relative,sep,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createClient} from '@supabase/supabase-js';
import pg from 'pg';
import {supabaseConfig} from '../p4-runtime/guard.mjs';
import {requireInstalled} from './guards.mjs';
const root=realpathSync(fileURLToPath(new URL('../../',import.meta.url)));
const [statusFile,output,...extra]=process.argv.slice(2);
assert.ok(statusFile&&output&&!extra.length);
assert.equal(process.env.ACADEMY_DISPOSABLE_SUPABASE_RUNNER,'YES');
assert.equal(process.env.GITHUB_ACTIONS,'true');
requireInstalled(new URL('.',import.meta.url));
const outside=p=>{const rel=relative(root,realpathSync(p));assert.ok(isAbsolute(rel)||rel==='..'||rel.startsWith('..'+sep),'External disposable path required');};
outside(statusFile);outside(output);
assert.ok(lstatSync(statusFile).isFile()&&lstatSync(statusFile).size<=65536);
const status=JSON.parse(readFileSync(statusFile,'utf8'));
const api=new URL(status.API_URL),db=new URL(status.DB_URL);
assert.equal(api.origin,'http://127.0.0.1:54321');assert.equal(api.pathname,'/');assert.ok(!api.username&&!api.password&&!api.search&&!api.hash);
assert.ok(['postgres:','postgresql:'].includes(db.protocol));assert.equal(db.hostname,'127.0.0.1');assert.equal(db.port,'54322');assert.equal(db.pathname,'/postgres');assert.equal(db.username,'postgres');assert.ok(db.password&&!db.search&&!db.hash);
const adminKey=status.SERVICE_ROLE_KEY,publicKey=status.ANON_KEY;
const role=key=>{assert.equal(typeof key,'string');const parts=key.split('.');assert.equal(parts.length,3);return JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8')).role;};
assert.equal(role(adminKey),'service_role');assert.equal(role(publicKey),'anon');
const user=suffix=>({email:'academy-'+suffix+'-'+randomBytes(8).toString('hex')+'@example.test',password:randomBytes(24).toString('hex')});
const users=[user('a'),user('b')];
const localFetch=(input,options={})=>{const url=new URL(input instanceof Request?input.url:input);assert.equal(url.origin,api.origin);return fetch(input,{...options,redirect:'error',signal:options.signal??AbortSignal.timeout(15000)});};
const admin=createClient(api.origin,adminKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{fetch:localFetch}});
for(const account of users){const {data,error}=await admin.auth.admin.createUser({...account,email_confirm:true});assert.ok(!error&&data.user?.id,'Synthetic user creation failed');}
const client=new pg.Client({connectionString:db.href,connectionTimeoutMillis:5000,statement_timeout:30000});
try{
 await client.connect();
 const {rows}=await client.query("SELECT current_database() AS db,current_user AS role,to_regclass('public.academy_runtime_documents') AS existing,(SELECT count(*)::int FROM auth.users) AS users");
 assert.equal(rows.length,1);assert.equal(rows[0].db,'postgres');assert.equal(rows[0].role,'postgres');assert.equal(rows[0].existing,null);assert.equal(rows[0].users,2,'Fresh two-user stack required');
 for(const path of ['examples/p4-runtime/supabase/fixture.sql','examples/p5-distributed-runtime/realtime-fixture.sql'])await client.query(readFileSync(join(root,path),'utf8'));
}finally{await client.end();}
const env={...process.env};
for(const key of Object.keys(env))if(/^(?:SUPABASE_|ACADEMY_SUPABASE_|PG|DATABASE_URL|DIRECT_URL|SHADOW_DATABASE_URL)/i.test(key))delete env[key];
Object.assign(env,{ACADEMY_SUPABASE_ISOLATED:'YES',ACADEMY_SUPABASE_URL:api.origin,ACADEMY_SUPABASE_PUBLIC_KEY:publicKey,ACADEMY_SUPABASE_A_EMAIL:users[0].email,ACADEMY_SUPABASE_A_PASSWORD:users[0].password,ACADEMY_SUPABASE_B_EMAIL:users[1].email,ACADEMY_SUPABASE_B_PASSWORD:users[1].password});
supabaseConfig(env);
const suites=['supabase','supabase-session','supabase-extended'];
for(const suite of suites){
 const res=spawnSync(process.execPath,['scripts/qualify-p4-evidence.mjs','--collect',suite,output],{cwd:root,env,encoding:'utf8',timeout:660000,maxBuffer:4*1024*1024});
 // Do not emit raw child logs: they could contain tokens or signed capabilities.
 assert.ok(!res.error&&!res.signal&&res.status===0,'Local acceptance failed: '+suite);
 console.log('Supplemental local Supabase acceptance passed: '+suite);
}
console.log(JSON.stringify({suites,publicationApproved:false,topicQualification:false}));
