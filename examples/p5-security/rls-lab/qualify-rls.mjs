import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

// A deliberately strict gate around a DISPOSABLE local PostgreSQL cluster.
export function validateTarget(env) {
  if (env.P5_LAB_CONFIRM !== 'DISPOSABLE_ONLY' || env.P5_LAB_RLS_CONFIRM !== 'ALLOW_ROLES')
    return {ok:false, reason:'explicit disposable and temporary-role confirmations required'};
  if (!env.P5_LAB_DATABASE_URL) return {ok:false, reason:'connection URL required'};
  let url;
  try { url = new URL(env.P5_LAB_DATABASE_URL); }
  catch { return {ok:false, reason:'invalid connection URL'}; }
  let db;
  try { db = decodeURIComponent(url.pathname.substring(1)); }
  catch { return {ok:false, reason:'invalid database name encoding'}; }
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) return {ok:false,reason:'postgresql URL required'};
  if (!['127.0.0.1','localhost','[::1]'].includes(url.hostname)) return {ok:false,reason:'only loopback hostname accepted'};
  if (!/^p5_lab_[a-z0-9_]+$/.test(db)) return {ok:false,reason:'only disposable p5_lab_* database accepted'};
  if (url.search || url.hash) return {ok:false,reason:'URL query parameters and fragments forbidden'};
  return {ok:true, url:env.P5_LAB_DATABASE_URL};
}

export function runRls(env=process.env) {
  const check=validateTarget(env);
  if (!check.ok) { console.error('BLOCKED: '+check.reason); return 2; }
  const sql=resolve(dirname(fileURLToPath(import.meta.url)), 'rls.sql');
  const child=spawnSync('psql',['-X','-w','--set=ON_ERROR_STOP=1','--dbname',check.url,'--file',sql],{
    encoding:'utf8',timeout:90000,maxBuffer:1024*1024,env:{...env,PGCONNECT_TIMEOUT:'5'}
  });
  if (child.error) { console.error('BLOCKED: psql unavailable or timed out: '+child.error.message); return 2; }
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  if (child.status!==0 || !child.stdout?.includes('P5_RLS_14_ASSERTIONS_PASSED')) {
    console.error('FAILED: RLS qualification did not pass'); return 1;
  }
  console.log('PASS: 14 disposable DB-role RLS assertions (not HTTP/OIDC qualification)');
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode=runRls();
