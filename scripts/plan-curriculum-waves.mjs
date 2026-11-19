// Deterministic offline wave planning. Does not contact GitHub Actions or Vercel.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
function wavePlan(curriculum, publishedIds, snapshot){
const groups=[
["08","09","10"],["11","12","13"],["14","15","16"],["17","18","19"],["20","21","22"],["23","24","25"],["26","27"]
];
const names=[
"Professional frontend, forms & HTTP services","Backend architecture & relational persistence",
"Identity, authorization & async reliability","Realtime, integrations & quality engineering",
"Delivery, operations & performance","Architecture, native platforms & specialized systems",
"Enterprise SaaS & defendable full-stack capstone"];
const goals=[
"Design system, client data and server-side HTTP API core","NestJS modules, PostgreSQL correctness, Prisma/Supabase persistence",
"Supabase RLS and authorization, app security, Redis and job queues","Realtime collaboration, search/media/email integration and full testing pyramid",
"Containers and CD, observability/SRE, frontend/API capacity and optimization",
"System design, Capacitor/Tauri, AI/data, geospatial and RTC foundations",
"Billing, RBAC/SSO/privacy/platform controls and integrated production capstone"];
const published=new Set(publishedIds);
const waves=groups.map((tracks,i)=>{
const modules=curriculum.modules.filter(m=>tracks.includes(m.id.split(".")[0])).sort((a,b)=>a.id.localeCompare(b.id)).map(m=>{
const topicIds=curriculum.lessons.filter(t=>t.moduleId===m.id).map(t=>t.id).sort();
return {id:m.id,title:m.title,topics:topicIds.length,alreadyAuthored:topicIds.filter(x=>published.has(x)).length,remaining:topicIds.filter(x=>!published.has(x)).length};
});
return {id:"W"+String(i+1).padStart(2,"0"),title:names[i],goal:goals[i],tracks,modules,topics:modules.reduce((n,m)=>n+m.topics,0),alreadyAuthored:modules.reduce((n,m)=>n+m.alreadyAuthored,0),remaining:modules.reduce((n,m)=>n+m.remaining,0),status:"planned-offline",gate:"Complete source, tests, local build, review and checkpoint before merging or enabling hosted builds"};
});
return {schemaVersion:1,asOf:"2026-11-19",strategy:"Large offline whole-track waves; no split modules",baseline:{authoredLessonIds:snapshot.publishedLessons,authoredMdx:snapshot.authoredMdxLessons,labFixtures:snapshot.labFixtures,completeModules:snapshot.completeModules.length},catalog:{tracks:curriculum.tracks.length,modules:curriculum.modules.length,topicIds:curriculum.lessons.length},remainingAfterCurrent:curriculum.lessons.length-published.size,waves};
}

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const curriculum=JSON.parse(read('data/curriculum.json'));
const checkpoint=JSON.parse(read('docs/checkpoint.json'));
const authoredContent=read('src/lib/academy/authored-content.ts');
const match=authoredContent.match(/export const AUTHORED_LESSON_IDS\\s*=\\s*\\[([^\\]]+)\\]/);
assert.ok(match,'Interactive authored lesson registry must be discoverable');
const interactiveIds=[...match[1].matchAll(/'([^']+)'/g)].map(x=>x[1]);
const mdxIds=fs.readdirSync(path.join(root,'src/content/lessons')).filter(n=>n.endsWith('.meta.json')).map(n=>JSON.parse(read('src/content/lessons/'+n)).id);
const publishedIds=[...new Set([...mdxIds,...interactiveIds])];
assert.equal(publishedIds.length,checkpoint.snapshot.publishedLessons,'Checkpoint must represent unique authored IDs');
const planned=wavePlan(curriculum,publishedIds,checkpoint.snapshot);
assert.equal(planned.remainingAfterCurrent,630,'Remaining topic count changed; replan the waves');
assert.equal(planned.waves.reduce((n,w)=>n+w.remaining,0),planned.remainingAfterCurrent);
const target=path.join(root,'docs/delivery-waves.json');
if(process.argv.includes('--write')){
 fs.writeFileSync(target,JSON.stringify(planned,null,2)+'\\n');
 console.log('Wrote docs/delivery-waves.json');
}else if(process.argv.includes('--check')){
 assert.deepEqual(JSON.parse(fs.readFileSync(target,'utf8')),planned,'Stale delivery waves; regenerate locally with npm run plan:waves:write');
 console.log('Wave manifest is consistent with canonical curriculum and authored lessons');
}else{
 console.log(JSON.stringify(planned,null,2));
}
