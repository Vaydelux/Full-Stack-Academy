/** Phase-wide evidence inventory; source contracts and supplemental execution remain distinct. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,realpathSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve,join,relative,isAbsolute,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=realpathSync(fileURLToPath(new URL('../',import.meta.url)));
const hash=x=>createHash('sha256').update(x).digest('hex');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',timeout:30000,maxBuffer:32*1024*1024});
export const commands=Object.freeze({P5:['test:p5-bundle'],P6:['test:p6-quality-source','test:p6-operations-source','test:p6-runtime'],P7:['test:p7-source','test:p7-runtime']});
export function phaseReceipt(plan,phase,head,observations){
 assert.match(head,/^[a-f0-9]{40}$/);assert.ok(Object.hasOwn(commands,phase));
 const modules=plan.modules.filter(m=>m.phase===phase),topics=modules.flatMap(m=>m.topics.filter(t=>!t.historical));
 assert.equal(modules.length,{P5:15,P6:18,P7:17}[phase]);assert.equal(topics.length,{P5:119,P6:144,P7:136}[phase]);
 assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);
 assert.deepEqual(observations.map(x=>x.command),commands[phase]);
 for(const o of observations){assert.equal(o.exit,0);assert.match(o.logSha256,/^[a-f0-9]{64}$/);}
 return {schemaVersion:1,commit:head,phase,scope:'phase-source-and-supplemental-runtime',observations,modules:modules.map(m=>({id:m.id,sourceFingerprint:m.fingerprint,requiredRuntime:m.runtime,topics:m.topics.filter(t=>!t.historical).map(t=>({id:t.id,manuscriptSha256:t.sha256,topicQualification:false}))})),sourceContractsChecked:topics.length,humanReview:false,topicQualification:false,publicationApproved:false};
}
function main(){
 const [phase,dir,...extra]=process.argv.slice(2);assert.ok(!extra.length&&Object.hasOwn(commands,phase)&&dir);
 assert.equal(process.env.GITHUB_ACTIONS,'true');assert.equal(process.version,'v24.11.1');
 const out=realpathSync(dir),rel=relative(root,out);assert.ok(isAbsolute(rel)||rel==='..'||rel.startsWith('..'+sep));
 const head=git('rev-parse','HEAD').trim(),index=git('ls-files','--stage','-z');
 const verify=()=>{assert.equal(git('rev-parse','HEAD').trim(),head);assert.equal(git('ls-files','--stage','-z'),index);assert.equal(git('status','--porcelain=v1','--untracked-files=all'),'');};
 verify();
 const plan=JSON.parse(execFileSync(process.execPath,['scripts/verify-late-phase.mjs','--json'],{cwd:root,encoding:'utf8',timeout:120000,maxBuffer:64*1024*1024}));
 const observations=[];
 for(const command of commands[phase]){
  const result=spawnSync('npm',['run',command],{cwd:root,encoding:'utf8',timeout:900000,maxBuffer:64*1024*1024,env:{...process.env,CI:'true'}});
  const log=(result.stdout??'')+'\n'+(result.stderr??'');
  writeFileSync(join(out,command.replaceAll(':','-')+'.log'),log,{flag:'wx'});
  console.log(command+' exit='+result.status);
  assert.ok(!result.error&&!result.signal&&result.status===0,'Phase suite failed: '+command);
  observations.push({command,exit:0,logSha256:hash(log)});verify();
 }
 const receipt=phaseReceipt(plan,phase,head,observations);
 writeFileSync(join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({phase,modules:receipt.modules.length,sourceContractsChecked:receipt.sourceContractsChecked,publicationApproved:false,topicQualification:false}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
