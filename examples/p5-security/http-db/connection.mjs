import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const exec=promisify(execFile);
const here=dirname(fileURLToPath(import.meta.url));
const actions={read:'P5_READ',update:'P5_UPDATE',delete:'P5_DELETE',upload:'P5_UPLOAD'};
const idPattern=/^[a-z0-9-]{1,40}$/;
const schemaPattern=/^p5h_[a-f0-9]{16}$/;

export function validateDatabaseTarget(env) {
  if(env.P5_LAB_CONFIRM!=='DISPOSABLE_ONLY'||env.P5_HTTP_DB_CONFIRM!=='ISOLATED_CLUSTER')throw Error('Two explicit disposable database confirmations are required');
  if(!env.P5_LAB_DATABASE_URL)throw Error('Missing P5_LAB_DATABASE_URL');
  let url;
  try{url=new URL(env.P5_LAB_DATABASE_URL)}catch{throw Error('Invalid PostgreSQL URL')}
  let db,user,password;
  try{db=decodeURIComponent(url.pathname.slice(1));user=decodeURIComponent(url.username);password=decodeURIComponent(url.password)}catch{throw Error('Invalid URL encoding')}
  if(!['postgres:','postgresql:'].includes(url.protocol)||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||!/^p5_lab_[a-z0-9_]+$/.test(db)||url.search||url.hash||!user||!/^\d{0,5}$/.test(url.port))throw Error('Only a loopback disposable p5_lab_* database without URL options is allowed');
  const port=Number(url.port||5432);
  if(port<1||port>65535)throw Error('Invalid port');
  return {db,user,password,port};
}

export function createRepository(env=process.env,{executor=exec}={}) {
  const target=validateDatabaseTarget(env);
  const schema='p5h_'+randomBytes(8).toString('hex');
  const connectionEnv={PATH:env.PATH||'/usr/bin:/bin',PGHOST:'127.0.0.1',PGHOSTADDR:'127.0.0.1',PGPORT:String(target.port),PGDATABASE:target.db,PGUSER:target.user,PGPASSWORD:target.password,PGCONNECT_TIMEOUT:'5',PGSSLMODE:'disable'};
  async function run(file,params={}) {
    if(!['preflight.sql','setup.sql','query.sql','cleanup.sql','revoke.sql'].includes(file))throw Error('Unknown SQL file');
    if(!schemaPattern.test(schema))throw Error('Unsafe schema');
    const args=['-X','-w','-q','-A','-t','-v','ON_ERROR_STOP=1','-v','schema='+schema];
    for(const [key,value] of Object.entries(params)){
      if(!/^[A-Z_a-z][A-Za-z0-9_]*$/.test(key)||typeof value!=='string')throw Error('Invalid SQL variable');
      args.push('-v',key+'='+value);
    }
    args.push('-f',join(here,file));
    const result=await executor('psql',args,{env:connectionEnv,timeout:45000,maxBuffer:256*1024,encoding:'utf8'});
    return String(result.stdout||'').trim();
  }
  async function action(name,{actor='admin',docId='',title=''}={}){
    if(!Object.hasOwn(actions,name)||!idPattern.test(actor))throw Error('Invalid action or actor');
    if(!idPattern.test(docId))throw Error('Invalid document ID');
    if(name==='update'&&(typeof title!=='string'||title.length<1||title.length>120))throw Error('Invalid title');
    const value=await run('query.sql',{actor,doc_id:docId,title,[actions[name]]:'1'});
    try{return JSON.parse(value)}catch{throw Error('Invalid SQL response')}
  }
  return {schema,
    async preflight(){
      const result=JSON.parse(await run('preflight.sql'));
      if(result.database!==target.db||!Number.isInteger(result.serverVersion)||result.serverVersion<170000||result.rowSecurity!=='on'||result.super||result.bypass)throw Error('Database identity or RLS-bypass role is unsafe');
      return {ok:true};
    },
    setup:()=>run('setup.sql'),cleanup:()=>run('cleanup.sql'),action,
    async revokeForQualification(userId){
      // Never expose this fixture-admin method as an HTTP route.
      if(!idPattern.test(userId))throw Error('Invalid user ID');
      const value=await run('revoke.sql',{user_id:userId});
      try{return JSON.parse(value)}catch{throw Error('Invalid revocation response')}
    }};
}
