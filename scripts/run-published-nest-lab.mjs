/** Execute real, compiled, topic-specific Nest acceptance against byte-matched source. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { candidatePaths } from './nest-candidate-contract.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const workspace=path.join(root,'examples/nestjs-vertical');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const lf=s=>s.replaceAll('\r\n','\n');
export function nestLabPlan(id,slug){
 const p=candidatePaths(id,slug);
 const relative=p=>p.replace('examples/nestjs-vertical/','');
 const pattern='^'+id.replaceAll('.','\\.')+' ';
 const suite=p=>['--test','--test-reporter=tap','--test-name-pattern='+pattern,relative(p)];
 return {paths:p,steps:[{args:['scripts/require-lock.mjs']},{args:['node_modules/typescript/bin/tsc','-p','tsconfig.json']},{args:suite(p.suite),count:1},...(p.integration?[{args:suite(p.integration),count:id==='11.04.03'?2:1}]:[])]};
}
export function verifyTap(result,count){
 assert.equal(result.status,0,'Runtime command failed');assert.ok(!result.signal&&!result.error,'Runtime command interrupted');
 if(count===undefined)return;
 const out=result.stdout??'';
 for(const [key,value] of [['tests',count],['pass',count],['fail',0],['cancelled',0],['skipped',0],['todo',0]]){
  const matches=[...out.matchAll(new RegExp('^# '+key+' (\\d+)\\r?$','gm'))];
  assert.equal(matches.length,1,'Missing or ambiguous TAP summary '+key);
  assert.equal(Number(matches[0][1]),value,'Unexpected TAP '+key);
 }
}
export function independentTestEnvironment(parent=process.env){
 const env={...parent};delete env.NODE_TEST_CONTEXT;return env;
}
export function runPublishedNestLab(id,slug){
 const plan=nestLabPlan(id,slug),p=plan.paths;
 const candidate=JSON.parse(read('release-candidates/nestjs/'+id.slice(0,5)+'/module.json')).candidates.find(c=>c.id===id);
 assert.equal(candidate?.slug,slug,'Lab identity mismatch');
 for(const [live,draft] of [[p.targets[3],p.sources[3]],[p.targets[4],p.sources[4]]])assert.equal(lf(read(live)),lf(read(draft)),'Published exercise diverges from compiled source');
 const mutex=path.join(workspace,'dist.lab-lock');
 // A second qualification process must fail rather than overwrite the active build.
 fs.mkdirSync(mutex);
 try{
  for(const step of plan.steps){
   const result=spawnSync(process.execPath,step.args,{cwd:workspace,env:independentTestEnvironment(),encoding:'utf8',timeout:90000,maxBuffer:4*1024*1024,windowsHide:true});
   if(result.stdout)process.stdout.write(result.stdout);
   if(result.stderr)process.stderr.write(result.stderr);
   verifyTap(result,step.count);
  }
 }finally{fs.rmdirSync(mutex);}
}
