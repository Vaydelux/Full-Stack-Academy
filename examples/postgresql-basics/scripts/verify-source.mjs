/** Read-only source integrity for PostgreSQL 12.01. It never opens a database. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPersistencePublishedCount } from '../../../scripts/persistence-publication-baseline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8').replaceAll('\r\n','\n');
const json=rel=>JSON.parse(read(rel));
const exists=rel=>fs.existsSync(path.join(root,rel));
const fences=mdx=>[...mdx.matchAll(/```sql\n([\s\S]*?)\n```/g)].map(x=>x[1].trim());
export function checkSnippetParity(article,starter,solution){
 const snippets=fences(article);
 return snippets.length===2&&snippets[0]===starter.trim()&&snippets[1]===solution.trim();
}
export function inspectPostgresDrafts(){
 const issues=[],entries=[];
 const problem=(id,message)=>issues.push({id,message});
 let curriculum,module;
 try{curriculum=json('data/curriculum.json');module=json('examples/postgresql-basics/module.json');}
 catch(error){return {status:'source-invalid',drafted:0,issues:[{id:'files',message:error.message}],realPostgresExecuted:false,canPublish:false};}
 const lessons=curriculum.lessons.filter(x=>x.moduleId==='12.01').sort((a,b)=>a.id.localeCompare(b.id));
 if(lessons.length!==8||module.lessons?.length!==8)problem('catalog','Expected eight canonical 12.01 lessons');
 if(module.moduleId!=='12.01'||module.readyToPublish!==false||module.runtimeQualification!=='not-run')problem('module','Premature release flags');
 const used=new Set();
 for(let i=0;i<lessons.length;i++){
  const row=lessons[i],id=row.id,base='drafts/postgresql/lessons/'+id;
  try{
   const meta=json(base+'.meta.json'),article=read(base+'.mdx'),slug=meta.labSlug;
   if(!/^[a-z][a-z0-9-]+$/.test(slug)||used.has(slug))problem(id,'Invalid/duplicate lab slug');
   used.add(slug);
   const dir='drafts/postgresql/labs/'+slug;
   const lab=json(dir+'/lab.json');
   const starter=read(dir+'/starter.sql'),solution=read(dir+'/solution.sql'),acceptance=read(dir+'/acceptance.sql');
   if(meta.id!==id||meta.title!==row.title||meta.moduleId!=='12.01'||meta.trackId!=='12')problem(id,'Noncanonical lesson metadata');
   if(meta.sourceStatus!=='draft-unverified'||meta.runtimeQualification!=='not-run'||meta.reviewStatus!=='unreviewed')problem(id,'Premature lesson review or publication');
   if(meta.prerequisites?.length!==1||meta.prerequisites[0] !== (i?lessons[i-1].id:'10.04.08'))problem(id,'Wrong prerequisite chain');
   if(module.lessons[i]?.id!==id||module.lessons[i]?.slug!==slug)problem(id,'Module content map differs');
   if(lab.lessonId!==id||lab.readyToPublish!==false||lab.requiresRealPostgresTest!==true||lab.sourceStatus!=='draft-unverified')problem(id,'Incorrect lab gate');
   if(lab.fixture!=='examples/postgresql-basics/fixture.sql')problem(id,'Wrong lab fixture');
   for(const name of ['starter','solution','acceptance'])if(lab[name]!==dir+'/'+name+'.sql')problem(id,'Wrong '+name+' SQL path');
   if(!starter.trim()||starter===solution||!acceptance.includes("RAISE EXCEPTION '"+id))problem(id,'Incorrect red/green acceptance assets');
   if(!checkSnippetParity(article,starter,solution))problem(id,'MDX snippets diverge from checked-in SQL');
   if((article.match(/<LessonStep\b/g)||[]).length!==3||!article.includes('<LearningGoals')||!article.includes('<KnowledgeCheck')||!article.includes('lessonId="'+id+'"'))problem(id,'Missing guided lesson or quiz');
   if(article.length<3500||!article.includes('## Bug Hunt')||!article.includes('## Official references'))problem(id,'Incomplete instructional material');
   if(!meta.officialReferences?.every(u=>u.startsWith('https://www.postgresql.org/docs/')&&article.includes(u)))problem(id,'Missing official reference');
   if(/<LabGate\b|dangerouslySetInnerHTML\s*=|<script\b/i.test(article)||exists('src/content/lessons/'+id+'.mdx')||exists('src/content/lessons/'+id+'.meta.json'))problem(id,'Draft in live registry or unsafe MDX');
   entries.push({id,title:row.title,slug,status:'draft-unverified'});
  }catch(error){problem(id,error.message);}
 }
 if(fs.readdirSync(path.join(root,'drafts/postgresql/lessons')).filter(x=>/^12\.01\.\d{2}\.mdx$/.test(x)).length!==8)problem('drafts','Wrong MDX count');
 if(used.size!==8)problem('labs','Wrong number of canonical 12.01 lab slugs');
 if(!exists('examples/postgresql-basics/fixture.sql'))problem('fixture','Missing SQL fixture');
 const published=json('docs/checkpoint.json').snapshot.publishedLessons;
 try{readPersistencePublishedCount(root);}catch(error){problem('checkpoint',error.message);}
 return {status:issues.length?'source-invalid':'draft-source-ready',drafted:entries.length,entries,publishedUnchanged:published,realPostgresExecuted:false,canPublish:false,issues,note:'Read-only integrity; no live PostgreSQL, browser, accessibility or release execution'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const flags=process.argv.slice(2);
 if(flags.some(flag=>!['--json','--check'].includes(flag)))throw Error('Usage: --json|--check');
 const result=inspectPostgresDrafts();
 if(flags.includes('--json'))console.log(JSON.stringify(result,null,2));
 else console.log('PostgreSQL 12.01 source: '+result.drafted+'/8; published '+result.publishedUnchanged+'; issues '+result.issues.length+'; database NOT run');
 if(result.issues.length){console.error(JSON.stringify(result.issues,null,2));process.exitCode=1;}
}
