/** Atomic eight-topic RHF publication transition. No hosted CI or Vercel.
 * --plan is read-only. --apply first executes REAL local Node24/browser suites,
 * demands human a11y evidence, writes all eight published artifacts and registries,
 * then reruns the complete local release gate. On failure it restores every file.
 * Never claim an automated screen-reader review.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {inspectRHFPublicationCandidates} from './verify-forms-query-rhf-candidates.mjs';
import {inspectFormsQueryPromotion} from './forms-query-promotion-readiness.mjs';
import {rhfReviewFingerprint} from './forms-query-review-fingerprint.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const local=p=>path.join(root,p);
const read=p=>fs.readFileSync(local(p),'utf8');
const json=p=>JSON.parse(read(p));
const ids=Array.from({length:8},(_,i)=>'09.02.'+String(i+1).padStart(2,'0'));
const labRoot='release-candidates/forms-query/09.02';
const evidencePath='docs/release-evidence/forms-query-09.02-accessibility.json';

function run(command,args,timeout=1_500_000){
 const isNpm=command==='npm'&&process.platform==='win32';
 const program=isNpm?(process.env.ComSpec||'cmd.exe'):command;
 const argv=isNpm?['/d','/s','/c','npm '+args.join(' ')]:args;
 console.log('Release qualification: '+command+' '+args.join(' '));
 const result=spawnSync(program,argv,{cwd:root,env:process.env,stdio:'inherit',timeout});
 if(result.error||result.status!==0)throw new Error('Release check failed: '+command+' '+args.join(' ')+'; '+(result.error?.message??result.status));
}
function capture(command,args){
 const result=spawnSync(command,args,{cwd:root,encoding:'utf8',timeout:20_000});
 if(result.error||result.status!==0)throw new Error('Could not inspect local Git state');
 return result.stdout.trim();
}
function humanEvidence(){
 if(!fs.existsSync(local(evidencePath)))throw new Error('Real human accessibility review is required at '+evidencePath);
 const evidence=json(evidencePath);
 assert.equal(evidence.moduleId,'09.02');
 assert.match(evidence.sourceSha256??'',/^[a-f0-9]{64}$/);
 assert.equal(evidence.sourceSha256,rhfReviewFingerprint(),
  'Accessibility review belongs to different lesson/lab/UI source; repeat actual review');
 assert.equal(evidence.reviewed,true);
 assert.equal(evidence.keyboard,true);
 assert.equal(evidence.zoom200,true);
 assert.ok(typeof evidence.reviewer==='string'&&evidence.reviewer.trim().length>=3);
 assert.ok(typeof evidence.screenReader==='string'&&evidence.screenReader.trim().length>=3);
 assert.match(evidence.date,/^\d{4}-\d{2}-\d{2}$/);
 assert.ok(Number.isFinite(Date.parse(evidence.date)),'Invalid reviewer date');
 assert.deepEqual([...evidence.lessonIds].sort(),ids);
 return evidence;
}
function sourcePlan(){
 const audited=inspectRHFPublicationCandidates();
 if(audited.issues.length||audited.candidateCount!==8)throw new Error('Candidate source audit failed: '+JSON.stringify(audited.issues));
 const promotion=inspectFormsQueryPromotion();
 if(promotion.sourceErrors.length)throw new Error('Draft source errors: '+JSON.stringify(promotion.sourceErrors));
 const module=promotion.modules.find(m=>m.id==='09.02');
 if(!module||![0,8].includes(module.published))throw new Error('RHF publication must be atomic: zero or eight');
 if(module.published===0&&module.staged!==8)throw new Error('Eight source-valid RHF drafts are required');
 const versions=json('content/stack-versions.json');
 assert.equal(versions.reactHookForm,'7');
 assert.equal(versions.tanstackQuery,'5');
 const rootPkg=json('package.json');
 const nested=json('examples/forms-query-vertical/react-client/package.json');
 const lock=json('examples/forms-query-vertical/react-client/package-lock.json');
 for(const dep of ['react-hook-form','@hookform/resolvers','@tanstack/react-query']){
  assert.equal(rootPkg.dependencies?.[dep],undefined,'Isolated lab dependency must not leak into the Next root');
  assert.equal(lock.packages?.['']?.dependencies?.[dep],nested.dependencies[dep]);
  assert.match(lock.packages?.['node_modules/'+dep]?.integrity??'',/^sha512-/);
 }
 return {moduleId:'09.02',publishedBefore:promotion.snapshot.published,
  targetPublished:promotion.snapshot.published+(8-module.published),
  alreadyPublished:module.published===8,
  sourceCandidates:ids,rootDependenciesUnchanged:true,
  reviewedSourceSha256:rhfReviewFingerprint(),
  requiredCommands:['npm ci','npm ci --prefix examples/forms-query-vertical/react-client',
   'npm run qualify:forms-query:full','npm run qualify:forms-query:rhf-browser',
   'npm run verify:offline','npm run qualify:forms-query:preview-browser'],
  manualEvidence:evidencePath};
}
function preparedWrites(reviewedAt){
 const writes=new Map();
 const registryPath='src/content/lesson-registry.tsx';
 const publishedPath='src/lib/academy/published.ts';
 let registry=read(registryPath),published=read(publishedPath);
 const articleImports=[],articleCases=[],metadataImports=[],aliases=[];
 for(let i=0;i<ids.length;i++){
  const id=ids[i];
  const slug=json('drafts/forms-query/lessons/'+id+'.meta.json').labSlug;
  const lab='forms-query-'+slug;
  const mdxPath=labRoot+'/lessons/'+id+'.mdx';
  const candidate=json(labRoot+'/lessons/'+id+'.meta.json');
  const labCandidate=json(labRoot+'/labs/'+lab+'/lab.json');
  const metadata={...candidate.publishedMetadata,reviewedAt};
  assert.equal(metadata.id,id);
  assert.equal(metadata.labId,'lab.react.'+lab);
  assert.equal(candidate.publicationReady,false);
  assert.equal(labCandidate.testsImplemented,true);
  assert.equal(labCandidate.runtimeTestsExecuted,false,'Candidate is not a runtime attestation');
  let mdx=read(mdxPath);
  mdx=mdx.replace(
   'Once the final candidate passes real browser/library and accessibility review, use the registered',
   'Use the published');
  mdx=mdx.replace(
   'This candidate is **not published** until release gates complete.',
   'This authored lesson was released through real browser, source and accessibility gates.');
  assert.ok(mdx.includes('<LabGate lessonId="'+id+'"'));
  writes.set('src/content/lessons/'+id+'.mdx',mdx);
  writes.set('src/content/lessons/'+id+'.meta.json',JSON.stringify(metadata,null,2)+'\n');
  for(const name of ['starter/solution.tsx','solution/solution.tsx','solution.test.mjs']){
   writes.set('labs/'+lab+'/'+name,read(labRoot+'/labs/'+lab+'/'+name));
  }
  writes.set('labs/'+lab+'/lab.json',JSON.stringify(labCandidate.proposedPublishedLabManifest,null,2)+'\n');
  const articleAlias='PublishedRHF'+String(i+1);
  const metaAlias='publishedRHF'+String(i+1);
  articleImports.push("import "+articleAlias+" from './lessons/"+id+".mdx';");
  articleCases.push("    case '"+id+"': return <"+articleAlias+" />;");
  metadataImports.push("import "+metaAlias+" from '@/content/lessons/"+id+".meta.json';");
  aliases.push(metaAlias);
 }
 assert.ok(registry.includes("    case '09.04.01': return"),'Cannot locate RHF case insertion point');
 registry=articleImports.join('\n')+'\n'+registry;
 registry=registry.replace("    case '09.04.01': return",articleCases.join('\n')+"\n    case '09.04.01': return");
 assert.ok(published.includes('export const MDX_METADATA = new Map(['));
 assert.ok(published.includes('export const LOCAL_LAB_LESSONS = ['));
 published=metadataImports.join('\n')+'\n'+published;
 published=published.replace('export const MDX_METADATA = new Map([',
  'export const MDX_METADATA = new Map(['+aliases.join(', ')+', ');
 published=published.replace('export const LOCAL_LAB_LESSONS = [',
  'export const LOCAL_LAB_LESSONS = ['+aliases.join(', ')+', ');
 writes.set(registryPath,registry);
 writes.set(publishedPath,published);
 for(const file of writes.keys())assert.ok(!fs.existsSync(local(file))||file===registryPath||file===publishedPath,
  'Refusing to overwrite existing published artifact: '+file);
 return writes;
}

/** In-memory publication rehearsal. Never writes a live article or records approval. */
export function simulateRHFPromotion(){
 const plan=sourcePlan();
 if(plan.alreadyPublished)return {moduleId:'09.02',status:'already-published',writes:0,sourceOnly:true};
 // This date is ONLY a schema fixture for an in-memory projection; it is not
 // evidence of a review, and is not written to disk or returned as approval.
 const writes=preparedWrites('2000-01-01');
 const problems=[];
 const check=(cond,reason)=>{if(!cond)problems.push(reason)};
 const generated=Array.from(writes.keys());
 const registry=writes.get('src/content/lesson-registry.tsx');
 const published=writes.get('src/lib/academy/published.ts');
 const versions=json('content/stack-versions.json');
 const pkg=json('package.json');
 for(const id of ids){
  const slug=json('drafts/forms-query/lessons/'+id+'.meta.json').labSlug;
  const lab='forms-query-'+slug;
  const article=writes.get('src/content/lessons/'+id+'.mdx');
  const meta=JSON.parse(writes.get('src/content/lessons/'+id+'.meta.json'));
  const manifest=JSON.parse(writes.get('labs/'+lab+'/lab.json'));
  check(meta.id===id&&meta.moduleId==='09.02'&&meta.trackId==='09','Canonical metadata mismatch '+id);
  check(meta.reviewedAt==='2000-01-01','Simulated review date missing '+id);
  check(meta.labId==='lab.react.'+lab,'Lab ID mismatch '+id);
  check(meta.description?.length>=40,'Description too short '+id);
  check(meta.level==='Intermediate','Level mismatch '+id);
  check(meta.title.length>=4,'Title too short '+id);
  check(meta.estimatedMinutes>=5&&meta.estimatedMinutes<=180,'Lesson duration invalid '+id);
  check(meta.status==='authored'&&meta.rubric?.length>=3,'Rubric/status invalid '+id);
  check(meta.objectives?.length>=3&&meta.objectives.every(x=>x.length>=15),'Lesson objectives invalid '+id);
  check(meta.sources?.length>=2&&meta.sources.every(x=>x.label.length>=3&&x.url.startsWith('https://')&&article.includes(x.url)),'Source references invalid '+id);
  check(Object.entries(meta.stack).every(([key,value])=>versions[key]===value),'Unpinned runtime version '+id);
  check(article.includes('<LabGate lessonId="'+id+'"')&&article.includes('## Bug Hunt')&&article.includes('## Official references')&&article.includes('<KnowledgeCheck')&&
     (article.match(/<LessonStep\b/g)||[]).length>=3,'MDX teaching sections invalid '+id);
  check(manifest.id===meta.labId&&manifest.lessonId===id&&manifest.status==='authored','Lab manifest mismatch '+id);
  check(manifest.title.length>=10&&manifest.expected.length>=20&&manifest.security.length>=20,'Lab description invalid '+id);
  check([manifest.starter,manifest.solution,manifest.tests].every(p=>writes.has(p)),'Missing generated lab assets '+id);
  check(manifest.verify.length>0&&manifest.verify.every(cmd=>cmd.startsWith('npm run ')&&pkg.scripts?.[cmd.slice(8)]),'Undefined lab command '+id);
  check(registry.includes("'"+id+"': return <PublishedRHF")&&published.includes("lessons/"+id+".meta.json"),'Incomplete published registries '+id);
 }
 check(generated.filter(p=>p.startsWith('src/content/lessons/')).length===16,'Expected 8 published MDX + 8 metadata');
 check(generated.filter(p=>p.startsWith('labs/forms-query-')).length===32,'Expected 8 complete lab packs');
 check(generated.length===50,'Expected 48 lesson/lab files and two synchronized registries');
 if(problems.length)throw new Error('RHF publication rehearsal failed: '+JSON.stringify(problems));
 return {moduleId:'09.02',status:'source-rehearsal-passed',sourceOnly:true,changesWritten:0,
  projectedPublished:plan.targetPublished,filesPrepared:generated.length,lessons:ids.length,
  lessonFiles:16,labFiles:32,registries:2,
  warning:'No Node24, npm, Chromium or actual human accessibility verification performed. Simulated date was never written.'};
}

