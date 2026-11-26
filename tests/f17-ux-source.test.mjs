import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('documentation shell uses current-module navigation, skip link and explicit workspace entry',()=>{
 const shell=read('src/components/course/DocShell.tsx');
 assert.match(shell,/catalog\.filter\(item => item\.moduleId === current\.moduleId\)/);
 assert.match(shell,/aria-current=\{item\.id===active\?'page'/);
 assert.match(shell,/href="#doc-main"/);
 assert.match(shell,/href="\/search"/);
 assert.match(shell,/href="\/"[^>]*>Workspace/);
 assert.doesNotMatch(shell,/for \(const id of PUBLISHED_LESSON_IDS\)/);
});
test('both article editions receive active catalog navigation without changing completion gate',()=>{
 const lesson=read('src/app/learn/[lessonId]/page.tsx');
 assert.equal((lesson.match(/<DocShell active=\{lessonId\} catalog=\{accessCatalog\}>/g)??[]).length,2);
 assert.match(lesson,/\(authored \|\| mdxMeta\) && <LessonNotebook/);
 assert.match(lesson,/localRubric && <LocalLessonCompletion/);
});
test('server discovery is non-indexable and has a bounded GET form, not a learner state writer',()=>{
 const search=read('src/app/search/page.tsx');
 assert.match(search,/robots:\{index:false,follow:true\}/);
 assert.match(search,/form action="\/search" method="get"/);
 assert.match(search,/maxLength=\{160\}/);
 assert.doesNotMatch(search,/'use client'|useAcademy|localStorage|AUTHORED_REFERENCES\.map\([^)]*=>\s*\{/);
});
test('discovery precedes optional beginner content, and dashboard resume precedes statistics',()=>{
 const course=read('src/app/learn/page.tsx');
 const dash=read('src/components/course/LearningDashboard.tsx');
 assert.ok(course.indexOf('<PublishedLessonExplorer catalog=')<course.indexOf('Start here · beginner learning path'));
 assert.ok(dash.indexOf('aria-labelledby="continue-heading"')<dash.indexOf('aria-label="Learning progress"'));
 const snapshot=JSON.parse(read('docs/checkpoint.json')).snapshot;
 assert.equal(snapshot.authoredReferenceDrafts,303);
 assert.equal(snapshot.publishedLessons,338);
 assert.equal(snapshot.labFixtures,337);
});


test('curriculum search filters can shrink below intrinsic select option width',()=>{
 const explorer=read('src/components/course/PublishedLessonExplorer.tsx');
 assert.match(explorer,/grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2/);
 for(const id of ['search','module','level'])assert.ok(explorer.includes('htmlFor="lesson-explorer-'+id+'" className="flex min-w-0 flex-col'));
 for(const id of ['module','level'])assert.ok(explorer.split('\n').some(line=>line.includes('id="lesson-explorer-'+id+'"')&&line.includes("className={controlClass + ' w-full'}")));
});
