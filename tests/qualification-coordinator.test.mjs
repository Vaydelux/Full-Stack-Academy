import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCKS, STEPS, EXTERNAL_GATES, inspectCheckout, preflight, sameCheckout, makeReport, runQualification } from '../scripts/qualification-coordinator.mjs';

const initial=()=>({commit:'a'.repeat(40),clean:true,repoRoot:true,node:'v24.9.0',npmReady:true,browserReady:true,locks:Object.fromEntries(LOCKS.map(f=>[f,'b'.repeat(64)])),scripts:Object.fromEntries(STEPS.map(s=>[s.script,'node trusted.mjs']))});
const harness=({states=[],results=[],base=initial(),profile='all'}={})=>{
 const calls=[],receipts=[];let count=0;
 const report=runQualification({profile,probe:()=>states[count++]??base,execute:step=>{calls.push(step.id);const value=results[calls.length-1];if(value instanceof Error)throw value;return value??{status:0};},save:r=>receipts.push(structuredClone(r)),now:()=> '2026-11-24T09:00:00.000Z'});
 return {report,calls,receipts};
};
const blocked=(changes,fragment)=>assert.ok(preflight({...initial(),...changes}).some(s=>s.includes(fragment)));

test('clean qualified preflight accepts stable Node24.9+',()=>assert.deepEqual(preflight(initial()),[]));
for(const version of ['v22.16.0','v24.8.9','v25.0.0','v24.9.0-rc.1','nonsense'])test('blocks unsupported runtime '+version,()=>blocked({node:version},'Node 24.9+'));
test('invalid HEAD blocks preflight',()=>blocked({commit:'bogus'},'Git checkout'));
test('wrong repository root blocks preflight',()=>blocked({repoRoot:false},'Git checkout'));
test('dirty tracked/untracked checkout blocks preflight',()=>blocked({clean:false},'must be clean'));
for(const file of LOCKS)test('missing tracked '+file+' blocks preflight',()=>{const s=initial();delete s.locks[file];blocked({locks:s.locks},file);});
test('bad lock digest blocks preflight',()=>blocked({locks:{...initial().locks,[LOCKS[0]]:'bad'}},LOCKS[0]));
test('missing script blocks preflight',()=>blocked({scripts:{}},'Missing npm script'));
test('npm entrypoint required',()=>blocked({npmReady:false},'npm-cli.js'));
test('browser dependency required',()=>blocked({browserReady:false},'Playwright'));
test('planning performs no execution and cannot approve publication',()=>{const r=makeReport(initial());assert.equal(r.status,'not-run');assert.equal(r.publicationApproved,false);assert.ok(r.steps.every(s=>s.status==='not-run'));assert.equal(r.externalGates.length,EXTERNAL_GATES.length);});
test('blocked run records receipt without executing steps',()=>{const {report,calls,receipts}=harness({base:{...initial(),node:'v22.16.0'}});assert.equal(report.status,'blocked');assert.deepEqual(calls,[]);assert.equal(receipts.length,1);assert.equal(report.publicationApproved,false);});
test('all five successful gates do not approve publication',()=>{const {report,calls,receipts}=harness();assert.deepEqual(calls,STEPS.map(s=>s.id));assert.equal(report.status,'automated-passed');assert.ok(report.steps.every(s=>s.status==='passed'));assert.ok(report.externalGates.every(s=>s.status==='not-run'));assert.equal(report.publicationApproved,false);assert.equal(receipts[0].status,'running');assert.equal(receipts[1].steps[0].status,'running');assert.equal(receipts.at(-1).status,'automated-passed');});
test('first failure prevents later gates',()=>{const {report,calls}=harness({results:[{status:0},{status:2}]});assert.equal(report.status,'failed');assert.equal(calls.length,2);assert.equal(report.steps[1].exitCode,2);assert.ok(report.steps.slice(2).every(s=>s.status==='not-run'));});
test('timeout and signal cannot pass',()=>{const {report}=harness({results:[{status:null,error:{code:'ETIMEDOUT'},signal:'SIGTERM'}]});assert.equal(report.status,'failed');assert.equal(report.steps[0].errorCode,'ETIMEDOUT');});
test('execution exception is fail closed',()=>{const {report}=harness({results:[Error('sensitive detail')]});assert.equal(report.status,'failed');assert.equal(report.steps[0].errorCode,'EXECUTION_ERROR');assert.ok(!JSON.stringify(report).includes('sensitive detail'));});
test('unexpected error with zero exit cannot pass',()=>assert.equal(harness({results:[{status:0,error:{code:'EIO'}}]}).report.status,'failed'));
test('changed commit before gate invalidates without execution',()=>{const base=initial(),{report,calls}=harness({base,states:[base,{...base,commit:'c'.repeat(40)}]});assert.equal(report.status,'invalidated');assert.equal(calls.length,0);});
test('dirty checkout after command invalidates success',()=>{const base=initial(),{report,calls}=harness({base,states:[base,base,{...base,clean:false}]});assert.equal(report.status,'invalidated');assert.equal(calls.length,1);assert.equal(report.steps[0].status,'invalidated');});
test('changed lock digest invalidates run',()=>{const base=initial(),{report}=harness({base,states:[base,base,{...base,locks:{...base.locks,[LOCKS[1]]:'d'.repeat(64)}}]});assert.equal(report.status,'invalidated');});
test('same checkout refuses missing locks or changed root',()=>{const base=initial();assert.equal(sameCheckout(base,{...base,locks:{}}),false);assert.equal(sameCheckout(base,{...base,repoRoot:false}),false);});
test('no manual or provider command can be executed by coordinator',()=>assert.ok(STEPS.every(s=>!/(deploy|publish|promote|qualify:p5|qualify:postgresql)/.test(s.script))));

