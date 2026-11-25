/** Read-only late-phase planning and structural evidence check; no promotion or external calls. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildLatePlan,evidenceTemplate,validateEvidence,manuscriptPath} from './late-phase-plan.mjs';
import {reviewPack,exportReview,verifyReviewArtifacts,readLocalArtifact} from './late-review-pack.mjs';
import {reconcilePublishedInventory} from '../examples/p4-foundations/scripts/reconcile-published.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8'),json=p=>JSON.parse(read(p));
const catalog=json('data/curriculum.json'),checkpoint=json('docs/checkpoint.json').snapshot;
const section=read('src/lib/academy/authored-content.ts').match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
assert.ok(section,'Missing interactive publication inventory');
const interactiveIds=[...section[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const mdxIds=readdirSync(resolve(root,'src/content/lessons')).filter(p=>p.endsWith('.meta.json')).map(p=>{const id=json('src/content/lessons/'+p).id;assert.equal(id,p.slice(0,-'.meta.json'.length));return id;});
const {publishedIds}=reconcilePublishedInventory({interactiveIds,mdxIds,checkpoint,catalogIds:catalog.lessons.map(x=>x.id)});
const files=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}).split('\0').filter(Boolean);
const baseline=json('data/late-phase-source-baseline.json');
assert.match(baseline.baselineCommit,/^[a-f0-9]{40}$/);
assert.equal(baseline.records.length,400);assert.equal(baseline.shared.length,110);
assert.equal(new Set(baseline.records.map(x=>x.id)).size,400);
const tracked=new Set(files);
for(const entry of [...baseline.records,...baseline.shared]){assert.match(entry.gitBlob,/^[a-f0-9]{40}$/);assert.ok(tracked.has(entry.path),'Baseline source removed: '+entry.path);if(entry.id)assert.equal(entry.path,manuscriptPath(entry.id));}
const result=buildLatePlan({catalog,publishedIds,files,read,gates:json('data/late-phase-runtime-gates.json'),scripts:json('package.json').scripts});
const args=process.argv.slice(2),find=id=>{const m=result.modules.find(m=>m.id===id);assert.ok(m,'Unknown module: '+id);return m;};
if(args.length===0||args.length===1&&args[0]==='--check'){
 for(const p of result.phases)console.log(p.id+': '+p.modules+' modules, '+p.remaining+'/'+p.planned+' new topics remaining');
 console.log('Source plan only; external runtimes and human review NOT executed; no approval.');
}else if(args.length===1&&args[0]==='--json')console.log(JSON.stringify(result,null,2));
else if(args.length===2&&args[0]==='--module')console.log(JSON.stringify(find(args[1]),null,2));
else if(args.length===2&&args[0]==='--template')console.log(JSON.stringify(evidenceTemplate(find(args[1])),null,2));
else if(args.length===3&&args[0]==='--check-evidence')console.log(JSON.stringify(validateEvidence(find(args[1]),JSON.parse(readFileSync(resolve(args[2]),'utf8'))),null,2));
else if(args.length===2&&args[0]==='--export-review'){
 const m=find(args[1]),pack=reviewPack(m,result.familyBindings[m.family],read,evidenceTemplate(m));
 console.log(JSON.stringify({directory:exportReview(pack),moduleId:m.id,files:pack.size,publicationApproved:false},null,2));
}else if(args.length===3&&args[0]==='--check-review-artifacts'){
 const m=find(args[1]),directory=resolve(args[2]),pack=reviewPack(m,result.familyBindings[m.family],read,evidenceTemplate(m));
 for(const [path,source] of pack)if(path!=='evidence.json')assert.equal(readFileSync(resolve(directory,path),'utf8'),source,'Review package drift: '+path);
 const evidence=JSON.parse(readFileSync(resolve(directory,'evidence.json'),'utf8'));
 console.log(JSON.stringify(verifyReviewArtifacts(m,evidence,p=>readLocalArtifact(resolve(directory,'artifacts'),p),validateEvidence),null,2));
}else throw Error('Usage: --check | --json | --module ID | --template ID | --check-evidence ID FILE | --export-review ID | --check-review-artifacts ID DIRECTORY');
