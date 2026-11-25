/** Source-side audit of the local release matrix. This does not execute a release gate. */
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const REQUIRED = Object.freeze([
 'test:release-gate-coverage',
 'test:forms-query-resilience',
 'test:curriculum-readiness',
 'test:publication-phases',
 'test:p4-source',
 'test:p5-bundle',
 'test:p6-quality-source',
 'test:p6-operations-source',
 'test:p7-source',
 'test:p8-learning',
 'test:p8-reference',
 'test:p8-ui',
 'lint',
 'typecheck',
 'test',
 'build',
]);
const P5_REQUIRED = Object.freeze([
 'test:p5-security','test:p5-postgresql-source','test:p5-rls-source',
 'test:p5-curriculum-source','test:p5-httpdb-source','test:p5-container-source',
 'test:p5-evidence-source','test:p5-cache-jobs','test:p5-redis-source',
 'test:p5-realtime-labs','test:p5-realtime-source',
 'test:p5-integrations-labs','test:p5-integrations-source',
 'test:p5-integrations-http','test:p5-postgres-search-source',
 'test:p5-webhook-integrity',
 'test:p5-durable-inbox','test:p5-durable-http','test:p5-multiprocess-inbox',
 'test:p5-postgres-inbox-source',
]);
const unique=(a)=>new Set(a).size===a.length;

export function auditOfflineMatrix({offlineSource,scripts}) {
 const errors=[];
 if(typeof offlineSource!=='string'||!scripts||typeof scripts!=='object')return {ok:false,errors:['invalid-source-or-scripts']};
 const match=offlineSource.match(/const steps\s*=\s*\[([\s\S]*?)\];/);
 if(!match)return {ok:false,errors:['missing-static-step-list']};
 const stepLines=match[1].split('\n').map(s=>s.trim()).filter(Boolean);
 const steps=[];
 for(const line of stepLines){
  const m=/^'([a-z0-9:_-]+)',?$/.exec(line);
  if(!m)errors.push('dynamic-or-unsupported-release-step:'+line);
  else steps.push(m[1]);
 }
 if(!unique(steps))errors.push('duplicate-release-step');
 for(const step of steps)if(typeof scripts[step]!=='string'||!scripts[step])errors.push('missing-script:'+step);
 for(const required of REQUIRED)if(!steps.includes(required))errors.push('missing-required-release-step:'+required);
 if(!/requireReleaseNodeRuntime\(process\.version\)/.test(offlineSource))errors.push('missing-node24-guard');
 if(/\b(?:github|vercel)\s+(?:deploy|workflow|run)\b/i.test(offlineSource))errors.push('unexpected-remote-release-command');
 const bundle=scripts['test:p5-bundle'];
 if(typeof bundle!=='string')errors.push('missing-p5-bundle');
 else{
  const calls=bundle.split('&&').map(x=>x.trim());
  const expected=P5_REQUIRED.map(x=>'npm run '+x);
  if(!unique(calls))errors.push('duplicate-p5-substep');
  for(const need of expected)if(!calls.includes(need))errors.push('missing-p5-substep:'+need);
  for(const call of calls){
   const match=/^npm run (test:p5-[a-z0-9-]+)$/.exec(call);
   if(!match){errors.push('unsafe-p5-bundle-command:'+call);continue;}
   const name=match[1];
   if(name==='test:p5-bundle')errors.push('recursive-p5-bundle');
   if(!Object.hasOwn(scripts,name)||typeof scripts[name]!=='string'||!scripts[name].trim())errors.push('missing-p5-script:'+name);
  }
 }
 return {ok:errors.length===0,errors,requiredReleaseCount:REQUIRED.length,requiredP5Count:P5_REQUIRED.length,offlineStepCount:steps.length};
}

const self=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===self){
 const root=resolve(dirname(self),'..');
 const read=p=>readFileSync(resolve(root,p),'utf8');
 const report=auditOfflineMatrix({offlineSource:read('scripts/verify-offline.mjs'),scripts:JSON.parse(read('package.json')).scripts});
 console.log(JSON.stringify(report,null,2));
 if(!report.ok)process.exitCode=1;
}
