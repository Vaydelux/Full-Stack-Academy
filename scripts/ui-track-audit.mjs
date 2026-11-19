(async function auditUI(){
 const fs=await import("node:fs"),path=await import("node:path"),url=await import("node:url"),assert=(await import("node:assert/strict")).default;
 const root=path.resolve(path.dirname(url.fileURLToPath(import.meta.url)),"..");
 const read=p=>fs.readFileSync(path.join(root,p),"utf8"),json=p=>JSON.parse(read(p));
 const curriculum=json("data/curriculum.json"),checkpoint=json("docs/checkpoint.json"),pkg=json("package.json");
 const lessons=curriculum.lessons.filter(l=>l.trackId==="08").sort((a,b)=>a.id.localeCompare(b.id));
 assert.equal(lessons.length,32,"Track 08 contains exactly four eight-topic modules");
 const reg=read("src/content/lesson-registry.tsx"),published=read("src/lib/academy/published.ts");
 const seen=new Set();let totalBytes=0;
 for(const l of lessons){
  assert.ok(!seen.has(l.id));seen.add(l.id);
  const meta=json("src/content/lessons/"+l.id+".meta.json"),mdx=read("src/content/lessons/"+l.id+".mdx");
  assert.equal(meta.id,l.id);assert.equal(meta.moduleId,l.moduleId);assert.equal(meta.trackId,"08");assert.equal(meta.level,"Intermediate");
  assert.equal(meta.status,"authored");assert.equal(meta.title,l.title,"Keep canonical lesson title: "+l.id);assert.ok(meta.title.length>=15&&meta.description.length>=50);
  assert.ok(meta.sources.length>=2&&meta.sources.every(s=>s.url.startsWith("https://")));
  assert.ok(meta.objectives.length>=3&&meta.rubric.length>=3);
  const no=Number(l.id.split(".").at(-1)),module=l.moduleId;
  assert.deepEqual(meta.prerequisites,[no>1?module+"."+String(no-1).padStart(2,"0"):module==="08.01"?"07.05.08":"08."+String(Number(module.slice(-2))-1).padStart(2,"0")+".08"]);
  for(const token of ["<LearningGoals","<KnowledgeCheck","<LabGate","<Misconception","## Bug Hunt","## Official references"]){
   assert.ok(mdx.includes(token),"Missing "+token+" "+l.id);
  }
  assert.equal((mdx.match(/<LessonStep\b/g)||[]).length,3,"Three guided steps required: "+l.id);
  const backticks=mdx.split("\n").filter(line=>line.startsWith("```")).length;
  assert.ok(backticks>=6&&backticks%2===0,"Unpaired code fence: "+l.id);
  assert.ok(reg.includes("./lessons/"+l.id+".mdx")&&reg.includes("case '"+l.id+"'"));
  assert.ok(published.includes("lessons/"+l.id+".meta.json"));
  for(const s of meta.sources)assert.ok(mdx.includes(s.url),"Official URL absent from prose: "+l.id);
  const slug=meta.labId.split(".").at(-1),lab=json("labs/"+slug+"/lab.json");
  assert.equal(lab.lessonId,l.id);assert.equal(lab.id,meta.labId);
  for(const p of [lab.starter,lab.solution,lab.tests,"labs/"+slug+"/starter/Widget.tsx","labs/"+slug+"/solution/Widget.tsx"]){assert.ok(fs.statSync(path.join(root,p)).isFile(),"Missing "+p);totalBytes+=read(p).length;}
  assert.notEqual(read(lab.starter),read(lab.solution),"Deliberately red starter required: "+l.id);
  assert.match(read(lab.tests),/ACADEMY_LAB_TARGET/);
  assert.match(read(lab.tests),/renderToStaticMarkup/);
  assert.ok(pkg.scripts["lab:"+slug],"Missing local lab script: "+l.id);
 }
 assert.equal(checkpoint.snapshot.authoredMdxLessons,289);
 assert.equal(checkpoint.snapshot.publishedLessons,291);
 assert.equal(checkpoint.snapshot.labFixtures,289);
 assert.equal(checkpoint.snapshot.completeModules.length,36);
 for(const m of ["08.01","08.02","08.03","08.04"])assert.ok(checkpoint.snapshot.completeModules.includes(m));
 console.log(JSON.stringify({status:"ui-structure-valid",topics:lessons.length,completeModules:4,labFilesChecked:lessons.length*5,sourceBytes:totalBytes,validationType:"Static file contract, not runtime or browser"},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
