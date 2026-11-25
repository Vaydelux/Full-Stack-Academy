import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const hash=s=>createHash('sha256').update(s).digest('hex');
const json=o=>JSON.stringify(o,null,2)+'\n';
const idPattern=/^\d{2}\.\d{2}$/;
const sqlModules=['12.01','12.02'];
export function nextPublication(queue,checkpoint){
 assert.deepEqual(queue.issues,[],'Publication inventory invalid');
 assert.equal(queue.baselinePublished+queue.phases.reduce((n,p)=>n+p.planned-p.remaining,0),checkpoint.publishedLessons,'Queue/checkpoint mismatch');
 const ordered=queue.phases.flatMap(p=>p.modules.map(m=>({...m,phase:p.id})));
 let pending=false;for(const m of ordered){assert.match(m.id,idPattern);if(!m.complete)pending=true;else assert.ok(!pending,'Out-of-order module '+m.id);}
 const next=ordered.find(m=>!m.complete);assert.equal(next?.id,queue.next?.id);
 if(!next)return {next:null,publicationApproved:false};
 const id=next.id;let commands,blockers;
 if(next.phase==='P1'){const name=id==='09.02'?'rhf':'query';commands=['npm run qualify:academy:local -- --run-p1','npm run promote:forms-query:'+name+' -- --plan','npm run promote:forms-query:'+name+' -- --review'];blockers=['Actual browser/runtime and named accessibility review required'];}
 else if(next.phase==='P2'){commands=['npm run promote:nestjs -- --plan '+id,'npm run promote:nestjs -- --review '+id];blockers=['Genuine Nest lockfile, installed runtime, actual module and human review required'];}
 else if(sqlModules.includes(id)){commands=['npm run promote:postgresql -- --plan '+id,'npm run promote:postgresql -- --review '+id,'npm run promote:postgresql -- --apply '+id];blockers=['Actual PostgreSQL red/green, browser qualification and named accessibility evidence required'];}
 else if(['P3','P4'].includes(next.phase)){commands=['npm run publish:academy -- --project '+id,'npm run pack:persistence -- --export '+id];blockers=['Review-only projection; topic-specific runtime qualification and guarded promotion required'];}
 else {commands=['npm run plan:late-phase -- --export-review '+id];blockers=['Actual module runtime, reviewed evidence and live projection required'];}
 return {next:{id,phase:next.phase,lessons:next.remaining,before:checkpoint.publishedLessons,target:checkpoint.publishedLessons+next.remaining.length,commands,blockers},publicationApproved:false};
}
function one(source,re,replacement){assert.equal([...source.matchAll(re)].length,1,'Missing or ambiguous projection marker '+re);return source.replace(re,()=>replacement);}
const fence=s=>[...s.matchAll(/^```sql\n([\s\S]*?)\n```$/gm)].map(m=>m[1]);
export function projectSqlModule(module,catalog,read,exists){
 assert.ok(sqlModules.includes(module.id),'Only single-session SQL Essentials and Relational Modeling supported');assert.equal(module.topics.length,8);assert.equal(module.publicationApproved,false);
 const writes=new Map(),registry='src/content/lesson-registry.tsx',metadata='src/lib/academy/published.ts',pkgPath='package.json';
 const pkg=JSON.parse(read(pkgPath)),imports=[],cases=[],metas=[],aliases=[];
 const put=(path,value)=>{assert.ok(!writes.has(path)&&!exists(path),'Existing or duplicate target '+path);writes.set(path,value);};
 const shared=Object.entries(module.shared);for(const [path,digest] of shared)assert.equal(hash(read(path)),digest,'Shared source drift '+path);
 const fixture=shared.find(([p])=>p.endsWith('/fixture.sql'))?.[0];assert.ok(fixture&&/^examples\/postgresql-(basics|modeling)\/fixture\.sql$/.test(fixture));
 for(const [i,t] of module.topics.entries()){
  assert.equal(t.id,module.id+'.0'+(i+1));assert.equal(t.kind,'sql-contract');assert.equal(t.publicationApproved,false);assert.match(t.slug,/^[a-z][a-z0-9-]+$/);
  const entry=catalog.lessons.find(l=>l.id===t.id);assert.ok(entry&&entry.title===t.title&&entry.moduleId===module.id&&entry.trackId==='12');
  const original='drafts/postgresql/lessons/'+t.id,sourceLab='drafts/postgresql/labs/'+t.slug+'/',slug='postgresql-'+t.id.replaceAll('.','-'),dir='labs/'+slug+'/',labId='lab.node.'+slug,script='lab:'+slug,command='npm run '+script;
  const paths=[original+'.mdx',original+'.meta.json',...['lab.json','starter.sql','solution.sql','acceptance.sql'].map(n=>sourceLab+n)];assert.deepEqual(Object.keys(t.bindings).sort(),paths.slice().sort());
  const source=Object.fromEntries(paths.map(p=>{const text=read(p);assert.equal(hash(text),t.bindings[p],'Source drift '+p);return [p,text];}));
  const draft=JSON.parse(source[original+'.meta.json']),lab=JSON.parse(source[sourceLab+'lab.json']);assert.equal(draft.id,t.id);assert.equal(draft.title,t.title);assert.equal(draft.reviewStatus,'unreviewed');assert.equal(lab.lessonId,t.id);assert.equal(lab.readyToPublish,false);assert.equal(lab.fixture,fixture);
  const before=source[original+'.mdx'].replaceAll('\r\n','\n');const goals=JSON.parse(before.match(/<LearningGoals items=\{(\[.*\])\} \/>/)?.[1]??'null');assert.ok(Array.isArray(goals)&&goals.length===3&&goals.every(x=>typeof x==='string'&&x.length>=15));
  assert.deepEqual(fence(before).map(s=>s.trim()),[source[sourceLab+'starter.sql'],source[sourceLab+'solution.sql']].map(s=>s.replaceAll('\r\n','\n').trim()));
  let article=one(before,/^import \{ LearningGoals, LessonStep, Misconception \} from '@\/components\/course\/LessonBlocks';$/gm,"import { LearningGoals, LessonStep, Misconception, LabGate } from '@/components/course/LessonBlocks';");
  article=article.replace(/^## (?:The real modeling problem|The problem we're solving)$/m,'## The problem');article=article.replace(/^## Mental model(?: and vocabulary)?$/m,'## Build the mental model');article=article.replace(/^## Bug hunt and regression reasoning$/m,'## Bug Hunt and regression reasoning');
  article=one(article,/^\*\*(?:Scope|Runtime):\*\*.*$/gm,'**Runtime boundary:** PostgreSQL 17 or later, isolated disposable local database. This exercise is not a production authorization or migration system.');
  article=one(article,/^\*\*Qualification boundary:\*\*.*$/gm,'**Qualification boundary:** Predictions are not executed evidence. Run the named positive and negative acceptance checks on the real disposable database.');
  const gate='## Guided local lab\n\nRun '+String.fromCharCode(96)+command+String.fromCharCode(96)+' from the repository root using the disposable PostgreSQL setup. The website does not execute SQL.\n\n<LabGate lessonId="'+t.id+'" labId="'+labId+'" commands={'+JSON.stringify([command])+'} interactive={false} />\n\n';
  if(module.id==='12.01')article=one(article,/^## Guided local lab\n[\s\S]*?(?=^## Reflect$)/gm,gate);else article=one(article,/^The SQL files are \*\*draft teaching materials\*\*\..*$/gm,gate.trim());
  article=article.replaceAll(sourceLab,dir);assert.deepEqual(fence(article),fence(before),'SQL fences changed');assert.ok(!article.includes(sourceLab));
  for(const marker of ['## The problem','## Build the mental model','<LearningGoals','<LessonStep','<KnowledgeCheck','<LabGate','## Bug Hunt','## Official references'])assert.ok(article.includes(marker),'Missing '+marker+' in '+t.id);
  assert.ok((article.match(/<LessonStep\b/g)??[]).length>=3);assert.ok(!/staged, not-yet-published|unpublished draft|draft teaching materials|source-staged files/i.test(article));
  const urls=draft.officialReferences;assert.ok(Array.isArray(urls)&&urls.length>=2&&urls.every(url=>new URL(url).protocol==='https:'&&article.includes(url)));
  const meta={id:t.id,title:t.title,description:goals[0],trackId:'12',moduleId:module.id,level:entry.level,estimatedMinutes:draft.estimatedMinutes,status:'authored',reviewedAt:'2000-01-01',stack:{postgresql:'17',node:'24'},prerequisites:draft.prerequisites,objectives:goals,labId,rubric:['Explain the relational invariant and its trust boundary.','Reproduce the intended failure on the same disposable fixture.','Run the corrected SQL and record the actual acceptance result.'],sources:urls.map((url,i)=>({label:'Official PostgreSQL reference '+(i+1),url}))};
  assert.ok(meta.description.length>=40&&Number.isInteger(meta.estimatedMinutes)&&meta.estimatedMinutes>=5&&meta.estimatedMinutes<=180&&Array.isArray(meta.prerequisites)&&meta.prerequisites.every(p=>p!==t.id&&catalog.lessons.some(l=>l.id===p)));
  put('src/content/lessons/'+t.id+'.mdx',article);put('src/content/lessons/'+t.id+'.meta.json',json(meta));
  for(const name of ['starter.sql','solution.sql','acceptance.sql'])put(dir+name,source[sourceLab+name]);
  put(dir+'lab.json',json({id:labId,lessonId:t.id,title:'PostgreSQL: '+t.title,runtime:'postgresql-17-local',status:'authored',starter:dir+'starter.sql',solution:dir+'solution.sql',tests:dir+'solution.test.mjs',verify:[command],expected:'Instructor passes and starter fails the specific named PostgreSQL semantic assertion.',security:'Trusted SQL on a disposable local PostgreSQL 17+ database only; no production credentials.'}));
  put(dir+'solution.test.mjs',"import test from 'node:test';\nimport {readFileSync} from 'node:fs';\nimport {runSqlPair} from '../../scripts/persistence-sql-runner.mjs';\nconst read=p=>readFileSync(new URL(p,import.meta.url),'utf8');\ntest("+JSON.stringify(t.id+' actual PostgreSQL red/green')+",{timeout:45000},()=>runSqlPair({id:"+JSON.stringify(t.id)+",fixture:read('../../"+fixture+"'),starter:read('starter.sql'),solution:read('solution.sql'),acceptance:read('acceptance.sql')}));\n");
  assert.ok(!Object.hasOwn(pkg.scripts,script));pkg.scripts[script]='node --test '+dir+'solution.test.mjs';const suffix=t.id.replaceAll('.',''),alias='pgMeta'+suffix;
  imports.push("import PgLesson"+suffix+" from './lessons/"+t.id+".mdx';");cases.push("    case '"+t.id+"': return <PgLesson"+suffix+" />;");metas.push("import "+alias+" from '@/content/lessons/"+t.id+".meta.json';");aliases.push(alias);
  assert.ok(!read(registry).includes('./lessons/'+t.id+'.mdx')&&!read(metadata).includes('lessons/'+t.id+'.meta.json'));
 }
 writes.set(registry,imports.join('\n')+'\n'+one(read(registry),/^    default: return null;$/gm,cases.join('\n')+'\n    default: return null;'));
 let metaSource=one(read(metadata),/export const MDX_METADATA = new Map\(\[/g,'export const MDX_METADATA = new Map(['+aliases.join(', ')+', ');metaSource=one(metaSource,/export const LOCAL_LAB_LESSONS = \[/g,'export const LOCAL_LAB_LESSONS = ['+aliases.join(', ')+', ');writes.set(metadata,metas.join('\n')+'\n'+metaSource);writes.set(pkgPath,json(pkg));
 assert.equal(writes.size,59);return {writes,fingerprint:hash(json([...writes].map(([path,body])=>[path,hash(body)]))),publicationApproved:false};
}
