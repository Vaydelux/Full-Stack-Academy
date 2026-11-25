import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULES,buildPersistencePlan,qualificationKind,isSqlContract,validatePublicationBaseline } from '../scripts/persistence-release-plan.mjs';
function fixture(){
 const files=new Map(),lessons=[],put=(p,o)=>files.set(p,typeof o==='string'?o:JSON.stringify(o));
 for(const [id,folder] of MODULES){
  const pg=id.startsWith('12.'),base=pg?'drafts/postgresql':'drafts/p4',fixture='examples/'+folder+'/fixture.sql';
  const manifest={moduleId:id,readyToPublish:false,runtimeQualification:'not-run',lessons:[],...(pg?{fixture}:{})};if(pg)put(fixture,'SELECT 1;');
  for(let n=1;n<=8;n++){
   const topic=id+'.0'+n,slug='topic-'+topic.replaceAll('.','-'),title='Topic '+topic,dir=base+'/labs/'+slug,lesson=base+'/lessons/'+topic;
   const kind=id==='12.03'?'single-session-sql-semantics':id==='12.04'&&n>4||id==='12.05'&&n>2?'manual-evidence':pg?'sql-contract':{'13.01':'manual-toolchain','13.02':'manual-prisma-integration','13.03':'manual-prisma-integration','13.04':'manual-prisma-supabase-integration','14.01':'manual-supabase-local','14.02':'manual-supabase-auth','14.03':'manual-rls-positive-negative','14.04':'manual-storage-realtime-integration'}[id];
   const language=pg?'sql':'ts',starter=dir+'/starter.'+language,solution=dir+'/solution.'+language,acceptance=dir+'/'+(isSqlContract(kind)?'acceptance.sql':'acceptance.md');
   lessons.push({id:topic,moduleId:id,title});manifest.lessons.push({id:topic,slug,title,qualificationKind:kind,language,extension:language});
   put(lesson+'.meta.json',{id:topic,moduleId:id,title,labSlug:slug,sourceStatus:'draft-unverified',runtimeQualification:'not-run',reviewStatus:'unreviewed'});
   put(dir+'/lab.json',{lessonId:topic,readyToPublish:false,sourceStatus:'draft-unverified',qualificationKind:kind,starter,solution,...(isSqlContract(kind)?{acceptance}:{acceptanceDoc:acceptance}),...(pg?{fixture}:{}),requiresSeparateConcurrencyReview:id==='12.03',requiresTwoAuthenticatedUsers:['14.03','14.04'].includes(id)});
   put(starter,'bad');put(solution,'good');put(lesson+'.mdx','```'+language+'\nbad\n```\n```'+language+'\ngood\n```');put(acceptance,isSqlContract(kind)?"RAISE EXCEPTION '"+topic+"'":"Manual evidence required. ".repeat(20));
  }put('examples/'+folder+'/module.json',manifest);
 }return {files,catalog:{lessons},read:p=>{assert.ok(files.has(p),'missing '+p);return files.get(p);}};
}
const run=f=>buildPersistencePlan(f.catalog,f.read);
const modify=(f,p,patch)=>{f.files.set(p,JSON.stringify({...JSON.parse(f.read(p)),...patch}));};
test('all thirteen modules contain 104 source-bound candidates and no approvals',()=>{const p=run(fixture());assert.equal(p.modules.length,13);assert.equal(p.topics,104);assert.equal(p.sqlContracts,30);assert.equal(p.manualContracts,74);assert.equal(p.modules.flatMap(x=>x.topics).every(t=>Object.keys(t.bindings).length===6&&!t.runtimeExecuted&&!t.publicationApproved),true);});
test('all eight transaction topics keep separate concurrency qualification',()=>{const p=run(fixture());assert.equal(p.modules[2].topics.every(t=>t.requiresSeparateConcurrencyReview&&isSqlContract(t.kind)),true);assert.equal(p.separateConcurrencyReviews,8);});
test('stable source fingerprint changes with source drift',()=>{const f=fixture(),p=run(f);assert.deepEqual(run(f),p);f.files.set('examples/postgresql-basics/fixture.sql','SELECT 2;');assert.notEqual(run(f).modules[0].fingerprint,p.modules[0].fingerprint);});
test('partial or incorrect canonical inventories fail',()=>{const f=fixture();f.catalog.lessons.pop();assert.throws(()=>run(f));});
test('unsafe or mismatched qualification kind fails',()=>{assert.throws(()=>qualificationKind('12.03','sql-contract'));assert.throws(()=>qualificationKind('14.03','manual-toolchain'));});
test('missing source and broken code parity fail',()=>{let f=fixture();f.files.delete('drafts/postgresql/labs/topic-12-01-01/solution.sql');assert.throws(()=>run(f));f=fixture();f.files.set('drafts/postgresql/labs/topic-12-01-01/solution.sql','wrong');assert.throws(()=>run(f),/parity/);});
test('premature publication flag fails',()=>{const f=fixture();modify(f,'drafts/postgresql/labs/topic-12-01-01/lab.json',{readyToPublish:true});assert.throws(()=>run(f));});
test('separate concurrency review cannot be silently removed',()=>{const f=fixture();modify(f,'drafts/postgresql/labs/topic-12-03-01/lab.json',{requiresSeparateConcurrencyReview:false});assert.throws(()=>run(f));});
test('two-user RLS proof cannot be silently removed',()=>{const f=fixture();modify(f,'drafts/p4/labs/topic-14-03-01/lab.json',{requiresTwoAuthenticatedUsers:false});assert.throws(()=>run(f));});
test('publication baseline permits legitimate earlier phases but rejects mismatched inventory',()=>{for(const n of [338,346,354,362,386,426,490,889])assert.equal(validatePublicationBaseline(n,Array.from({length:n-1},(_,i)=>String(i)),['interactive']),n);assert.throws(()=>validatePublicationBaseline(346,[],[]));assert.throws(()=>validatePublicationBaseline(337,Array(336).fill('x'),['interactive']));});