function applyWrites(writes){
 const previous=new Map(),done=[];
 for(const [file] of writes)previous.set(file,fs.existsSync(local(file))?read(file):null);
 previous.set('docs/checkpoint.json',read('docs/checkpoint.json'));
 try{
  for(const [file,content] of writes){
   fs.mkdirSync(path.dirname(local(file)),{recursive:true});
   fs.writeFileSync(local(file),content);
   done.push(file);
  }
  run('npm',['run','checkpoint:write'],30_000);
  // The first full test suite before promotion cannot substitute for testing
  // the published Next MDX imports, regenerated routes, new lab manifests,
  // and source-derived checkpoint AFTER promotion.
  run('npm',['run','verify:offline']);
  run('npm',['run','qualify:forms-query:preview-browser'],420_000);
  const checkpoint=json('docs/checkpoint.json').snapshot;
  assert.equal(checkpoint.publishedLessons,346);
  assert.ok(checkpoint.completeModules.includes('09.02'));
  console.log('RHF 09.02 promotion prepared: 346/889. Review and commit these local changes; no GitHub merge or deployment performed.');
 }catch(error){
  console.error('Release failed; restoring original local source tree and checkpoint');
  for(const file of done.reverse()){
   const old=previous.get(file);
   if(old===null)fs.rmSync(local(file),{force:true});
   else fs.writeFileSync(local(file),old);
  }
  fs.writeFileSync(local('docs/checkpoint.json'),previous.get('docs/checkpoint.json'));
  throw error;
 }
}
const mode=process.argv[2]??'--plan';
if(process.argv.length>3||!['--plan','--simulate','--apply'].includes(mode))throw new Error('Usage: npm run promote:forms-query:rhf -- --plan|--simulate|--apply');
const plan=sourcePlan();
if(mode==='--plan'){
 console.log(JSON.stringify({...plan,status:plan.alreadyPublished?'already published; no files changed':'unpublished; no files changed'},null,2));
}else if(mode==='--simulate'){
 console.log(JSON.stringify(simulateRHFPromotion(),null,2));
}else{
 if(plan.alreadyPublished)throw new Error('RHF 09.02 is already published; apply cannot overwrite it');
 if(Number(process.versions.node.split('.')[0])!==24)throw new Error('Promotion requires Node.js 24');
 if(!process.env.ACADEMY_BROWSER_ROOT)throw new Error('Real Playwright browser installation required');
 if(capture('git',['status','--porcelain']))throw new Error('Start promotion from a clean Git worktree');
 const reviewer=humanEvidence();
 // Run the complete source/practice/Chromium qualification on this exact tree.
 run('npm',['ci']);
 run('npm',['ci','--prefix','examples/forms-query-vertical/react-client']);
 run('npm',['run','qualify:forms-query:full']);
 run('npm',['run','qualify:forms-query:rhf-browser'],420_000);
 const writes=preparedWrites(reviewer.date);
 applyWrites(writes);
}
