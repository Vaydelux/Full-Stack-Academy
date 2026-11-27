/** Run only specifically supported disposable checks. Never edits review decisions or the checkout. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {lstatSync,realpathSync,openSync,writeFileSync,closeSync,rmSync} from 'node:fs';
import {join,sep} from 'node:path';
import {runSqlPair} from './persistence-sql-runner.mjs';
import {validatePgArtifact} from './pg-performance-evidence.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const supported=new Set(['semantic-red-green','measured-performance','logical-restore']);
const topics=id=>Array.from({length:8},(_,i)=>id+'.0'+(i+1));
const expectedKinds={'12.04':['measured-performance','semantic-red-green','semantic-red-green','semantic-red-green','measured-performance','semantic-red-green','measured-performance','measured-performance'],'12.05':['logical-restore',null,'semantic-red-green','semantic-red-green',null,null,'logical-restore','logical-restore']};
function runRuntime(root,path,args=[]){try{return JSON.parse(execFileSync(process.execPath,[path,...args],{cwd:root,encoding:'utf8',timeout:180000,maxBuffer:4*1024*1024,windowsHide:true,stdio:['ignore','pipe','pipe']}));}catch{throw Error('Disposable runtime check failed: '+path);}}
export function collectPgReviewArtifacts({root,directory,manifest,module,projection,read,verifyCheckout},{sql=runSqlPair,runtime=runRuntime}={}){
 assert.ok(Object.hasOwn(expectedKinds,module.id));assert.equal(manifest.moduleId,module.id);assert.equal(manifest.sourceFingerprint,module.fingerprint);assert.equal(manifest.projectionFingerprint,projection.fingerprint);assert.match(manifest.commit,/^[a-f0-9]{40}$/);assert.equal(manifest.applicable,false);assert.equal(manifest.publicationApproved,false);
 const ids=topics(module.id);assert.deepEqual(projection.records.map(r=>r.id),ids);assert.deepEqual(module.topics.map(t=>t.id),ids);
 const artifacts=join(directory,'artifacts');const checkDirectory=()=>{assert.ok(lstatSync(artifacts).isDirectory()&&!lstatSync(artifacts).isSymbolicLink());assert.equal(realpathSync(artifacts),directory+sep+'artifacts');};checkDirectory();
 const jobs=projection.records.flatMap((r,i)=>{const kinds=r.runtime.filter(k=>supported.has(k));const expected=expectedKinds[module.id][i];assert.deepEqual(kinds,expected?[expected]:[],'Unexpected runtime obligation '+r.id);assert.match(r.acceptanceSha256,/^[a-f0-9]{64}$/);return kinds.map(kind=>({id:r.id,kind,name:r.id+'.'+kind+'.log',acceptanceSha256:r.acceptanceSha256}));});
 for(const j of jobs){try{lstatSync(join(artifacts,j.name));throw Error('Artifact already exists: '+j.name);}catch(e){if(e.code!=='ENOENT')throw e;}}
 verifyCheckout();
 const fixture=Object.keys(module.shared).find(p=>p.endsWith('/fixture.sql'));assert.equal(fixture,'examples/postgresql-'+(module.id==='12.04'?'performance':'operations')+'/fixture.sql');
 const pending=jobs.map(j=>{
  const topic=module.topics.find(t=>t.id===j.id);assert.match(topic.slug,/^[a-z][a-z0-9-]+$/);const lab='drafts/postgresql/labs/'+topic.slug+'/';let result;
  if(j.kind==='semantic-red-green')result=sql({id:j.id,fixture:read(fixture),starter:read(lab+'starter.sql'),solution:read(lab+'solution.sql'),acceptance:read(lab+'acceptance.sql')});
  else if(j.kind==='measured-performance'){const out=runtime(root,'examples/p5-distributed-runtime/p3-acceptance-run.mjs',[j.id]);assert.equal(out.publicationApproved,false);assert.equal(out.manualReviewRequired,true);assert.equal(out.observations.length,1);result=out.observations[0];}
  else result=runtime(root,'scripts/pg-restore-drill.mjs');
  const binding={commit:manifest.commit,moduleId:module.id,sourceFingerprint:module.fingerprint,projectionFingerprint:projection.fingerprint,lessonId:j.id,kind:j.kind,acceptanceSha256:j.acceptanceSha256};
  const body=JSON.stringify({schemaVersion:1,...binding,result,publicationApproved:false,manualReviewRequired:true},null,2)+'\n';assert.ok(Buffer.byteLength(body)<=4*1024*1024);validatePgArtifact(Buffer.from(body),binding);return {...j,body,sha256:hash(body)};
 });
 verifyCheckout();checkDirectory();const created=[];
 try{for(const p of pending){checkDirectory();const path=join(artifacts,p.name);const fd=openSync(path,'wx',0o600);created.push(path);try{writeFileSync(fd,p.body);}finally{closeSync(fd);}}verifyCheckout();}catch(e){const failures=[];for(const p of created){try{checkDirectory();rmSync(p);}catch(error){failures.push(error);}}if(failures.length)throw new AggregateError([e,...failures],'Artifact cleanup incomplete; inspect disposable review directory');throw e;}
 return {moduleId:module.id,artifacts:pending.map(({body,...p})=>p),manualRemaining:projection.records.flatMap(r=>r.runtime.filter(k=>!supported.has(k)).map(kind=>({id:r.id,kind}))),reviewEvidenceChanged:false,publicationApproved:false};
}
