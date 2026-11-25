/** Read-only coordination and non-applicable review overlay export. No automatic promotion. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync,existsSync,mkdtempSync,mkdirSync,writeFileSync,rmSync,realpathSync,lstatSync} from 'node:fs';
import {resolve,join,dirname,relative,isAbsolute,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {collectStagedIds} from './staged-inventory.mjs';
import {buildPublicationQueue} from './publication-queue.mjs';
import {reconcilePublishedInventory} from '../examples/p4-foundations/scripts/reconcile-published.mjs';
import {buildPersistencePlan} from './persistence-release-plan.mjs';
import {nextPublication,projectSqlModule} from './f9-publication.mjs';
import {extendedModules,projectPersistenceReview} from './persistence-review-projection.mjs';
import {evidenceTemplate,checkEvidence} from './persistence-review-evidence.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8'),json=p=>JSON.parse(read(p)),exists=p=>existsSync(join(root,p));
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',timeout:30000,maxBuffer:32*1024*1024});
const hash=s=>createHash('sha256').update(s).digest('hex');
const args=process.argv.slice(2);
const supported=['12.01','12.02',...extendedModules],mode=args[0],requested=args[1];
assert.ok(args.length===1&&['--next','--check-projections'].includes(mode)||args.length===2&&mode==='--project'&&supported.includes(requested)||args.length===3&&mode==='--check-review-evidence'&&extendedModules.includes(requested),'Usage: --next | --check-projections | --project MODULE_ID | --check-review-evidence MODULE_ID DIRECTORY (review only)');
const project=(m,catalog)=>extendedModules.includes(m.id)?projectPersistenceReview(m,catalog,read,exists):projectSqlModule(m,catalog,read,exists);
const catalog=json('data/curriculum.json'),checkpoint=json('docs/checkpoint.json').snapshot;
const section=read('src/lib/academy/authored-content.ts').match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);assert.ok(section,'Missing authored IDs');
const interactiveIds=[...section[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const mdxIds=readdirSync(join(root,'src/content/lessons')).filter(p=>p.endsWith('.meta.json')).map(p=>{const id=json('src/content/lessons/'+p).id;assert.equal(id,p.slice(0,-10));assert.ok(exists('src/content/lessons/'+id+'.mdx'));return id;});
const {publishedIds}=reconcilePublishedInventory({interactiveIds,mdxIds,checkpoint,catalogIds:catalog.lessons.map(t=>t.id)});
const queue=buildPublicationQueue(catalog,publishedIds,collectStagedIds(root,catalog));const next=nextPublication(queue,checkpoint);
if(args[0]==='--next')console.log(JSON.stringify(next,null,2));
else{
 const plan=buildPersistencePlan(catalog,read),modules=plan.modules.filter(m=>supported.includes(m.id)&&!m.topics.every(t=>publishedIds.includes(t.id))&&(mode==='--check-projections'||m.id===requested));
 if(mode!=='--check-projections')assert.equal(modules.length,1,'Requested module is already published or unsupported');
 const projections=modules.map(m=>({id:m.id,sourceFingerprint:m.fingerprint,...project(m,catalog)}));
 if(mode==='--check-projections')console.log(JSON.stringify({modules:projections.map(p=>({id:p.id,files:p.writes.size,fingerprint:p.fingerprint,executableTopicWrappers:p.records?p.records.filter(r=>r.executableTopicWrapper).length:8,blockedManualWrappers:p.records?p.records.filter(r=>!r.executableTopicWrapper).length:0,applicable:false})),publicationApproved:false},null,2));
 else{
  const clean=()=>{assert.equal(realpathSync(git(['rev-parse','--show-toplevel']).trim()),realpathSync(root));assert.ok(git(['ls-files','-v','-z']).split('\0').filter(Boolean).every(line=>line.startsWith('H ')),'Unsupported hidden or unmerged index entry');assert.equal(git(['status','--porcelain=v1','--untracked-files=all']),'','Use a clean checkout');};
  clean();const head=git(['rev-parse','HEAD']).trim();assert.match(head,/^[a-f0-9]{40}$/);
  // Recompute after checkout preflight; no copy into the source tree and no apply command.
  const m=buildPersistencePlan(catalog,read).modules.find(x=>x.id===requested),p=project(m,catalog);assert.equal(p.fingerprint,projections[0].fingerprint);
  const manifest={schemaVersion:2,commit:head,moduleId:m.id,sourceFingerprint:m.fingerprint,projectionFingerprint:p.fingerprint,orderedNext:next.next?.id??null,eligibleByOrder:next.next?.id===m.id,reviewFixtureDate:'2000-01-01',files:[...p.writes].map(([path,body])=>({path,sha256:hash(body),preimageSha256:exists(path)?hash(read(path)):null})),...(p.records?{obligations:p.records}:{}),runtimeExecuted:false,publicationApproved:false,applicable:false};
  if(mode==='--check-review-evidence'){
   const directory=realpathSync(resolve(args[2]));
   assert.ok(lstatSync(resolve(args[2])).isDirectory(),'Use a real review directory');
   const rel=relative(realpathSync(root),directory);assert.ok(isAbsolute(rel)||rel==='..'||rel.startsWith('..'+sep),'Review directory must be outside checkout');
   const checked=(relativePath,max=4*1024*1024)=>{
    let target=directory;for(const part of relativePath.split('/')){assert.ok(part&&part!=='.'&&part!=='..');target=join(target,part);const stat=lstatSync(target);assert.ok(!stat.isSymbolicLink(),'Symlink in review pack: '+relativePath);}
    const stat=lstatSync(target);assert.ok(stat.isFile()&&stat.size>0&&stat.size<=max,'Missing or oversized review file: '+relativePath);assert.ok(realpathSync(target).startsWith(directory+sep));return readFileSync(target);
   };
   assert.deepEqual(JSON.parse(checked('manifest.json').toString('utf8')),manifest,'Manifest/source drift; regenerate at current HEAD');
   for(const [path,body] of p.writes)assert.equal(hash(checked('overlay/'+path)),hash(body),'Overlay drift '+path);
   const result=checkEvidence(evidenceTemplate(m.id,m.fingerprint,p),JSON.parse(checked('evidence.json').toString('utf8')),name=>checked('artifacts/'+name),new Date().toISOString().slice(0,10));
   clean();assert.equal(git(['rev-parse','HEAD']).trim(),head);console.log(JSON.stringify(result,null,2));process.exit(0);
  }
  const temp=realpathSync(tmpdir()),rel=relative(realpathSync(root),temp);assert.ok(isAbsolute(rel)||rel==='..'||rel.startsWith('..'+sep),'Temporary review must be outside checkout');
  const output=mkdtempSync(join(temp,'academy-f9-review-'));
  try{
   for(const [path,body] of p.writes){const target=join(output,'overlay',path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,body,{flag:'wx'});}
   writeFileSync(join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
   if(p.records){mkdirSync(join(output,'artifacts'));writeFileSync(join(output,'evidence.json'),JSON.stringify(evidenceTemplate(m.id,m.fingerprint,p),null,2)+'\n',{flag:'wx'});}
   writeFileSync(join(output,'README.md'),'# NON-APPLICABLE review overlay\n\nThese files demonstrate the proposed live registry shape, not a promotion patch. The review fixture date is synthetic. Do not copy into main or deploy. Actual topic-specific runtime, full local build/browser, named human review and a guarded apply mechanism are required. Extended review overlays deliberately omit LabGate; manual wrappers intentionally fail. Synthetic metadata dates are not evidence. The checkpoint is deliberately not projected. Regenerate after any source change.\n',{flag:'wx'});
   clean();assert.equal(git(['rev-parse','HEAD']).trim(),head);console.log(JSON.stringify({output,...manifest,files:manifest.files.length},null,2));
  }catch(error){rmSync(output,{recursive:true,force:true});throw error;}
 }
}
