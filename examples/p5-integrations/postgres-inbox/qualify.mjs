/** Fail-closed, opt-in PostgreSQL 17+ teaching qualification; rollback only. */
import {spawnSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const sqlPath=resolve(dirname(fileURLToPath(import.meta.url)),'qualification.sql');
const dbPattern=/^p5_lab_inbox_[a-z0-9_]{4,32}$/;
export function validateInboxDb({db,host='127.0.0.1',port='5432',user,confirm,confirmDb,run}={}){
 const errors=[];
 if(run!=='--run')errors.push('Explicit --run required');
 if(!dbPattern.test(db??''))errors.push('Disposable p5_lab_inbox_* DB required');
 if(host!=='127.0.0.1')errors.push('Only IPv4 loopback database allowed');
 if(!/^[0-9]{1,5}$/.test(String(port))||Number(port)<1||Number(port)>65535)errors.push('Invalid port');
 if(typeof user!=='string'||!/^[a-z_][a-z0-9_]{0,62}$/.test(user))errors.push('Nonprivileged runtime role required');
 if(confirm!=='I_UNDERSTAND_DISPOSABLE_DB')errors.push('First confirmation required');
 if(confirmDb!==db)errors.push('Second confirmation must equal database name');
 return errors;
}
export function qualifyInboxDb({db,host='127.0.0.1',port='5432',user,confirm,confirmDb,run,psql='psql',env=process.env}={}){
 const errors=validateInboxDb({db,host,port,user,confirm,confirmDb,run});
 if(errors.length)throw Error(errors.join('; '));
 const safeEnv={...env,PGHOST:host,PGPORT:String(port),PGDATABASE:db,PGUSER:user,PGCONNECT_TIMEOUT:'5',PGOPTIONS:''};
 const args=['-X','--set','ON_ERROR_STOP=1','--no-password','--host',host,'--port',String(port),'--username',user,'--dbname',db];
 const runPsql=tail=>spawnSync(psql,[...args,...tail],{encoding:'utf8',timeout:45000,maxBuffer:1024*1024,shell:false,env:safeEnv});
 const roleCheck=`SELECT CASE WHEN current_setting('server_version_num')::integer >= 170000
 AND NOT pg_is_in_recovery() AND NOT r.rolsuper AND NOT r.rolbypassrls AND current_user = r.rolname
 THEN 'P5_INBOX_SAFE_ROLE' ELSE 'DENIED' END FROM pg_roles r WHERE r.rolname=current_user`;
 const pre=runPsql(['--tuples-only','--no-align','--command',roleCheck]);
 if(pre.error||pre.status!==0||pre.stdout?.trim()!=='P5_INBOX_SAFE_ROLE')throw Error('PostgreSQL preflight refused: 17+, primary and non-BYPASSRLS role required');
 const result=runPsql(['--file',sqlPath]);
 if(result.error||result.status!==0||!result.stdout?.includes('P5_INBOX_SQL_16_ASSERTIONS_PASSED'))throw Error('PostgreSQL inbox qualification failed: no SQL acceptance evidence');
 return {ok:true,assertions:16,host,database:db,role:user,mode:'rollback-only'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const r=qualifyInboxDb({run:process.argv[2],db:process.env.P5_INBOX_DB,
   host:process.env.P5_INBOX_HOST,port:process.env.P5_INBOX_PORT??'5432',user:process.env.P5_INBOX_USER,
   confirm:process.env.P5_INBOX_CONFIRM,confirmDb:process.env.P5_INBOX_CONFIRM_DB});
  console.log(JSON.stringify(r));
 }catch(err){console.error('Qualification blocked:',err.message);process.exitCode=1;}
}
