import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const ids=["06.01.02","06.01.03","06.01.04","06.01.05","06.01.06","06.01.07","06.01.08","06.02.01","06.02.02","06.02.03","06.02.04","06.02.05","06.02.06","06.02.07","06.02.08"];
const names=["react-props","react-children","react-conditional","react-list-identity","react-render-commit","react-events","react-profile-capstone","react-state-snapshots","react-batched-updates","react-derived-state","react-immutable-updates","react-state-identity","react-lift-state","react-reducer","react-stale-closures"];
test('15 React lessons are registered with complete, local-only fixture paths',()=>{
 const registry=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const pkg=JSON.parse(read('package.json'));
 for(let i=0;i<ids.length;i++) {
  const id=ids[i],name=names[i];
  const meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
  const lab=JSON.parse(read('labs/'+name+'/lab.json'));
  assert.equal(meta.id,id);assert.equal(meta.labId,lab.id);assert.equal(lab.lessonId,id);
  assert.match(registry,new RegExp("case '"+id.replaceAll('.','\\.')+"'"));
  assert.ok(published.includes('lessons/'+id+'.meta.json'));
  for(const file of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,file)).isFile(),file);
  assert.equal(pkg.scripts['lab:'+name],'tsx --test labs/'+name+'/solution.test.mjs');
  assert.ok(pkg.scripts['test:labs'].includes(lab.tests));
 }
});
test('new lesson meta uses canonical React IDs and does not pretend to run remote code',()=>{
 for(const id of ids){
  const content=read('src/content/lessons/'+id+'.mdx');
  assert.ok((content.match(/<LessonStep\\b/g)||[]).length>=3,id);
  assert.match(content,/## Bug Hunt/);
  assert.match(content,/## Official references/);
  assert.match(content,/interactive=\{false\}/);
 }
});
