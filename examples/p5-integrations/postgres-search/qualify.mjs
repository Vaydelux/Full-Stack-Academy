import {spawnSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const sql=resolve(dirname(fileURLToPath(import.meta.url)),'qualification.sql');
const DB_PATTERN=/^p5_lab_search_[a-z0-9_]{4,32}$/;
export const validateOptions=({db,host='127.0.0.1',port='5432',user,confirm,confirmDb,run})=>{
 const errors=[];
 if(run!=='--run')errors.push('Explicit --run flag required');
 if(!DB_PATTERN.test(db??''))errors.push('Disposable p5_lab_search_* database required');
 if(host!=='127.0.0.1')errors.push('Only IPv4 loopback allowed');
 if(!/^[0-9]{1,5}$/.test(String(port))||Number(port)<1||Number(port)>65535)errors.push('Invalid PostgreSQL port');
 if(typeof user!=='string'||!/^[a-z_][a-z0-9_]{0,62}$/.test(user))errors.push('Explicit non-superuser role required');
 if(confirm!=='I_UNDERSTAND_DISPOSABLE_DB')errors.push('First confirmation missing');
 if(confirmDb!==db)errors.push('Second confirmation must match exact database');
 return errors;
};
export function qualify({db,host='127.0.0.1',port='5432',user,confirm,confirmDb,run,psql='psql',env=process.env}={}){
 const errors=validateOptions({db,host,port,user,confirm,confirmDb,run});
 if(errors.length)throw Error(errors.join('; '));
 // Never run a shell. Use explicit fixed SQL and fail closed when the SQL marker is absent.
 const safeEnv={...env,PGHOST:host,PGPORT:String(port),PGDATABASE:db,PGUSER:user,PGCONNECT_TIMEOUT:'5',PGOPTIONS:''};
 const common=['-X','--set','ON_ERROR_STOP=1','--no-password','--host',host,'--port',String(port),'--username',user,'--dbname',db];
 const runPsql=args=>spawnSync(psql,[...common,...args],{encoding:'utf8',timeout:45000,maxBuffer:1024*1024,env:safeEnv,shell:false});
 const pre=runPsql(['--tuples-only','--no-align','--command',
  "SELECT CASE WHEN current_setting('server_version_num')::int >= 170000 AND NOT r.rolsuper AND NOT r.rolbypassrls THEN 'P5_SEARCH_SAFE_ROLE' ELSE 'DENIED' END FROM pg_roles r WHERE r.rolname = current_user;"]);
 if(pre.error||pre.status!==0||pre.stdout?.trim()!=='P5_SEARCH_SAFE_ROLE')throw Error('PostgreSQL 17+ non-superuser / non-BYPASSRLS preflight failed');
 const result=runPsql(['--file',sql]);
 if(result.error||result.status!==0||!result.stdout?.includes('P5_SEARCH_SQL_15_ASSERTIONS_PASSED'))throw Error('SQL qualification failed; no passing evidence');
 return {ok:true,assertions:15,database:db,host,role:user};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const report=qualify({run:process.argv[2],db:process.env.P5_SEARCH_DB,host:process.env.P5_SEARCH_HOST,
   port:process.env.P5_SEARCH_PORT??'5432',user:process.env.P5_SEARCH_USER,
   confirm:process.env.P5_SEARCH_CONFIRM,confirmDb:process.env.P5_SEARCH_CONFIRM_DB});
  console.log(JSON.stringify(report));
 }catch(err){console.error('Qualification denied or failed:',err.message);process.exitCode=1;}
}
