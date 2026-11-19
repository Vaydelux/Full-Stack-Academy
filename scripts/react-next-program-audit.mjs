// Offline structural preflight for the full 80-topic React + Next.js program.
// This checks checked-in content and wiring; it does NOT typecheck or execute frameworks.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const readJson=p=>JSON.parse(read(p));
const curriculum=readJson('data/curriculum.json');
const source=curriculum.lessons.filter(x=>x.trackId==='06'||x.trackId==='07');
const added=source.filter(x=>x.id!=='06.01.01');
assert.equal(source.length,80,'React/Next program must cover eighty canonical topic IDs');
assert.equal(added.length,79,'Seventy-nine new lessons expected beside the existing React JSX example');
const registry=read('src/content/lesson-registry.tsx');
const published=read('src/lib/academy/published.ts');
const pkg=readJson('package.json');
const unique=new Set();
let react=0,next=0;
for(const topic of added){
 const id=topic.id;
 assert.ok(!unique.has(id),'Duplicate canonical ID: '+id);unique.add(id);
 const meta=readJson('src/content/lessons/'+id+'.meta.json');
 assert.equal(meta.id,id);assert.equal(meta.moduleId,topic.moduleId);assert.equal(meta.trackId,topic.trackId);
 assert.equal(meta.level,topic.level);assert.equal(meta.status,'authored');
 assert.ok(meta.title.length>=15);assert.ok(meta.description.length>=40);
 assert.ok(meta.objectives.length>=3);assert.ok(meta.rubric.length>=3);
 assert.ok(meta.sources.length>=2);
 assert.ok(meta.sources.every(x=>x.url.startsWith('https://')));
 assert.ok(meta.labId.startsWith('lab.foundation.'));
 assert.ok(registry.includes("./lessons/"+id+".mdx"));
 assert.ok(published.includes("lessons/"+id+".meta.json"));
 const body=read('src/content/lessons/'+id+'.mdx');
 assert.equal((body.match(/<LessonStep\b/g)||[]).length,3,'Three guided steps required: '+id);
 for(const term of ['## The problem','## Build the mental model','<LearningGoals','<KnowledgeCheck','<LabGate','## Bug Hunt','## Official references']){
  assert.ok(body.includes(term),'Missing pedagogy '+term+': '+id);
 }
 const fences=(body.match(/^\`\`\`/gm)||[]).length;
 assert.equal(fences,6,'Three paired example fences required: '+id);
 for(const source of meta.sources)assert.ok(body.includes(source.url),'Reference not linked: '+id);
 const slug=meta.labId.split('.').at(-1),dir='labs/'+slug;
 const lab=readJson(dir+'/lab.json');
 assert.equal(lab.lessonId,id);assert.equal(lab.id,meta.labId);
 for(const p of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,p)).isFile(),'Missing fixture '+p);
 assert.ok(pkg.scripts['lab:'+slug],'Missing lab command '+id);
 assert.ok(pkg.scripts.test.concat(pkg.scripts['test:labs']).includes(lab.tests),'All-labs command missing '+id);
 const starter=read(lab.starter),solution=read(lab.solution),test=read(lab.tests);
 assert.notEqual(starter,solution,'Student starter must be different from instructor solution: '+id);
 assert.match(starter,/export (?:async )?function solve/);assert.match(solution,/export (?:async )?function solve/);
 assert.match(test,/ACADEMY_LAB_TARGET/);
 if(topic.trackId==='06'){
  react++;
  assert.ok(fs.statSync(path.join(root,dir+'/starter/Widget.tsx')).isFile());
  assert.ok(fs.statSync(path.join(root,dir+'/solution/Widget.tsx')).isFile());
  assert.match(test,/renderToStaticMarkup/,'SSR initial-render evidence missing: '+id);
 }else{
  next++;
  const example=read(dir+'/example.tsx');
  assert.ok(example.length>70,'Next.js example missing: '+id);
  assert.match(test,/example\.tsx/);
 }
}
const checkpoint=readJson('docs/checkpoint.json');
assert.deepEqual({lessons:checkpoint.snapshot.publishedLessons,mdx:checkpoint.snapshot.authoredMdxLessons,labs:checkpoint.snapshot.labFixtures,modules:checkpoint.snapshot.completeModules.length},{lessons:259,mdx:257,labs:257,modules:32});
console.log(JSON.stringify({status:'static-structure-passed',newReact:react,newNext:next,newTotal:added.length,authoredLessonIds:checkpoint.snapshot.publishedLessons,mdx:checkpoint.snapshot.authoredMdxLessons,localLabManifests:checkpoint.snapshot.labFixtures,completeModules:checkpoint.snapshot.completeModules.length,notVerified:['actual tsx execution','TypeScript compilation','Next build','React DOM hydration','Next App Router','Chromium']},null,2));
