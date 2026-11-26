/** Run only specifically supported disposable checks. Never edits review decisions or the checkout. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {lstatSync,realpathSync,writeFileSync,rmSync} from 'node:fs';
import {join,sep} from 'node:path';
import {runSqlPair} from './persistence-sql-runner.mjs';
import {validatePerformance,validateLogicalRestore} from './pg-performance-evidence.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const supported=new Set(['semantic-red-green','measured-performance','logical-restore']);
export function collectPgReviewArtifacts({root,directory,manifest,module,projection,read,verifyCheckout}){
 assert.ok(['12.04','12.05'].includes(module.id));assert.equal(manifest.moduleId,module.id);assert.equal(manifest.sourceFingerprint,module.fingerprint);assert.equal(manifest.projectionFingerprint,projection.fingerprint);assert.equal(manifest.applicable,false);assert.equal(manifest.publicationApproved,false);
 const artifacts=join(directory,'artifacts');assert.ok(lstatSync(artifacts).isDirectory()&&!lstatSync(artifacts).isSymbolicLink());assert.equal(realpathSync(artifacts),directory+sep+'artifacts');
 const jobs=projection.records.flatMap(r=>r.runtime.filter(k=>supported.has(k)).map(kind=>({id:r.id,kind,name:r.id+'.'+kind+'.log',acceptanceSha256:r.acceptanceSha256})));
 assert.equal(jobs.length,module.id==='12.04'?8:5);
 // Check all destinations first. Existing evidence must not be silently replaced.
 for(const j of jobs){try{lstatSync(join(artifacts,j.name));throw Error('Artifact already exists: '+j.name);}catch(e){if(e.code!=='ENOENT')throw e;}}
 verifyCheckout();
 const run=(path,args=[])=>{try{return JSON.parse(execFileSync(process.execPath,[path,...args],{cwd:root,encoding:'utf8',timeout:180000,maxBuffer:4*1024*1024,windowsHide:true,stdio:['ignore','pipe','pipe']}));}catch{throw Error('Disposable runtime check failed: '+path);}};
 const fixture=Object.keys(module.shared).find(p=>p.endsWith('/fixture.sql'));assert.ok(fixture);
 const pending=jobs.map(j=>{
  const topic=module.topics.find(t=>t.id===j.id);assert.ok(topic);const lab='drafts/postgresql/labs/'+topic.slug+'/';let result;
  if(j.kind==='semantic-red-green')result=runSqlPair({id:j.id,fixture:read(fixture),starter:read(lab+'starter.sql'),solution:read(lab+'solution.sql'),acceptance:read(lab+'acceptance.sql')});
  else if(j.kind==='measured-performance'){const out=run('examples/p5-distributed-runtime/p3-acceptance-run.mjs',[j.id]);assert.equal(out.publicationApproved,false);assert.equal(out.manualReviewRequired,true);assert.equal(out.observations.length,1);result=out.observations[0];assert.equal(result.id,j.id);assert.equal(result.scope,'disposable-real-postgresql');assert.equal(result.publicationApproved,false);validatePerformance(j.id,result.observations);}
  else result=validateLogicalRestore(run('scripts/pg-restore-drill.mjs'));
  const body=JSON.stringify({schemaVersion:1,commit:manifest.commit,moduleId:module.id,sourceFingerprint:module.fingerprint,projectionFingerprint:projection.fingerprint,lessonId:j.id,kind:j.kind,acceptanceSha256:j.acceptanceSha256,result,publicationApproved:false,manualReviewRequired:true},null,2)+'\n';
  assert.ok(Buffer.byteLength(body)<=4*1024*1024);return {...j,body,sha256:hash(body)};
 });
 verifyCheckout();const created=[];
 try{for(const p of pending){const path=join(artifacts,p.name);writeFileSync(path,p.body,{flag:'wx',mode:0o600});created.push(path);}verifyCheckout();}catch(e){for(const p of created)rmSync(p);throw e;}
 return {moduleId:module.id,artifacts:pending.map(({body,...p})=>p),manualRemaining:projection.records.flatMap(r=>r.runtime.filter(k=>!supported.has(k)).map(kind=>({id:r.id,kind}))),reviewEvidenceChanged:false,publicationApproved:false};
}
