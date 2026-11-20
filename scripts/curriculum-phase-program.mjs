/**
 * Canonical 889-topic publication program. Source-derived and offline.
 *
 * A phase orders modules; it does not grant a lesson publication status.
 * Status always comes from the live published MDX metadata + authored IDs.
 * CLI: --json | --markdown | --phase P1 | --check (may be combined).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const json=relative=>JSON.parse(read(relative));
const unique=(values,label)=>{const u=new Set(values);assert.equal(u.size,values.length,'Duplicate '+label);return u;};

export const PHASE_DEFINITIONS=Object.freeze([
 { id:'P1', title:'Forms and remote state', tracks:['09'], modules:['09.02','09.03'], result:'Finish React Hook Form and TanStack Query: 16 drafted topic packs' },
 { id:'P2', title:'Backend services with NestJS', tracks:['11'], result:'Dependency injection, guards, modules and API architecture' },
 { id:'P3', title:'PostgreSQL and relational data', tracks:['12'], result:'Real SQL, transactions, indexing and disaster recovery' },
 { id:'P4', title:'Prisma and Supabase', tracks:['13','14'], result:'Versioned ORM migrations, Auth, RLS and storage' },
 { id:'P5', title:'Security and application services', tracks:['15','16','17','18'], result:'Identity, Redis/queues, realtime, files and integration boundaries' },
 { id:'P6', title:'Quality, operations and architecture', tracks:['19','20','21','22','23'], result:'Testing, CI/CD, SRE, performance and system design' },
 { id:'P7', title:'Platforms and graduation capstones', tracks:['24','25','26','27'], result:'Offline/mobile, advanced data, enterprise governance and capstones' },
]);

export function buildPublicationProgram({curriculum,publishedIds,stagedIds=[]}){
 const all=curriculum.lessons;
 const catalogIds=unique(all.map(l=>l.id),'canonical topic');
 const moduleIds=unique(curriculum.modules.map(m=>m.id),'canonical module');
 const published=unique([...publishedIds],'published lesson');
 const staged=unique([...stagedIds],'staged lesson');
 for(const id of published)assert.ok(catalogIds.has(id),'Unknown published topic '+id);
 for(const id of staged)assert.ok(catalogIds.has(id),'Unknown staged topic '+id);
 for(const id of staged)assert.ok(!published.has(id),'Published topic still staged '+id);
 const moduleById=new Map(curriculum.modules.map(m=>[m.id,m]));
 const topicsByModule=new Map(curriculum.modules.map(m=>[m.id,[]]));
 for(const l of all){
  assert.ok(moduleById.has(l.moduleId),'Orphan topic '+l.id);
  topicsByModule.get(l.moduleId).push(l);
 }
 const coverage=new Map();
 const result=[];
 let expectedFinal=published.size;
 for(const group of PHASE_DEFINITIONS){
  const selection=group.modules ?? curriculum.modules.filter(m=>group.tracks.includes(m.track)).map(m=>m.id);
  const modules=selection.map(id=>{
   const m=moduleById.get(id);
   assert.ok(m,'Unknown phase module '+id);
   assert.ok(group.tracks.includes(m.track),'Phase track mismatch '+id);
   assert.ok(!coverage.has(id),'Module assigned to multiple phases: '+id);
   coverage.set(id,group.id);
   const lessons=topicsByModule.get(id).slice().sort((a,b)=>a.id.localeCompare(b.id));
   const unpublished=lessons.filter(l=>!published.has(l.id)).map(l=>l.id);
   const stagedHere=unpublished.filter(id=>staged.has(id));
   const already=lessons.length-unpublished.length;
   return {
    id, title:m.title, track:m.track, total:lessons.length,
    published:already, staged:stagedHere.length, unpublished:unpublished.length,
    stillToAuthor:unpublished.length-stagedHere.length,
    ids:unpublished, stagedIds:stagedHere,
    status:already===lessons.length?'published':already>0?'partially-published':
      stagedHere.length===lessons.length?'staged':stagedHere.length>0?'partially-staged':'planned',
   };
  });
  const remaining=modules.reduce((n,m)=>n+m.unpublished,0);
  expectedFinal+=remaining;
  result.push({
   id:group.id,title:group.title,goal:group.result,
   modules, moduleCount:modules.length,
   totalTopics:modules.reduce((n,m)=>n+m.total,0),
   published:modules.reduce((n,m)=>n+m.published,0),
   staged:modules.reduce((n,m)=>n+m.staged,0),
   remaining, afterCompletionPublished:expectedFinal,
   complete:remaining===0,
  });
 }
 const missingModules=curriculum.modules.filter(m=>!coverage.has(m.id) &&
   topicsByModule.get(m.id).some(l=>!published.has(l.id)));
 assert.deepEqual(missingModules.map(m=>m.id),[], 'Unassigned unpublished modules');
 const orphanStage=[...staged].filter(id=>!coverage.has(all.find(l=>l.id===id).moduleId));
 assert.deepEqual(orphanStage,[],'Staged topics do not belong to a remaining phase');
 assert.equal(expectedFinal,all.length,'Phase plan must finish exactly all canonical topics');
 const moduleCount=result.reduce((a,p)=>a+p.moduleCount,0);
 const remaining=all.length-published.size;
 return {
  baseline:{tracks:curriculum.tracks.length,modules:curriculum.modules.length,
   topics:all.length,published:published.size,unpublished:remaining,staged:staged.size,
   unstaged:remaining-staged.size,remainingModules:result.flatMap(p=>p.modules).filter(m=>m.unpublished>0).length},
  phases:result,scheduledModules:moduleCount,activePhase:result.find(p=>!p.complete)?.id??null,
  finalPublished:expectedFinal,
  distinction:'Published means present in the real academy published registry; staged and source-authored are not published.',
 };
}

export function readPublicationProgram(){
 const curriculum=json('data/curriculum.json');
 const authored=read('src/lib/academy/authored-content.ts');
 const section=authored.match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
 assert.ok(section,'Unable to read authored interactive lesson IDs');
 const interactive=[...section[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
 const metaDir=path.join(root,'src/content/lessons');
 const mdxFiles=fs.readdirSync(metaDir).filter(name=>name.endsWith('.meta.json'));
 const mdx=mdxFiles.map(name=>json('src/content/lessons/'+name).id);
 const stagingDir=path.join(root,'drafts/forms-query/lessons');
 const staged=fs.existsSync(stagingDir)
  ?fs.readdirSync(stagingDir).filter(name=>name.endsWith('.meta.json')).map(name=>json('drafts/forms-query/lessons/'+name).id)
  :[];
 // Historical draft assets may be retained for repeatable instructor/browser tests.
 // A topic is staged only while it is NOT actually published.
 const publishedIds=[...new Set([...interactive,...mdx])];
 const publishedSet=new Set(publishedIds);
 const report=buildPublicationProgram({
  curriculum,publishedIds,stagedIds:staged.filter(id=>!publishedSet.has(id))
 });
 const checkpoint=json('docs/checkpoint.json').snapshot;
 assert.equal(report.baseline.topics,checkpoint.catalogTopics,'Canonical topic count drifts from checkpoint');
 assert.equal(report.baseline.published,checkpoint.publishedLessons,'Publication count drifts from checkpoint');
 assert.equal(mdx.length,checkpoint.authoredMdxLessons,'MDX metadata count drifts from checkpoint');
 assert.equal(report.baseline.remainingModules,checkpoint.modules-checkpoint.completeModules.length,
  'Module completion count drifts from checkpoint');
 return report;
}
export function formatPublicationProgram(report, selected){
 const phases=selected?report.phases.filter(p=>p.id===selected):report.phases;
 if(selected&&phases.length===0)throw Error('Unknown publication phase: '+selected);
 const heading=['# Full-Stack Academy — Verified-Scope Publication Phases',
  '', 'Canonical '+report.baseline.published+'/'+report.baseline.topics+
  ' published; '+report.baseline.unpublished+' still unpublished in '+
  report.baseline.remainingModules+' incomplete modules.',
  ''];
 for(const p of phases){
  heading.push('## '+p.id+' — '+p.title,
   '', 'Goal: '+p.goal,
   '', 'Modules: '+p.moduleCount+'; remaining topics: '+p.remaining+
   '; projected total when phase completes: '+p.afterCompletionPublished+'.','',
   '| Module | Title | Published | Staged | To author | Missing |',
   '|---|---|---:|---:|---:|---:|');
  for(const m of p.modules)heading.push('| '+m.id+' | '+m.title.replaceAll('|','/')+
   ' | '+m.published+'/'+m.total+' | '+m.staged+' | '+m.stillToAuthor+' | '+m.unpublished+' |');
  heading.push('');
 }
 heading.push('**Status rule:** the report only reads files/registries; it cannot mark lessons published.',
  'Every eight-lesson module requires MDX/metadata, red-and-green runnable lab tests,',
  'locked runtime dependencies, content checks, real browser/keyboard tests, named human',
  'screen-reader/zoom review, and a green local Node 24 build before publication.','');
 return heading.join('\n');
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const args=process.argv.slice(2);
 const i=args.indexOf('--phase');
 const selected=i>=0?args[i+1]:null;
 if(i>=0&&!selected)throw Error('--phase expects P1 through P7');
 const permitted=['--check','--json','--markdown','--phase'];
 if(args.some((a,k)=>!permitted.includes(a)&&k!==i+1))throw Error('Unknown CLI option');
 const report=readPublicationProgram();
 if(args.includes('--json'))console.log(JSON.stringify(selected?report.phases.find(p=>p.id===selected):report,null,2));
 else console.log(formatPublicationProgram(report,selected));
 if(args.includes('--check'))console.log('Curriculum phase coverage and checkpoint count: verified from source.');
}
