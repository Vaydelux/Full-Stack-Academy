/** Read-only coordination and non-applicable review overlay export. No automatic promotion. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync,existsSync,mkdtempSync,mkdirSync,writeFileSync,rmSync,realpathSync} from 'node:fs';
import {resolve,join,dirname,relative,isAbsolute,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {collectStagedIds} from './staged-inventory.mjs';
import {buildPublicationQueue} from './publication-queue.mjs';
import {reconcilePublishedInventory} from '../examples/p4-foundations/scripts/reconcile-published.mjs';
import {buildPersistencePlan} from './persistence-release-plan.mjs';
import {nextPublication,projectSqlModule} from './f9-publication.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8'),json=p=>JSON.parse(read(p)),exists=p=>existsSync(join(root,p));
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',timeout:30000,maxBuffer:32*1024*1024});
const hash=s=>createHash('sha256').update(s).digest('hex');
const args=process.argv.slice(2);
assert.ok(args.length===1&&['--next','--check-projections'].includes(args[0])||args.length===2&&args[0]==='--project'&&['12.01','12.02'].includes(args[1]),'Usage: --next | --check-projections | --project 12.01|12.02 (review only)');
const catalog=json('data/curriculum.json'),checkpoint=json('docs/checkpoint.json').snapshot;
const section=read('src/lib/academy/authored-content.ts').match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);assert.ok(section,'Missing authored IDs');
const interactiveIds=[...section[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const mdxIds=readdirSync(join(root,'src/content/lessons')).filter(p=>p.endsWith('.meta.json')).map(p=>{const id=json('src/content/lessons/'+p).id;assert.equal(id,p.slice(0,-10));assert.ok(exists('src/content/lessons/'+id+'.mdx'));return id;});
const {publishedIds}=reconcilePublishedInventory({interactiveIds,mdxIds,checkpoint,catalogIds:catalog.lessons.map(t=>t.id)});
const queue=buildPublicationQueue(catalog,publishedIds,collectStagedIds(root,catalog));const next=nextPublication(queue,checkpoint);
if(args[0]==='--next')console.log(JSON.stringify(next,null,2));
else{
 const plan=buildPersistencePlan(catalog,read),modules=plan.modules.filter(m=>['12.01','12.02'].includes(m.id)&&!m.topics.every(t=>publishedIds.includes(t.id))&&(args[0]!=='--project'||m.id===args[1]));
 if(args[0]==='--project')assert.equal(modules.length,1,'Requested module is already published or unsupported');
 const projections=modules.map(m=>({id:m.id,sourceFingerprint:m.fingerprint,...projectSqlModule(m,catalog,read,exists)}));
 if(args[0]==='--check-projections')console.log(JSON.stringify({modules:projections.map(p=>({id:p.id,files:p.writes.size,fingerprint:p.fingerprint})),publicationApproved:false},null,2));
 else{
  const clean=()=>{assert.equal(realpathSync(git(['rev-parse','--show-toplevel']).trim()),realpathSync(root));assert.ok(git(['ls-files','-v','-z']).split('\0').filter(Boolean).every(line=>line.startsWith('H ')),'Unsupported hidden or unmerged index entry');assert.equal(git(['status','--porcelain=v1','--untracked-files=all']),'','Use a clean checkout');};
  clean();const head=git(['rev-parse','HEAD']).trim();assert.match(head,/^[a-f0-9]{40}$/);
  // Recompute after checkout preflight; no copy into the source tree and no apply command.
  const m=buildPersistencePlan(catalog,read).modules.find(x=>x.id===args[1]),p=projectSqlModule(m,catalog,read,exists);assert.equal(p.fingerprint,projections[0].fingerprint);
  const temp=realpathSync(tmpdir()),rel=relative(realpathSync(root),temp);assert.ok(isAbsolute(rel)||rel==='..'||rel.startsWith('..'+sep),'Temporary review must be outside checkout');
  const output=mkdtempSync(join(temp,'academy-f9-review-'));
  try{
   const manifest={schemaVersion:1,commit:head,moduleId:m.id,sourceFingerprint:m.fingerprint,projectionFingerprint:p.fingerprint,orderedNext:next.next?.id??null,eligibleByOrder:next.next?.id===m.id,reviewFixtureDate:'2000-01-01',files:[...p.writes].map(([path,body])=>({path,sha256:hash(body),preimageSha256:exists(path)?hash(read(path)):null})),runtimeExecuted:false,publicationApproved:false,applicable:false};
   for(const [path,body] of p.writes){const target=join(output,'overlay',path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,body,{flag:'wx'});}
   writeFileSync(join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
   writeFileSync(join(output,'README.md'),'# NON-APPLICABLE review overlay\n\nThese files demonstrate the proposed live registry shape, not a promotion patch. The review fixture date is synthetic. Do not copy into main or deploy. Actual PostgreSQL, full local build/browser, named human review and a guarded apply mechanism are required. The checkpoint is deliberately not projected. Regenerate after any source change.\n',{flag:'wx'});
   clean();assert.equal(git(['rev-parse','HEAD']).trim(),head);console.log(JSON.stringify({output,...manifest,files:manifest.files.length},null,2));
  }catch(error){rmSync(output,{recursive:true,force:true});throw error;}
 }
}
