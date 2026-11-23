import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {validateDatabaseTarget} from '../http-db/connection.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
export const stages=[
  {command:'test:p5-bundle',marker:null},
  {command:'qualify:p5:postgresql',marker:'P5_SQL_14_ASSERTIONS_PASSED'},
  {command:'qualify:p5:rls',marker:'P5_RLS_14_ASSERTIONS_PASSED'},
  {command:'qualify:p5:http-db',marker:'P5_REAL_HTTP_POSTGRESQL_PASSED checks='}
];
const sha=(data)=>createHash('sha256').update(data).digest('hex');
const failure=(reason,partial={})=>({schemaVersion:1,passed:false,reason,...partial});
function runProcess(run,name,args,env,timeout=900000){
 const result=run(name,args,{cwd:root,env,encoding:'utf8',timeout,maxBuffer:8*1024*1024});
 return {status:result.status,error:result.error,stdout:String(result.stdout||''),stderr:String(result.stderr||'')};
}
export function runQualification({run=spawnSync,version=process.version,env=process.env}={}){
 if(!/^v24\./.test(version))return failure('Node 24 is required');
 let target;
 try{target=validateDatabaseTarget(env);}catch(error){return failure('Unsafe or unconfirmed lab database: '+error.message);}
 const dbEnv={...env,PGHOST:'127.0.0.1',PGHOSTADDR:'127.0.0.1',PGPORT:String(target.port),PGDATABASE:target.db,PGUSER:target.user,PGPASSWORD:target.password,PGSSLMODE:'disable',PGCONNECT_TIMEOUT:'5'};
 const git=runProcess(run,'git',['-c','safe.directory='+root,'rev-parse','HEAD'],dbEnv,10000);
 const commit=git.stdout.trim();
 if(git.error||git.status!==0||!/^[0-9a-f]{40}$/.test(commit))return failure('Cannot identify exact Git commit');
 const dirty=runProcess(run,'git',['-c','safe.directory='+root,'status','--porcelain','--untracked-files=no'],dbEnv,10000);
 if(dirty.error||dirty.status!==0||dirty.stdout.trim())return failure('Git checkout has modified tracked files',{commit});
 const pg=runProcess(run,'psql',['-X','-w','-A','-t','-c','SHOW server_version_num'],dbEnv,15000);
 const serverVersion=Number(pg.stdout.trim());
 if(pg.error||pg.status!==0||!Number.isInteger(serverVersion)||serverVersion<170000)return failure('Cannot verify PostgreSQL 17+ server',{commit});
 const report={schemaVersion:1,passed:false,commit,nodeVersion:version,postgresServerVersion:serverVersion,databaseType:'disposable-local-postgresql',stages:[]};
 for(const stage of stages){
  const result=runProcess(run,'npm',['run',stage.command],dbEnv);
  const markerPresent=stage.marker===null||result.stdout.includes(stage.marker);
  const ok=!result.error&&result.status===0&&markerPresent;
  report.stages.push({name:stage.command,passed:ok,exitCode:result.status,requiredMarker:stage.marker,markerPresent,logSha256:sha(result.stdout+'\n'+result.stderr)});
  if(!ok){report.reason='Qualification failed: '+stage.command;return report;}
 }
 report.passed=true;
 report.completedAt=new Date().toISOString();
 return report;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=runQualification();
 // Docker Compose log prefixes are harmless because the value is base64url.
 // The record contains no environment secrets or raw logs.
 console.log('P5_QUALIFICATION_EVIDENCE='+Buffer.from(JSON.stringify(report)).toString('base64url'));
 if(!report.passed){console.error('P5 qualification blocked/failed: '+report.reason);process.exitCode=1;}
}
