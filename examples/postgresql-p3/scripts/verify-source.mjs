/** Source-only prepublication audit for PostgreSQL modules 12.03–12.05. No SQL is executed. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSqlContract } from '../../../scripts/persistence-release-plan.mjs';
import { inspectPublishedSql } from '../../../scripts/pg-promotion-guard.mjs';
import { readPersistencePublishedCount } from '../../../scripts/persistence-publication-baseline.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const modules=[
 {id:'12.03',folder:'postgresql-transactions',previous:'12.02.08',auto:8,manual:0},
 {id:'12.04',folder:'postgresql-performance',previous:'12.03.08',auto:4,manual:4},
 {id:'12.05',folder:'postgresql-operations',previous:'12.04.08',auto:2,manual:6},
];
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8').replaceAll('\r\n','\n');
const json=relative=>JSON.parse(read(relative));
const exists=relative=>fs.existsSync(path.join(root,relative));
export function extractSqlFences(text){
 return [...text.matchAll(/```sql\n([\s\S]*?)\n```/g)].map(x=>x[1].trim());
}
export function checkLabParity(article,starter,solution){
 const snippets=extractSqlFences(article);
 return snippets.length===2&&snippets[0]===starter.trim()&&snippets[1]===solution.trim();
}
export function inspectExtendedPostgresDrafts(){
 const problems=[],items=[];
 const issue=(id,reason)=>problems.push({id,reason});
 const curr=json('data/curriculum.json'),baseline=json('docs/checkpoint.json').snapshot;
 const published=baseline.publishedLessons;
 try{readPersistencePublishedCount(root);}catch(error){issue('baseline',error.message);}
 let auto=0,manual=0;
 const seen=new Set();
 for(const mod of modules){
  const manifest=json('examples/'+mod.folder+'/module.json');
  const canonical=curr.lessons.filter(x=>x.moduleId===mod.id).sort((a,b)=>a.id.localeCompare(b.id));
  if(canonical.length!==8||manifest.lessons?.length!==8||manifest.moduleId!==mod.id)
   issue(mod.id,'Expected exactly eight canonical topics in module manifest');
  if(manifest.readyToPublish!==false||manifest.runtimeQualification!=='not-run'||
     manifest.sourceStatus!=='draft-unverified')
   issue(mod.id,'Premature module publication/runtime qualification');
  for(let i=0;i<canonical.length;i++){
   const row=canonical[i],id=row.id,base='drafts/postgresql/lessons/'+id;
   try{
    const meta=json(base+'.meta.json'),article=read(base+'.mdx'),slug=meta.labSlug;
    if(!/^[a-z][a-z0-9-]+$/.test(slug)||seen.has(slug))issue(id,'Invalid or duplicate lab slug');
    seen.add(slug);
    const folder='drafts/postgresql/labs/'+slug;
    const lab=json(folder+'/lab.json');
    const starter=read(folder+'/starter.sql'),solution=read(folder+'/solution.sql');
    const desiredPrevious=i===0?mod.previous:canonical[i-1].id;
    if(meta.id!==id||meta.title!==row.title||meta.moduleId!==mod.id||meta.trackId!=='12'||
       meta.prerequisites?.length!==1||meta.prerequisites[0]!==desiredPrevious)
      issue(id,'Canonical curriculum identity or prerequisite chain diverged');
    if(meta.sourceStatus!=='draft-unverified'||meta.runtimeQualification!=='not-run'||meta.reviewStatus!=='unreviewed'||
       lab.sourceStatus!=='draft-unverified'||lab.readyToPublish!==false||lab.runtimeQualification!=='not-run')
      issue(id,'Inaccurate authoring/runtime/release flag');
    if(lab.lessonId!==id||lab.title!==row.title||manifest.lessons[i]?.id!==id||
       manifest.lessons[i]?.slug!==slug)
      issue(id,'Module/lab metadata identity mismatch');
    if(lab.starter!==folder+'/starter.sql'||lab.solution!==folder+'/solution.sql'||
       lab.fixture!=='examples/'+mod.folder+'/fixture.sql')
      issue(id,'Lab source or fixture path mismatch');
    if(!starter.trim()||starter.trim()===solution.trim()||!checkLabParity(article,starter,solution))
      issue(id,'Starter/instructor code fences do not exactly match sources');
    if((article.match(/<LessonStep\b/g)||[]).length!==3||
       !article.includes('<LearningGoals')||!article.includes('<KnowledgeCheck')||
       !article.includes('lessonId="'+id+'"')||!article.includes('## Bug Hunt')||
       !article.includes('## Official references')||article.length<4000)
      issue(id,'Incomplete guided lesson, quiz, bug hunt or reference');
    if(!meta.officialReferences?.length||!meta.officialReferences.every(url=>url.startsWith('https://www.postgresql.org/docs/')&&article.includes(url)))
      issue(id,'Official PostgreSQL documentation references missing');
    if(/<LabGate\b|<script\b|dangerouslySetInnerHTML/.test(article)||(mod.id!=='12.03'&&(exists('src/content/lessons/'+id+'.mdx')||exists('src/content/lessons/'+id+'.meta.json'))))
      issue(id,'Draft improperly published or unsafe MDX');
    const kind=lab.qualificationKind;
    if(meta.evidenceMode&&meta.evidenceMode!==kind)issue(id,'Evidence type mismatch');
    if(isSqlContract(kind)){
      if(mod.id==='12.03'&&(kind!=='single-session-sql-semantics'||lab.requiresSeparateConcurrencyReview!==true))issue(id,'Separate concurrency review missing');
      auto++;
      if(lab.acceptance!==folder+'/acceptance.sql'||!exists(lab.acceptance)||
         !read(folder+'/acceptance.sql').includes("RAISE EXCEPTION '"+id))
       issue(id,'Missing named semantic SQL acceptance gate');
    }else if(kind==='manual-evidence'){
      manual++;
      if(lab.acceptanceDoc!==folder+'/acceptance.md'||!exists(lab.acceptanceDoc)||
         !read(folder+'/acceptance.md').toLowerCase().includes('manual')||
         read(folder+'/acceptance.md').length<400)
       issue(id,'Missing explicit manual-review evidence boundary');
    }else issue(id,'Unsupported qualification type '+String(kind));
    const publication=mod.id==='12.03'?inspectPublishedSql({id,title:row.title,slug},{exists,read}):'draft';
    items.push({id,slug,kind,sourceStatus:'draft-unverified',publication});
   }catch(error){issue(id,error.message);}
  }
  const live=items.filter(x=>x.id.startsWith(mod.id+'.')&&x.publication==='published').length;if(live!==0&&live!==8)issue(mod.id,'Partial module publication');
  if(!exists('examples/'+mod.folder+'/fixture.sql'))issue(mod.id,'Missing disposable SQL fixture');
  const matching=fs.readdirSync(path.join(root,'drafts/postgresql/lessons'))
   .filter(x=>x.startsWith(mod.id+'.')&&x.endsWith('.mdx'));
  if(matching.length!==8)issue(mod.id,'Unexpected lesson count for this module');
  if(items.filter(x=>x.id.startsWith(mod.id+'.')).length!==8)issue(mod.id,'Incomplete module lab source');
  if(items.filter(x=>x.id.startsWith(mod.id+'.')&&isSqlContract(x.kind)).length!==mod.auto ||
     items.filter(x=>x.id.startsWith(mod.id+'.')&&x.kind==='manual-evidence').length!==mod.manual)
   issue(mod.id,'Semantic vs manual evidence classification changed');
 }
 if(items.length!==24||auto!==14||manual!==10)issue('all','Expected 24 drafts, 14 SQL contracts and 10 manually reviewed labs');
 const status=problems.length?'source-invalid':'source-authored-unverified';
 return {status,canonicalModules:modules.map(m=>m.id),drafted:items.length,sqlContracts:auto,
  manualEvidenceRequired:manual,realPostgresExecuted:false,publishedUnchanged:published,
  readyToPublish:false,items,problems,
  note:'Source integrity does not prove PostgreSQL execution, actual concurrency, performance or restore readiness.'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const args=process.argv.slice(2);
 if(args.some(x=>!['--check','--json'].includes(x)))throw Error('Usage: --check or --json');
 const report=inspectExtendedPostgresDrafts();
 if(args.includes('--json'))console.log(JSON.stringify(report,null,2));
 else console.log('P3 source-only: '+report.drafted+'/24 lesson drafts, '+report.sqlContracts+' SQL contracts, '+report.manualEvidenceRequired+' manual gates; '+report.problems.length+' issues');
 if(report.problems.length){console.error(JSON.stringify(report.problems,null,2));process.exitCode=1;}
}
