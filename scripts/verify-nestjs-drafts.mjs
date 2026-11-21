/** Read-only, fail-closed NestJS 12 authoring source audit.
 * Source validity does NOT certify actual Nest, TypeScript, HTTP or DB runtime.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=relative=>path.join(root,relative);
const read=relative=>fs.readFileSync(file(relative),'utf8').replaceAll('\r\n','\n');
const json=relative=>JSON.parse(read(relative));
const exists=relative=>fs.existsSync(file(relative));
const modules=['11.01','11.02','11.03','11.04'];
const sourceDir='drafts/nestjs/lessons';
const labsDir='drafts/nestjs/labs';
const fences=mdx=>[...mdx.matchAll(/```ts\n([\s\S]*?)\n```/g)].map(m=>m[1].trim());

export function inspectNestJsDrafts(){
 const canonical=json('data/curriculum.json');
 const liveIndex=read('src/lib/academy/published.ts');
 const liveMdx=read('src/content/lesson-registry.tsx');
 const checkpoint=json('docs/checkpoint.json').snapshot;
 const items=canonical.lessons.filter(x=>modules.includes(x.moduleId)).sort((a,b)=>a.id.localeCompare(b.id));
 const issues=[],topics=[],usedSlugs=new Set();
 const problem=(id,msg)=>issues.push({id,message:msg});
 if(items.length!==32)problem('catalog','Expected exactly 32 canonical NestJS topics');
 const expectedIds=new Set(items.map(x=>x.id));
 const stagedFiles=fs.readdirSync(file(sourceDir));
 const mdxIds=stagedFiles.filter(name=>name.endsWith('.mdx')).map(name=>name.slice(0,-4)).sort();
 const metaIds=stagedFiles.filter(name=>name.endsWith('.meta.json')).map(name=>name.slice(0,-10)).sort();
 if(JSON.stringify(mdxIds)!==JSON.stringify([...expectedIds].sort()))problem('drafts','MDX file list does not match canonical topics');
 if(JSON.stringify(metaIds)!==JSON.stringify([...expectedIds].sort()))problem('drafts','Metadata file list does not match canonical topics');
 for(const item of items){
  const id=item.id,base=sourceDir+'/'+id;
  try {
   const meta=json(base+'.meta.json'),mdx=read(base+'.mdx');
   const slug=meta.labSlug;
   if(typeof slug!=='string'||!/^[a-z][a-z0-9-]+$/.test(slug)||usedSlugs.has(slug)){
    problem(id,'Invalid or duplicate lab slug');continue;
   }
   usedSlugs.add(slug);
   const labRoot=labsDir+'/'+slug;
   const lab=json(labRoot+'/lab.json');
   const starter=read(labRoot+'/starter.ts').trim();
   const solution=read(labRoot+'/solution.ts').trim();
   const blocks=fences(mdx);
   if(meta.id!==id||meta.title!==item.title||meta.trackId!=='11'||meta.moduleId!==item.moduleId)problem(id,'Canonical metadata mismatch');
   if(meta.sourceStatus!=='draft-unverified'||meta.runtimeQualification!=='not-run'||meta.reviewStatus!=='unreviewed')problem(id,'Premature review or publication flag');
   if(meta.stack?.nestjs!=='12'||meta.stack?.typescript!=='6'||meta.stack?.node!=='24')problem(id,'Incorrect current NestJS 12 stack majors');
   if(!Array.isArray(meta.officialReferences)||meta.officialReferences[0]!==item.referenceUrl||
      meta.officialReferences.length<2||!meta.officialReferences.every(url=>url.startsWith('https://docs.nestjs.com/')))problem(id,'Official reference mismatch');
   if(meta.officialReferences?.some(url=>!mdx.includes(url)))problem(id,'Article missing official reference links');
   if(!Array.isArray(meta.prerequisites)||meta.prerequisites.length!==1||!canonical.lessons.some(x=>x.id===meta.prerequisites[0]))problem(id,'Missing canonical prerequisite');
   if(!meta.securityBoundary||meta.securityBoundary.length<40)problem(id,'Missing security boundary');
   if(lab.id!=='draft.nestjs.'+slug||lab.lessonId!==id||
      lab.starter!==labRoot+'/starter.ts'||lab.solution!==labRoot+'/solution.ts')problem(id,'Lab ID/path mismatch');
   if(lab.readyToPublish!==false||lab.requiresRealNestTest!==true||lab.sourceStatus!=='draft-unverified')problem(id,'Lab is not clearly unverified');
   if(lab.expectedPositive!==meta.acceptance||lab.expectedNegative!==meta.misconception)problem(id,'Lab acceptance differs from lesson');
   if(!starter||!solution||starter===solution||starter.length<120||solution.length<120)problem(id,'Starter/solution source incomplete');
   if(blocks.length!==2||blocks[0]!==starter||blocks[1]!==solution)problem(id,'MDX code fences diverge from actual source');
   if((mdx.match(/<LessonStep\b/g)||[]).length!==3||!mdx.includes('<LearningGoals')||!mdx.includes('<KnowledgeCheck')||
      !mdx.includes('lessonId="'+id+'"')||!mdx.includes('## Bug Hunt')||!mdx.includes('## Official references'))problem(id,'Missing required teaching sections');
   if(mdx.length<4000)problem(id,'Lesson prose too shallow for a staged course');
   if(/<LabGate\b|dangerouslySetInnerHTML\s*=|<script\b/i.test(mdx))problem(id,'Unsafe or prematurely published MDX');
   if(liveIndex.includes('lessons/'+id+'.meta.json')||liveMdx.includes('./lessons/'+id+'.mdx')||
     exists('src/content/lessons/'+id+'.meta.json'))problem(id,'Draft incorrectly registered as published');
   topics.push({id,moduleId:item.moduleId,title:item.title,labSlug:slug,sourceReady:true,publication:'draft'});
  } catch(error){problem(id,error.message);}
 }
 const actualLabs=fs.readdirSync(file(labsDir),{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name);
 if(actualLabs.length!==32||actualLabs.some(slug=>!usedSlugs.has(slug)))problem('labs','Expected 32 distinct lab folders');
 if(checkpoint.publishedLessons<338)problem('checkpoint','Published count regressed below the P1 baseline');
 const nestLock=exists('examples/nestjs-vertical/package-lock.json');
 const byModule=modules.map(id=>({moduleId:id,drafted:topics.filter(t=>t.moduleId===id).length,published:0,
  runtimeQualified:false,blockers:['Nest 12 real module and HTTP tests not run','Human accessibility evidence not recorded',...(nestLock?[]:['Trusted nested npm lockfile not generated'])]}));
 return {status:issues.length?'source-invalid':'draft-source-ready',publishedUnchanged:checkpoint.publishedLessons,
  drafted:topics.length,modules:byModule,topics,issues,realNestRuntimeExecuted:false,
  hasNpmLockfile:nestLock,canPublish:false,
  note:'Source-readiness audit only: no npm/Nest/DB/Chromium or manual assistive-technology execution was performed.'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const flags=new Set(process.argv.slice(2));
 if([...flags].some(f=>!['--json','--check','--strict'].includes(f)))throw Error('Usage: --json|--check|--strict');
 const audit=inspectNestJsDrafts();
 if(flags.has('--json'))console.log(JSON.stringify(audit,null,2));
 else console.log('NestJS 12 drafts: '+audit.drafted+'/32 source-ready, published count '+audit.publishedUnchanged+
  ', issues '+audit.issues.length+', real framework tests NOT run.');
 if(audit.issues.length)console.error(JSON.stringify(audit.issues,null,2));
 if((flags.has('--check')&&audit.issues.length)||(flags.has('--strict')&&!audit.canPublish))process.exitCode=1;
}
