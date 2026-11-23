/** Read-only P4 manuscript qualification. Never runs Prisma, SQL, or Supabase. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reconcilePublishedInventory } from './reconcile-published.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const modules=[
 {id:'13.01',folder:'p4-prisma-setup',previous:'12.05.08',kind:'manual-toolchain'},
 {id:'13.02',folder:'p4-prisma-data',previous:'13.01.08',kind:'manual-prisma-integration'},
 {id:'14.01',folder:'p4-supabase-architecture',previous:'12.05.08',kind:'manual-supabase-local'},
 {id:'14.02',folder:'p4-supabase-auth',previous:'14.01.08',kind:'manual-supabase-auth'},
 {id:'13.03',folder:'p4-prisma-advanced',previous:'13.02.08',kind:'manual-prisma-integration'},
 {id:'13.04',folder:'p4-prisma-supabase-integration',previous:'13.03.08',kind:'manual-prisma-supabase-integration'},
 {id:'14.03',folder:'p4-supabase-rls',previous:'14.02.08',kind:'manual-rls-positive-negative'},
 {id:'14.04',folder:'p4-supabase-storage-realtime',previous:'14.03.08',kind:'manual-storage-realtime-integration'},
];
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replaceAll('\r\n','\n');
const json=p=>JSON.parse(read(p));
const exists=p=>fs.existsSync(path.join(root,p));
export function extractFences(content,language){
 if(!/^(ts|sql|bash|prisma)$/.test(language))throw Error('Unsupported snippet language');
 const pattern=new RegExp('```'+language+'\\n([\\s\\S]*?)\\n```','g');
 return [...content.matchAll(pattern)].map(match=>match[1].trim());
}
export function matchesExerciseFiles(article,language,starter,solution){
 const snippets=extractFences(article,language);
 return snippets.length===2 && snippets[0]===starter.trim() && snippets[1]===solution.trim();
}
export function inspectP4Manuscripts(){
 const issues=[],records=[];
 const problem=(id,issue)=>issues.push({id,issue});
 let canonical,checkpoint;
 try{
  canonical=json('data/curriculum.json');
  checkpoint=json('docs/checkpoint.json').snapshot;
 }catch(error){
  return {status:'source-invalid',issues:[{id:'catalog',issue:error.message}],
    sourceAuthored:0,readyToPublish:false,realIntegrationExecuted:false};
 }
 // Published status comes from the actual authoring/MDX registries, not a
 // hard-coded baseline. Earlier phases can legitimately publish later.
 let publishedFromRegistry=null;
 let publishedIds=new Set();
 try{
  const authored=read('src/lib/academy/authored-content.ts');
  const section=authored.match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
  if(!section)throw Error('Unable to parse published interactive lesson IDs');
  const interactiveIds=[...section[1].matchAll(/'([^']+)'/g)].map(match=>match[1]);
  const mdxDir=path.join(root,'src/content/lessons');
  const mdxIds=fs.readdirSync(mdxDir)
   .filter(name=>name.endsWith('.meta.json'))
   .map(name=>{
    const id=json('src/content/lessons/'+name).id;
    if(id!==name.slice(0,-'.meta.json'.length))
     throw Error('Published MDX metadata ID/file mismatch: '+name);
    return id;
   });
  const inventory=reconcilePublishedInventory({
   interactiveIds,mdxIds,checkpoint,
   catalogIds:canonical.lessons.map(row=>row.id),
  });
  publishedFromRegistry=inventory.publishedCount;
  publishedIds=new Set(inventory.publishedIds);
 }catch(error){problem('published-registry',error.message);}
 const usedSlugs=new Set();
 for(const mod of modules){
  const manifest=json('examples/'+mod.folder+'/module.json');
  const expected=canonical.lessons.filter(x=>x.moduleId===mod.id).sort((a,b)=>a.id.localeCompare(b.id));
  if(expected.length!==8||manifest.lessons?.length!==8||manifest.moduleId!==mod.id||
     manifest.trackId!==mod.id.slice(0,2))
   problem(mod.id,'Canonical module lesson count/identity mismatch');
  if(manifest.sourceStatus!=='draft-unverified'||manifest.readyToPublish!==false||
     manifest.runtimeQualification!=='not-run')
   problem(mod.id,'Module falsely marked as published or runtime-verified');
  for(let i=0;i<expected.length;i++){
   const row=expected[i],id=row.id;
   try{
    const basename='drafts/p4/lessons/'+id;
    const meta=json(basename+'.meta.json'),article=read(basename+'.mdx');
    const slug=meta.labSlug;
    if(!/^[a-z][a-z0-9-]+$/.test(slug)||usedSlugs.has(slug))
     problem(id,'Duplicate/invalid lab slug');
    usedSlugs.add(slug);
    const dir='drafts/p4/labs/'+slug;
    const lab=json(dir+'/lab.json');
    const outline=manifest.lessons[i];
    const language=outline?.language;
    const extension=outline?.extension;
    if(!['ts','sql','bash','prisma'].includes(language)||
       {ts:'ts',sql:'sql',bash:'sh',prisma:'prisma'}[language]!==extension)
     problem(id,'Snippet language or extension mismatch');
    const suffix={ts:'ts',sql:'sql',bash:'sh',prisma:'prisma'}[language];
    const starter=read(dir+'/starter.'+suffix),solution=read(dir+'/solution.'+suffix);
    const acceptance=read(dir+'/acceptance.md');
    const previous=i?expected[i-1].id:mod.previous;
    if(meta.id!==id||meta.title!==row.title||meta.moduleId!==mod.id||
       meta.trackId!==mod.id.slice(0,2)||
       meta.prerequisites?.length!==1||meta.prerequisites[0]!==previous)
     problem(id,'Canonical identity/title/prerequisite mismatch');
    if(meta.sourceStatus!=='draft-unverified'||meta.runtimeQualification!=='not-run'||
       meta.reviewStatus!=='unreviewed'||meta.readyToPublish!==false)
     problem(id,'Lesson falsely marked as reviewed, published or runtime-verified');
    if(outline?.id!==id||outline.title!==row.title||outline.slug!==slug||
       outline.qualificationKind!==mod.kind||lab.lessonId!==id||lab.moduleId!==mod.id||
       lab.qualificationKind!==mod.kind)
     problem(id,'Module or lab manifest does not match canonical lesson');
    if(lab.sourceStatus!=='draft-unverified'||lab.runtimeQualification!=='not-run'||
       lab.readyToPublish!==false||lab.acceptanceDoc!==dir+'/acceptance.md'||
       lab.starter!==dir+'/starter.'+suffix||lab.solution!==dir+'/solution.'+suffix)
     problem(id,'Incorrect lab release gate or source path');
    if(!starter.trim()||starter.trim()===solution.trim()||
       !matchesExerciseFiles(article,language,starter,solution))
     problem(id,'Broken exact Markdown/start/solution code fence parity');
    if((article.match(/<LessonStep\b/g)||[]).length!==3||
       !article.includes('<LearningGoals')||!article.includes('<KnowledgeCheck')||
       !article.includes('lessonId="'+id+'"')||
       !article.includes('## Bug Hunt')||!article.includes('## Official references')||
       article.length<3500)
     problem(id,'Incomplete lesson teaching blocks or references');
    if(!meta.officialReferences?.length||
       !meta.officialReferences.every(url=>url.startsWith('https://')&&article.includes(url))||
       lab.officialReference!==meta.officialReferences[0])
     problem(id,'Missing official reference or inaccurate metadata');
    if(acceptance.length<300||!/(not executed|not run|not-yet-executed)/i.test(acceptance)||
       !/(negative|denied|forbidden|unsafe)/i.test(acceptance))
     problem(id,'Missing explicit negative/manual runtime evidence gate');
    if(['14.03','14.04'].includes(mod.id)&&lab.requiresTwoAuthenticatedUsers!==true)
     problem(id,'RLS/Storage demo must require two authenticated test users');
    if(publishedIds.has(id))problem(id,'Unverified P4 draft registered as published');
    if(/<LabGate\b|<script\b|dangerouslySetInnerHTML/i.test(article)||
       exists('src/content/lessons/'+id+'.mdx')||
       exists('src/content/lessons/'+id+'.meta.json'))
     problem(id,'Unverified or unsafe lesson accidentally published');
    records.push({id,title:row.title,slug,language,moduleId:mod.id,status:'draft-unverified'});
   }catch(error){problem(id,error.message);}
  }
 }
 if(records.length!==64||usedSlugs.size!==64)problem('all','Expected exactly 64 distinct P4 lesson manuscripts');
 if(publishedFromRegistry===null)problem('checkpoint','Published registry could not be reconciled');
 const moduleCounts=modules.map(m=>({moduleId:m.id,drafted:records.filter(r=>r.moduleId===m.id).length}));
 return {status:issues.length?'source-invalid':'source-authored-unverified',
  sourceAuthored:records.length,unpublished:true,realIntegrationExecuted:false,
  readyToPublish:false,publishedUnchanged:checkpoint.publishedLessons,
  publishedFromRegistry,checkpointPublished:checkpoint.publishedLessons,
  moduleCounts,modules:modules.map(x=>x.id),records,issues,
  caveat:'Source and exact snippet parity are not Prisma 7 compilation, RLS evaluation, JWT/SSR testing, or real Supabase integration.'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const args=process.argv.slice(2);
 if(args.some(a=>!['--check','--json'].includes(a)))throw Error('Usage: --check or --json');
 const result=inspectP4Manuscripts();
 if(args.includes('--json'))console.log(JSON.stringify(result,null,2));
 else console.log('P4: '+result.sourceAuthored+'/64 source-authored drafts; '+result.issues.length+' issues; real integration NOT run');
 if(result.issues.length){console.error(JSON.stringify(result.issues,null,2));process.exitCode=1;}
}
