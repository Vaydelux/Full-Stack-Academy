import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replaceAll('\r\n','\n');
const json=p=>JSON.parse(read(p));
const ids=['09.02','09.03'].flatMap(mod=>Array.from({length:8},(_,i)=>mod+'.'+String(i+1).padStart(2,'0')));
const vocabulary={
 '09.02.01':['defaultValues','register'],
 '09.02.02':['Controller','keyboard'],
 '09.02.03':['z.input','z.output'],
 '09.02.04':['field.id','index'],
 '09.02.05':['idempotency','key'],
 '09.02.06':['isDirty','reset'],
 '09.02.07':['aria-invalid','422'],
 '09.02.08':['useWatch','setValue'],
 '09.03.01':['query key','signal'],
 '09.03.02':['staleTime','gcTime'],
 '09.03.03':['useMutation','invalidate'],
 '09.03.04':['snapshot','rollback'],
 '09.03.05':['useInfiniteQuery','nextCursor'],
 '09.03.06':['HydrationBoundary','dehydrate'],
 '09.03.07':['AbortSignal','503'],
 '09.03.08':['412','RHF']
};
const fences=source=>[...source.matchAll(/```tsx\n([\s\S]*?)\n```/g)].map(x=>x[1].trim());

test('P1 contains exactly sixteen canonical and uniquely scoped source lessons',()=>{
 const catalog=json('data/curriculum.json').lessons;
 const actual=catalog.filter(x=>x.moduleId==='09.02'||x.moduleId==='09.03').map(x=>x.id).sort();
 assert.deepEqual(actual,ids);
 assert.equal(new Set(ids).size,16);
 assert.equal(new Set(Object.keys(vocabulary)).size,16);
});
for(const id of ids){
 test(id+' contains substantial distinct production decisions and trustworthy exercises',()=>{
  const catalog=json('data/curriculum.json').lessons.find(x=>x.id===id);
  const meta=json('drafts/forms-query/lessons/'+id+'.meta.json');
  const mdx=read('drafts/forms-query/lessons/'+id+'.mdx');
  const contract=json('drafts/forms-query/labs/'+meta.labSlug+'/lab.json');
  const starter=read(contract.starter).trim();
  const solution=read(contract.solution).trim();
  const begin=mdx.indexOf('## Production decision guide:');
  const end=mdx.indexOf('## Guided local lab',begin);
  assert.ok(begin>=0&&end>begin,id+' missing production guide');
  const guide=mdx.slice(begin,end);
  assert.ok(guide.split(/\s+/).length>=180,id+' guide is too short');
  assert.ok(guide.includes('| --- |'),id+' missing concrete failure comparisons');
  assert.ok(guide.includes('**Independent exercise'),id+' missing self-guided exercise');
  for(const term of vocabulary[id])assert.ok(guide.toLowerCase().includes(term.toLowerCase()),id+' missing '+term);
  assert.equal(meta.id,id);
  assert.equal(meta.title,catalog.title);
  assert.equal(meta.moduleId,catalog.moduleId);
  assert.equal(contract.lessonId,id);
  assert.equal(meta.officialReferences[0],catalog.referenceUrl);
  for(const url of meta.officialReferences)assert.ok(mdx.includes(url),id+' missing '+url);
  assert.deepEqual(fences(mdx),[starter,solution],id+' changed the runnable red/green examples');
  assert.equal((mdx.match(/<LessonStep\b/g)||[]).length,3);
  assert.equal((mdx.match(/<KnowledgeCheck\b/g)||[]).length,1);
  assert.ok(mdx.includes('lessonId="'+id+'"'));
  assert.ok(mdx.includes('accessibility review'));
  assert.ok(mdx.includes('publication'));
  assert.ok(!mdx.includes('<LabGate'),id+' is still staged');
  assert.doesNotMatch(mdx,/<script\b|<iframe\b|dangerouslySetInnerHTML\s*=/i);
  assert.doesNotMatch(mdx,/not yet compiled with installed RHF packages or browser-tested|No compatible npm dependency lock or browser qualification has been completed/i);
 });
}
test('preview publication boundary remains isolated from the live lesson registry',()=>{
 const preview=read('src/content/forms-query-draft-registry.tsx');
 const live=read('src/content/lesson-registry.tsx');
 const metadata=read('src/lib/academy/published.ts');
 for(const id of ids){
  assert.ok(preview.includes("'"+id+"'"),id+' absent from preview');
  assert.ok(!live.includes('./lessons/'+id+'.mdx'),id+' prematurely published in MDX');
  assert.ok(!metadata.includes('lessons/'+id+'.meta.json'),id+' prematurely published in metadata');
 }
 const checkpoint=json('docs/checkpoint.json');
 assert.equal(checkpoint.snapshot.publishedLessons,338);
 assert.equal(checkpoint.snapshot.authoredMdxLessons,337);
 assert.equal(checkpoint.snapshot.labFixtures,337);
});
