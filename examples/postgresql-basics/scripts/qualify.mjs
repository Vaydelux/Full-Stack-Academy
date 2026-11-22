/** Actual PostgreSQL SQL red/green gate; never executes without dedicated loopback test DB. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
export function validateTestDb(urlText, optIn){
 if(optIn!=='YES')throw Error('Set ACADEMY_ISOLATED_PG=YES to opt in to a disposable local database');
 if(!urlText)throw Error('PG_TEST_URL is required (no production database)');
 let url;
 try{url=new URL(urlText);}catch{throw Error('PG_TEST_URL must be a valid PostgreSQL URL');}
 if(!['postgres:','postgresql:'].includes(url.protocol)||!['localhost','127.0.0.1','[::1]','::1'].includes(url.hostname))
  throw Error('Only loopback PostgreSQL URLs are allowed; remote and production hosts refused');
 const db=decodeURIComponent(url.pathname.slice(1));
 if(!/^academy[_-]test(?:[_-][a-z0-9]+)?$/i.test(db))
  throw Error('Test database must be named academy_test (optionally with a test suffix)');
 return urlText;
}
function runSql(url,fixture,lesson,acceptance){
 const input=["BEGIN;","SET LOCAL statement_timeout = '5000ms';","SET LOCAL lock_timeout = '1000ms';",
   fixture,lesson,acceptance,"ROLLBACK;",""].join('\n');
 const result=spawnSync('psql',['-X','--no-password','--set=ON_ERROR_STOP=1','--dbname='+url,'-q','-A','-t'],
   {input,encoding:'utf8',timeout:15000,maxBuffer:256*1024,env:process.env});
 if(result.error)throw Error('psql not available or failed: '+result.error.message);
 return {status:result.status,stderr:(result.stderr??'').slice(0,1500)};
}
export function qualify(){
 const db=validateTestDb(process.env.PG_TEST_URL,process.env.ACADEMY_ISOLATED_PG);
 const mod=JSON.parse(read('examples/postgresql-basics/module.json'));
 if(mod.readyToPublish!==false||mod.lessons?.length!==8)throw Error('Module acceptance manifest is invalid');
 const fixture=read('examples/postgresql-basics/fixture.sql');
 let passed=0;
 for(const lesson of mod.lessons){
  const dir='drafts/postgresql/labs/'+lesson.slug+'/';
  const acceptance=read(dir+'acceptance.sql');
  const instructor=runSql(db,fixture,read(dir+'solution.sql'),acceptance);
  if(instructor.status!==0)throw Error(lesson.id+' instructor SQL failed: '+instructor.stderr);
  const starter=runSql(db,fixture,read(dir+'starter.sql'),acceptance);
  if(starter.status===0||!starter.stderr.includes(lesson.id))
   throw Error(lesson.id+' starter did not fail its expected semantic assertion: '+starter.stderr);
  console.log(lesson.id+' instructor PASS and expected starter rejection PASS');
  passed++;
 }
 console.log('Real PostgreSQL 12.01: '+passed+' instructor and '+passed+' expected failure checks passed. NOT a publication authorization.');
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 try{qualify();}catch(error){console.error('PostgreSQL NOT QUALIFIED: '+error.message);process.exitCode=1;}
}
