import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=["06.03.01","06.03.02","06.03.03","06.03.04","06.03.05","06.03.06","06.03.07","06.03.08","06.04.01","06.04.02","06.04.03","06.04.04","06.04.05","06.04.06","06.04.07","06.04.08"];
const names=["react-render-purity","react-external-effect","react-effect-cleanup","react-effect-dependencies","react-ref-mutable","react-dom-ref-focus","react-avoid-effect","react-timer-keyboard","react-context-provider","react-custom-hook","react-use-transition","react-use-deferred-value","react-use-optimistic","react-use-action-state","react-error-suspense","react-optimistic-capstone"];
test('all 16 Effects/Advanced React tutorials have full authored metadata and local test boundaries',()=>{
 const registry=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const pkg=JSON.parse(read('package.json'));
 for(let i=0;i<ids.length;i++){
  const id=ids[i],name=names[i];
  const meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
  const lab=JSON.parse(read('labs/'+name+'/lab.json'));
  const mdx=read('src/content/lessons/'+id+'.mdx');
  assert.equal(meta.id,id);assert.equal(meta.labId,lab.id);assert.equal(lab.lessonId,id);
  assert.equal(meta.moduleId,id.slice(0,5));
  assert.equal(meta.stack.react,'19');assert.equal(meta.stack.typescript,'5');
  assert.ok(meta.rubric.length>=3);assert.ok(meta.sources.every(s=>mdx.includes(s.url)));
  assert.ok(registry.includes("./lessons/"+id+".mdx"));assert.ok(published.includes("lessons/"+id+".meta.json"));
  assert.equal((mdx.match(/<LessonStep\b/g)||[]).length,3);
  assert.ok(mdx.includes("<KnowledgeCheck")&&mdx.includes("<Misconception")&&mdx.includes(`<LabGate lessonId="${id}"`));
  assert.ok(mdx.includes("interactive={false}"));
  for(const asset of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,asset)).isFile(),asset);
  assert.equal(pkg.scripts['lab:'+name],'tsx --test labs/'+name+'/solution.test.mjs');
  assert.equal(pkg.scripts['test:labs'],'node scripts/run-local-labs.mjs');
 }
});
test('browser smoke and all publication guards use 09.02.01 as the next planned Zod lesson',()=>{
 for(const file of ['scripts/browser-smoke.mjs','scripts/react-batch-smoke.mjs','scripts/react-advanced-smoke.mjs','scripts/css-track-smoke.mjs','scripts/js-ts-batch-smoke.mjs','scripts/git-track-smoke.mjs']){
  assert.ok(read(file).includes('09.02.01'),file);
 }
});

test('advanced examples avoid stale results and shortcut hijacking',()=>{
 const transition=read('labs/react-use-transition/solution/solution.tsx');
 assert.ok(transition.includes("matchOptions(options,resultQuery)"));
 assert.ok(!transition.includes("setVisible("));
 const timer=read('labs/react-timer-keyboard/solution/solution.tsx');
 assert.ok(timer.includes("'BUTTON','A'"));
 assert.ok(timer.includes("defaultPrevented"));
 const optimistic=read('labs/react-use-optimistic/solution/solution.tsx');
 assert.ok(optimistic.includes("useRef(0)"));
 assert.ok(!optimistic.includes("Date.now()"));
});
