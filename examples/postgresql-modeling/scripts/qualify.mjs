/** Real PostgreSQL 12.02 positive AND negative semantic checks. No remote DB access. */
import fs from 'node:fs';
import path from 'node:path';
import { connectionEnvironment, runSqlPair } from '../../../scripts/persistence-sql-runner.mjs';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
export function validateDatabaseConnection(raw,optIn){
 if(optIn!=='YES')throw Error('ACADEMY_ISOLATED_PG=YES is required');
 if(typeof raw!=='string'||!raw)throw Error('PG_TEST_URL is required');
 let url;try{url=new URL(raw);}catch{throw Error('Invalid PG_TEST_URL');}
 if(!['postgres:','postgresql:'].includes(url.protocol)||
   !['127.0.0.1','localhost','[::1]','::1'].includes(url.hostname))
  throw Error('Only loopback PostgreSQL connections are allowed');
 const db=decodeURIComponent(url.pathname.slice(1));
 if(!/^academy[_-]test(?:[_-][a-z0-9]+)?$/i.test(db))throw Error('Dedicated academy_test database required');
 const user=decodeURIComponent(url.username);
 if(!user)throw Error('Explicit test database username required');
 const port=url.port||'5432';
 if(!Number.isInteger(Number(port))||Number(port)<1||Number(port)>65535)
  throw Error('Invalid test PostgreSQL port');
 connectionEnvironment(raw,optIn,{});
 return {host:url.hostname,port,database:db,user,password:decodeURIComponent(url.password)};
}
export function qualify(){
 validateDatabaseConnection(process.env.PG_TEST_URL,process.env.ACADEMY_ISOLATED_PG);
 const manifest=JSON.parse(read('examples/postgresql-modeling/module.json'));
 if(manifest.moduleId!=='12.02'||manifest.readyToPublish!==false||manifest.lessons?.length!==8)
  throw Error('Invalid source manifest');
 const fixture=read('examples/postgresql-modeling/fixture.sql');
 let passed=0;
 for(const item of manifest.lessons){
  const dir='drafts/postgresql/labs/'+item.slug+'/';
  const assertions=read(dir+'acceptance.sql');
  runSqlPair({id:item.id,fixture,starter:read(dir+'starter.sql'),solution:read(dir+'solution.sql'),acceptance:assertions});
  passed++;console.log(item.id+' instructor OK, starter semantic failure verified');
 }
 console.log('PostgreSQL 12.02 real SQL: '+passed+'/8 instructor and '+passed+'/8 expected-red checks; publication still blocked.');
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 try{qualify();}catch(error){console.error('PostgreSQL NOT QUALIFIED: '+error.message);process.exitCode=1;}
}
