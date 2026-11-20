/** Read-only source audit for the eight RHF publication candidates.
 * The report NEVER grants a published status from candidate existence.
 * Does not run browser, npm, assistive technology or release commands.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=p=>path.join(root,p);
const read=p=>fs.readFileSync(file(p),'utf8').replaceAll('\r\n','\n');
const json=p=>JSON.parse(read(p));
const ids=Array.from({length:8},(_,i)=>'09.02.'+String(i+1).padStart(2,'0'));
const candidates='release-candidates/forms-query/09.02';
const blocks=s=>[...s.matchAll(/```tsx\n([\s\S]*?)\n```/g)].map(x=>x[1].trim());

export function inspectRHFPublicationCandidates(){
 const catalog=new Map(json('data/curriculum.json').lessons.map(item=>[item.id,item]));
 const registry=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const checkpoint=json('docs/checkpoint.json').snapshot;
 const pkg=json('package.json');
 const issues=[],records=[];
 const fail=(id,reason)=>issues.push({id,reason});
 for(const id of ids){
  try {
   const topic=catalog.get(id),staged=json('drafts/forms-query/lessons/'+id+'.meta.json');
   const slug=staged.labSlug;
   if(!/^[a-z][a-z0-9-]+$/.test(slug)||!topic||topic.moduleId!=='09.02')throw Error('Canonical staged lesson mismatch');
   const dir=candidates+'/lessons/'+id,labDir=candidates+'/labs/forms-query-'+slug;
   const candidate=json(dir+'.meta.json'),article=read(dir+'.mdx');
   const labCandidate=json(labDir+'/lab.json');
   const proj=candidate.publishedMetadata,proposed=labCandidate.proposedPublishedLabManifest;
   const stagedArticle=read('drafts/forms-query/lessons/'+id+'.mdx');
   const stageLab=json('drafts/forms-query/labs/'+slug+'/lab.json');
   if(candidate.publicationReady!==false||candidate.reviewedAt===true)fail(id,'Candidate metadata claims publication readiness');
   if(candidate.targetPath!=='src/content/lessons/'+id+'.meta.json')fail(id,'Incorrect publish target path');
   if(candidate.blockedOn?.some(x=>/root npm dependency lock|root RHF|root resolver/i.test(x)))fail(id,'Obsolete root runtime blocker; teaching dependencies belong in nested lab');
   if(proj.id!==id||proj.title!==topic.title||proj.trackId!=='09'||proj.moduleId!=='09.02'||proj.level!==topic.level)fail(id,'Published metadata projection mismatches the catalog');
   if(proj.status!=='authored'||proj.reviewedAt!==null)fail(id,'Publication review date cannot be invented');
   if(!Array.isArray(proj.objectives)||proj.objectives.length<3||!Array.isArray(proj.rubric)||proj.rubric.length<3)fail(id,'Missing pedagogy/rubric metadata');
   if(!Array.isArray(proj.sources)||proj.sources.length<2||proj.sources.some(x=>!x.url.startsWith('https://')))fail(id,'Missing official references');
   if(proj.labId!=='lab.react.forms-query-'+slug)fail(id,'Lab ID mismatch');
   if(proj.description?.length<40)fail(id,'Publication description too short');
   if(proj.title.length<4||(proj.title.length<15&&proj.title!==topic.title))fail(id,'Short title must match the canonical curriculum');
   const labId='lab.react.forms-query-'+slug,labName='forms-query-'+slug;
   if(proposed.id!==labId||proposed.lessonId!==id||proposed.title!==topic.title)fail(id,'Proposed lab metadata mismatch');
   if(proposed.starter!=='labs/'+labName+'/starter/solution.tsx'||proposed.solution!=='labs/'+labName+'/solution/solution.tsx')fail(id,'Proposed instructor or starter path mismatch');
   if(proposed.tests!=='labs/'+labName+'/solution.test.mjs'||labCandidate.testsImplemented!==true)fail(id,'Expected authored per-lab real browser acceptance test');
   const executableTest=read(labDir+'/solution.test.mjs');
   if(!executableTest.includes('spawnSync(process.execPath')||
      !executableTest.includes("'--lab','"+slug+"'")||
      !executableTest.includes('assert.equal(result.status,0'))fail(id,'Candidate test does not execute its named browser lab');
   if(!proposed.verify.includes('npm run lab:'+labName)||pkg.scripts['lab:'+labName]!=='node scripts/verify-rhf-release-browser.mjs --lab '+slug)fail(id,'Missing per-lab browser script');
   if(!article.includes('<LabGate lessonId="'+id+'" labId="'+labId+'"'))fail(id,'Candidate article missing planned LabGate');
   if((article.match(/<LessonStep\b/g)||[]).length!==3||!article.includes('<KnowledgeCheck'))fail(id,'Teaching structure missing');
   const original=blocks(stagedArticle),planned=blocks(article);
   const starter=read(labDir+'/starter/solution.tsx').trim(),solution=read(labDir+'/solution/solution.tsx').trim();
   if(original.length!==2||planned.length!==2||original[0]!==planned[0]||original[1]!==planned[1]||
      starter!==original[0]||solution!==original[1])fail(id,'Candidate source differs from qualified draft examples');
   if(stageLab.lessonId!==id||stageLab.readyToPublish!==false)fail(id,'Staged lab status changed unexpectedly');
   for(const url of staged.officialReferences)if(!article.includes(url))fail(id,'Candidate missing official reference');
   const livePaths={
    mdx:'src/content/lessons/'+id+'.mdx',
    meta:'src/content/lessons/'+id+'.meta.json',
    lab:'labs/'+labName+'/lab.json'
   };
   const installed=[
    fs.existsSync(file(livePaths.mdx)),
    fs.existsSync(file(livePaths.meta)),
    fs.existsSync(file(livePaths.lab)),
    registry.includes('./lessons/'+id+'.mdx'),
    published.includes('lessons/'+id+'.meta.json')
   ];
   const publishedHere=installed.every(Boolean);
   if(installed.some(Boolean)&&!publishedHere)fail(id,'Partial live registry or lab publication');
   if(publishedHere){
    const liveMeta=json(livePaths.meta),liveLab=json(livePaths.lab);
    if(liveMeta.id!==id||liveMeta.labId!==labId||!liveMeta.reviewedAt||
       liveLab.id!==labId||liveLab.lessonId!==id||
       liveLab.tests!=='labs/'+labName+'/solution.test.mjs'){
      fail(id,'Promoted metadata or lab no longer matches the candidate contract');
    }
   }
   records.push({id,title:topic.title,labSlug:slug,publishCandidatePresent:true,
    published:publishedHere,runtimeTestAuthored:true,
    runtimeTestsExecuted:'not-established-by-this-source-audit',
    manualAccessibilityApproved:'not-established-by-this-source-audit',
    readyToPublish:false});
  }catch(error){fail(id,String(error.message??error));}
 }
 const publishedRHF=records.filter(x=>x.published).length;
 if(publishedRHF!==0&&publishedRHF!==8)fail('module','RHF publication must include exactly eight topics');
 if(checkpoint.publishedLessons<338+publishedRHF)fail('checkpoint','Checkpoint is smaller than the live RHF publication');
 if(records.length!==8)fail('module','Exactly eight complete candidate packs required');
 const nested=json('examples/forms-query-vertical/react-client/package.json');
 const nestedLock=json('examples/forms-query-vertical/react-client/package-lock.json');
 const missingNested=['react-hook-form','@hookform/resolvers'].filter(dep=>
  !nested.dependencies?.[dep]||
  nestedLock.packages?.['']?.dependencies?.[dep]!==nested.dependencies[dep]||
  !nestedLock.packages?.['node_modules/'+dep]?.integrity);
 const siteImports=read('src/content/lesson-registry.tsx');
 if(/from ['"](?:react-hook-form|@hookform\/resolvers|@tanstack\/react-query)['"]/.test(siteImports)){
  fail('root','Published MDX registry must not import RHF/Query teaching runtimes');
 }
 return {moduleId:'09.02',candidateCount:records.length,records,issues,
  sourceValid:issues.length===0,readyToPublish:false,publishedCount:checkpoint.publishedLessons,
  pending:{nestedDependencyDefects:missingNested,isolatedReactRuntimeQualification:true,
   perLabTestImplementations:0,perLabTestsUnrun:8,realChromiumAcceptance:true,humanAssistiveTechnologyReview:true,
   exactCandidateNextBuild:true},
  note:'Source bundle audit only; candidate existence never grants lesson progress or publication'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const flags=new Set(process.argv.slice(2));
 if([...flags].some(x=>!['--json','--check','--strict'].includes(x)))throw Error('Usage: --json | --check | --strict');
 const result=inspectRHFPublicationCandidates();
 if(flags.has('--json'))console.log(JSON.stringify(result,null,2));
 else console.log('RHF 09.02 publication candidates: '+result.candidateCount+'/8 structural packs; '+result.issues.length+
  ' source issues; published '+result.publishedCount+'; real release gates PENDING.');
 if(result.issues.length)console.error(JSON.stringify(result.issues,null,2));
 if((flags.has('--check')&&result.issues.length)||(flags.has('--strict'&&!result.readyToPublish))process.exitCode=1;
}