function fixture(t){
 const root=mkdtempSync(join(tmpdir(),'academy-coordinator-test-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 const git=(...args)=>{const r=spawnSync('git',args,{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
 git('init','-q');git('config','user.email','academy@example.invalid');git('config','user.name','Academy Test');
 for(const f of LOCKS){mkdirSync(dirname(join(root,f)),{recursive:true});writeFileSync(join(root,f),'{}\n');}
 writeFileSync(join(root,'package.json'),JSON.stringify({scripts:initial().scripts}));
 mkdirSync(join(root,'scripts'));copyFileSync(fileURLToPath(new URL('../scripts/qualification-coordinator.mjs',import.meta.url)),join(root,'scripts/qualification-coordinator.mjs'));
 git('add','.');git('commit','-qm','fixture');
 return {root,git};
}
test('real Git preflight observes exact clean commit and tracked locks',t=>{const {root,git}=fixture(t);const s=inspectCheckout(root,{});assert.equal(s.commit,git('rev-parse','HEAD'));assert.equal(s.clean,true);assert.equal(s.repoRoot,true);assert.equal(Object.keys(s.locks).length,3);assert.equal(s.npmReady,false);assert.equal(s.browserReady,false);});
test('real Git preflight detects modified and untracked files',t=>{const {root,git}=fixture(t);writeFileSync(join(root,LOCKS[0]),'changed');assert.equal(inspectCheckout(root,{}).clean,false);git('checkout','--',LOCKS[0]);writeFileSync(join(root,'untracked.txt'),'x');assert.equal(inspectCheckout(root,{}).clean,false);});
test('real Git preflight does not accept untracked replacement lock',t=>{const {root,git}=fixture(t);git('rm','--cached',LOCKS[0]);assert.equal(Object.hasOwn(inspectCheckout(root,{}).locks,LOCKS[0]),false);});
test('real CLI plan leaves checkout clean; blocked run emits receipt outside it',t=>{
 const {root,git}=fixture(t),script=join(root,'scripts/qualification-coordinator.mjs');
 const plan=spawnSync(process.execPath,[script,'--plan'],{cwd:root,encoding:'utf8',env:{...process.env,npm_execpath:'',ACADEMY_BROWSER_ROOT:''}});assert.equal(plan.status,0,plan.stderr);assert.equal(JSON.parse(plan.stdout).publicationApproved,false);assert.equal(git('status','--porcelain'),'');
 const run=spawnSync(process.execPath,[script,'--run'],{cwd:root,encoding:'utf8',env:{...process.env,npm_execpath:'',ACADEMY_BROWSER_ROOT:''}});assert.equal(run.status,1,run.stderr);const result=JSON.parse(run.stdout);assert.equal(result.status,'blocked');t.after(()=>rmSync(dirname(result.receipt),{recursive:true,force:true}));const receipt=JSON.parse(readFileSync(result.receipt,'utf8'));assert.equal(receipt.commit,git('rev-parse','HEAD'));assert.equal(receipt.publicationApproved,false);assert.ok(receipt.steps.every(s=>s.status==='not-run'));assert.equal(git('status','--porcelain'),'');
});
test('real CLI unknown option refuses execution',t=>{const {root}=fixture(t);const result=spawnSync(process.execPath,[join(root,'scripts/qualification-coordinator.mjs'),'--force'],{cwd:root,encoding:'utf8'});assert.equal(result.status,2);assert.match(result.stderr,/Usage:/);});

test('P1 profile excludes the missing P2 lock and records P2 as not-run',()=>{const s=initial();delete s.locks[LOCKS[2]];assert.deepEqual(preflight(s,'p1'),[]);assert.ok(preflight(s).some(x=>x.includes(LOCKS[2])));const {report,calls}=harness({base:s,profile:'p1'});assert.equal(report.profile,'p1');assert.equal(report.status,'automated-passed');assert.deepEqual(calls,STEPS.slice(0,4).map(x=>x.id));assert.ok(report.externalGates.some(x=>x.gate==='P2 NestJS runtime qualification'&&x.status==='not-run'));assert.equal(report.publicationApproved,false);});
test('P1 still requires the actual React lock',()=>{const s=initial();delete s.locks[LOCKS[1]];assert.ok(preflight(s,'p1').some(x=>x.includes(LOCKS[1])));});
test('unknown profile is rejected',()=>assert.throws(()=>makeReport(initial(),'unknown'),/Invalid qualification profile/));
