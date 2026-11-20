import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const terms={
 '09.02.01':['one field, one owner','defaultValues','register'],
 '09.02.02':['Controller','onChange','keyboard'],
 '09.02.03':['z.input','z.output','422'],
 '09.02.04':['field.id','index','eight rows'],
 '09.02.05':['idempotency','response lost','same logical'],
 '09.02.06':['isDirty','reset','503'],
 '09.02.07':['aria-invalid','422','focus'],
 '09.02.08':['setValue','useWatch','preview']
};
test('all eight RHF teaching drafts have distinct production-focused guides',()=>{
 const items=JSON.parse(read('data/curriculum.json')).lessons.filter(x=>x.moduleId==='09.02');
 assert.equal(items.length,8);
 for(const [id,required] of Object.entries(terms)){
  const item=items.find(x=>x.id===id);
  assert.ok(item,id+' missing from canonical catalog');
  const meta=JSON.parse(read('drafts/forms-query/lessons/'+id+'.meta.json'));
  assert.equal(meta.id,id);assert.equal(meta.title,item.title);
  const mdx=read('drafts/forms-query/lessons/'+id+'.mdx');
  const start=mdx.indexOf('## Production decision guide:');
  const end=mdx.indexOf('## Guided local lab',start);
  assert.ok(start>=0&&end>start,id+' missing decision guide');
  const guide=mdx.slice(start,end);
  assert.ok(guide.split(/\s+/).length>=170,id+' shallow guide');
  assert.ok(guide.includes('| --- |'),id+' lacks failure comparison');
  assert.ok(guide.includes('**Independent exercise'),id+' lacks a learner exercise');
  for(const term of required)assert.ok(guide.includes(term),id+' missing '+term);
  assert.equal((mdx.match(/```tsx/g)||[]).length,2,id+' red/instructor examples changed');
  assert.equal((mdx.match(/<LessonStep\b/g)||[]).length,3,id+' changed number of teaching steps');
  assert.ok(mdx.includes('lessonId="'+id+'"'));
  assert.ok(!mdx.includes('<LabGate'),id+' is not yet published');
 }
});
