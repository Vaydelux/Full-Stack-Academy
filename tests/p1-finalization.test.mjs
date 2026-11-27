import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { p1ModuleStates, expectedP1Publication, verifyP1RouteState } from '../scripts/p1-browser-state.mjs';
import { assertP1Checkout, assertP1ReviewPredecessor, markP1ReviewFixture, REVIEW_FIXTURE_STATUS } from '../scripts/p1-publication-review.mjs';
const files=id=>Array.from({length:8},(_,i)=>id+'.'+String(i+1).padStart(2,'0')+'.meta.json');
test('metadata accepts 338, 346 and 354 transitions',()=>{
  assert.deepEqual(p1ModuleStates([]),{'09.02':false,'09.03':false});
  assert.deepEqual(p1ModuleStates(files('09.02')),{'09.02':true,'09.03':false});
  assert.deepEqual(p1ModuleStates([...files('09.02'),...files('09.03')]),{'09.02':true,'09.03':true});
});
test('partial or reversed module publication is rejected',()=>{
  for(const names of [files('09.02').slice(1),files('09.03'),[...files('09.02'),...files('09.03').slice(1)]]) assert.throws(()=>p1ModuleStates(names));
});
function pageFixture({status=200,robots='noindex, follow',reading=true,guided=false,completion=false,noCredit=true,markComplete=false,activeContent=false}={}) {
  const element=present=>({count:async()=>Number(present),waitFor:async()=>assert.ok(present),locator:()=>element(activeContent)});
  const roles={'Reading edition article':reading,'Guided lesson':guided,'Lesson completion':completion,'Mark complete':markComplete};
  return {goto:async()=>({status:()=>status}),locator:()=>({first:()=>({getAttribute:async()=>robots})}),getByText:()=>element(noCredit),getByRole:(_role,{name})=>element(roles[name])};
}
const publishedPage={robots:'index, follow',reading:false,guided:true,completion:true,noCredit:false};
test('route assertion accepts reading edition and published lesson states',async()=>{
  await verifyP1RouteState(pageFixture(),'http://127.0.0.1:3000','09.02.01',false);
  await verifyP1RouteState(pageFixture(publishedPage),'http://127.0.0.1:3000','09.02.01',true);
});
test('route assertion rejects wrong robots, missing reading article, and credit leaks',async()=>{
  for(const overrides of [{status:404},{robots:'index'},{reading:false},{noCredit:false},{guided:true},{completion:true},{markComplete:true},{activeContent:true}]) await assert.rejects(()=>verifyP1RouteState(pageFixture(overrides),'http://127.0.0.1:3000','09.02.01',false));
});
test('published route requires guided lesson and completion without contradictory reading state',async()=>{
  for(const overrides of [{robots:'noindex'},{guided:false},{completion:false},{reading:true},{noCredit:true}]) await assert.rejects(()=>verifyP1RouteState(pageFixture({...publishedPage,...overrides}),'http://127.0.0.1:3000','09.02.01',true));
});
function fixture(t) {
  const dir=mkdtempSync(path.join(tmpdir(),'p1-review-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const root=path.join(dir,'repo'),worktree=path.join(dir,'review');mkdirSync(root);
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-q');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');
  writeFileSync(path.join(root,'lesson'),'original');writeFileSync(path.join(root,'review.json'),'{}');git('add','.');git('commit','-qm','fixture');
  return {root,worktree,git};
}
test('review requires a detached linked worktree, not main or a detached primary checkout',t=>{
  const {root,worktree,git}=fixture(t);assert.throws(()=>assertP1Checkout(root,{reviewOnly:true}),/detached/);
  git('worktree','add','--detach',worktree);assert.equal(assertP1Checkout(worktree,{reviewOnly:true}),git('rev-parse','HEAD'));
  git('checkout','--detach');assert.throws(()=>assertP1Checkout(root,{reviewOnly:true}),/linked/);
});
test('real Git detects hidden tracked edits and untracked evidence',t=>{
  const {root,git}=fixture(t);assertP1Checkout(root,{evidencePath:'review.json'});
  writeFileSync(path.join(root,'untracked.json'),'{}');assert.throws(()=>assertP1Checkout(root,{evidencePath:'untracked.json'}),/tracked/);rmSync(path.join(root,'untracked.json'));
  git('update-index','--assume-unchanged','lesson');writeFileSync(path.join(root,'lesson'),'hidden');assert.throws(()=>assertP1Checkout(root),/Hidden/);
});
test('postflight allows only expected changes and rejects changed HEAD',t=>{
  const {root,git}=fixture(t);const head=assertP1Checkout(root);writeFileSync(path.join(root,'lesson'),'changed');
  assert.equal(assertP1Checkout(root,{expectedHead:head,allowedChanges:new Set(['lesson'])}),head);
  assert.throws(()=>assertP1Checkout(root,{allowedChanges:new Set()}),/Unexpected/);
  git('add','lesson');git('commit','-qm','next');assert.throws(()=>assertP1Checkout(root,{expectedHead:head}),/HEAD changed/);
});
test('fixture checkpoint is explicitly not commit or deploy approval',()=>{
  const record={snapshot:{publishedLessons:346},status:'old',development:{old:true}};const next=markP1ReviewFixture(record,'09.02');
  assert.equal(next.status,REVIEW_FIXTURE_STATUS);assert.equal(next.development.state,REVIEW_FIXTURE_STATUS);assert.match(next.nextMilestone,/Never commit or deploy/);assert.deepEqual(next.snapshot,record.snapshot);assert.equal(record.status,'old');
});

test('legacy boundary is derived from metadata at all three atomic publication states',()=>{
 const rhf=files('09.02'),query=files('09.03');
 for(const [names,expected] of [[[],[false,false]],[rhf,[true,false]],[[...rhf,...query],[true,true]]]){
  assert.deepEqual(['09.02.01','09.03.01'].map(id=>expectedP1Publication(id,names)),expected);
 }
 assert.throws(()=>expectedP1Publication('09.02.01',rhf.slice(1)));
 assert.throws(()=>expectedP1Publication('09.03.01',query));
 assert.throws(()=>expectedP1Publication('09.04.01',[]));
});

test('chained review accepts exact detached RHF fixture and rejects tampering or unrelated edits',t=>{
 const {root,worktree,git}=fixture(t);
 git('worktree','add','--detach',worktree);
 const projection=new Map(Array.from({length:50},(_,i)=>['projected-'+i,'expected-'+i]));
 for(const [name,body] of projection)writeFileSync(path.join(worktree,name),body);
 const checkpoint=markP1ReviewFixture({snapshot:{publishedLessons:346,completeModules:['09.02']}},'09.02');
 const opts={head:git('rev-parse','HEAD'),projection,checkpoint,readActual:name=>readFileSync(path.join(worktree,name),'utf8')};
 assert.doesNotThrow(()=>assertP1ReviewPredecessor(worktree,opts));
 assert.throws(()=>assertP1ReviewPredecessor(root,opts),/detached/);
 assert.throws(()=>assertP1ReviewPredecessor(worktree,{...opts,checkpoint:{...checkpoint,status:'published'}}),/review-only/);
 writeFileSync(path.join(worktree,'projected-0'),'tampered');
 assert.throws(()=>assertP1ReviewPredecessor(worktree,opts),/exact reviewed/);
 writeFileSync(path.join(worktree,'projected-0'),'expected-0');
 writeFileSync(path.join(worktree,'unrelated'),'unexpected');
 assert.throws(()=>assertP1ReviewPredecessor(worktree,opts),/Unexpected/);
});
