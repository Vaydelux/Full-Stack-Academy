/** Guarded atomic publication of all eight 09.03 Query topics, after RHF 09.02.
 * --plan and --simulate do not write files. --apply requires Node24, a clean
 * worktree, real Chromium + SSR checks and human accessible review evidence.
 * No GitHub Actions, Vercel, deployment or automatic commit/merge.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {inspectQueryPublicationCandidates} from './verify-forms-query-query-candidates.mjs';
import {inspectFormsQueryPromotion} from './forms-query-promotion-readiness.mjs';
import {renderPublishedQueryArticle} from './forms-query-query-release-article.mjs';
import {queryReviewFingerprint} from './forms-query-query-review-fingerprint.mjs';
import {projectionFingerprint,verifyProjectionOnDisk} from './forms-query-projection-integrity.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const local=p=>path.join(root,p);
const read=p=>fs.readFileSync(local(p),'utf8');
const json=p=>JSON.parse(read(p));
const ids=Array.from({length:8},(_,i)=>'09.03.'+String(i+1).padStart(2,'0'));
const base='release-candidates/forms-query/09.03';
const evidencePath='docs/release-evidence/forms-query-09.03-accessibility.json';

function exec(command,args,timeout=1_500_000){
 const windows=command==='npm'&&process.platform==='win32';
 const cmd=windows?(process.env.ComSpec||'cmd.exe'):command;
 const argv=windows?['/d','/s','/c','npm '+args.join(' ')]:args;
 console.log('Query qualification: '+command+' '+args.join(' '));
 const result=spawnSync(cmd,argv,{cwd:root,env:process.env,stdio:'inherit',timeout});
 if(result.error||result.status!==0)throw Error('Qualification failed: '+command+' '+args.join(' ')+' '+(result.error?.message??result.status));
}
function gitStatus(){
 const result=spawnSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8',timeout:20000});
 if(result.error||result.status!==0)throw Error('Could not inspect local Git state');
 return result.stdout.trim();
}
function candidatePlan(){
 const audit=inspectQueryPublicationCandidates();
 if(audit.issues.length||audit.candidateCount!==8)throw Error('Query source packs invalid: '+JSON.stringify(audit.issues));
 const program=inspectFormsQueryPromotion();
 if(program.sourceErrors.length)throw Error('Forms/Query staging invalid: '+JSON.stringify(program.sourceErrors));
 const rhf=program.modules.find(m=>m.id==='09.02'),query=program.modules.find(m=>m.id==='09.03');
 if(!rhf||!query||![0,8].includes(rhf.published)||![0,8].includes(query.published))
  throw Error('Forms/Query modules must be atomically published in eight-lesson batches');
 if(query.published===0&&query.staged!==8)throw Error('Eight source-valid Query drafts required');
 const nested=json('examples/forms-query-vertical/react-client/package.json');
 const lock=json('examples/forms-query-vertical/react-client/package-lock.json');
 const rootPkg=json('package.json');
 for(const dep of ['@tanstack/react-query','react-hook-form','@hookform/resolvers']){
  assert.equal(rootPkg.dependencies?.[dep],undefined,'RHF/Query executable dependencies belong in the isolated React workspace');
  assert.equal(lock.packages?.['']?.dependencies?.[dep],nested.dependencies[dep]);
  assert.match(lock.packages?.['node_modules/'+dep]?.integrity??'',/^sha512-/);
 }
 assert.equal(json('content/stack-versions.json').tanstackQuery,'5');
 return {moduleId:'09.03',candidates:ids,publishedBefore:program.snapshot.published,
  rhfPrerequisitePublished:rhf.published===8,queryAlreadyPublished:query.published===8,
  projectedPublicationAfterRHF:354,reviewSourceSha256:queryReviewFingerprint(),
  targetFiles:54,humanEvidencePath:evidencePath,
  pending:['Real Node24 npm ci and Query v5 Chromium assertions',
   'Actual Next 16 SSR hydration positive/negative acceptance',
   'Production Next MDX/route build and full local labs',
   'Named human keyboard, 200% zoom and screen-reader review']};
}
function verifiedReview(){
 if(!fs.existsSync(local(evidencePath)))throw Error('Named human review evidence missing: '+evidencePath);
 const review=json(evidencePath);
 assert.equal(review.moduleId,'09.03');
 assert.equal(review.reviewed,true);
 assert.equal(review.keyboard,true);
 assert.equal(review.zoom200,true);
 assert.ok(typeof review.reviewer==='string'&&review.reviewer.trim().length>=3);
 assert.ok(typeof review.screenReader==='string'&&review.screenReader.trim().length>=3);
 assert.match(review.date,/^\d{4}-\d{2}-\d{2}$/);
 assert.ok(Number.isFinite(Date.parse(review.date)));
 assert.match(review.sourceSha256??'',/^[a-f0-9]{64}$/);
 assert.equal(review.sourceSha256,queryReviewFingerprint(),'Human review is stale for the current Query lesson/SSR source');
 assert.deepEqual([...review.lessonIds].sort(),ids);
 return review;
}
export function preparedQueryWrites(reviewedAt){
 const files=new Map();
 const registryPath='src/content/lesson-registry.tsx';
 const metadataPath='src/lib/academy/published.ts';
 let registry=read(registryPath),metadataRegistry=read(metadataPath);
 const imports=[],cases=[],metaImports=[],aliases=[];
 for(let i=0;i<ids.length;i++){
  const id=ids[i],slug=json('drafts/forms-query/lessons/'+id+'.meta.json').labSlug;
  const lab='forms-query-'+slug,dir=base+'/labs/'+lab;
  const article=renderPublishedQueryArticle(read(base+'/lessons/'+id+'.mdx'),{id,slug});
  const candidate=json(base+'/lessons/'+id+'.meta.json');
  const pack=json(dir+'/lab.json');
  assert.equal(candidate.publicationReady,false);
  assert.equal(pack.promotionReady,false);
  assert.equal(pack.testsImplemented,true);
  assert.equal(pack.runtimeTestsExecuted,false,'Source-only bundle is not runtime proof');
  assert.equal(candidate.publishedMetadata.id,id);
  assert.equal(pack.proposedPublishedLabManifest.id,'lab.react.'+lab);
  const meta={...candidate.publishedMetadata,reviewedAt};
  files.set('src/content/lessons/'+id+'.mdx',article);
  files.set('src/content/lessons/'+id+'.meta.json',JSON.stringify(meta,null,2)+'\n');
  for(const rel of ['starter/solution.tsx','solution/solution.tsx','solution.test.mjs']){
   files.set('labs/'+lab+'/'+rel,read(dir+'/'+rel));
  }
  files.set('labs/'+lab+'/lab.json',JSON.stringify(pack.proposedPublishedLabManifest,null,2)+'\n');
  for(const rel of pack.extraFiles??[]){
   if(slug!=='ssr-hydration'||!['starter/providers.tsx','starter/task-list.tsx','solution/providers.tsx','solution/task-list.tsx'].includes(rel))
    throw Error('Untrusted additional Query lab file '+rel);
   files.set('labs/'+lab+'/'+rel,read(dir+'/'+rel));
  }
  const mdxAlias='PublishedQuery'+(i+1),metaAlias='publishedQuery'+(i+1);
  imports.push("import "+mdxAlias+" from './lessons/"+id+".mdx';");
  cases.push("    case '"+id+"': return <"+mdxAlias+" />;");
  metaImports.push("import "+metaAlias+" from '@/content/lessons/"+id+".meta.json';");
  aliases.push(metaAlias);
 }
 const marker="    case '09.04.01': return";
 assert.ok(registry.includes(marker),'Cannot locate next canonical module insertion point');
 registry=imports.join('\n')+'\n'+registry;
 registry=registry.replace(marker,cases.join('\n')+'\n'+marker);
 assert.ok(metadataRegistry.includes('export const MDX_METADATA = new Map(['));
 assert.ok(metadataRegistry.includes('export const LOCAL_LAB_LESSONS = ['));
 metadataRegistry=metaImports.join('\n')+'\n'+metadataRegistry;
 metadataRegistry=metadataRegistry.replace('export const MDX_METADATA = new Map([',
  'export const MDX_METADATA = new Map(['+aliases.join(', ')+', ');
 metadataRegistry=metadataRegistry.replace('export const LOCAL_LAB_LESSONS = [',
  'export const LOCAL_LAB_LESSONS = ['+aliases.join(', ')+', ');
 files.set(registryPath,registry);
 files.set(metadataPath,metadataRegistry);
 assert.equal(files.size,54,'Expected 16 Query lesson files, 32 test/lab files, 4 SSR support files and two registries');
 for(const file of files.keys())assert.ok(!fs.existsSync(local(file))||
  file===registryPath||file===metadataPath,'Existing published file would be overwritten: '+file);
 return files;
}
export function simulateQueryPublication(){
 const plan=candidatePlan();
 if(plan.queryAlreadyPublished)return {moduleId:'09.03',status:'already-published',sourceOnly:true,changesWritten:0};
 const projection=preparedQueryWrites('2000-01-01');
 let lessons=0,labs=0,extras=0;
 for(const id of ids){
  const slug=json('drafts/forms-query/lessons/'+id+'.meta.json').labSlug;
  const lab='forms-query-'+slug,mdx=projection.get('src/content/lessons/'+id+'.mdx');
  const meta=JSON.parse(projection.get('src/content/lessons/'+id+'.meta.json'));
  const manifest=JSON.parse(projection.get('labs/'+lab+'/lab.json'));
  if(meta.id!==id||meta.reviewedAt!=='2000-01-01'||meta.labId!=='lab.react.'+lab)
   throw Error('In-memory Query metadata mismatch '+id);
  if(!mdx.includes('<LabGate lessonId="'+id+'"')||!mdx.includes('## Official references')||
    !mdx.includes('## Bug Hunt')||(mdx.match(/<LessonStep\b/g)||[]).length!==3)
   throw Error('Incomplete published lesson projection '+id);
  if(manifest.id!==meta.labId||manifest.lessonId!==id||
     !manifest.runtime.includes('browser')||!manifest.verify.length)
   throw Error('Invalid in-memory Query lab manifest '+id);
  for(const asset of [manifest.starter,manifest.solution,manifest.tests]){
   if(!projection.has(asset))throw Error('Missing candidate lab file '+asset);
  }
  lessons+=2;labs+=4;
  if(slug==='ssr-hydration'){
   for(const rel of ['starter/providers.tsx','starter/task-list.tsx','solution/providers.tsx','solution/task-list.tsx']){
    if(!projection.has('labs/'+lab+'/'+rel))throw Error('Missing SSR hydration asset '+rel);
    extras++;
   }
  }
 }
 return {moduleId:'09.03',status:'source-rehearsal-passed',sourceOnly:true,
  rhfPrerequisitePublished:plan.rhfPrerequisitePublished,
  projectionAfterPrerequisites:354,files:projection.size,projectionSha256:projectionFingerprint(projection).sha256,lessonFiles:lessons,
  labFiles:labs,ssrSupportFiles:extras,registries:2,changesWritten:0,
  warning:'This is not real npm, Next SSR, Chromium, human accessibility or publication evidence.'};
}
function applyTransaction(projection,reviewSha){
 const previous=new Map(),written=[];
 for(const file of projection.keys())previous.set(file,fs.existsSync(local(file))?read(file):null);
 previous.set('docs/checkpoint.json',read('docs/checkpoint.json'));
 try{
  for(const [file,content] of projection){
   fs.mkdirSync(path.dirname(local(file)),{recursive:true});
   fs.writeFileSync(local(file),content);
   written.push(file);
  }
  verifyProjectionOnDisk(projection,read);
  exec('npm',['run','checkpoint:write'],30_000);
  exec('npm',['run','verify:offline']);
  exec('npm',['run','qualify:forms-query:preview-browser'],420_000);
  verifyProjectionOnDisk(projection,read);
  assert.equal(queryReviewFingerprint(),reviewSha,'Reviewed Query content changed during postflight');
  const checkpoint=json('docs/checkpoint.json');
  assert.equal(checkpoint.snapshot.publishedLessons,354);
  assert.ok(checkpoint.snapshot.completeModules.includes('09.02'));
  assert.ok(checkpoint.snapshot.completeModules.includes('09.03'));
  checkpoint.status='p1-query-09.03-locally-qualified-awaiting-commit';
  checkpoint.development={...checkpoint.development,
   state:'p1-09.03-locally-qualified-eight-lessons-awaiting-commit',
   note:'Query 09.03 local Node24/npm/Next SSR/Chromium release gate and named accessibility evidence passed for SHA-256 '+reviewSha+'. Source remains an unmerged and undeployed local checkout.'};
  checkpoint.nextMilestone='Review and commit qualified Query 09.03 publication; merge verified change, then proceed to P2 NestJS.';
  fs.writeFileSync(local('docs/checkpoint.json'),JSON.stringify(checkpoint,null,2)+'\n');
  console.log('Query 09.03 qualified locally: 354/889, not committed/merged/deployed.');
 }catch(error){
  console.error('Query publication failed; restoring all source files and prior checkpoint');
  for(const file of written.reverse()){
   const old=previous.get(file);
   if(old===null)fs.rmSync(local(file),{force:true});
   else fs.writeFileSync(local(file),old);
  }
  fs.writeFileSync(local('docs/checkpoint.json'),previous.get('docs/checkpoint.json'));
  throw error;
 }
}
const mode=process.argv[2]??'--plan';
if(process.argv.length>3||!['--plan','--simulate','--apply'].includes(mode))
 throw Error('Usage: npm run promote:forms-query:query -- --plan|--simulate|--apply');
const plan=candidatePlan();
if(mode==='--plan')console.log(JSON.stringify({...plan,changesWritten:0},null,2));
else if(mode==='--simulate')console.log(JSON.stringify(simulateQueryPublication(),null,2));
else{
 if(plan.queryAlreadyPublished)throw Error('09.03 is already published');
 if(!plan.rhfPrerequisitePublished)throw Error('RHF 09.02 must be published before Query 09.03');
 if(Number(process.versions.node.split('.')[0])!==24)throw Error('Node 24 required for publication');
 if(!process.env.ACADEMY_BROWSER_ROOT)throw Error('Actual Playwright/Chromium installation required');
 if(gitStatus())throw Error('Start publication from a clean Git worktree');
 const review=verifiedReview();
 exec('npm',['ci']);
 exec('npm',['ci','--prefix','examples/forms-query-vertical/react-client']);
 exec('npm',['run','qualify:forms-query:full']);
 exec('npm',['run','qualify:forms-query:query-browser'],600_000);
 assert.equal(queryReviewFingerprint(),review.sourceSha256,'Human-reviewed Query source changed during preflight');
 if(gitStatus())throw Error('Preflight modified the Git worktree; inspect before releasing');
 applyTransaction(preparedQueryWrites(review.date),review.sourceSha256);
}
