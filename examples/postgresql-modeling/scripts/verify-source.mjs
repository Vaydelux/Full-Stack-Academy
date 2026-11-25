/** Offline source integrity gate for PostgreSQL 12.02. Does NOT execute SQL. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {inspectPublishedSql} from '../../../scripts/pg-promotion-guard.mjs';
import { readPersistencePublishedCount } from '../../../scripts/persistence-publication-baseline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8').replaceAll('\r\n','\n');
const json=relative=>JSON.parse(read(relative));
const present=relative=>fs.existsSync(path.join(root,relative));
export const sqlFences=article=>[...article.matchAll(/```sql\n([\s\S]*?)\n```/g)].map(x=>x[1].trim());
export function matchesInstructorSources(article,starter,solution){
 const blocks=sqlFences(article);
 return blocks.length===2 && blocks[0]===starter.trim() && blocks[1]===solution.trim();
}
export function inspectModelingDrafts(){
 const issues=[],records=[];
 const fail=(id,message)=>issues.push({id,message});
 let catalog,manifest;
 try {
  catalog=json('data/curriculum.json');
  manifest=json('examples/postgresql-modeling/module.json');
 }catch(error){
  return {status:'source-invalid',drafted:0,realPostgresExecuted:false,canPublish:false,issues:[{id:'source',message:error.message}]};
 }
 const canonical=catalog.lessons.filter(x=>x.moduleId==='12.02').sort((a,b)=>a.id.localeCompare(b.id));
 if(canonical.length!==8 || manifest.lessons?.length!==8)fail('module','Expected eight canonical 12.02 topics');
 if(manifest.moduleId!=='12.02'||manifest.readyToPublish!==false||manifest.runtimeQualification!=='not-run')
  fail('module','Premature runtime/publication flag');
 const seen=new Set();
 for(let i=0;i<canonical.length;i++){
  const topic=canonical[i],id=topic.id;
  try{
   const base='drafts/postgresql/lessons/'+id,meta=json(base+'.meta.json'),article=read(base+'.mdx');
   const slug=meta.labSlug;
   if(!/^[a-z][a-z0-9-]+$/.test(slug)||seen.has(slug))fail(id,'Invalid or duplicate lab slug');
   seen.add(slug);
   const dir='drafts/postgresql/labs/'+slug,contract=json(dir+'/lab.json');
   const starter=read(dir+'/starter.sql'),solution=read(dir+'/solution.sql'),acceptance=read(dir+'/acceptance.sql');
   if(meta.id!==id||meta.moduleId!=='12.02'||meta.trackId!=='12'||meta.title!==topic.title)
    fail(id,'Canonical topic identity mismatch');
   if(meta.sourceStatus!=='draft-unverified'||meta.runtimeQualification!=='not-run'||meta.reviewStatus!=='unreviewed')
    fail(id,'Unapproved lesson status');
   if(meta.prerequisites?.length!==1||meta.prerequisites[0] !== (i?'12.02.0'+i:'12.01.08'))
    fail(id,'Wrong lesson prerequisite');
   if(manifest.lessons[i]?.id!==id||manifest.lessons[i]?.slug!==slug)fail(id,'Module inventory/order mismatch');
   if(contract.lessonId!==id||contract.sourceStatus!=='draft-unverified'||contract.readyToPublish!==false||
      contract.runtimeQualification!=='not-run'||contract.fixture!=='examples/postgresql-modeling/fixture.sql')
    fail(id,'Incorrect lab release gate');
   for(const name of ['starter','solution','acceptance'])
    if(contract[name]!==dir+'/'+name+'.sql')fail(id,'Missing declared lab path: '+name);
   if(!starter.trim()||starter===solution||!acceptance.includes("RAISE EXCEPTION '"+id))
    fail(id,'Red/green source not semantically distinguishable');
   if(!matchesInstructorSources(article,starter,solution))
    fail(id,'Instructor MDX snippets differ from SQL assets');
   if((article.match(/<LessonStep\b/g)||[]).length!==3||!article.includes('<LearningGoals')||
      !article.includes('<KnowledgeCheck')||!article.includes('lessonId="'+id+'"'))
    fail(id,'Lesson missing three guided stages or quiz');
   if(article.length<3500||!article.includes('## Bug hunt')&&!article.includes('## Bug Hunt')||
      !article.includes('## Official references'))
    fail(id,'Lesson is incomplete');
   if(!meta.officialReferences?.every(url=>url.startsWith('https://www.postgresql.org/docs/')&&article.includes(url)))
    fail(id,'Official SQL docs missing from metadata/lesson');
   if(/<LabGate\b|<script\b|dangerouslySetInnerHTML/.test(article))fail(id,'Unsafe draft MDX');
   const publication=inspectPublishedSql({id,title:topic.title,slug},{exists:present,read});
   records.push({id,title:topic.title,slug,status:'draft-unverified',publication});
  }catch(error){fail(id,error.message);}
 }
 if(records.some(r=>r.publication==='published')&&!records.every(r=>r.publication==='published'))fail('module','Partial 12.02 publication');
 if(!present('examples/postgresql-modeling/fixture.sql'))fail('fixture','Missing temporary-table data');
 const published=json('docs/checkpoint.json').snapshot.publishedLessons;
 try{readPersistencePublishedCount(root);}catch(error){fail('checkpoint',error.message);}
 return {status:issues.length?'source-invalid':'draft-source-ready',drafted:records.length,records,
   publishedUnchanged:published,realPostgresExecuted:false,canPublish:false,issues};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const flags=process.argv.slice(2);
 if(flags.some(x=>!['--check','--json'].includes(x)))throw Error('Usage: --check | --json');
 const result=inspectModelingDrafts();
 if(flags.includes('--json'))console.log(JSON.stringify(result,null,2));
 else console.log('PostgreSQL modeling: '+result.drafted+'/8 drafts, '+result.issues.length+' issues; real DB NOT executed');
 if(result.issues.length) {console.error(JSON.stringify(result.issues,null,2));process.exitCode=1;}
}
