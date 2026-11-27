/** P3 runtime qualification only. No projection writes or human approval. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {assertP1Checkout} from './p1-publication-review.mjs';
import {buildPersistencePlan} from './persistence-release-plan.mjs';
import {runSqlPair} from './persistence-sql-runner.mjs';
import {parseConcurrencyOutput} from './pg-transaction-evidence.mjs';
import {sqlReceipt,reviewFingerprint} from './pg-promotion-guard.mjs';
import {projectSqlModule} from './f9-publication.mjs';
import {existsSync} from 'node:fs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const exists=p=>existsSync(new URL('../'+p,import.meta.url));
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',timeout:30000,maxBuffer:32*1024*1024});
const cli=(file,args,env=process.env)=>JSON.parse(execFileSync(process.execPath,[file,...args],{cwd:root,env,encoding:'utf8',timeout:2_400_000,maxBuffer:16*1024*1024}));
assert.equal(process.argv.length,2,'No arguments accepted');
assert.match(process.version,/^v24\.(?:9|[1-9]\d+)\.\d+$/);
const head=assertP1Checkout(root),index=git('ls-files','--stage','-z');
const verify=()=>{assertP1Checkout(root,{expectedHead:head});assert.equal(git('ls-files','--stage','-z'),index);};
const catalog=JSON.parse(read('data/curriculum.json')),modules=buildPersistencePlan(catalog,read).modules;
const semantic=[];
for(const id of ['12.01','12.02','12.03']){
 verify();
 const m=modules.find(m=>m.id===id),p=projectSqlModule(m,catalog,read,exists);
 const fixture=read(Object.keys(m.shared).find(p=>p.endsWith('/fixture.sql')));
 const results=m.topics.map(t=>{const dir='drafts/postgresql/labs/'+t.slug+'/';return runSqlPair({id:t.id,fixture,starter:read(dir+'starter.sql'),solution:read(dir+'solution.sql'),acceptance:read(dir+'acceptance.sql')});});
 const concurrency=id==='12.03'?m.topics.map(t=>parseConcurrencyOutput(JSON.stringify(cli('examples/p5-distributed-runtime/p3-acceptance-run.mjs',[t.id])),t.id)):undefined;
 semantic.push(sqlReceipt(id,reviewFingerprint(index,id,p.fingerprint),results,concurrency));verify();
 console.log(JSON.stringify({moduleId:id,semantic:results.length,concurrency:concurrency?.length??0,publicationApproved:false}));
}
const mixed=[];
for(const [id,count] of [['12.04',8],['12.05',5]]){
 verify();
 const pack=cli('scripts/publish-academy.mjs',['--project',id]);
 assert.equal(pack.commit,head);assert.equal(pack.applicable,false);
 const env=id==='12.05'?{...process.env,PG_TEST_URL:process.env.ACADEMY_PG_BACKUP_URL}:process.env;
 const evidence=cli('scripts/publish-academy.mjs',['--collect-runtime-evidence',id,pack.output],env);
 assert.equal(evidence.artifacts.length,count);assert.equal(evidence.publicationApproved,false);assert.equal(evidence.reviewEvidenceChanged,false);
 mixed.push({moduleId:id,sourceFingerprint:pack.sourceFingerprint,projectionFingerprint:pack.projectionFingerprint,directory:pack.output,...evidence});verify();
 console.log(JSON.stringify({moduleId:id,artifacts:count,manualRemaining:evidence.manualRemaining,publicationApproved:false}));
}
console.log(JSON.stringify({status:'p3-automated-runtime-passed',commit:head,semantic, mixed,publicationApproved:false,manualReviewRequired:true,committed:false,deployed:false},null,2));
