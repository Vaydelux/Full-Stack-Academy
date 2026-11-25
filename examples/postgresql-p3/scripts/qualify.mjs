/**
 * Real opt-in PostgreSQL 12.03–12.05 SEMANTIC checks only.
 * Manual performance, two-session concurrency, replication and restore evidence
 * remain out of scope, even when every SQL contract passes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isSqlContract } from '../../../scripts/persistence-release-plan.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const json=file=>JSON.parse(read(file));
const moduleFolders={
 '12.03':'postgresql-transactions',
 '12.04':'postgresql-performance',
 '12.05':'postgresql-operations',
};

export function validateIsolatedPostgres(urlText,approval){
 if(approval!=='YES')throw Error('Explicit ACADEMY_ISOLATED_PG=YES approval is required');
 if(typeof urlText!=='string'||!urlText)throw Error('PG_TEST_URL is required');
 let url;
 try{url=new URL(urlText);}catch{throw Error('PG_TEST_URL must be a valid postgresql URL');}
 if(!['postgres:','postgresql:'].includes(url.protocol))throw Error('Only PostgreSQL connections are accepted');
 if(!['localhost','127.0.0.1','[::1]','::1'].includes(url.hostname))
  throw Error('Only local loopback PostgreSQL test hosts are allowed');
 if(url.search||url.hash)throw Error('Connection query parameters and fragments are not allowed');
 const database=decodeURIComponent(url.pathname.slice(1));
 if(!/^academy[_-]test(?:[_-][a-z0-9]+)?$/i.test(database))
  throw Error('Database must be dedicated academy_test or academy-test with optional test suffix');
 const user=decodeURIComponent(url.username);
 if(!user)throw Error('Explicit local test database role required');
 const port=url.port||'5432';
 if(!/^\d+$/.test(port)||Number(port)<1||Number(port)>65535)throw Error('Invalid PostgreSQL port');
 return {hostname:url.hostname,database,user,password:decodeURIComponent(url.password),port};
}

function postgresRun(connection,fixture,source,acceptance){
 // Never inherit arbitrary libpq config such as PGSERVICE or PGOPTIONS.
 const env=Object.fromEntries(Object.entries(process.env).filter(([name])=>!name.startsWith('PG')));
 const safeEnv={...env,PGHOST:connection.hostname,PGDATABASE:connection.database,
  PGPORT:connection.port,PGUSER:connection.user,PGPASSWORD:connection.password,
  PGSSLMODE:'disable',PGCONNECT_TIMEOUT:'4',PGAPPNAME:'academy-p3-qualification'};
 const input=[
  'BEGIN;',
  "SET LOCAL statement_timeout='5000ms';",
  "SET LOCAL lock_timeout='1000ms';",
  fixture,source,acceptance,'ROLLBACK;','',
 ].join('\n');
 const result=spawnSync('psql',['-X','--no-password','-v','ON_ERROR_STOP=1','-q','-A','-t'],{
  input,encoding:'utf8',timeout:15000,maxBuffer:256_000,env:safeEnv,
 });
 if(result.error)throw Error('psql execution failed: '+result.error.message);
 if(result.signal)throw Error('psql process interrupted');
 return {success:result.status===0,
  stderr:(result.stderr??'').slice(0,1100)};
}

export function qualify(options={}){
 const db=validateIsolatedPostgres(process.env.PG_TEST_URL,process.env.ACADEMY_ISOLATED_PG);
 const chosen=options.moduleId?[options.moduleId]:Object.keys(moduleFolders);
 for(const id of chosen)if(!moduleFolders[id])throw Error('Unsupported module '+id);
 let greenPass=0,redExpected=0,manualSkipped=0;
 for(const id of chosen){
  const folder=moduleFolders[id];
  const manifest=json('examples/'+folder+'/module.json');
  if(manifest.moduleId!==id||manifest.readyToPublish!==false||
     manifest.runtimeQualification!=='not-run'||manifest.lessons?.length!==8)
   throw Error('Invalid module source/release manifest for '+id);
  const fixture=read('examples/'+folder+'/fixture.sql');
  for(const row of manifest.lessons){
   const file='drafts/postgresql/labs/'+row.slug+'/';
   const contract=json(file+'lab.json');
   if(contract.lessonId!==row.id||contract.readyToPublish!==false||
      contract.qualificationKind!==row.qualificationKind)
    throw Error('Lab manifest mismatch for '+row.id);
   if(row.qualificationKind==='manual-evidence'){
    manualSkipped++;
    console.log(row.id+' MANUAL EVIDENCE REQUIRED (not run)');
    continue;
   }
   if(!isSqlContract(row.qualificationKind))throw Error('Unsupported qualification type');
   if(id==='12.03'&&(row.qualificationKind!=='single-session-sql-semantics'||contract.requiresSeparateConcurrencyReview!==true))throw Error('Separate concurrency review must remain mandatory');
   const assertSql=read(file+'acceptance.sql');
   if(!assertSql.includes("RAISE EXCEPTION '"+row.id))
    throw Error(row.id+' is missing its named SQL semantic acceptance assertion');
   const green=postgresRun(db,fixture,read(file+'solution.sql'),assertSql);
   if(!green.success)throw Error(row.id+' instructor SQL failed: '+green.stderr);
   greenPass++;
   const red=postgresRun(db,fixture,read(file+'starter.sql'),assertSql);
   if(red.success||!red.stderr.includes(row.id))
    throw Error(row.id+' learner starter did not reproduce its named semantic failure: '+red.stderr);
   redExpected++;
   console.log(row.id+' REAL SQL PASS (instructor and expected semantic failure)');
  }
 }
 const report={sqlPositivePass:greenPass,sqlExpectedNegativePass:redExpected,manualStillRequired:manualSkipped,
  fullReleaseQualified:false,
  warning:'The SQL contract subset does NOT verify simultaneous transactions, benchmarks, replica health, PITR, restore drills, browser or accessibility.'};
 console.log(JSON.stringify(report,null,2));
 return report;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 try{
  const args=process.argv.slice(2);
  if(args.length>1||args.length&&(!args[0].startsWith('--module=')||
     !moduleFolders[args[0].slice('--module='.length)]))
   throw Error('Usage: node qualify.mjs [--module=12.03|12.04|12.05]');
  qualify({moduleId:args.length?args[0].slice('--module='.length):undefined});
 }catch(error){
  console.error('PostgreSQL P3 NOT QUALIFIED: '+error.message);
  process.exitCode=1;
 }
}
