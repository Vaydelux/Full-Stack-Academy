import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const ids=['09.02','09.03'].flatMap(mod=>Array.from({length:8},(_,i)=>mod+'.'+String(i+1).padStart(2,'0')));
const registry=read('src/content/forms-query-draft-registry.tsx');
const page=read('src/app/learn/projects/forms-query/drafts/[lessonId]/page.tsx');
const project=read('src/app/learn/projects/forms-query/page.tsx');
const scope=read('src/components/course/DraftLessonScope.tsx');
const quiz=read('src/components/course/KnowledgeCheck.tsx');

test('all 16 draft previews have explicit MDX imports and registry entries',()=>{
 assert.equal(new Set(ids).size,16);
 for(const id of ids){
  assert.match(registry,new RegExp("from '../../drafts/forms-query/lessons/"+id.replaceAll('.','\\.')+"\\.mdx'"));
  assert.match(registry,new RegExp("'"+id.replaceAll('.','\\.')+"': DraftLesson\\d+"));
  assert.ok(fs.statSync(path.join(root,'drafts/forms-query/lessons/'+id+'.mdx')).isFile());
 }
 assert.equal((registry.match(/^import DraftLesson\d+ from /gm)||[]).length,16);
});
test('draft pages remain separate until each whole module is fully published',()=>{
 const mdx=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 for(const moduleId of ['09.02','09.03']){
  const moduleIds=ids.filter(id=>id.startsWith(moduleId+'.'));
  const statuses=moduleIds.map(id=>({
    id,mdx:mdx.includes('./lessons/'+id+'.mdx'),
    metadata:published.includes('lessons/'+id+'.meta.json')
  }));
  assert.ok(statuses.every(x=>!x.mdx&&!x.metadata) ||
    statuses.every(x=>x.mdx&&x.metadata),'Module must publish atomically');
 }
});
test('all draft URLs have explicit static params with no arbitrary dynamic IDs',()=>{
 assert.match(page,/export const dynamicParams = false/);
 assert.match(page,/generateStaticParams\(\)/);
 assert.match(page,/remainingDraftIds\.map\(/);
 assert.match(page,/isPublishedLesson\(lessonId\)/);
 assert.match(page,/isFormsQueryDraftId\(lessonId\)/);
 assert.match(page,/notFound\(\)/);
});
test('draft previews disallow search indexing and canonical publication metadata',()=>{
 assert.match(page,/robots: \{ index: false, follow: false/);
 assert.doesNotMatch(page,/alternates:|canonical:/);
 assert.match(page,/Unpublished preview/);
 assert.match(page,/Draft preview, not an accredited or published lesson/);
});
test('preview content remains separate from published progress and completion flow',()=>{
 assert.match(page,/<DraftLessonScope>/);
 assert.match(page,/<FormsQueryDraftArticle lessonId=\{lessonId\}/);
 assert.match(scope,/createContext\(false\)/);
 assert.match(scope,/Provider value=\{true\}/);
 assert.match(quiz,/const draftPreview = useDraftLessonScope\(\)/);
 assert.match(quiz,/!draftPreview && lessonId && selected === correctIndex/);
 assert.match(quiz,/Draft preview: answers are for practice only and never save course completion/);
 assert.doesNotMatch(page,/LocalLessonCompletion|markLessonComplete|LessonNotebook/);
});
test('project roadmap links to local previews and preserves GitHub source inspection',()=>{
 assert.match(project,/isPublishedLesson\(topic\.id\) \? '\/learn\/' \+ topic\.id/);
 assert.match(project,/Published lesson/);
 assert.match(project,/View MDX source/);
 assert.match(project,/do\s+not grant course progress/);
});
test('each preview MDX imports only the existing trusted lesson components',()=>{
 for(const id of ids){
  const source=read('drafts/forms-query/lessons/'+id+'.mdx');
  const header=source.split(/\r?\n\r?\n/)[0];
  const imports=header.split(/\r?\n/).filter(line=>line.startsWith('import '));
  assert.equal(imports.length,2,id+' unexpected MDX imports');
  assert.match(imports[0],/from '@\/components\/course\/LessonBlocks'/);
  assert.match(imports[1],/from '@\/components\/course\/KnowledgeCheck'/);
  assert.match(source,new RegExp('lessonId="'+id.replaceAll('.','\\.')+'"'));
  assert.doesNotMatch(source,/<LabGate\b/);
  assert.doesNotMatch(source,/<script\b|<iframe\b|dangerouslySetInnerHTML\s*=/i);
 }
});
test('preview MDX accurately distinguishes locked tests from unpublished lessons',()=>{
 for(const id of ids){
  const source=read('drafts/forms-query/lessons/'+id+'.mdx');
  assert.doesNotMatch(source,/not yet compiled with installed RHF packages or browser-tested/i);
  assert.doesNotMatch(source,/No compatible npm dependency lock or browser qualification has been completed/i);
  assert.match(source,/publication/i);
  assert.match(source,/accessibility review/i);
 }
});
test('draft reading flow provides visible source and previous/next navigation',()=>{
 assert.match(page,/aria-label="Breadcrumb"/);
 assert.match(page,/Inspect MDX source/);
 assert.match(page,/aria-label="Draft lesson sequence"/);
 assert.match(page,/Previous draft/);
 assert.match(page,/Next draft/);
});


test('real browser smoke exercises all previews and verifies actual persisted quiz boundaries',()=>{
 const smoke=read('scripts/forms-query-draft-preview-smoke.mjs');
 const full=read('scripts/browser-smoke.mjs');
 const launch=read('scripts/verify-academy-browser.mjs');
 const runner=read('scripts/forms-query-draft-preview-browser-runner.mjs');
 const pkg=JSON.parse(read('package.json'));
 assert.match(smoke,/for\(const \[index,topic\] of drafts\.entries\(\)\)/);
 assert.match(smoke,/liveIds/);
 assert.match(smoke,/canonical\.filter\(x=>!liveIds\.has\(x\.id\)\)/);
 assert.match(smoke,/meta\[name="robots"\]\[content\*="noindex"\]/);
 assert.match(smoke,/await persistedQuiz\(page,first\)/);
 assert.match(smoke,/await persistedQuiz\(page,published\)/);
 assert.match(smoke,/await answerQuiz\(page,first/);
 assert.match(smoke,/await answerQuiz\(page,published/);
 assert.match(smoke,/route\('09\.03\.99'\)/);
 assert.match(full,/await verifyFormsQueryDraftPreviews\(\{page: previewPage,base\}\)/);
 assert.match(full,/const previewContext = await browser\.newContext\(/);
 assert.match(full,/await previewContext\.close\(\)/);
 assert.match(launch,/--draft-preview/);
 assert.match(runner,/await verifyFormsQueryDraftPreviews\(\{page,base\}\)/);
 assert.equal(pkg.scripts['qualify:forms-query:preview-browser'],
  'node scripts/verify-academy-browser.mjs --draft-preview');
});

test('real preview acceptance includes portrait, landscape, tablet, desktop and document overflow checks',()=>{
 const smoke=read('scripts/forms-query-draft-preview-smoke.mjs');
 for(const [w,h] of [[320,780],[375,812],[414,896],[768,1024],[812,375],[1024,768],[1440,900]]){
  assert.match(smoke,new RegExp('width:'+w+',height:'+h));
 }
 assert.match(smoke,/topic\.id\.endsWith\('\.01'\)\?responsiveViewports/);
 assert.match(smoke,/sizes\.document<=sizes\.viewport&&sizes\.body<=sizes\.viewport/);
 assert.match(smoke,/viewportChecks\+\+/);
 assert.match(smoke,/No visual pass is implied/);
});

test('after module publication, all published P1 lesson URLs remain in responsive smoke',()=>{
 const smoke=read('scripts/forms-query-draft-preview-smoke.mjs');
 assert.match(smoke,/const publishedTopics=canonical\.filter\(topic=>liveIds\.has\(topic\.id\)\)/);
 assert.match(smoke,/for\(const topic of publishedTopics\)/);
 assert.match(smoke,/page\.goto\(base\+'\/learn\/'\+topic\.id/);
 assert.match(smoke,/name:'Guided lesson'/);
 assert.match(smoke,/publishedViewportChecks\+\+/);
 assert.match(smoke,/Published P1 lesson overflow/);
});
