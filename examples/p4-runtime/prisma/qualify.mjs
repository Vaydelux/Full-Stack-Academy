import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {checksum,verifyHistory} from './migration-history.mjs';
import {migrationDigest,qualifyCatalog} from './schema-drift.mjs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {pgConfig,preflightPg} from '../guard.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));
assert.equal(process.versions.node.split('.')[0],'24','Node 24 required');
const url=pgConfig();
for(const key of Object.keys(process.env))if(/^PG/i.test(key)||/^(DATABASE_URL|DIRECT_URL|SHADOW_DATABASE_URL)$/i.test(key))delete process.env[key];
assert.ok(existsSync(new URL('package-lock.json',import.meta.url)),'Generate and commit a genuine isolated npm lockfile before qualification');
const pkg=JSON.parse(readFileSync(new URL('package.json',import.meta.url),'utf8')),lock=JSON.parse(readFileSync(new URL('package-lock.json',import.meta.url),'utf8'));
assert.ok(lock.lockfileVersion>=3&&lock.packages?.[''],'Invalid lockfile');
for(const [name,version] of Object.entries({...pkg.dependencies,...pkg.devDependencies})){assert.equal(lock.packages['node_modules/'+name]?.version,version,'Lock version mismatch '+name);assert.equal(JSON.parse(readFileSync(new URL('node_modules/'+name+'/package.json',import.meta.url),'utf8')).version,version,'Installed version mismatch '+name);}
const initial='20261125000000_initial';
const digest='731dedbb70cc488348b062ab7fe3e3dbec201344e4f79a3ea016e3a18d825322';
const migration=readFileSync(new URL('prisma/migrations/'+initial+'/migration.sql',import.meta.url));
assert.deepEqual(readdirSync(new URL('prisma/migrations/',import.meta.url),{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name),[initial],'Review the reference catalog before adding migrations');
assert.equal(migrationDigest(migration),digest,'Reference migration changed; review catalog exercise');
const {Client}=await import('pg');const client=new Client({connectionString:url,connectionTimeoutMillis:5000,statement_timeout:5000});
try{await client.connect();await preflightPg(client);}finally{await client.end();}
function run(args){const p=spawnSync(process.execPath,args,{cwd:root,env:process.env,stdio:'pipe',encoding:'utf8',timeout:120000,maxBuffer:4*1024*1024,windowsHide:true});assert.ok(!p.error&&!p.signal&&p.status===0,'Prisma qualification step failed: '+args[0]+' '+(args[1]??''));return p.stdout;}
for(const args of [['validate'],['generate'],['migrate','deploy'],['migrate','status']])run(['node_modules/prisma/build/index.js',...args]);
const expected=readdirSync(new URL('prisma/migrations/',import.meta.url),{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>({name:e.name,checksum:checksum(readFileSync(new URL('prisma/migrations/'+e.name+'/migration.sql',import.meta.url)))}));
async function audit(){const db=new Client({connectionString:url,connectionTimeoutMillis:5000,statement_timeout:5000});try{await db.connect();await preflightPg(db);const {rows}=await db.query('SELECT migration_name,checksum,finished_at,rolled_back_at,applied_steps_count FROM public._prisma_migrations');return verifyHistory(expected,rows);}finally{await db.end();}}
await audit();run(['node_modules/prisma/build/index.js','migrate','deploy']);await audit();
const catalogClient=new Client({connectionString:url,connectionTimeoutMillis:5000,statement_timeout:10000});
try{await catalogClient.connect();await preflightPg(catalogClient);await qualifyCatalog(catalogClient,migration,digest);}finally{await catalogClient.end();}
const output=run(['--experimental-transform-types','--test','--test-reporter=tap','live.test.mjs']);
for(const [key,value] of [['tests',2],['pass',2],['fail',0],['cancelled',0],['skipped',0],['todo',0]])assert.equal(output.match(new RegExp('^# '+key+' '+value+'\\r?$','gm'))?.length,1,'Missing exact test result '+key);
console.log('Prisma integration: real generated client/migration/CRUD test passed; module publication NOT approved.');
